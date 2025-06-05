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
    const {
      Engine,
      Render,
      World,
      Body,
      Bodies,
      Runner,
      Mouse,
      MouseConstraint,
      Composites,
      Composite,
      Constraint,
    } = Matter;

    // const newtonsCradle = function (xx, yy, number, size, length) {
    //   const newtonsCradle = Composite.create({ label: "Newtons Cradle" });
    //
    //   for (var i = 0; i < number; i++) {
    //     let separation = 1.9;
    //     let circle = Bodies.circle(
    //       xx + i * (size * separation),
    //       yy + length,
    //       size,
    //       {
    //         inertia: Infinity,
    //         restitution: 1,
    //         friction: 0,
    //         frictionAir: 0,
    //         slop: size * 0.02,
    //         render: {
    //           fillStyle: "transparent",
    //           strokeStyle: "#000",
    //           lineWidth: 1,
    //         },
    //       },
    //     );
    //
    //     let constraint = Constraint.create({
    //       pointA: { x: xx + i * (size * separation), y: yy },
    //       bodyB: circle,
    //       render: {
    //         type: "line",
    //         strokeStyle: "#000000", // 黑色线条
    //         lineWidth: 1,
    //       },
    //     });
    //
    //     Composite.addBody(newtonsCradle, circle);
    //     Composite.addConstraint(newtonsCradle, constraint);
    //   }
    //
    //   return newtonsCradle;
    // };
    //
    // // 创建物理引擎
    // const engine = Engine.create({
    //   gravity: { x: 0, y: 1 }, // 设置重力方向 (y轴向下)
    // });
    const engine = Engine.create();
    const world = engine.world;

    // engineRef.current = engine;

    // 创建运行器
    const runner = Runner.create();
    // runnerRef.current = runner;

    // 创建渲染器
    const render = Render.create({
      canvas: canvasRef.current,
      engine: engine,
      options: {
        width: 800,
        height: 600,
        showAngleIndicator: true,
        // showVelocity: true,
        // wireframes: false, // 非线框模式
        // background: "transparent",
      },
    });

    // 启动渲染和运行器
    Render.run(render);
    Runner.run(runner, engine);

    const rows = 10;
    const yy = 600 - 25 - 40 * rows;

    const stack = Composites.stack(400, yy, 5, rows, 0, 0, function (x, y) {
      return Bodies.rectangle(x, y, 40, 40);
    });

    Composite.add(world, [
      stack,
      // walls
      Bodies.rectangle(400, 0, 800, 50, { isStatic: true }),
      Bodies.rectangle(400, 600, 800, 50, { isStatic: true }),
      Bodies.rectangle(800, 300, 50, 600, { isStatic: true }),
      Bodies.rectangle(0, 300, 50, 600, { isStatic: true }),
    ]);

    const ball = Bodies.circle(100, 400, 50, {
      density: 0.04,
      frictionAir: 0.005,
    });

    Composite.add(world, ball);
    Composite.add(
      world,
      Constraint.create({
        pointA: { x: 300, y: 100 },
        bodyB: ball,
      }),
    );

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

    Composite.add(world, mouseConstraint);

    render.mouse = mouse;

    Render.lookAt(render, {
      min: { x: 0, y: 0 },
      max: { x: 800, y: 600 },
    });

    // const cradle = newtonsCradle(280, 100, 5, 30, 200);
    // Composite.add(world, cradle);
    // Body.translate(cradle.bodies[0], { x: -180, y: -100 });
    //
    // const mouse = Mouse.create(render.canvas);
    // const mouseConstraint = MouseConstraint.create(engine, {
    //   mouse: mouse,
    //   constraint: {
    //     stiffness: 0.2,
    //     render: {
    //       visible: false,
    //     },
    //   },
    // });
    //
    // Composite.add(world, mouseConstraint);
    //
    // render.mouse = mouse;
    //
    // Render.lookAt(render, {
    //   min: { x: 0, y: 50 },
    //   max: { x: 800, y: 600 },
    // });

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
    <div className="py-3">
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
