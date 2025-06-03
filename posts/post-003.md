---
title: "vue+websocket模拟即时通讯"
date: "2020-09-23"
tag: "Socket"
description: "这是使用vue+websocket模拟即时通讯的demo"
---

### 什么是WebSocket?

WebSocket 是 HTML5 开始提供的一种在单个 TCP 连接上进行全双工通讯的协议。

WebSocket 使得客户端和服务器之间的数据交换变得更加简单，允许服务端主动向客户端推送数据。在 WebSocket API 中，浏览器和服务器只需要完成一次握手，两者之间就直接可以创建持久性的连接，并进行双向数据传输。

现在，很多网站为了实现推送技术，所用的技术都是 Ajax
轮询。轮询是在特定的的时间间隔（如每1秒），由浏览器对服务器发出HTTP请求，然后由服务器返回最新的数据给客户端的浏览器。这种传统的模式带来很明显的缺点，即浏览器需要不断的向服务器发出请求，然而HTTP请求可能包含较长的头部，其中真正有效的数据可能只是很小的一部分，显然这样会浪费很多的带宽等资源。

HTML5 定义的 WebSocket 协议，能更好的节省服务器资源和带宽，并且能够更实时地进行通讯。

### WebSocket 事件

| 事件    | 事件处理程序     | 描述                       |
| ------- | ---------------- | -------------------------- |
| open    | Socket.onopen    | 连接建立时触发             |
| message | Socket.onmessage | 客户端接收服务端数据时触发 |
| error   | Socket.onerror   | 通信发生错误时触发         |
| close   | Socket.onclose   | 连接关闭时触发             |

### WebSocket 方法

| 方法           |       描述       |
| -------------- | :--------------: |
| Socket.send()  | 使用连接发送数据 |
| Socket.close() |     关闭连接     |

### 示例

#### 1.客户端搭建

客户端是由vue脚手架搭建，如果比较熟的小伙伴可直接跳到后面，首先打开命令行工具，全局安装vue-cli

```bash
npm install -g @vue/cli
```

然后创建一个新项目

```bash
vue create my-project
# OR
vue ui
```

按照自己的喜好点点点，构建完成后，找到页面/src/App.vue,覆盖以下代码

```html
<template>
  <div class="container">
    <button @click="openConnect" v-if="!isConnected">打开连接</button>
    <button @click="closeConnect" v-if="isConnected">关闭连接</button>
    <label for="input" v-if="isConnected">
      <input id="input" v-model="message" />
      <button @click="sendMessage">发送信息</button>
    </label>
    <ul>
      <li v-for="(item,index) in messageList" :key="index">
        <span v-if="item.type===0" class="type1">{{item.uid}} 欢迎登录</span>
        <span v-if="item.type===1" class="type2"
          >{{item.uid}}：{{item.message}}</span
        >
        <span v-if="item.type===2" class="type3">{{item.uid}}已退出</span>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        message: null, //当前输入消息
        messageList: [], //消息列表
        ws: null, //ws实例
        isConnected: false, //是否处于连接
      };
    },
    methods: {
      /**
       *@dec 打开连接
       */
      openConnect() {
        if ("WebSocket" in window) {
          //判定ws兼容
          const ws = new WebSocket("ws://localhost:8080"); //地址为服务器接口地址

          ws.onopen = () => {
            // 连接成功时
            this.isConnected = true;
          };

          ws.onmessage = (evt) => {
            // 发送信息时
            this.messageList.push(JSON.parse(evt.data));
          };

          ws.onclose = () => {
            // 关闭连接时
            this.isConnected = false;
          };

          ws.onerror = (err) => {
            // 连接错误时
            console.log("err", err);
            this.isConnected = false;
          };

          this.ws = ws;
        } else {
          alert("您的浏览器不支持 WebSocket!");
        }
      },

      /**
       *@dec 发送信息
       */
      sendMessage() {
        if (this.ws && this.message) {
          this.ws.send(this.message);
          this.message = "";
        }
      },

      /**
       *@dec 关闭连接
       */
      closeConnect() {
        if (this.ws) this.ws.close();
      },
    },
  };
</script>

<style>
  .type1 {
    color: #999;
  }

  .type2 {
  }

  .type3 {
    color: #999;
  }
</style>
```

然后在命令行输入

```bash
npm run serve
```

启动服务，具体内容可参考[VUE-CLI](https://cli.vuejs.org/zh/)

现在点击'打开连接'还是会报错，因为我们的后端服务还没开启，下面我们建立服务端

#### 2.服务端

服务端是用express搭建，是一个基于 Node.js
平台，搭建方法很简单，假定你已经安装了[Node.js](https://nodejs.org/en/)，接下来进入命令行工具，为你的应用创建一个目录，然后进入此目录并将其作为当前工作目录。

```bash
mkdir myapp
cd myapp
```

然后通过命令，创建一个 package.json 文件

```bash
npm init -y
```

接下来在 myapp 目录下安装 Express 并将其保存到依赖列表中

```bash
npm install express --save
```

然后安装websocket

```bash
npm install ws --save
```

安装完成后，在根目录下新建server.js，并写入内容

```js
const WebSocket = require("ws");
const server = new WebSocket.Server({ port: 8080 }); //端口号不要和客户端端口号重复
console.log("服务启动成功");

let userList = []; // 用户列表，每个登录的用户都会存储在里面

let broadcast = (mesObj) => {
  // 消息广播，即用户列表里的每个用户都会收到消息
  userList.forEach((item) => {
    item.send(
      JSON.stringify({
        // send只能发送字符串
        uid: mesObj.uid, //唯一id
        message: mesObj.message, //发送的信息
        type: mesObj.type, //发送的类型，0是登录，1是发送消息时，2是退出时
      }),
    );
  });
};

server.on("connection", function connection(ws) {
  //当有用户建立连接时

  ws.uid = [new Date().getTime(), Math.floor(Math.random() * 10000)].join("_"); //由于没有连接数据库，创建随机数id
  userList.push(ws); //将用户存储到userList
  console.log(ws.uid);
  broadcast({
    //发送登录通知
    uid: ws.uid,
    message: "欢迎登录",
    type: 0,
  });

  ws.on("message", (message) => {
    //当用户发消息时
    broadcast({
      //转发给所有人
      uid: ws.uid,
      message,
      type: 1,
    });
  });

  ws.on("close", () => {
    //当用户退出时
    broadcast({
      //转发给所有人
      uid: ws.uid,
      message: "已退出",
      type: 2,
    });
  });
});
```

在命令行内，启动express服务

```bash
node server.js
```

### 参考文献

具体命令可参考[Express中文网](https://www.expressjs.com.cn/starter/installing.html)，最后可以打开多个客户端页面，互相发消息啦，当然这只是个简单的本地模拟，如果想要更加具体，可以添加mysql来管理具体用户，这在里就不多说啦
