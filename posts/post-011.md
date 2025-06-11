---
title: "Raspberry系列5：树莓派+移动硬盘搭建NAS"
date: "2023-04-02"
tag: "Raspberry"
description: "树莓派的一些日常折腾"
---

## 为什么要用树莓派搭建NAS？

想试试

## 所需材料

1. 树莓派主板（推荐树莓派4B，因其有USB3.0和千兆网口）
2. 大容量移动硬盘（根据需求选择，建议至少1TB）
3. 优质电源（5V/3A以上，确保稳定供电）
4. microSD卡（16GB以上，用于安装系统）
5. 散热外壳（长期运行需要考虑散热）

## 系统安装与配置

### 1. 安装操作系统

首先下载Raspberry Pi OS Lite版本（无桌面环境更节省资源）：

```bash
# 使用Raspberry Pi Imager工具刷写系统
sudo apt install rpi-imager
rpi-imager
```

选择"Raspberry Pi OS Lite (64-bit)"，写入microSD卡。

### 2. 初始设置

插入SD卡启动树莓派，进行基本配置：

```bash
sudo raspi-config
```

依次设置：

- 更改默认密码
- 主机名（如"raspberry-nas"）
- 启用SSH
- 扩展文件系统

### 3. 挂载移动硬盘

首先识别硬盘设备：

```bash
lsblk
```

假设硬盘为`/dev/sda1`，创建挂载点并挂载：

```bash
sudo mkdir /mnt/nas
sudo mount /dev/sda1 /mnt/nas
```

为了实现开机自动挂载，编辑`/etc/fstab`：

```bash
sudo blkid # 获取硬盘UUID
sudo nano /etc/fstab
```

添加如下行（替换为你的UUID）：

```
UUID=1234-5678 /mnt/nas ext4 defaults,auto,users,rw,nofail 0 0
```

## 安装Samba实现文件共享

Samba是最常用的网络文件共享协议，兼容Windows、Mac和Linux。

```bash
sudo apt update
sudo apt install samba samba-common-bin
```

配置Samba：

```bash
sudo nano /etc/samba/smb.conf
```

在文件末尾添加：

```
[nas]
   comment = NAS Storage
   path = /mnt/nas
   browseable = yes
   writeable = yes
   only guest = no
   create mask = 0777
   directory mask = 0777
   public = no
```

设置Samba用户密码（建议与系统用户不同）：

```bash
sudo smbpasswd -a pi
```

重启Samba服务：

```bash
sudo systemctl restart smbd
```

## 进阶配置

### 1. 硬盘休眠（延长寿命）

安装hdparm并设置休眠：

```bash
sudo apt install hdparm
sudo hdparm -S 120 /dev/sda # 设置10分钟无活动后休眠
```

### 2. 动态DNS（外网访问）

如果你有公网IP，可以使用DDNS服务：

```bash
sudo apt install ddclient
```

配置你的DDNS提供商信息。

### 3. 数据备份

设置定期自动备份到另一块硬盘或云存储：

```bash
sudo apt install rsync
crontab -e
```

添加每日备份任务：

```
0 3 * * * rsync -avz /mnt/nas/ /mnt/backup/
```

## 性能优化

1. **使用ext4文件系统**：比NTFS或FAT32更适合Linux环境
2. **启用USB3.0**：确保硬盘连接在蓝色USB3.0接口上
3. **网络优化**：使用有线连接而非WiFi
4. **关闭不必要的服务**：如蓝牙、桌面环境等

## 总结

通过树莓派搭建NAS，你获得了一个低成本、高定制化的家庭存储中心。虽然性能不如商业NAS强大，但对于一般家庭使用完全足够。更重要的是，整个过程充满乐趣，你可以根据自己的需求不断扩展功能，如添加媒体服务器、下载机等功能。

**下一步建议**：尝试安装Plex或Jellyfin媒体服务器，将你的NAS升级为家庭媒体中心！

---

**相关阅读**  
[Raspberry系列4：树莓派作为家庭VPN服务器](../raspberry-vpn)  
[如何选择适合NAS的硬盘](../nas-hdd-guide)
