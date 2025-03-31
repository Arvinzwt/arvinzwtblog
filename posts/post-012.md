---
title: "WEBGL2学习笔记03：颜色配置和重置画布"
date: "2024-07-05"
tag: "WebGL2"
description: ""
---


现在我们做一点调整，通过片段着色器变量传参，来修改颜色

## 调整片段着色器
- 修改片段着色器属性，添加全局变量

```js
const FRAGMENT_SHADER_SOURCE = `#version 300 es
  precision highp float;
  uniform vec4 u_color; // 定义一个4维变量u_color，uniform：全局变量
  out vec4 a_color; //定义输出变量 a_color
  void main() {
    a_color = u_color; // 将u_color赋值给a_color
  }
`
```

- 读取该变量在片段着色器的位置

```js
const colorLocation = gl.getUniformLocation(shaderProgram, 'u_color');
```

- 在绘制过程中，向片段着色器传递变量

```js
gl.uniform4fv(colorLocation, [
  Math.random(),
  Math.random(),
  Math.random(),
  1,
]);
```

整体代码如下：

```html
<!DOCTYPE html>
<html lang='en'>
<head>
  <meta charset='UTF-8'>
  <meta name='viewport' content='width=device-width, initial-scale=1.0'>
  <title>Title</title>
  <style>
    #glCanvas {
      /*border: 1px solid red;*/
    }
  </style>
</head>
<body>
<canvas id='glCanvas' width='300' height='300'></canvas>
</body>
<script>
  /**
   * @desc 加载着色器对象
   * @param gl
   * @param type 着色器类型
   * @param source 着色器源代码
   */
  function loadShader(gl, type, source) {
    const shader = gl.createShader(type)//创建着色器对象
    gl.shaderSource(shader, source)//设置着色器对象的源代码
    gl.compileShader(shader)//编译指定的着色器

    // 获取着色器对象参数，参数为 shader：着色器，pname：查询的参数名称
    // pname可以是： SHADER_TYPE:着色器类型
    //              DELETE_STATUS:着色器是否已被标记为删除
    //              COMPILE_STATUS:色器的编译状态
    //              INFO_LOG_LENGTH:着色器信息日志的长度
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      alert(
        'An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader)
      )
      gl.deleteShader(shader)
      return null
    }

    return shader
  }

  /**
   * @desc 加载着色器程序对象
   * @param gl
   * @param vsSource 顶点着色器源码
   * @param fsSource 片段着色器源代码
   */
  function initShaderProgram(gl, vsSource, fsSource) {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource)
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource)

    const shaderProgram = gl.createProgram() //创建着色器程序对象
    gl.attachShader(shaderProgram, vertexShader) //将顶点着色器对象附加到着色器程序对象上
    gl.attachShader(shaderProgram, fragmentShader) //将片段着色器对象附加到着色器程序对象上
    gl.linkProgram(shaderProgram) //链接已经附加到着色器程序对象上的顶点着色器和片段着色器

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      alert(
        'Unable to initialize the shader program: ' +
        gl.getProgramInfoLog(shaderProgram)
      )
      return null
    }

    return shaderProgram
  }


  function main() {
    const gl = document.querySelector('#glCanvas').getContext('webgl2')
    if (!gl) {
      alert('WebGL2 not supported')
      return
    }

    // # 设置顶点的最终裁剪空间坐标，四个参数分别为x,y,z,w;
    // # X 和 Y 坐标范围从 -1 到 1，表示屏幕的水平和垂直范围。
    // # Z 坐标范围从 0 到 1，表示深度信息，用于深度测试和裁剪。
    // # W 坐标通常是 1.0，用于透视除法。

    const VERTEX_SHADER_SOURCE = `#version 300 es
      in vec2 a_position; //输入一个二维变量a_position；
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0); //gl_Position是一个四维数据， 改为由二维数据a_position和0.0，1.0拼接
        gl_PointSize = 10.0;
      }
    `

    const FRAGMENT_SHADER_SOURCE = `#version 300 es
      precision highp float;
      uniform vec4 u_color; // 定义一个4维变量u_color，uniform：全局变量
      out vec4 a_color; //定义输出变量 a_color
      void main() {
        a_color = u_color; // 将u_color赋值给a_color
      }
    `

    // 编译顶点着色器
    const shaderProgram = initShaderProgram(gl, VERTEX_SHADER_SOURCE, FRAGMENT_SHADER_SOURCE)

    // 创建顶点缓冲区
    const vertexBuffer = gl.createBuffer()////创建一个顶点缓冲区对象
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)////将缓冲区对象绑定到 WebGL 的`ARRAY_BUFFER`目标上

    //使用`bufferData`将我们要调整的坐标数据传输到`vertexBuffer`缓冲区中，数据类型为`Float32Array`，并指定了使用模式为`gl.STATIC_DRAW`，表示数据不会频繁改变。
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      // 点的顶点数据
      0.0, 0.8,

      // 线条的顶点数据
      -0.5, -0.5,
      0.5, -0.5,

      // 三角形的顶点数据
      -0.5, 0.5,
      0.5, 0.5,
      0.0, 0.0
    ]), gl.STATIC_DRAW)


    // 获取a_position位置属性
    const positionAttributeLocation = gl.getAttribLocation(shaderProgram, 'a_position')

    // 获取着色器程序（Shader Program）中 uniform 变量的位置（location）
    const colorLocation = gl.getUniformLocation(shaderProgram, 'u_color');

    // 指定属性数据如何读取
    const vao = gl.createVertexArray()//创建一个新的顶点数组对象 (VAO)

    //将创建的 vao 绑定为当前的顶点数组对象
    gl.bindVertexArray(vao)

    // vertexAttribPointer：这个函数用于指定顶点属性数组如何解释存储在缓冲区中的数据
    //                      positionAttributeLocation：我们设定在顶点着色器的变量a_position的位置
    //                      2：表示每个顶点属性由两个分量组成（这里是 x 和 y 坐标）
    //                      gl.FLOAT：顶点属性数据类型，这里是浮点数。
    //                      false：是否标准化数据。对于浮点数类型，没有标准化。
    //                      0：stride，指定相邻两个顶点之间的字节距离。0 表示属性数据紧密地打包在一起。
    //                      0：offset，表示属性在缓冲区中起始位置的字节偏移量。这里为0，从缓冲区开头开始读取数据。
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0)

    //启用指定位置的顶点属性数组。
    gl.enableVertexAttribArray(positionAttributeLocation)

    drawScene()

    function drawScene() {
      // 清空画布
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
      gl.clearColor(0.0, 0.0, 0.0, 0.0)
      gl.clear(gl.COLOR_BUFFER_BIT)

      // 执行指定的着色器
      gl.useProgram(shaderProgram)

      // 在绘制之前绑定顶点数组对象
      gl.bindVertexArray(vao)

      // 向片元着色器中的 uniform a_color 变量传递一个四维向量
      gl.uniform4fv(colorLocation, [
        Math.random(),
        Math.random(),
        Math.random(),
        1,
      ]);

      // 绘制点
      gl.drawArrays(gl.POINTS, 0, 1)

      // 绘制线条
      gl.drawArrays(gl.LINES, 1, 2)

      // 绘制三角形
      gl.drawArrays(gl.TRIANGLES, 3, 3)
    }
  }

  main()
</script>
</html>
```

刷新页面，可看到颜色已经随机改变

## 调整canvas的大小
- 而实际应用中，canvas的大小一般是根据页面大小动态变化的，而style设置的宽高和属性栏的宽高不一致时，canvas往往会变形扭曲，我们可以在渲染时添加以下处理：

```js
  function resizeCanvasToDisplaySize(canvas, multiplier) {
    multiplier = multiplier || 1;
    const width  = canvas.clientWidth  * multiplier | 0;
    const height = canvas.clientHeight * multiplier | 0;
    if (canvas.width !== width ||  canvas.height !== height) {
      canvas.width  = width;
      canvas.height = height;
      return true;
    }
    return false;
  }
```
## 添加工具
我们添加一个`webgl2fundamentals`官方提供的，学习用的小工具处理
源码:[webgl-utils](https://webgl2fundamentals.org/webgl/resources/webgl-utils.js)

- 当前的空间坐标为-1～1，与我们前端常用的像素差异有点多，可以通过调整`gl_Position`属性来将顶点坐标从屏幕坐标系转换到裁剪空间坐标系
- - 调整顶点编辑器的如下

```js
const VERTEX_SHADER_SOURCE = `#version 300 es
  in vec2 a_position; // 输入顶点坐标
  uniform vec2 u_resolution;  // uniform 变量，表示渲染目标的分辨率（宽度和高度）。通常，这些坐标是相对于当前渲染目标（如画布）的坐标
  void main() {
    // 这一步将顶点坐标从实际像素坐标转换为相对于渲染目标大小的比例。u_resolution 是一个 uniform 变量，代表渲染目标的分辨率，通过将顶点坐标除以 u_resolution，得到一个范围在 [0, 1] 内的坐标。
    vec2 zeroToOne = a_position / u_resolution;

    // 这一步将 [0, 1] 范围内的坐标线性映射到 [0, 2] 范围内。这种缩放确保了所有顶点坐标都位于裁剪空间中的可见范围内。
    vec2 zeroToTwo = zeroToOne * 2.0;

    // 裁剪空间坐标系的范围是 [-1, 1]。通过将 [0, 2] 范围内的坐标减去 1.0，将其映射到 [-1, 1] 范围内。
    vec2 clipSpace = zeroToTwo - 1.0;

    // 设置顶点的裁剪空间坐标
    // WebGL 的坐标系与标准的裁剪空间坐标系的差异：WebGL 的 y 轴与 NDC 的 y 轴方向是相反的，所以这里乘以 vec2(1, -1) 来翻转 y 轴的方向，确保坐标系正确。
    gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
  }
`
```

- - 获取`u_resolution`的位置属性

```js
const resolutionUniformLocation = gl.getUniformLocation(shaderProgram, 'u_resolution');
```

- - 将数据同步到gpu

```js
gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);
```

- - 坐标系已经发生变化，调整图像坐标大小

```js
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
  // 点的顶点数据
  10.0, 10.0,

  // 线条的顶点数据
  10.0, 10.0,
  550.0, 280.0,

  // 三角形的顶点数据
  100.0, 0.0,
  0.0, 100.0,
  200.0, 150.0,

  // // 点的顶点数据
  // 0.0, 0.8,
  //
  // // 线条的顶点数据
  // -0.5, -0.5,
  // 0.5, -0.5,
  //
  // // 三角形的顶点数据
  // -0.5, 0.5,
  // 0.5, 0.5,
  // 0.0, 0.0
]), gl.STATIC_DRAW)
```

整体代码如下：
[02_colorAndWidth](https://gitee.com/arvinzwt/webgl2-test/blob/master/02_colorAndWidth.html)

最终效果如下：

![image.png](/images/posts/012-01.png)

### 参考文献：

https://webgl2fundamentals.org/webgl/lessons/zh_cn/webgl-fundamentals.html#toc

---

上一篇：[WEBGL2学习笔记02：点、线、三角形](/posts/post-011)

下一篇：[WEBGL2学习笔记04：平移、旋转、缩放](/posts/post-013)
