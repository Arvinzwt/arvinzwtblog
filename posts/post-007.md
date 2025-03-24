---
title: "Raspberry系列3：配置阿里镜像源"
date: "2022-06-26"
tag: "Raspberry"
description: "Raspberry Pi OS 安装docker网络连接中断的解决思路"
---

docker安装成功之后（如果没有安装，请参考之前的文章：[Raspberry Pi OS 安装docker compose](https://juejin.cn/post/7383992605548478515)），发现拉取镜像的时候贼拉慢，像80多岁的老奶奶连吃7天最辣的川味火锅不喝水，然后在洗手间拉粑粑的速度。所以痛定思痛的我决定换个国内的镜像源。然后悲催的发现大部分免费开源的镜像源已经不能访问了，得了，看来免费就像我老婆对我的爱，来的无缘无故，走的悄无声息，还是配置些绑定到个人的，起码不失效的国内镜像源吧。
## 配置前提
1. 你要有阿里云的账号，没有可以免费注册一个[注册地址](https://cr.console.aliyun.com/cn-hangzhou/instances/mirrors)
2. raspberry安装的为linux系统，当然mac或者window也支持，只是我懒的试了

## 开始配置
1.打开阿里云，登陆

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c4022b936aec4add8699a650533dc6e3~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1473&h=682&s=386152&e=png&b=fefefe)

2.右上角header有个控制台，点击进入

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0cb8bd1ebd7e4f049b419ee3903a2b60~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=284&h=65&s=7530&e=png&b=fefdfd)

3.在搜索栏里直接搜索容器镜像服务

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2475888a373542e09200d9bc3c1d6ccf~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=500&h=251&s=40915&e=png&b=fdfcfc)

4.可以在左侧菜单栏里面找到镜像加速器

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c2a8153d020d4d7ca84a5c4ee8b84809~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=204&h=73&s=3811&e=png&b=e4e4e4)

5.找到里面属于你的加速器地址，复制
6.linux环境下，是通过配置`/etc/docker/daemon.json`文件来更换镜像源，可执行以下代码
```
sudo mkdir -p /etc/docker
sudo tee /etc/docker/daemon.json <<-'EOF' { "registry-mirrors": ["https://e38m94ca.mirror.aliyuncs.com"] } EOF 
sudo systemctl daemon-reload 
sudo systemctl restart docker
```
7.然后执行`sudo docker info`查看是否配置成功
8.如果是mac或者window系统可以参考下方阿里云官方文档

## 参考文档
https://cr.console.aliyun.com/cn-hangzhou/instances/mirrors
