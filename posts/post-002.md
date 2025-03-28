---
title: "nuxtjs/auth的简单运用"
date: "2020-09-25"
tag: "Nuxt"
description: "nuxtjs/auth模块的简单运用"
---

最近项目要用到jwt登录，不想自己写，看到nuxt有现成的auth模块，就拿来用了一下，记录如下：

### 1.安装

打开命令行，输入：

```bash
npm install @nuxtjs/auth @nuxtjs/axios
```

安装完成后，找到根目录下的 nuxt.config.js 编辑

```js
{
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/auth'
  ],
  auth: {
    // Options
  }
}
```

这样就启用了

### 2.监听页面

然后我们要让auth模块去监听页面，判断是否登录，可分为全局监听和单页面监听，

#### 2.1.单页面监听

单页面监听的话，只需要在该页面添加属性

```js
export default {
  middleware: "auth",
};
```

#### 2.2.全局监听

单页面在部分情况下比较麻烦，可以选用全局监听：在路由上做一个中间件，在nuxt.config.js编辑

```js
router: {
  middleware: ["auth"];
}
```

auth是插件自带的，不需要自己去middleware自己再添加。同时，如果全局监听，想要忽略个别页面，可以将想要忽略的页面上添加属性

```js
export default {
  auth: false,
};
```

### 3.添加登录方案

然后我们要为auth模块添加登录方案，auth模块提供的有本地、Oauth2和自定义三种方案，这里我们只说一下本地登录和自定义：

#### 3.1.本地登录

在nuxt.config.js 编辑

```js
auth: {
   strategies: {
      local: {
          endpoints: {
              login: {url: 'http://www.api.com/api/auth/login', method: 'post', propertyName: 'token'},
              logout: {url: 'http://www.api.com/api/auth/logout', method: 'post'},
              user: {url: 'http://www.api.com/api/auth/user', method: 'get', propertyName: 'user'}
          },
      }
  },
}
```

strategies里面就是放的方案，local是指本地方案，endpoints是指方案里面的每个端点，url是指方案请求的后端地址，method请求方式，propertyName可以用于指定将响应JSON的哪个字段用作值，也就是说，上面三个接口返回的数据结构应该为

```js
//www.api.com/api/auth/login

http: {
  token: "i8@39hqzG@A5Ax9d5yQ5ayF#N^^jR$3jpi$rVEh6ZAAd";
}
```

```js
//www.api.com/api/auth/logout
http: {
  status: true;
}
```

```js
//www.api.com/api/auth/user

http: {
  user: {
    name: "张三";
  }
}
```

然后在页面里面新建pages/login.vue,写入

```html
<template>
  <div>
    <div>
      <input type="text" v-model="login.nam" />
      <input type="text" v-model="login.pas" />
      <button @click="loginFn">login</button>
    </div>
  </div>
</template>

<script>
  export default {
    name: "login",
    data() {
      return {
        login: {
          nam: "",
          pas: "",
        },
      };
    },
    created() {},
    mounted() {},
    destroyed() {},
    methods: {
      loginFn() {
        this.$auth.loginWith("local", this.login).then((res) => {
          this.$router.push("/home");
        });
      },
    },
  };
</script>

<style scoped></style>
```

新建pages/home.vue,写入

```html
<template>
  <div>
    <div>用户信息：{{$auth.user}}</div>
    <div>是否登录：{{$auth.loggedIn}}</div>
    <button @click="loginOut">登出</button>
  </div>
</template>

<script>
  export default {
    components: {},
    methods: {
      loginOut() {
        this.$auth.logout().then((res) => {
          this.$router.push("/login");
        });
      },
    },
  };
</script>

<style></style>
```

然后重新启动nuxt

```bash
npm run dev
```

就可以看到auth模块已经生效

#### 3.2.自定义

首先要在nuxt.config.js修改

```js
build: {
  transpile: ['@nuxtjs/auth']
},
auth: {
  strategies: {
    customStrategy: {
       _scheme: '~/schemes/customScheme',
       endpoints: {
           login: {url: 'http://localhost:7001/api/auth/login', method: 'post', propertyName: 'token'},
           logout: {url: 'http://localhost:7001/api/auth/logout', method: 'post'},
           user: {url: 'http://localhost:7001/api/auth/user', method: 'get', propertyName: 'user'}
       },
   },
  }
}
```

然后在根目录中新建文件夹schemes和添加文件customScheme.js并写入

```js
import LocalScheme from "@nuxtjs/auth/lib/schemes/local";

//继承local方案
export default class CustomScheme extends LocalScheme {
  async login(endpoint) {
    //覆盖登录接口
    console.log("login", endpoint);
    return endpoint;
  }

  async logout(endpoint) {
    //覆盖登出接口
    console.log("logout", endpoint);
    return endpoint;
  }

  async user(endpoint) {
    //覆盖user接口
    console.log("user", endpoint);
    return endpoint;
  }
}
```

修改pages/login.vue页面

```html
<template>
  <div>
    <div>
      <input type="text" v-model="login.nam" />
      <input type="text" v-model="login.pas" />
      <button @click="loginFn">login</button>
    </div>
  </div>
</template>

<script>
  export default {
    name: "login",
    data() {
      return {
        login: {
          nam: "",
          pas: "",
        },
      };
    },
    created() {},
    mounted() {},
    destroyed() {},
    methods: {
      loginFn() {
        this.$auth.loginWith("customStrategy", this.login).then((res) => {
          this.$router.push("/home");
        });
      },
    },
  };
</script>

<style scoped></style>
```

到此，即已完成
