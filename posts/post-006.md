---
title: "vue-socket.io"
date: "2022-12-21"
tag: "Socket"
description: "vue-socket.io+typescript+vue脚手架的简单使用"
---

### 什么是vue-socket.io

针对vue包装后的socket.io-client，所以此文暂做记录

#### 1.搭建vue脚手架

我们用官方指令直接跑就行,如果不知道的小伙伴怎么搭建的小伙伴可以看一下官方文档 [VueCli](https://cli.vuets.org/zh/)

```bash
vue create my-project
```

我们选默认的babel,typescript,router,vuex,eslint就行，然后

```bash
cd my-project
npm run serve
```

打开浏览器，查看 [http://localhost:8080/](http://localhost:8080/)，就能看到本地服务了

#### 2.搭建后端服务

本地服务搭建好之后，不要着急，我们再搭建一个简单的express后端服务，来创建我们的socket连接，新建文件夹，名称随意,打开文件夹所在的命令行工具，输入

```bash
npm init -y
npm install express socket.io
```

然后新建index.ts在文件夹内,并写入

```ts
var app = require("express")();
var http = require("http").createServer(app);
var io = require("socket.io")(http, {
  //跨域处理
  cors: {
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  },
});

app.get("/", (req, res) => {
  res.send("<h1>Hello world</h1>");
});

io.on("connection", (socket) => {
  //连接成功
  socket.emit("EnterSuccess", {
    //发送客户端用户信息
    name: "张三",
    msg: "测试信息",
  });
  socket.on("ChatFromClient", (data) => {
    //接受到客户端信息
    socket.emit("ChatFromServer", data); //返回客户端信息
  });
  socket.on("disconnect", () => {
    //断开连接
    console.log("user disconnected");
  });
});

http.listen(3000, () => {
  console.log("listening on *:3000");
});
```

然后启动服务：

```bash
node index.ts
```

打开[http://localhost:3000/](http://localhost:3000/)，看到hello world
说明后端服务启动成功,需要注意的是，socket.io处理跨域v2版本和v3版本是有挺大区别的，具体请参考[https://socket.io/docs/v3/migrating-from-2-x-to-3-0/#CORS-handling](https://socket.io/docs/v3/migrating-from-2-x-to-3-0/#CORS-handling)

#### 2.连接socket

然后回到我们的脚手架文件夹内，打开命令行工具，安装vue-socket.io和socket.io-client（其实安装vue-socket.io就行，他就是封装之后的socket.io-client,但是神奇的是
vue-socket.io并没有直接写options的地址，只好在引入socket.io-client写配置文件）

```bash
npm install vue-socket.io --save
npm install socket.io-client
```

再修改src/main.ts

```ts
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import VueSocketIO from "vue-socket.io";
import SocketIO from "socket.io-client";

Vue.use(
  new VueSocketIO({
    debug: true,
    connection: SocketIO("http://localhost:3000/", {
      options: {
        path: "/socket.io",
        autoConnect: true, //启动自从自动连接
        secure: true,
        transports: ["websocket"], // ['websocket', 'polling']
        reconnection: true, //启动重新连接
        reconnectionAttempts: 5, //最大重试连接次数
        reconnectionDelay: 2000, //最初尝试新的重新连接等待时间
        reconnectionDelayMax: 10000, //最大等待重新连接,之前的2倍增长
        timeout: 20000,
      },
    }),
    vuex: {
      store,
      actionPrefix: "Socket",
      mutationPrefix: "Socket",
    },
  }),
);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
```

http://localhost:3000/是服务器的地址，vuex是vue-socket.io在vuex上的一些配置，即当后端通过socket发送给客户端数据时，vue-socket.io已经封装处理过，会触发vuex上的对应的action和
mutation，所以我们处理一下vuex,打开/src/store/index.ts改写为

```ts
import Vue from "vue";
import Vuex from "vuex";
import Socket from "./socket";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    Socket,
  },
});
```

然后在/src/store下新建socket.ts并写入

```ts
export default {
  namespaced: true,
  state: {
    usr: {},
    chatList: [],
  },
  actions: {
    //事件为前后端约定，并不固定
    SocketEnterSuccess({ commit }: any, data: any) {
      commit("SocketUsr", data);
    },
    SocketChatFromServer({ commit }: any, data: any) {
      commit("SocketChat", data);
    },
  },
  mutations: {
    SocketUsr(state: any, data: any) {
      state.usr = data;
    },
    SocketChat(state: any, data: any) {
      state.chatList.push(data);
    },
  },
  getters: {},
};
```

修改src/views/Home.vue

```html
<template>
  <div class="home">
    <div>{{ usr }}</div>
    <ul>
      <li v-for="(item,index) in chatList" :key="index">{{ item }}</li>
    </ul>
    <input type="text" v-model="chat" />
    <button @click="submit">发送信息</button>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from "vue-property-decorator";

  @Component({
    name: "home",
  })
  export default class Home extends Vue {
    private chat = "";

    private mounted() {
      this.sockets.subscribe("connect", () => {
        console.log("连接成功");
      });
      this.sockets.subscribe("connect_error", () => {
        console.log("连接失败");
      });
    }

    get usr() {
      return this.$store.state.Socket.usr;
    }

    get chatList() {
      return this.$store.state.Socket.chatList;
    }

    private submit() {
      this.$socket.emit("ChatFromClient", {
        value: this.chat,
      });
      this.chat = "";
    }
  }
</script>
```

打开控制台，选择Network，选择WS，点击你接口的那个连接，就可以看到完整的socket通讯了，值得一提的是，监听连接成功的接口

```ts
this.sockets.subscribe("connect", () => {
  console.log("连接成功");
});
```

如果有延迟会再也接不到，比如改一下

```ts
setTimeout(() => {
  this.sockets.subscribe("connect", () => {
    console.log("连接成功");
  });
}, 300);
```

就无法监听连接成功事件，但事实上连接时已经成功的，需要警惕下。
