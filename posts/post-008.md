---
title: "Raspberry系列2：安装docker compose"
date: "2022-06-25"
tag: "Raspberry"
description: "Raspberry Pi OS 安装docker的后继操作"
---

## 安装前提

首先你要已经安装了docker，且已经更新过apt仓库，不然docker compose也没啥用不是，安装方法可参考之前的文章
[Raspberry系列1：安装docker](/posts/post-007)

## 安装

官方提供了2种安装方式，

- linux系统上的docker仓库安装，
- 手动安装

如果你之前安装的是docker desktop，默认是已经安装好docker-compose。
由于我们第一篇文章使用的apt安装，这一篇我们同样讲的是第一种方法。

### 安装

```bash
sudo apt-get update
sudo apt-get install docker-compose-plugin
```

### 检查

通过检查版本，来验证docker-compose是否安装正确

```bash
docker compose version
```

如果输出为

```bash
Docker Compose version vN.N.N
```

`vN.N.N`是你的版本号，则安装成功

## 参考文档

[官方文档](https://docs.docker.com/compose/install/linux/)
