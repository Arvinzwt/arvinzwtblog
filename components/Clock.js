import { useEffect, useRef } from "react";
import Matter from "matter-js";

export default function Clock() {
  const canvasRef = useRef(null);
  const engineRef = useRef(null);
  const runnerRef = useRef(null);

  useEffect(() => {
    // 只在客户端执行
    if (typeof window === "undefined") return;

    // 解构 Matter 模块
    const { Engine, Render, World, Bodies, Runner, Mouse, MouseConstraint } =
      Matter;

    // 创建物理引擎
    const engine = Engine.create({
      gravity: { x: 0, y: 1 }, // 设置重力方向 (y轴向下)
    });
    engineRef.current = engine;

    // 创建运行器
    const runner = Runner.create();
    runnerRef.current = runner;

    // 创建渲染器
    const render = Render.create({
      canvas: canvasRef.current,
      engine: engine,
      options: {
        width: 800,
        height: 600,
        wireframes: false, // 非线框模式
        background: "#f0f0f0",
      },
    });

    // 创建边界墙
    const wallOptions = { isStatic: true, render: { fillStyle: "#333333" } };
    const ground = Bodies.rectangle(400, 610, 810, 60, wallOptions);
    const leftWall = Bodies.rectangle(-30, 300, 60, 600, wallOptions);
    const rightWall = Bodies.rectangle(830, 300, 60, 600, wallOptions);

    // 创建随机小球
    const balls = [];
    const colors = [
      "#FF5252",
      "#FF4081",
      "#E040FB",
      "#7C4DFF",
      "#536DFE",
      "#448AFF",
      "#40C4FF",
      "#18FFFF",
      "#64FFDA",
      "#69F0AE",
    ];

    for (let i = 0; i < 15; i++) {
      const radius = Math.random() * 20 + 10;
      balls.push(
        Bodies.circle(
          Math.random() * 700 + 50, // x位置 (避免靠近边缘)
          Math.random() * -200 - 50, // 从屏幕上方开始
          radius,
          {
            restitution: 0.8, // 弹性系数
            friction: 0.005,
            render: {
              fillStyle: colors[Math.floor(Math.random() * colors.length)],
            },
          },
        ),
      );
    }

    // 添加鼠标交互控制
    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: {
          visible: false,
        },
      },
    });

    // 将所有元素添加到世界
    World.add(engine.world, [
      ground,
      leftWall,
      rightWall,
      ...balls,
      mouseConstraint,
    ]);

    // 启动渲染和运行器
    Render.run(render);
    Runner.run(runner, engine);

    // 清理函数
    return () => {
      Render.stop(render);
      Runner.stop(runner);
      World.clear(engine.world, false);
      Engine.clear(engine);
      render.canvas.remove();
      render.textures = {};
    };
  }, []);

  return (
    <div className="p-5 bg-white">
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
        }}
      />
    </div>
  );
}
