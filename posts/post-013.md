---
title: "WEBGL2学习笔记04：平移、旋转、缩放"
date: "2024-07-05"
tag: "WebGL2"
description: ""
---

回顾一下上篇：[# 02. WEBGL2学习笔记: 颜色配置和重置画布](https://juejin.cn/post/7387316089159499817)

源码：[02_colorAndWidth](https://gitee.com/arvinzwt/webgl2-test/blob/master/02_colorAndWidth.html)

### 1.平移

我们在此基础上做点调整使之往下平移100px。

- 调整顶点着色器源码：
- - 新加一个`u_translation`属性，用来传输平移的坐标，并
- - 把`zeroToOne`的值调整为`( a_position + u_translation ) / u_resolution;`，从而可以把平移坐标传递给`gl_Position`。

```
const VERTEX_SHADER_SOURCE = `#version 300 es
  in vec2 a_position;
  uniform vec2 u_resolution;
  uniform vec2 u_translation;
  void main() {
    vec2 zeroToOne = ( a_position + u_translation ) / u_resolution;
    vec2 zeroToTwo = zeroToOne * 2.0;
    vec2 clipSpace = zeroToTwo - 1.0;
    gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
  }
`
```

- 读取新加的`u_translation`属性位置

```
const translationLocation = gl.getUniformLocation(shaderProgram, 'u_translation');
```

- 调整变量，传递给顶点着色器

```
const translation = [0, 100];
gl.uniform2fv(translationLocation, translation);
```

最终效果如下：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0ff36cb9a78146d3809e8dd642d0a584~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=237&h=333&s=5137&e=png&b=ffffff)

### 2.旋转、缩放

同样的，我们做点调整，添加上旋转和缩放功能

- 修改顶点着色器：
- - `uniform vec2 u_rotation;`：添加全局变量 u_rotation；
- - `uniform vec2 u_rotation;`：添加全局变量 u_scale；
- - `vec2 scaledPosition = a_position * u_scale;`:定义一个二维变量scaledPosition，值为位置坐标\*缩放比例
- - `vec2 rotatedPosition = vec2(
scaledPosition.x * u_rotation.y + scaledPosition.y * u_rotation.x,
scaledPosition.y * u_rotation.y - scaledPosition.x * u_rotation.x);`：最终旋转的角度由于缩放比例、位置坐标、旋转角度决定；

```
const VERTEX_SHADER_SOURCE = `#version 300 es
  in vec2 a_position;
  uniform vec2 u_resolution;
  uniform vec2 u_translation;
  uniform vec2 u_rotation;
  uniform vec2 u_scale;

  void main() {
    vec2 scaledPosition = a_position * u_scale;

    vec2 rotatedPosition = vec2(
       scaledPosition.x * u_rotation.y + scaledPosition.y * u_rotation.x,
       scaledPosition.y * u_rotation.y - scaledPosition.x * u_rotation.x);


    vec2 zeroToOne = ( rotatedPosition + u_translation ) / u_resolution;
    vec2 zeroToTwo = zeroToOne * 2.0;
    vec2 clipSpace = zeroToTwo - 1.0;

    gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
  }
`
```

- 获取缩放和旋转的位置属性

```
const rotationLocation = gl.getUniformLocation(shaderProgram, "u_rotation");
const scaleLocation = gl.getUniformLocation(shaderProgram, "u_scale");
```

- 渲染

```
gl.uniform2fv(rotationLocation, [0, 1]);
gl.uniform2fv(scaleLocation, [0.5, 0.5]);
```

- 最终效果如下：

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/056af6f5155b46b8be226b0da6c29b5f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=221&h=317&s=3893&e=png&b=ffffff)

- 最终代码：[03_translateAndRotate.](https://gitee.com/arvinzwt/webgl2-test/blob/master/03_translateAndRotate.html)
- 下一篇：04. WEBGL2学习笔记：矩阵和动画

### 参考文献

https://webgl2fundamentals.org/webgl/lessons/zh_cn/webgl-2d-matrices.html
