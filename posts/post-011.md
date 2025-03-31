---
title: "WEBGL2学习笔记02：点、线、三角形"
date: "2024-07-04"
tag: "WebGL2"
description: ""
---

我们来做一个最简单的webgl2图形

## 图形绘制

### 新建一个canvas

```html
<canvas id="glCanvas" width="300" height="300"></canvas>
```

获取gl对象

```js
function main() {
  const gl = document.querySelector("#glCanvas").getContext("webgl2");
  if (!gl) {
    alert("WebGL2 not supported");
    return false;
  }
}
main();
```

### 编写一段顶点着色器

```js
const VERTEX_SHADER_SOURCE = `#version 300 es
  void main() {
    gl_Position = vec4(0, 0, 0, 1);
    gl_PointSize = 10.0;
  }
`;
```

- `#version 300 es` 指想要使用WebGL2的着色器语法:GLSL ES 3.00。 如果你没有把它放到第一行，将默认设置为GLSL ES 1.00,即WebGL1.0的语法。**必须位于着色器代码的第一行**。 它前面不允许有任何的注释或空行！

- `void main()`是着色器程序的入口，指定了在GPU上执行的每个顶点或片元的处理逻辑。
- `gl_Position`是一个webgl2的一个内置的4维变量（xyzw），用于顶点着色器中指定顶点在**裁剪空间**（Clip Space）中的位置;

- `gl_PointSize`内置变量，控制点的大小

### 编写片元着色器

```
const FRAGMENT_SHADER_SOURCE = `#version 300 es
  precision highp float;
  out vec4 a_color;
  void main() {
    a_color = vec4(0, 0, 0, 1);
  }
`
```

- `precision highp float;`：声明浮点数为高精度（顶点着色器默认浮点精度是 `highp`，所以不用声明），（当前大部分浏览器都是支持高精度的）
- `out vec4 a_color;`：输出一个4维变量（rgba）,在片元着色器中，`out` 关键字表示这个变量将会被传递到后续的渲染阶段（如帧缓冲区）。
- `a_color = vec4(0, 0, 0, 1); `: 设定a_color的值为vec4(red, green, blue, alpha)

### 创建着色器

```js
// 编译顶点着色器
const vertexShader = gl.createShader(gl.VERTEX_SHADER); //创建一个类型为顶点着色器的的着色器
gl.shaderSource(vertexShader, VERTEX_SHADER_SOURCE); //设置着色器的源代码。
gl.compileShader(vertexShader); // 编译着色器对象的函数

// 编译片元着色器
const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, FRAGMENT_SHADER_SOURCE);
gl.compileShader(fragmentShader);

// 创建程序对象
const shaderProgram = gl.createProgram();
gl.attachShader(shaderProgram, vertexShader); //将编译好的着色器（Shader）对象附加到程序对象（Program）上的函数
gl.attachShader(shaderProgram, fragmentShader);
gl.linkProgram(shaderProgram); //将顶点着色器和片元着色器组合成一个可执行的程序对象
```

### 封装

**创建着色器程序**这个过程在99% 的 WbgGL 应用中是一样的，所以我们常封装为一个函数

```js
/**
 * @desc 加载着色器对象
 * @param gl
 * @param type 着色器类型
 * @param source 着色器源代码
 */
function loadShader(gl, type, source) {
  const shader = gl.createShader(type); //创建着色器对象
  gl.shaderSource(shader, source); //设置着色器对象的源代码
  gl.compileShader(shader); //编译指定的着色器

  // 获取着色器对象参数，参数为 shader：着色器，pname：查询的参数名称
  // pname可以是： SHADER_TYPE:着色器类型
  //              DELETE_STATUS:着色器是否已被标记为删除
  //              COMPILE_STATUS:色器的编译状态
  //              INFO_LOG_LENGTH:着色器信息日志的长度
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert(
      "An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader),
    );
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

/**
 * @desc 加载着色器程序对象
 * @param gl
 * @param vsSource 顶点着色器源码
 * @param fsSource 片段着色器源代码
 */
function initShaderProgram(gl, vsSource, fsSource) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

  const shaderProgram = gl.createProgram(); //创建着色器程序对象
  gl.attachShader(shaderProgram, vertexShader); //将顶点着色器对象附加到着色器程序对象上
  gl.attachShader(shaderProgram, fragmentShader); //将片段着色器对象附加到着色器程序对象上
  gl.linkProgram(shaderProgram); //链接已经附加到着色器程序对象上的顶点着色器和片段着色器

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert(
      "Unable to initialize the shader program: " +
        gl.getProgramInfoLog(shaderProgram),
    );
    return null;
  }

  return shaderProgram;
}
```

### 绘制

```js
gl.useProgram(shaderProgram); //激活程序对象

gl.drawArrays(gl.POINTS, 0, 1); //绘制图形
```

gl.drawArrays(mode, first, count); 其中各参数的含义如下：

- `mode`：指定绘制的图元类型，可以是以下常量之一：

  - `gl.POINTS`：绘制独立的点。
  - `gl.LINES`：每两个顶点之间绘制一条线段。
  - `gl.LINE_STRIP`：依次连接所有顶点，但只绘制出线段。
  - `gl.LINE_LOOP`：类似 `LINE_STRIP`，但是会连接起始点和最后一个点，形成闭合的线段。
  - `gl.TRIANGLES`：每三个顶点之间绘制一个三角形。
  - `gl.TRIANGLE_STRIP`：依次连接所有顶点，形成一系列的三角形。
  - `gl.TRIANGLE_FAN`：类似 `TRIANGLE_STRIP`，但是以第一个顶点为公共顶点。

- `first`：指定从哪个顶点开始绘制，通常为 0 表示从第一个顶点开始绘制。

- `count`：指定绘制顶点的数量，即绘制几个顶点。例如，如果 `mode` 是 `gl.TRIANGLES`，那么 `count` 应该是顶点数目的三倍，因为每个三个顶点构成一个三角形。

对应所有代码如下：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Title</title>
    <style>
      #glCanvas {
        border: 1px solid red;
      }
    </style>
  </head>
  <body>
    <canvas id="glCanvas" width="300" height="300"></canvas>
  </body>
  <script>
    /**
     * @desc 加载着色器对象
     * @param gl
     * @param type 着色器类型
     * @param source 着色器源代码
     */
    function loadShader(gl, type, source) {
      const shader = gl.createShader(type); //创建着色器对象
      gl.shaderSource(shader, source); //设置着色器对象的源代码
      gl.compileShader(shader); //编译指定的着色器

      // 获取着色器对象参数，参数为 shader：着色器，pname：查询的参数名称
      // pname可以是： SHADER_TYPE:着色器类型
      //              DELETE_STATUS:着色器是否已被标记为删除
      //              COMPILE_STATUS:色器的编译状态
      //              INFO_LOG_LENGTH:着色器信息日志的长度
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(
          "An error occurred compiling the shaders: " +
            gl.getShaderInfoLog(shader),
        );
        gl.deleteShader(shader);
        return null;
      }

      return shader;
    }

    /**
     * @desc 加载着色器程序对象
     * @param gl
     * @param vsSource 顶点着色器源码
     * @param fsSource 片段着色器源代码
     */
    function initShaderProgram(gl, vsSource, fsSource) {
      const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
      const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

      const shaderProgram = gl.createProgram(); //创建着色器程序对象
      gl.attachShader(shaderProgram, vertexShader); //将顶点着色器对象附加到着色器程序对象上
      gl.attachShader(shaderProgram, fragmentShader); //将片段着色器对象附加到着色器程序对象上
      gl.linkProgram(shaderProgram); //链接已经附加到着色器程序对象上的顶点着色器和片段着色器

      if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert(
          "Unable to initialize the shader program: " +
            gl.getProgramInfoLog(shaderProgram),
        );
        return null;
      }

      return shaderProgram;
    }

    function main() {
      const gl = document.querySelector("#glCanvas").getContext("webgl2");
      if (!gl) {
        alert("WebGL2 not supported");
        return;
      }

      // # 设置顶点的最终裁剪空间坐标，四个参数分别为x,y,z,w;
      // # X 和 Y 坐标范围从 -1 到 1，表示屏幕的水平和垂直范围。
      // # Z 坐标范围从 0 到 1，表示深度信息，用于深度测试和裁剪。
      // # W 坐标通常是 1.0，用于透视除法。
      const VERTEX_SHADER_SOURCE = `#version 300 es
      void main() {
        gl_Position = vec4(0, 0, 0, 1);
        gl_PointSize = 10.0;
      }
    `;

      const FRAGMENT_SHADER_SOURCE = `#version 300 es
      precision highp float;
      out vec4 a_color;
      void main() {
        a_color = vec4(0, 0, 0, 1); //设定a_color的值为vec4(red, green, blue, alpha)
      }
    `;

      // 编译顶点着色器
      const shaderProgram = initShaderProgram(
        gl,
        VERTEX_SHADER_SOURCE,
        FRAGMENT_SHADER_SOURCE,
      );

      gl.useProgram(shaderProgram); //激活程序对象

      gl.drawArrays(gl.POINTS, 0, 1); //绘制图形
    }

    main();
  </script>
</html>
```

![image.png](/images/posts/011-01.png)

### 移动点的位置

我们做点调整，可以自定义点的位置

- 既然要从外部变量改变点的位置，我们首先定一个变量到顶点着色器中，通过变量来调整坐标

```js
const VERTEX_SHADER_SOURCE = `#version 300 es
  in vec2 a_position; //输入一个二维变量a_position；
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0); //gl_Position是一个四维数据， 改为由二维数据a_position和0.0，1.0拼接
    gl_PointSize = 10.0;
  }
`;
```

- 创建一个缓冲区，来存放我们想要调整的数据

```js
//使用`bufferData`将我们要调整的坐标数据传输到`vertexBuffer`缓冲区中，数据类型为`Float32Array`，并指定了使用模式为`gl.STATIC_DRAW`，表示数据不会频繁改变。
gl.bufferData(
  gl.ARRAY_BUFFER,
  new Float32Array([
    // 线条的顶点数据
    // -0.5, -0.5,
    // 0.5, -0.5,

    // 点的顶点数据
    0.0, 0.8,

    // 三角形的顶点数据
    // -0.5, 0.5,
    // 0.5, 0.5,
    // 0.0, 0.0
  ]),
  gl.STATIC_DRAW,
);
```

- 将我们存储在缓冲区的属性和顶点数组绑定

```js
// 获取a_position位置属性
const positionAttributeLocation = gl.getAttribLocation(
  shaderProgram,
  "a_position",
);

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
```

- 渲染

```js
drawScene();

function drawScene() {
  // 清空画布
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.clearColor(0.0, 0.0, 0.0, 0.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // 执行指定的着色器
  gl.useProgram(shaderProgram);

  // 在绘制之前绑定顶点数组对象
  gl.bindVertexArray(vao);

  // 绘制线条
  // gl.drawArrays(gl.LINES, 0, 2)

  // 绘制点
  gl.drawArrays(gl.POINTS, 0, 1);

  // 绘制三角形
  // gl.drawArrays(gl.TRIANGLES, 3, 3)
}
```

- 整体代码如下

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Title</title>
    <style>
      #glCanvas {
        border: 1px solid red;
      }
    </style>
  </head>
  <body>
    <canvas id="glCanvas" width="300" height="300"></canvas>
  </body>
  <script>
    /**
     * @desc 加载着色器对象
     * @param gl
     * @param type 着色器类型
     * @param source 着色器源代码
     */
    function loadShader(gl, type, source) {
      const shader = gl.createShader(type); //创建着色器对象
      gl.shaderSource(shader, source); //设置着色器对象的源代码
      gl.compileShader(shader); //编译指定的着色器

      // 获取着色器对象参数，参数为 shader：着色器，pname：查询的参数名称
      // pname可以是： SHADER_TYPE:着色器类型
      //              DELETE_STATUS:着色器是否已被标记为删除
      //              COMPILE_STATUS:色器的编译状态
      //              INFO_LOG_LENGTH:着色器信息日志的长度
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(
          "An error occurred compiling the shaders: " +
            gl.getShaderInfoLog(shader),
        );
        gl.deleteShader(shader);
        return null;
      }

      return shader;
    }

    /**
     * @desc 加载着色器程序对象
     * @param gl
     * @param vsSource 顶点着色器源码
     * @param fsSource 片段着色器源代码
     */
    function initShaderProgram(gl, vsSource, fsSource) {
      const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
      const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

      const shaderProgram = gl.createProgram(); //创建着色器程序对象
      gl.attachShader(shaderProgram, vertexShader); //将顶点着色器对象附加到着色器程序对象上
      gl.attachShader(shaderProgram, fragmentShader); //将片段着色器对象附加到着色器程序对象上
      gl.linkProgram(shaderProgram); //链接已经附加到着色器程序对象上的顶点着色器和片段着色器

      if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert(
          "Unable to initialize the shader program: " +
            gl.getProgramInfoLog(shaderProgram),
        );
        return null;
      }

      return shaderProgram;
    }

    function main() {
      const gl = document.querySelector("#glCanvas").getContext("webgl2");
      if (!gl) {
        alert("WebGL2 not supported");
        return;
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
    `;

      const FRAGMENT_SHADER_SOURCE = `#version 300 es
      precision highp float;
      out vec4 a_color;
      void main() {
        a_color = vec4(0, 0, 0, 1);
      }
    `;

      // 编译顶点着色器
      const shaderProgram = initShaderProgram(
        gl,
        VERTEX_SHADER_SOURCE,
        FRAGMENT_SHADER_SOURCE,
      );

      // 创建顶点缓冲区
      const vertexBuffer = gl.createBuffer(); ////创建一个顶点缓冲区对象
      gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer); ////将缓冲区对象绑定到 WebGL 的`ARRAY_BUFFER`目标上

      //使用`bufferData`将我们要调整的坐标数据传输到`vertexBuffer`缓冲区中，数据类型为`Float32Array`，并指定了使用模式为`gl.STATIC_DRAW`，表示数据不会频繁改变。
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([
          // 线条的顶点数据
          // -0.5, -0.5,
          // 0.5, -0.5,

          // 点的顶点数据
          0.0, 0.8,

          // 三角形的顶点数据
          // -0.5, 0.5,
          // 0.5, 0.5,
          // 0.0, 0.0
        ]),
        gl.STATIC_DRAW,
      );

      // 获取a_position位置属性
      const positionAttributeLocation = gl.getAttribLocation(
        shaderProgram,
        "a_position",
      );

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
      gl.vertexAttribPointer(
        positionAttributeLocation,
        2,
        gl.FLOAT,
        false,
        0,
        0,
      );

      //启用指定位置的顶点属性数组。
      gl.enableVertexAttribArray(positionAttributeLocation);

      drawScene();

      function drawScene() {
        // 清空画布
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.clearColor(0.0, 0.0, 0.0, 0.0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        // 执行指定的着色器
        gl.useProgram(shaderProgram);

        // 在绘制之前绑定顶点数组对象
        gl.bindVertexArray(vao);

        // 绘制线条
        // gl.drawArrays(gl.LINES, 0, 2)

        // 绘制点
        gl.drawArrays(gl.POINTS, 0, 1);

        // 绘制三角形
        // gl.drawArrays(gl.TRIANGLES, 3, 3)
      }
    }

    main();
  </script>
</html>
```

打开html，可以看到点的位置已经发生改变

![image.png](/images/posts/011-02.png)

绘制线条和三角形

我们做点调整绘制一下线条和三角形

- 在执行`bufferData`的操作中，添加线的坐标，和三角形的坐标

```js
//使用`bufferData`将我们要调整的坐标数据传输到`vertexBuffer`缓冲区中，数据类型为`Float32Array`，并指定了使用模式为`gl.STATIC_DRAW`，表示数据不会频繁改变。
gl.bufferData(
  gl.ARRAY_BUFFER,
  new Float32Array([
    // 点的顶点数据
    0.0, 0.8,

    // 线条的顶点数据
    -0.5, -0.5, 0.5, -0.5,

    // 三角形的顶点数据
    -0.5, 0.5, 0.5, 0.5, 0.0, 0.0,
  ]),
  gl.STATIC_DRAW,
);
```

- 在渲染的地方添加渲染线条和三角形的处理

```js
// 绘制线条
gl.drawArrays(gl.LINES, 1, 2);

// 绘制三角形
gl.drawArrays(gl.TRIANGLES, 3, 3);
```

整体代码如下

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Title</title>
    <style>
      #glCanvas {
        border: 1px solid red;
      }
    </style>
  </head>
  <body>
    <canvas id="glCanvas" width="300" height="300"></canvas>
  </body>
  <script>
    /**
     * @desc 加载着色器对象
     * @param gl
     * @param type 着色器类型
     * @param source 着色器源代码
     */
    function loadShader(gl, type, source) {
      const shader = gl.createShader(type); //创建着色器对象
      gl.shaderSource(shader, source); //设置着色器对象的源代码
      gl.compileShader(shader); //编译指定的着色器

      // 获取着色器对象参数，参数为 shader：着色器，pname：查询的参数名称
      // pname可以是： SHADER_TYPE:着色器类型
      //              DELETE_STATUS:着色器是否已被标记为删除
      //              COMPILE_STATUS:色器的编译状态
      //              INFO_LOG_LENGTH:着色器信息日志的长度
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(
          "An error occurred compiling the shaders: " +
            gl.getShaderInfoLog(shader),
        );
        gl.deleteShader(shader);
        return null;
      }

      return shader;
    }

    /**
     * @desc 加载着色器程序对象
     * @param gl
     * @param vsSource 顶点着色器源码
     * @param fsSource 片段着色器源代码
     */
    function initShaderProgram(gl, vsSource, fsSource) {
      const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
      const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

      const shaderProgram = gl.createProgram(); //创建着色器程序对象
      gl.attachShader(shaderProgram, vertexShader); //将顶点着色器对象附加到着色器程序对象上
      gl.attachShader(shaderProgram, fragmentShader); //将片段着色器对象附加到着色器程序对象上
      gl.linkProgram(shaderProgram); //链接已经附加到着色器程序对象上的顶点着色器和片段着色器

      if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert(
          "Unable to initialize the shader program: " +
            gl.getProgramInfoLog(shaderProgram),
        );
        return null;
      }

      return shaderProgram;
    }

    function main() {
      const gl = document.querySelector("#glCanvas").getContext("webgl2");
      if (!gl) {
        alert("WebGL2 not supported");
        return;
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
    `;

      const FRAGMENT_SHADER_SOURCE = `#version 300 es
      precision highp float;
      out vec4 a_color;
      void main() {
        a_color = vec4(0, 0, 0, 1);
      }
    `;

      // 编译顶点着色器
      const shaderProgram = initShaderProgram(
        gl,
        VERTEX_SHADER_SOURCE,
        FRAGMENT_SHADER_SOURCE,
      );

      // 创建顶点缓冲区
      const vertexBuffer = gl.createBuffer(); ////创建一个顶点缓冲区对象
      gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer); ////将缓冲区对象绑定到 WebGL 的`ARRAY_BUFFER`目标上

      //使用`bufferData`将我们要调整的坐标数据传输到`vertexBuffer`缓冲区中，数据类型为`Float32Array`，并指定了使用模式为`gl.STATIC_DRAW`，表示数据不会频繁改变。
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([
          // 点的顶点数据
          0.0, 0.8,

          // 线条的顶点数据
          -0.5, -0.5, 0.5, -0.5,

          // 三角形的顶点数据
          -0.5, 0.5, 0.5, 0.5, 0.0, 0.0,
        ]),
        gl.STATIC_DRAW,
      );

      // 获取a_position位置属性
      const positionAttributeLocation = gl.getAttribLocation(
        shaderProgram,
        "a_position",
      );

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
      gl.vertexAttribPointer(
        positionAttributeLocation,
        2,
        gl.FLOAT,
        false,
        0,
        0,
      );

      //启用指定位置的顶点属性数组。
      gl.enableVertexAttribArray(positionAttributeLocation);

      drawScene();

      function drawScene() {
        // 清空画布
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.clearColor(0.0, 0.0, 0.0, 0.0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        // 执行指定的着色器
        gl.useProgram(shaderProgram);

        // 在绘制之前绑定顶点数组对象
        gl.bindVertexArray(vao);

        // 绘制点
        gl.drawArrays(gl.POINTS, 0, 1);

        // 绘制线条
        gl.drawArrays(gl.LINES, 1, 2);

        // 绘制三角形
        gl.drawArrays(gl.TRIANGLES, 3, 3);
      }
    }

    main();
  </script>
</html>
```

- 刷新页面，即可看到

![image.png](/images/posts/011-03.png)

- 这篇我们讲了通过修改顶点着色器来修改位置和绘制点线面，接下来我们看看如何修改片段着色器来调整颜色[02. WEBGL2学习2: 颜色配置](url)

## 附录

-- 空间向量(x、y、z、w):

1. X 和 Y 坐标范围从 -1 到 1，表示屏幕的水平和垂直范围;
2. Z 坐标范围从 0 到 1，表示深度信息，用于深度测试和裁剪。
3. W 坐标通常是 1.0，用于透视除法。

-- 坐标空间转换

1.  **模型空间（Model Space）** ：顶点的原始坐标，通常是对象的局部坐标系。
1.  **世界空间（World Space）** ：通过模型变换将模型空间坐标转换到世界坐标系中。
1.  **视图空间（View Space 或 Eye Space）** ：通过视图变换将世界空间坐标转换为相机或观察者的视角下的坐标系。
1.  **裁剪空间（Clip Space）** ：通过投影变换将视图空间坐标转换为规范化的坐标空间，即 `[-1, 1]` 范围内的坐标。
1.  **屏幕空间（Screen Space 或 Window Space）** ：通过视口变换将裁剪空间坐标映射到屏幕的像素坐标系。

-- 浏览器支持情况：

![image.png](/images/posts/011-04.png)

## 参考文档

https://webgl2fundamentals.org/webgl/lessons/zh_cn/webgl-fundamentals.html#toc

---

上一篇：[WEBGL2学习笔记01：基础概念](/posts/post-010)
下一篇：[WEBGL2学习笔记03：颜色配置和重置画布](/posts/post-012)
