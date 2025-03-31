---
title: "WEBGL2学习笔记01：基础概念"
date: "2024-07-03"
tag: "WebGL2"
description: ""
---

## 前言

如果说我们做一个模型类比于雕像的话，webgl2只是个锤子，它只能够画**点、线、三角形**，所有的3d模型都是这三者复杂的**组合**。

而webgl2怎么画点、线、三角形呢？它只做了两件事，**剪辑空间坐标(Clip space coordinates)和颜色**，它有两大法宝：

- **顶点着色器(Vertex Shader)**：实现剪辑空间坐标；
- **片段着色器(Fragment Shader)**：实现调色。

而作为程序员的我们操作的东西其实也就是两件：

- **点着色器**：提供剪辑空间坐标；
- **片段着色器**：提供调色；

你需要做的是：设置一堆状态，然后调用绘制方法在GPU上运行你的着色器。（对webgl2而言,差不多90%的方法几乎都是设置全局变量或者最终绘制需要的**状态**。）

着色器有**四种方法**能够接收数据：

1. 属性(Attributes)，缓冲区(Buffers)和顶点数组(Vertex Arrays)
2. Uniforms
3. 纹理(Textures)
4. Varyings

## 参考文献

https://webgl2fundamentals.org/webgl/lessons/webgl-fundamentals.html

---

下一篇：[01. WEBGL2学习-点、线、三角形](/posts/post-011)
