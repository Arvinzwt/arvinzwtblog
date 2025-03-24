---
title: "Raspberry系列4：通过DNS快速找到树莓派IP地址"
date: "2022-06-26"
tag: "Raspberry"
description: "通过ip连接操作树莓派过程组"
---

树莓派刚烧录好系统，想要远程连接，那么快速省事的找到树莓派对应的ip地址就很有必要了，这里提供一个比较简洁的方法
## 前提条件
1. 有一台电脑可以远程连接（如果是树莓派直接连接屏幕和键盘鼠标，也没必要看这个文章了）
2. 知道树莓派的主机名（在烧录系统的时候就能看到，一般默认的是raspberrypi）
3. 树莓派和电脑在同一个局域网中

## 连接方法
执行以下指令(raspberrypi为默认主机名，以下代码可替换成你对应的主机名)
```
ping raspberrypi
```
如果通过则可以看到对应ip，如果返回
```
ping: cannot resolve raspberrypi: Unknown host
```

可以试试mdns，直接使用设备的主机名加 `.local` 后缀来进行解析

```
ping raspberrypi.local
```
完结～

完结的完结：如果是mac电脑，自带的有`dns-sd`,也可以执行以下指令，来解析同一局域网下对应主机的ip
```
dns-sd -G v4v6 raspberrypi.local
```
