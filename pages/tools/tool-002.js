import React, { useEffect, useRef ,useState} from "react";
import PostsLayout from "../../components/PostsLayout";
import Head from "next/head";
import * as PIXI from "pixi.js";

export default function Tool002() {
  const canvasRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  const config = {
    width: 540,
    height: 640,
    gridSize: 10,
    snakeColor: 0x808080,
    foodColor: 0xff0000,
    initialSpeed: 150,
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkIfMobile = () => {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent,
      );
    };

    if (checkIfMobile()) {
      setIsMobile(true);
      return;
    }

    // 初始化 PixiJS
    const app = new PIXI.Application();

    // 异步初始化
    app
      .init({
        width: config.width,
        height: config.height,
        backgroundColor: "#ffffff",
        canvas: canvasRef.current,
      })
      .then(() => {
        let snake = [];
        let food = null;
        let direction = "right";
        let nextDirection = "right";
        let gameLoop = null;
        let score = 0;
        let scoreText = null;
        let gameOverText = null;
        let speed = config.initialSpeed;

        function initGame() {
          // 清理旧游戏状态
          if (gameLoop) {
            app.ticker.remove(gameLoop);
            gameLoop = null;
          }

          app.ticker.stop();
          app.ticker.maxFPS = 10; // 限制最大帧率
          app.ticker.start();

          // app.stage.removeChildren();
          // 保留gameOverText但隐藏它
          if (gameOverText) {
            gameOverText.visible = false;
          }

          // 移除其他所有子元素
          const childrenToRemove = app.stage.children.filter(
            (child) => child !== gameOverText,
          );
          childrenToRemove.forEach((child) => app.stage.removeChild(child));

          // 重置游戏状态
          snake = [];
          direction = "right";
          nextDirection = "right";
          score = 0;
          speed = config.initialSpeed;

          // 初始化蛇身（3节）
          for (let i = 0; i < 3; i++) {
            addSnakeSegment(
              5 * config.gridSize,
              5 * config.gridSize + i * config.gridSize,
            );
          }

          // 创建食物和分数显示
          createFood();
          initScoreText();

          // 初始化游戏循环
          gameLoop = (delta) => {
            gameUpdate(delta);
          };
          app.ticker.add(gameLoop);

          // 添加键盘控制
          initControls();
        }

        function initScoreText() {
          scoreText = new PIXI.Text(`分数: ${score}`, {
            fontFamily: "Arial",
            fontSize: 12,
            fill: 0x808080,
            align: "center",
          });
          scoreText.x = 10;
          scoreText.y = 10;
          app.stage.addChild(scoreText);
        }

        function initControls() {
          document.removeEventListener("keydown", handleKeyDown); // 先移除旧的
          document.addEventListener("keydown", handleKeyDown); // 再添加新的
        }

        function handleKeyDown(e) {
          switch (e.key) {
            case "ArrowUp":
              nextDirection = "up";
              break;
            case "ArrowDown":
              nextDirection = "down";
              break;
            case "ArrowLeft":
              nextDirection = "left";
              break;
            case "ArrowRight":
              nextDirection = "right";
              break;
            case " ":
              if (gameOverText?.visible) initGame();
              break;
          }
        }

        function addSnakeSegment(x, y) {
          const segment = new PIXI.Graphics();
          segment.lineStyle(1, 0x000000);
          segment.beginFill(config.snakeColor);
          segment.drawRect(0, 0, config.gridSize, config.gridSize);
          segment.endFill();
          segment.x = x;
          segment.y = y;

          // 新头部添加到数组开头和舞台
          snake.unshift(segment);
          app.stage.addChild(segment);
        }

        function createFood() {
          // 移除旧食物
          if (food) {
            app.stage.removeChild(food);
            food.destroy();
          }

          // 生成有效位置
          let foodX, foodY;
          do {
            foodX =
              Math.floor(Math.random() * (config.width / config.gridSize)) *
              config.gridSize;
            foodY =
              Math.floor(Math.random() * (config.height / config.gridSize)) *
              config.gridSize;
          } while (
            snake.some((segment) => segment.x === foodX && segment.y === foodY)
          );

          // 创建新食物
          food = new PIXI.Graphics();
          food.beginFill(config.foodColor);
          food.drawRect(0, 0, config.gridSize, config.gridSize);
          food.endFill();
          food.x = foodX;
          food.y = foodY;
          app.stage.addChild(food);
        }

        function gameUpdate() {
          // 更新方向（防止180度转弯）
          updateDirection();

          // 计算新头部位置
          const { newHeadX, newHeadY } = calculateNewHeadPosition();

          // 碰撞检测
          if (checkCollision(newHeadX, newHeadY)) {
            gameOver();
            return;
          }

          // 移动蛇
          moveSnake(newHeadX, newHeadY);
        }

        function updateDirection() {
          const oppositeDirections = {
            up: "down",
            down: "up",
            left: "right",
            right: "left",
          };

          if (nextDirection !== oppositeDirections[direction]) {
            direction = nextDirection;
          }
        }

        function calculateNewHeadPosition() {
          const head = snake[0];
          let newHeadX = head.x;
          let newHeadY = head.y;

          switch (direction) {
            case "up":
              newHeadY -= config.gridSize;
              break;
            case "down":
              newHeadY += config.gridSize;
              break;
            case "left":
              newHeadX -= config.gridSize;
              break;
            case "right":
              newHeadX += config.gridSize;
              break;
          }

          return { newHeadX, newHeadY };
        }

        function checkCollision(x, y) {
          return (
            x < 0 ||
            x >= config.width ||
            y < 0 ||
            y >= config.height ||
            snake.some((segment) => segment.x === x && segment.y === y)
          );
        }

        function moveSnake(newHeadX, newHeadY) {
          // 添加新头部
          addSnakeSegment(newHeadX, newHeadY);

          // 检查是否吃到食物
          if (newHeadX === food.x && newHeadY === food.y) {
            score += 10;
            scoreText.text = `分数: ${score}`;
            createFood();
          } else {
            // 移除尾部
            const tail = snake.pop();
            if (tail) {
              app.stage.removeChild(tail);
              tail.destroy();
            }
          }
        }

        function gameOver() {
          if (gameLoop) {
            app.ticker.remove(gameLoop);
            gameLoop = null;
          }

          if (!gameOverText) {
            gameOverText = new PIXI.Text("游戏结束 - 按空格键重新开始", {
              fontFamily: "Arial",
              fontSize: 16,
              fill: 0xff0000,
              align: "center",
            });
            gameOverText.x = config.width / 2 - gameOverText.width / 2;
            gameOverText.y = config.height / 2 - gameOverText.height / 2;
            app.stage.addChild(gameOverText);
          } else {
            gameOverText.visible = true;
          }
        }

        initGame();
      });

    // 组件卸载时清理
    return () => {
      app.destroy(true, true);
    };
  }, []);

  return (
    <PostsLayout propsClass="bg-white px-3">
      <Head>
        <title>snack</title>
      </Head>
      <div className="p-3 flex justify-center">
        {isMobile ? (
          <div className="text-center p-5 bg-gray-100 rounded-lg">
            <p className="text-red-500 font-bold">
              暂不支持移动端，请在电脑上访问
            </p>
            <p className="text-gray-600 mt-2">
              Not supported on mobile, please visit on desktop
            </p>
          </div>
        ) : (
          <canvas className="shadow-lg" ref={canvasRef} />
        )}
      </div>
    </PostsLayout>
  );
}
