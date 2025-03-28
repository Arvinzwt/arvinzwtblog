---
title: "123123"
date: "2024-09-02"
tag: "WebGL2"
description: ""
---

## 目录


回顾一下上篇：[ # 03. WEBGL2学习笔记：平移、旋转、缩放](https://juejin.cn/user/2102689080284888)

源码：[03_translateAndRotate](https://gitee.com/arvinzwt/webgl2-test/blob/master/03_translateAndRotate.html)

### 1.动画

首先，做点调整，将缩放、平移、旋转去掉，修改后代码如下：

```javascript
function main() {
  const gl = document.querySelector("#glCanvas").getContext("webgl2");
  if (!gl) {
    alert("WebGL2 not supported");
    return;
  }

  const VERTEX_SHADER_SOURCE = `#version 300 es
      in vec2 a_position;

      void main() {
        gl_Position = vec4(a_position, 0, 1);
      }
    `;

  const FRAGMENT_SHADER_SOURCE = `#version 300 es
      precision highp float;
      uniform vec4 u_color;
      out vec4 a_color;
      void main() {
        a_color = u_color;
      }
    `;

  // 编译顶点着色器
  const shaderProgram = webglUtils.createProgramFromSources(gl, [
    VERTEX_SHADER_SOURCE,
    FRAGMENT_SHADER_SOURCE,
  ]);

  // 创建顶点缓冲区
  const vertexBuffer = gl.createBuffer(); ////创建一个顶点缓冲区对象
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer); ////将缓冲区对象绑定到 WebGL 的`ARRAY_BUFFER`目标上

  //使用`bufferData`将我们要调整的坐标数据传输到`vertexBuffer`缓冲区中，数据类型为`Float32Array`，并指定了使用模式为`gl.STATIC_DRAW`，表示数据不会频繁改变。
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
      // // 点的顶点数据
      // 10.0, 10.0,
      //
      // // 线条的顶点数据
      // 10.0, 10.0,
      // 550.0, 280.0,
      //
      // // 三角形的顶点数据
      // 100.0, 0.0,
      // 0.0, 100.0,
      // 200.0, 150.0,

      // 点的顶点数据
      0.0, 0.8,

      // 线条的顶点数据
      -0.5, -0.5, 0.5, -0.5,

      // 三角形的顶点数据
      -0.5, 0.5, 0.5, 0.5, 0.0, 0.0,
    ]),
    gl.STATIC_DRAW,
  );

  // 获取位置属性
  const positionAttributeLocation = gl.getAttribLocation(
    shaderProgram,
    "a_position",
  );
  const colorLocation = gl.getUniformLocation(shaderProgram, "u_color");

  // 指定属性数据如何读取
  const vao = gl.createVertexArray(); //创建一个新的顶点数组对象 (VAO)

  //将创建的 vao 绑定为当前的顶点数组对象
  gl.bindVertexArray(vao);

  // vertexAttribPointer：这个函数用于指定顶点属性数组如何解释存储在缓冲区中的数据
  //                      positionAttributeLocation：我们设定在顶点着色器的变量a_position的位置
  //                      2：表示每个顶点属性由两个分量组成（这里是 x 和 y 坐标）
  //                      gl.FLOAT：顶点属性数据类型，这里是浮点数。
  //                      false：是否标准化数据。对于浮点数类型，没有标准化。
  //                      0：stride，指定相邻两个顶点之间的字节距离。0 表示属性数据紧密地打包在一起。
  //                      0：offset，表示属性在缓冲区中起始位置的字节偏移量。这里为0，从缓冲区开头开始读取数据。
  gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

  //启用指定位置的顶点属性数组。
  gl.enableVertexAttribArray(positionAttributeLocation);

  drawScene();

  function drawScene() {
    webglUtils.resizeCanvasToDisplaySize(gl.canvas);

    // 清空画布
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0.0, 0.0, 0.0, 0.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // 执行指定的着色器
    gl.useProgram(shaderProgram);

    // 在绘制之前绑定顶点数组对象
    gl.bindVertexArray(vao);

    gl.uniform4fv(colorLocation, [
      Math.random(),
      Math.random(),
      Math.random(),
      1,
    ]);

    // 绘制点
    gl.drawArrays(gl.POINTS, 0, 1);

    // 绘制线条
    gl.drawArrays(gl.LINES, 1, 2);

    // 绘制三角形
    gl.drawArrays(gl.TRIANGLES, 3, 3);
  }
}

main();
```

运行，出现界面如下：



