---
title: "MATTER笔记03：核心控制"
date: "2025-04-02"
tag: "MatterJs"
description: "一个用于网页的2D刚体物理引擎"
---

### 说明

matter.js的控制核心大概有以下模块
| 模块名称 | 说明 | 描述 |
| -------- | -------- | ----------------------------------------------------------------- |
| Engine | 引擎 | 物理模拟的核心控制器，负责更新世界状态、处理碰撞和力学计算。 |
| Render | 渲染器 | 用于调试的可视化工具，将物理世界渲染到 Canvas（非生产环境专用）。 |
| Events | 事件系统 | 监听和触发物理世界的事件（碰撞开始、睡眠、引擎更新等）。 |

#### 基础案例

我们新建一个最小示例

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Matter.js 物理引擎示例</title>
  </head>
  <body>
    <div id="app"></div>
    <!-- 引入 Matter.js 物理引擎库 -->
    <script src="https://cdn.bootcdn.net/ajax/libs/matter-js/0.20.0/matter.js"></script>
    <script>
      // 模块别名（简化调用）
      var Engine = Matter.Engine, // 物理引擎核心模块
        Render = Matter.Render, // 渲染模块（用于可视化调试）
        Runner = Matter.Runner, // 运行控制模块
        Bodies = Matter.Bodies, // 刚体创建模块
        Composite = Matter.Composite; // 复合物体/世界管理模块

      // 1. 创建物理引擎实例
      // - 会自动创建一个空的物理世界 (engine.world)
      var engine = Engine.create();

      // 2. 创建渲染器（用于可视化调试）
      // - element: 指定渲染画布挂载的DOM元素
      // - engine:  绑定到哪个物理引擎
      var render = Render.create({
        element: document.body, // 渲染到页面body中
        engine: engine, // 绑定刚创建的引擎
        options: {
          wireframes: true, // 线框模式（调试时更清晰）
        },
      });

      // 3. 创建物理实体
      // - 矩形刚体参数：(x坐标, y坐标, 宽度, 高度, [选项])
      var boxA = Bodies.rectangle(400, 200, 80, 80, {
        restitution: 0.8, // 弹性系数（0-1）
      });
      var boxB = Bodies.rectangle(450, 50, 80, 80, {
        angle: Math.PI / 4, // 初始旋转角度（弧度）
      });
      // 静态地面（isStatic: true 表示不受重力影响）
      var ground = Bodies.rectangle(400, 610, 810, 60, {
        isStatic: true, // 设为静态物体
      });

      // 4. 将所有刚体添加到物理世界
      Composite.add(engine.world, [boxA, boxB, ground]);

      // 5. 启动渲染器（开始绘制物理世界）
      Render.run(render);

      // 6. 创建运行控制器
      var runner = Runner.create({
        fps: 60, // 可选：限制帧率
      });

      // 7. 启动物理引擎（开始模拟）
      // - 会自动按帧更新物理世界状态
      Runner.run(runner, engine);
    </script>
  </body>
</html>
```

### 1、引擎

#### 说明

Engine 是 Matter.js 最核心的模块，相当于物理世界的大脑。它负责：

- 协调所有物理计算（位置、速度、碰撞等）
- 管理时间步长和更新循环
- 持有世界实例（engine.world）
- 控制重力等全局参数

#### 主要属性和方法

| 关键方法                                 | 说明                                                                                                      |
| ---------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| Engine.create()                          | 创建引擎实例，包含默认的 world（物理世界）和 render（可选渲染器）。                                       |
| Engine.update(engine, delta, correction) | 推进物理模拟一步：_delta_：时间步长（默认 16.666ms，即 60Hz）。_correction_：用于补偿帧率波动的修正因子。 |
| Engine.run(engine)                       | 启动持续更新的循环（基于 requestAnimationFrame）。                                                        |
| Engine.clear(engine)                     | 清除引擎数据（如移除所有物体）。                                                                          |

#### 使用

### 2、渲染器

#### 说明

Render 模块专为调试设计，提供：

- 实时可视化物理世界
- 线框/实体渲染模式切换
- 视图缩放和平移支持
- 性能指标显示

### 3、事件系统

#### 说明

事件系统可以监听三类事件：

- 引擎事件：beforeUpdate、afterUpdate
- 碰撞事件：collisionStart、collisionActive、collisionEnd
- 物体事件：sleepStart、sleepEnd

### 参考文献

[Matter.js 官方文档](https://brm.io/matter-js/docs/)

[Matter.js GitHub 仓库](https://github.com/liabru/matter-js)

---

上一篇：[MATTER笔记02：安装](/posts/post-016)

下一篇：[MATTER笔记04：物理实体](/posts/post-018)
