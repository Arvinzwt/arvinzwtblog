---
title: "MATTER笔记02：安装"
date: "2025-04-01"
tag: "MatterJs"
description: "一个用于网页的2D刚体物理引擎"
---

## 安装

### CDN引入

使用稳定的[cdn](https://www.bootcdn.cn/) 节点并引入，例如

```js
<script src="https://cdn.bootcdn.net/ajax/libs/matter-js/0.20.0/matter.js"></script>
```

### 下载引入

下载[官方最新版本脚本](https://github.com/liabru/matter-js/tree/master/build) ，并将脚本包含在您的网页中，例如

```js
<script src="matter.js"></script>
```

### npm安装

您也可以使用包管理器 [npm](https://www.npmjs.org/package/matter-js) 进行安装

```bash
npm install matter-js
```

## 常见问题

常见问题请参考官方[issue](https://github.com/liabru/matter-js/issues/1001)

## 最小示例

以下是使用内置渲染器和运行器的最小示例，可帮助您入门：

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

      /*******************************
       * 扩展建议：
       * 1. 添加鼠标交互：
       *    var mouse = Matter.Mouse.create(render.canvas);
       *    var mouseConstraint = Matter.MouseConstraint.create(engine, { mouse });
       *    Composite.add(engine.world, mouseConstraint);
       *
       * 2. 监听碰撞事件：
       *    Matter.Events.on(engine, 'collisionStart', function(event) {
       *      console.log('碰撞发生！', event.pairs);
       *    });
       *******************************/
    </script>
  </body>
</html>
```

### 参考文献

[Matter.js 官方文档](https://brm.io/matter-js/docs/)

[Matter.js GitHub 仓库](https://github.com/liabru/matter-js)

---

上一篇：[MATTER笔记01：基础概念](/posts/post-015)

下一篇：[MATTER笔记03：核心控制](/posts/post-017)
