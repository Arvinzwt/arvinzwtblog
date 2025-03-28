---
title: "Raspberry系列1：安装docker"
date: "2022-06-24"
tag: "Raspberry"
description: "Raspberry Pi OS 安装docker的简化流程"
---

## 1.烧录系统

### 1.1.选择镜像

首先用[Raspberry PI imager](https://www.raspberrypi.com/software/)安装镜像，选择64位系统（docker官方说明如下，大意位支持32-bit(armhf)和64-bit(arm64)，但是64位是基于debian，所以可以直接按照debian的说明进行安装）（此处只讨论64位安装流程）

![image.png](/images/posts/005-01.png)

### 1.2.选择操作系统

打开Raspberry PI imager，选择对应的镜像进行烧录
![image.png](/images/posts/005-02.png)

### 1.3.选择配置

点击NEXT按钮，选择配置，选择services，选择开启ssh服务，方便我们后继连接

![image.png](/images/posts/005-03.png)

点击开始，等待系统烧录完成后，通过ssh链接树莓派

## 2.先决条件

### 2.1.防火墙

如果不是新烧录的系统，之前有适用ufw和firewalld管理防火墙的，docker公开端口会绕过防火墙，可参考:[docker and ufw](https://docs.docker.com/network/packet-filtering-firewalls/#docker-and-ufw)

### 2.1.包管理

安装docker engine之前，需要卸载所有冲突的包，执行以下命令

```bash
for pkg in docker.io docker-doc docker-compose podman-docker containerd runc; do sudo apt-get remove $pkg; done
```

大意为，循环`docker.io docker-doc docker-compose podman-docker containerd runc`这几个安装包，执行删除，`done`表示循环结束

## 3.安装

官方提供了4种安装方法

- 直接安装docker desktop
- 适用apt安装
- 手动安装
- 使用脚本安装（仅推荐用于测试和开发环境）

考虑到内存大小和升级管理的方便，我们推荐第二种，使用apt安装

### 3.1.设置存储库

```bash
# Add Docker's official GPG key:
sudo apt-get update
sudo apt-get install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/debian/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

# Add the repository to Apt sources:
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/debian \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
```

### 3.2.设置代理

如果返回链接超时，很正常，2023年之后docker在国内访问就需要一些小方法了，这里可以使用阿里云的代理镜像，把上述`https://download.docker.com`改为`https://mirrors.aliyun.com`
具体可参考 [Raspberry系列3：配置阿里镜像源](/posts/post-007)
，如下：

```bash
# Add Docker's official GPG key:
sudo apt-get update
sudo apt-get install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://mirrors.aliyun.com/docker-ce/linux/debian/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

# Add the repository to Apt sources:
echo \
 "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://mirrors.aliyun.com/docker-ce/linux/debian \
 $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
 sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
```

### 3.3.安装docker包

```bash
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

### 3.4.验证安装

```bash
sudo docker run hello-world
```

## 参考文献

- [Install Docker Engine on Debian](https://docs.docker.com/engine/install/debian/)
- [Install Docker Engine on Raspberry Pi Os (32-bit)](https://docs.docker.com/engine/install/raspberry-pi-os/)
- [阿里云docker-ce镜像](https://mirrors.aliyun.com/docker-ce/linux/debian/)
- [raspberrypi系统烧录工具](https://www.raspberrypi.com/software/)

---

下一篇：[Raspberry系列2：安装docker compose](/posts/post-006)
