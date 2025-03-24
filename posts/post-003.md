---
title: "使用WebRTC搭建简易聊天室"
date: "2022-10-10"
tag: "WebRTC"
description: "这是一个使用SkyRTC和SkyRTC-client搭建浏览器中音频、视频、文字聊天室的Demo"
---

### 什么是WebRTC

很久很久之前~~
，其实也不太久，浏览器是不支持相互之间直接建立信道进行通信，就像我想从页面a和页面b之间进行数据交流，一般都是a发送到服务器上，服务器把a的消息中转到b上，反之亦然，这样一段消息要有两次通信，还要首受到两次通讯的带宽限制，像是视频音频之类的数据流直接打出了GG，所以就WebRTC诞生啦~
WebRTC就是个JavaScript接口，能够通过浏览器调用摄像头、话筒，然后建立两个浏览器之前的信道，这个信道可以发送任数据，而不通过服务器

### 示例

#### 1.搭建本地服务

首先我们先建立个本地服务，我用的是express,假定你已经安装了[Node.js](https://nodejs.org/en/)，接下来进入命令行工具，为你的应用创建一个目录，然后进入此目录并将其作为当前工作目录。

```
mkdir myapp
cd myapp
```

然后通过命令，创建一个 package.json 文件

```
npm init -y
```

接下来在 myapp 目录下安装 Express 并将其保存到依赖列表中

```
npm install express --save
```

然后安装ws（是一种易于使用，运行迅速且经过全面测试的WebSocket客户端）

```
npm install ws --save
```

安装skyrtc（一个集成的nodejs编写的WebRTC服务端库）

```
npm install skyrtc --save
```

安装uuid（能够快速生成随机的UID）

```
npm install uuid --save
```

安装完成后，在根目录下新建server.js，并写入内容

```
const express = require('express')
const app = express()
const port = process.env.PORT || 3000;
const path = require("path");

app.use(express.static(path.join(__dirname, 'public')));

app.get('/',(req,res)=>{
    res.send('hello world')
})

app.listen(port, () => {
    console.log(`Example app listening on http://localhost:${port}`)
})
```

在命令行输入

```
node server.js
```

打开[http://localhost:3000](http://localhost:3000)看到"Hello World!",说明本地服务好啦!
但是每次都要执行修改都要重新启动服务，所以我们安装一个nodemon来监听测目录中的文件更改,并自动重新启动

```
npm install nodemon --save
```

然后修改根目录下的package.json文件中的scripts为

```
    "scripts": {
        "start": "nodemon server.js"
    },
```

然后在命令行输入命令

```
npm run start
```

打开[http://localhost:3000](http://localhost:3000)看到"Hello World!",修改server.js中的sender

```
app.get('/',(req,res)=>{
    res.send('hello webrtc')
})
```

刷新[http://localhost:3000]页面，你会发现没有重启服务，页面也变成了hello webrtc

然后在根目录新建public/demo.html 并写入

```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <style>
        video {
            vertical-align: top;
            background: #ccc;
        }
    </style>
</head>
<body>
    <div id="app">
        <button onclick="openWebRTC()">开始</button>
        <button onclick="closeWebRTC()">结束</button>
        <video id="oVideo1" autoplay></video>
        <video id="oVideo2" autoplay></video>
    </div>
</body>
<script>
    let subscriberPeerConnection = null;
    let publisherPeerConnection = null;
    let localStream = null;

    // 开始
    function openWebRTC() {
        console.log("拉取摄像头权限")
        navigator.mediaDevices.getUserMedia({
            audio: true,
            video: {
                width: {exact: 720},
                height: {exact: 405}
            }
        }).then((stream) => {
            console.log('拉取摄像头权限成功')
            console.log('摄像头数据流放入视频1')
            document.getElementById('oVideo1').srcObject = localStream = stream;//摄像头1

            createSubscriber();//建立连接
            createPublisher();//建立连接
        }).catch(function (error) {
            console.log('拉取摄像头权限失败', err)
        });
    }


    // 建立连接
    function createSubscriber() {
        console.log('创建本地计算机到远端的WebRTC连接1')
        subscriberPeerConnection = new RTCPeerConnection({"iceServers": [{"urls": "stun:stun.l.google.com:19302"}]})


        subscriberPeerConnection.ontrack = function (event) {
            console.log('远端的WebRTC连接1 触发的轨道事件')
            console.log('远端的WebRTC连接1 数据流放入视频2')
            document.getElementById('oVideo2').srcObject = event.streams[0];
        }

        // 当获得新的源之后，需要将该源的信息发送给远端信号服务器，并分发至其他端的RTCPeerConnection。其他RTCPeerConnection通过addIceCandidate()方法将新candidate 中携带的信息，将新的源描述信息添加进它的备选池中；
        subscriberPeerConnection.onicecandidate = function (event) {
            console.log('远端的WebRTC连接1 添加新的RTCICECandidate对象')

            if (publisherPeerConnection) {
                console.log('远端的WebRTC连接2 将远端的WebRTC连接1 添加的candidate中携带的信息，将新的源描述信息添加进它的备选池中')

                publisherPeerConnection.addIceCandidate(event.candidate).then(() => {
                    console.log('添加成功');
                }).catch(function (error) {
                    console.log('添加失败');
                });
            }
        }
    }

    // 建立接受者连接
    function createPublisher() {
        console.log('创建本地计算机到远端的WebRTC连接2')
        publisherPeerConnection = new RTCPeerConnection({"iceServers": [{"urls": "stun:stun.l.google.com:19302"}]})

        console.log('将视频1中轨道信息全部添加到远端的WebRTC连接2')
        localStream.getTracks().forEach((track) => {
            publisherPeerConnection.addTrack(track, localStream);
        });

        publisherPeerConnection.onicecandidate = function (event) {
            console.log('远端的WebRTC连接2 添加新的RTCICECandidate对象')

            if (subscriberPeerConnection) {
                console.log('远端的WebRTC连接1 将远端的WebRTC连接2 添加的candidate中携带的信息，将新的源描述信息添加进它的备选池中')

                subscriberPeerConnection.addIceCandidate(event.candidate).then(() => {
                    console.log('添加成功');
                }).catch(function (error) {
                    console.log('添加成功');
                });
            }
        }

        console.log('远端的WebRTC连接2 启动创建一个SDP offer')
        publisherPeerConnection.createOffer({
            offerToReceiveAudio: true,
            offerToReceiveVideo: true
        }).then((desc) => {
            // 更改与连接关联的本地描述。此描述指定连接本地端的属性，包括媒体格式
            console.log('远端的WebRTC连接1和远端的WebRTC连接2 更改与连接关联的本地描述,保持与新建的SDP offe一致')
            publisherPeerConnection.setLocalDescription(desc);
            subscriberPeerConnection.setRemoteDescription(desc);

            subscriberPeerConnection.createAnswer().then((desc2) => {
                subscriberPeerConnection.setLocalDescription(desc2);
                publisherPeerConnection.setRemoteDescription(desc2);
            }).catch(function (error) {
            });
        }).catch(function (error) {
        });
    }

    function closeWebRTC() {
        localStream.getTracks().forEach(track => {
            track.stop();
        });
        publisherPeerConnection.close();
        subscriberPeerConnection.close();
    }
</script>
</html>
```

打开[http://localhost:3000/demo.html](http://localhost:3000/demo.html)并刷新就可以体验基本的webrtc功能啦
