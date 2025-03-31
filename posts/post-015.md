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

### 核心模块
| 模块名称    | 说明     | 描述 |
| --------- | ------- | --- |
| Engine     | 引擎   | 物理引擎的核心控制器，管理整个模拟系统的运行 |
| World      | 物理世界 | 包含所有物理实体和约束的虚拟世界容器 |
| Body       | 物理身体 | 代表单个具有物理属性的物体（如盒子、球体等） |
| Bodies     | 身体工厂 | 提供快速创建常见形状物理体的工厂方法 |

### 组合与约束
| 模块名称       | 说明     | 描述 |
| ------------ | ------- | --- |
| Composite     | 组合体   | 将多个物体组合成复杂结构的工具 |
| Constraint    | 约束     | 定义物体间连接关系的模块（如绳索、铰链等） |

### 交互与渲染
| 模块名称          | 说明       | 描述 |
| --------------- | --------- | --- |
| MouseConstraint  | 鼠标控制   | 实现鼠标与物理世界交互的功能 |
| Render           | 渲染器     | 将物理世界可视化呈现的渲染系统 |
| Runner           | 运行器     | 控制物理模拟更新循环的运行器 |

### 碰撞检测
| 模块名称    | 说明       | 描述 |
| --------- | --------- | --- |
| Collision  | 碰撞检测   | 检测和处理物体碰撞的系统 |
| Query      | 空间查询   | 在物理空间中进行区域查询的工具 |
| Grid       | 空间网格   | 用于优化碰撞检测的空间分区网格 |
| Pairs      | 碰撞配对   | 管理碰撞检测中物体配对关系的工具 |
| SAT        | 碰撞算法   | 使用分离轴定理进行碰撞检测的算法 |

### 工具模块
| 模块名称    | 说明       | 描述 |
| --------- | --------- | --- |
| Vector     | 向量计算   | 处理二维向量运算的数学工具 |
| Vertices   | 顶点处理   | 处理多边形顶点数据的工具集 |
| Resolver   | 碰撞解决   | 解决碰撞后物体运动方案的模块 |

### 特殊效果
| 模块名称    | 说明       | 描述 |
| --------- | --------- | --- |
| Events     | 事件系统   | 提供物理事件监听和处理的系统 |
| Sleeping   | 休眠系统   | 优化性能的休眠（静止物体不计算）系统 |
| Metrics    | 性能统计   | 提供性能监测和统计功能 |

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
  gravity: { x: 0, y: 1 } // 可自定义重力
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
    background: '#fafafa'
  }
});
```

### 创建物理世界

- 创建物理实体

```js
// 静态地面
const ground = Bodies.rectangle(400, 610, 810, 60, {
  isStatic: true,
  render: { fillStyle: '#2ecc71' }
});

// 动态物体
const box = Bodies.rectangle(400, 200, 80, 80);
const ball = Bodies.circle(100, 100, 50, {
  restitution: 0.8 // 弹性系数
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
    stiffness: 0.2
  }
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
<html lang='en'>
<head>
  <meta charset='UTF-8'>
  <meta name='viewport' content='width=device-width, initial-scale=1.0'>
  <!--样式重制-->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/meyer-reset/2.0/reset.min.css">
  <style>
    body, html {
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
      Engine,   // 物理引擎核心
      Render,   // 渲染器
      World,    // 物理世界
      Bodies,   // 物体创建
      Runner,   // 运行控制
      Mouse,    // 鼠标交互
      MouseConstraint // 鼠标约束
    } = Matter;

  // ==================== 引擎初始化 ====================
  // 创建物理引擎实例
  const engine = Engine.create({
    gravity: { x: 0, y: 1 }, // 设置重力 (x: 水平重力, y: 垂直重力)
    enableSleeping: true      // 启用休眠系统优化性能
  });

  // ==================== 渲染器设置 ====================
  const render = Render.create({
    element: document.querySelector('#app'), // 挂载到DOM元素
    engine: engine,                         // 绑定物理引擎
    options: {
      width: 800,                           // 画布宽度
      height: 600,                          // 画布高度
      wireframes: false,                    // 是否显示线框 (true=线框模式)
      background: '#fafafa',                // 背景颜色
      showAngleIndicator: true,             // 显示角度指示器
      showCollisions: true                  // 显示碰撞点
    }
  });

  // ==================== 物理物体创建 ====================
  // 创建静态地面 (isStatic: true 表示不会移动)
  const ground = Bodies.rectangle(
    400,       // x坐标 (画布中心)
    610,       // y坐标 (靠近底部)
    810,       // 宽度
    60,        // 高度
    {
      isStatic: true,
      render: {
        fillStyle: '#2ecc71', // 填充颜色
        strokeStyle: '#27ae60', // 边框颜色
        lineWidth: 2
      },
      friction: 0.3 // 摩擦系数
    }
  );

  // 创建动态矩形
  const box = Bodies.rectangle(400, 200, 80, 80, {
    restitution: 0.6, // 弹性系数 (0-1)
    friction: 0.1,
    render: {
      fillStyle: '#3498db'
    }
  });

  // 创建动态圆形
  const ball = Bodies.circle(100, 100, 50, {
    restitution: 0.8, // 更高的弹性
    friction: 0.05,
    render: {
      fillStyle: '#e74c3c'
    }
  });

  // ==================== 添加到物理世界 ====================
  World.add(engine.world, [
    ground,  // 地面
    box,     // 矩形
    ball     // 圆形
  ]);

  // ==================== 鼠标交互 ====================
  // 创建鼠标控制
  const mouse = Mouse.create(render.canvas);
  const mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
      stiffness: 0.2,        // 约束刚度
      render: {
        visible: false      // 不显示约束线
      }
    }
  });

  // 添加鼠标约束到世界
  World.add(engine.world, mouseConstraint);

  // 同步渲染器的鼠标实例
  render.mouse = mouse;

  // ==================== 事件监听 ====================
  // 碰撞开始事件
  Matter.Events.on(engine, 'collisionStart', (event) => {
    const pairs = event.pairs;
    pairs.forEach((pair) => {
      console.log('碰撞发生在:', pair.bodyA, pair.bodyB);
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
      bodies.push(Bodies.rectangle(
        Math.random() * 700 + 50,
        Math.random() * 300,
        Math.random() * 50 + 20,
        Math.random() * 50 + 20
      ));
    }
    World.add(engine.world, bodies);
  }

  // 示例：添加5个随机物体
  // addRandomBodies(5);

  // ==================== 窗口大小调整 ====================
  window.addEventListener('resize', () => {
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

下一篇：[MATTER笔记02：核心模块](/posts/post-016)

