---
title: "MATTER笔记01：基础概念"
date: "2025-03-31"
tag: "matter.js"
description: "一个用于网页的2D刚体物理引擎"
---

## 说明

Matter.js 是一个强大的 2D 物理引擎，用于在网页中创建真实的物理效果。

## 基础概念

Matter.js 由多个模块组成，每个模块负责不同的功能。以下是主要模块的简单解释：

| 模块名称        | 说明         | 描述                                                              |
| --------------- | ------------ | ----------------------------------------------------------------- |
| Engine          | 引擎         | 物理模拟的核心控制器，负责更新世界状态、处理碰撞和力学计算。      |
| Render          | 渲染器       | 用于调试的可视化工具，将物理世界渲染到 Canvas（非生产环境专用）。 |
| Runner          | 运行器       | 控制引擎的更新循环（如固定帧率或按需刷新）。                      |
| Body            | 物理实体     | 单个刚体对象（如矩形、圆形等），具有质量、位置、速度等物理属性。  |
| Bodies          | 实体工厂     | 提供快速创建常见形状（矩形、圆形、多边形等）的静态方法。          |
| Composite       | 复合结构     | 将多个刚体或约束组合为复杂物体（如铰接机械、车辆等）。            |
| Composites      | 复合结构工厂 | 提供预定义的复合结构生成方法（如链式、堆叠等）。                  |
| Constraint      | 约束         | 定义物体间的连接关系（如弹簧、绳索、铰链等）。                    |
| MouseConstraint | 鼠标约束     | 将用户鼠标交互绑定到物理世界，实现拖拽物体功能。                  |
| Events          | 事件系统     | 监听和触发物理世界的事件（碰撞开始、睡眠、引擎更新等）。          |
| Common          | 通用工具     | 提供共享的工具函数（如随机数生成、深度克隆等）。                  |
| Plugin          | 插件系统     | 允许扩展引擎功能（需手动注册，如自定义碰撞检测或物理行为）。      |

## 运行步骤

Matter.js 的运行通常遵循一套标准流程，以下是创建物理模拟的基本步骤：

### 初始化阶段

- 引入必要模块

```js
// 常用模块
const Engine = Matter.Engine,
  Render = Matter.Render,
  World = Matter.World,
  Bodies = Matter.Bodies,
  Runner = Matter.Runner;
```

- 创建引擎核心

```js
// 创建物理引擎
const engine = Engine.create({
  gravity: { x: 0, y: 1 }, // 可自定义重力
});
```

### 渲染设置

- 创建渲染器

```js
const render = Render.create({
  element: document.body, // 挂载点
  engine: engine,
  options: {
    width: 800,
    height: 600,
    wireframes: true, // 线框模式
    background: "#fafafa",
  },
});
```

### 创建物理世界

- 创建物理实体

```js
// 静态地面
const ground = Bodies.rectangle(400, 610, 810, 60, {
  isStatic: true,
  render: { fillStyle: "#2ecc71" },
});

// 动态物体
const box = Bodies.rectangle(400, 200, 80, 80);
const ball = Bodies.circle(100, 100, 50, {
  restitution: 0.8, // 弹性系数
});
```

- 添加到世界

```js
World.add(engine.world, [ground, box, ball]);
```

### 交互设置（可选）

- 鼠标控制

```js
const mouse = Matter.Mouse.create(render.canvas);
const mouseConstraint = Matter.MouseConstraint.create(engine, {
  mouse: mouse,
  constraint: {
    stiffness: 0.2,
  },
});
World.add(engine.world, mouseConstraint);
render.mouse = mouse; // 同步鼠标
```

### 启动系统

- 创建并运行主循环

```js
const runner = Runner.create();
Runner.run(runner, engine); // 物理更新循环
Render.run(render); // 渲染循环
```

## 简单示例

代码如下：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <!--样式重制-->
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/meyer-reset/2.0/reset.min.css"
    />
    <style>
      body,
      html {
        background: #f7f8fb;
      }

      #app {
        width: 100vw;
        height: 100vh;
        display: block;
        text-align: center;
        box-sizing: border-box;
        border: 1px solid gray;
        padding: 30px;
      }
    </style>
    <title>matter-js</title>
  </head>
  <body>
    <div id="app"></div>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/matter-js/0.20.0/matter.js"></script>
    <script>
      /**
       * Matter.js 物理引擎初始化
       * 包含完整的物理世界设置、渲染和交互控制
       */

      // ==================== 模块导入 ====================
      // 使用解构赋值导入常用模块
      const {
        Engine, // 物理引擎核心
        Render, // 渲染器
        World, // 物理世界
        Bodies, // 物体创建
        Runner, // 运行控制
        Mouse, // 鼠标交互
        MouseConstraint, // 鼠标约束
      } = Matter;

      // ==================== 引擎初始化 ====================
      // 创建物理引擎实例
      const engine = Engine.create({
        gravity: { x: 0, y: 1 }, // 设置重力 (x: 水平重力, y: 垂直重力)
        enableSleeping: true, // 启用休眠系统优化性能
      });

      // ==================== 渲染器设置 ====================
      const render = Render.create({
        element: document.querySelector("#app"), // 挂载到DOM元素
        engine: engine, // 绑定物理引擎
        options: {
          width: 800, // 画布宽度
          height: 600, // 画布高度
          wireframes: false, // 是否显示线框 (true=线框模式)
          background: "#fafafa", // 背景颜色
          showAngleIndicator: true, // 显示角度指示器
          showCollisions: true, // 显示碰撞点
        },
      });

      // ==================== 物理物体创建 ====================
      // 创建静态地面 (isStatic: true 表示不会移动)
      const ground = Bodies.rectangle(
        400, // x坐标 (画布中心)
        610, // y坐标 (靠近底部)
        810, // 宽度
        60, // 高度
        {
          isStatic: true,
          render: {
            fillStyle: "#2ecc71", // 填充颜色
            strokeStyle: "#27ae60", // 边框颜色
            lineWidth: 2,
          },
          friction: 0.3, // 摩擦系数
        },
      );

      // 创建动态矩形
      const box = Bodies.rectangle(400, 200, 80, 80, {
        restitution: 0.6, // 弹性系数 (0-1)
        friction: 0.1,
        render: {
          fillStyle: "#3498db",
        },
      });

      // 创建动态圆形
      const ball = Bodies.circle(100, 100, 50, {
        restitution: 0.8, // 更高的弹性
        friction: 0.05,
        render: {
          fillStyle: "#e74c3c",
        },
      });

      // ==================== 添加到物理世界 ====================
      World.add(engine.world, [
        ground, // 地面
        box, // 矩形
        ball, // 圆形
      ]);

      // ==================== 鼠标交互 ====================
      // 创建鼠标控制
      const mouse = Mouse.create(render.canvas);
      const mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
          stiffness: 0.2, // 约束刚度
          render: {
            visible: false, // 不显示约束线
          },
        },
      });

      // 添加鼠标约束到世界
      World.add(engine.world, mouseConstraint);

      // 同步渲染器的鼠标实例
      render.mouse = mouse;

      // ==================== 事件监听 ====================
      // 碰撞开始事件
      Matter.Events.on(engine, "collisionStart", (event) => {
        const pairs = event.pairs;
        pairs.forEach((pair) => {
          console.log("碰撞发生在:", pair.bodyA, pair.bodyB);
        });
      });

      // ==================== 启动引擎 ====================
      // 创建并启动运行器
      const runner = Runner.create();
      Runner.run(runner, engine); // 启动物理更新循环

      // 启动渲染器
      Render.run(render);

      // ==================== 实用函数 ====================
      /**
       * 添加随机物体到世界
       * @param {number} count - 要添加的物体数量
       */
      function addRandomBodies(count) {
        const bodies = [];
        for (let i = 0; i < count; i++) {
          bodies.push(
            Bodies.rectangle(
              Math.random() * 700 + 50,
              Math.random() * 300,
              Math.random() * 50 + 20,
              Math.random() * 50 + 20,
            ),
          );
        }
        World.add(engine.world, bodies);
      }

      // 示例：添加5个随机物体
      // addRandomBodies(5);

      // ==================== 窗口大小调整 ====================
      window.addEventListener("resize", () => {
        // 更新渲染器尺寸
        render.options.width = window.innerWidth;
        render.options.height = window.innerHeight;
        Render.setPixelRatio(render, window.devicePixelRatio);
      });
    </script>
  </body>
</html>
```

## 参考文献

[Matter.js 官方文档](https://brm.io/matter-js/docs/)

[Matter.js GitHub 仓库](https://github.com/liabru/matter-js)

---

下一篇：[MATTER笔记02：安装](/posts/post-016)
