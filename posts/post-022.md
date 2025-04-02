---
title: "MATTER笔记22"
date: "2025-04-11"
tag: "MatterJs"
description: "一个用于网页的2D刚体物理引擎"
---

### 说明

| 模块名称 | 说明     | 描述                                                              |
| -------- | -------- | ----------------------------------------------------------------- |
| Engine   | 引擎     | 物理模拟的核心控制器，负责更新世界状态、处理碰撞和力学计算。      |
| Render   | 渲染器   | 用于调试的可视化工具，将物理世界渲染到 Canvas（非生产环境专用）。 |
| Events   | 事件系统 | 监听和触发物理世界的事件（碰撞开始、睡眠、引擎更新等）。          |

### 引擎

#### 说明

Engine 是 Matter.js 最核心的模块，相当于物理世界的大脑。它负责：

- 协调所有物理计算（位置、速度、碰撞等）
- 管理时间步长和更新循环
- 持有世界实例（engine.world）
- 控制重力等全局参数

#### Methods

#### Properties / Options

#### Events

#### 使用

```js
// 创建引擎（自动生成默认世界）
const engine = Matter.Engine.create();

// 配置参数（可选）
engine.gravity.y = 1; // 设置Y轴重力
engine.timing.timeScale = 0.5; // 时间减速50%

// 手动更新引擎（替代Runner）
Matter.Engine.update(engine, deltaTime);
```

#### 示例

```js
// 创建堆叠的盒子
const boxes = [];
for (let i = 0; i < 5; i++) {
  boxes.push(Bodies.rectangle(300, 100 + i * 50, 50, 50));
}
Composite.add(engine.world, boxes);

// 特殊效果：瞬间施加全局力
Matter.Engine.applyForce(
  engine.world,
  { x: 0, y: 0 }, // 作用点（全局坐标）
  { x: 0.01, y: -0.02 }, // 力向量
);
```

### 渲染器

#### 说明

Render 模块专为调试设计，提供：

- 实时可视化物理世界
- 线框/实体渲染模式切换
- 视图缩放和平移支持
- 性能指标显示

#### Methods

#### Properties / Options

#### Events

#### 使用

```js
const render = Matter.Render.create({
  element: document.body,
  engine: engine,
  options: {
    width: 800,
    height: 600,
    wireframes: false, // 实体模式
    showSleeping: true, // 显示休眠物体
    background: "#f4f4f4",
  },
});

// 控制渲染
Matter.Render.stop(render); // 暂停渲染
Matter.Render.setPixelRatio(render, "auto"); // 适配高清屏
```

#### 示例

```js
// 动态修改渲染选项
document.querySelector("#toggle-mode").addEventListener("click", () => {
  render.options.wireframes = !render.options.wireframes;
});

// 添加调试信息显示
Matter.Events.on(render, "afterRender", () => {
  const ctx = render.context;
  ctx.fillStyle = "red";
  ctx.fillText(`物体数量: ${engine.world.bodies.length}`, 20, 20);
});
```

### 事件系统

#### 说明

事件系统可以监听三类事件：

- 引擎事件：beforeUpdate、afterUpdate
- 碰撞事件：collisionStart、collisionActive、collisionEnd
- 物体事件：sleepStart、sleepEnd

#### Methods

#### Properties / Options

#### Events

#### 使用

```js
// 监听碰撞开始
Matter.Events.on(engine, "collisionStart", (event) => {
  const pairs = event.pairs;
  pairs.forEach((pair) => {
    console.log(`${pair.bodyA.id} 碰撞了 ${pair.bodyB.id}`);
  });
});

// 自定义事件触发
Matter.Events.trigger(engine, "custom-event", {
  timestamp: Date.now(),
});
```

#### 示例

```js
// 实现物体点击检测
Matter.Events.on(engine, "afterUpdate", () => {
  const bodies = Matter.Query.point(engine.world.bodies, {
    x: mouseX,
    y: mouseY,
  });
  if (bodies.length > 0) {
    highlightBody(bodies[0]);
  }
});

// 物体休眠唤醒通知
Matter.Events.on(engine, "sleepStart", (event) => {
  const body = event.source;
  body.render.fillStyle = "#999"; // 变灰色表示休眠
});
```

### 参考文献

[Matter.js 官方文档](https://brm.io/matter-js/docs/)

[Matter.js GitHub 仓库](https://github.com/liabru/matter-js)

---

上一篇：[MATTER笔记02：安装](/posts/post-016)

下一篇：[MATTER笔记04：物理实体](/posts/post-018)
