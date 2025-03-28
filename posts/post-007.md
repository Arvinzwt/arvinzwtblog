---
title: "Raspberry系列3：配置阿里镜像源"
date: "2022-06-26"
tag: "Raspberry"
description: "Raspberry Pi OS 安装docker网络连接中断的解决思路"
---

docker安装时（如果没有安装，请参考之前的文章：[Raspberry Pi OS 安装docker compose](https://juejin.cn/post/7383992605548478515)），
介于国内镜像太过缓慢，这里单独说一下配置阿里云镜像的方法

## 配置前提

你要有阿里云的账号，没有可以免费注册一个[注册地址](https://cr.console.aliyun.com/cn-hangzhou/instances/mirrors)

## 开始配置

1.打开[阿里云](https://account.aliyun.com/login/login.htm)

2.右上角header有个控制台，点击进入

![image.png](/images/posts/006-01.png)

3.在搜索栏里直接搜索 `容器镜像服务 ACR`

![image.png](/images/posts/006-02.png)

4.可以在左侧菜单栏里面找到镜像加速器

![image.png](/images/posts/006-03.png)

5.找到里面属于你的加速器地址，复制
6.linux环境下，是通过配置`/etc/docker/daemon.json`文件来更换镜像源，可执行以下代码

```bash
sudo mkdir -p /etc/docker
sudo tee /etc/docker/daemon.json <<-'EOF' { "registry-mirrors": ["https://e38m94ca.mirror.aliyuncs.com"] } EOF
sudo systemctl daemon-reload
sudo systemctl restart docker
```

7.然后执行`sudo docker info`查看是否配置成功8.如果是mac或者window系统可以参考下方阿里云官方文档

## 参考文档

https://cr.console.aliyun.com/cn-hangzhou/instances/mirrors

---

下一篇：[Raspberry系列4：通过DNS快速找到树莓派IP地址](/posts/post-008)

上一篇：[Raspberry系列2：安装docker compose](/posts/post-006)
