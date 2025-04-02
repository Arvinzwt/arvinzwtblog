---
title: "MATTER笔记04：物理实体"
date: "2025-04-03"
tag: "MatterJs"
description: "一个用于网页的2D刚体物理引擎"
---

### 说明

**Bodies** 模块包含用于创建具有常用身体配置（例如矩形、圆形和其他多边形）的刚体模型的工厂方法。

**Body** 模块提供对单个刚体的底层操作和属性管理。

他们区分大概如下：

| 特性     | Body                         | Bodies                       |
| -------- | ---------------------------- | ---------------------------- |
| 用途     | 操作/管理刚体                | 快速生成标准形状刚体         |
| 方法类型 | 属性修改工具方法             | 工厂方法（创建实例）         |
| 使用频率 | 中低频（需要精细控制时使用） | 高频（初始化场景时大量使用） |
| 典型输入 | 已有刚体对象 + 参数          | 几何参数 + 可选配置项        |
| 输出结果 | 修改后的刚体                 | 新创建的刚体                 |

### 案例

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

### 参考文献

[Matter.js 官方文档](https://brm.io/matter-js/docs/)

[Matter.js GitHub 仓库](https://github.com/liabru/matter-js)

---

上一篇：[MATTER笔记03：核心控制](/posts/post-017)

下一篇：[MATTER笔记05：结构与约束组](/posts/post-019)
