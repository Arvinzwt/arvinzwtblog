import Layout from "../components/Layout";
import { useEffect, useRef } from "react";

export default function Home() {
  const canvasRef = useRef(null);
  const cConfig = useRef({
    cw: 800,
    ch: 400,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let animationFrameId = requestAnimationFrame(render);
    let x = 0;

    function render() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "red";
      ctx.fillRect(x, 10, 50, 50);

      x++;

      animationFrameId = requestAnimationFrame(render);
    }

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <Layout>
      <canvas
        width={`${cConfig.cw}px`}
        height={`${cConfig.ch}px`}
        className="border border-solid border-red-500"
        ref={canvasRef}
      />
    </Layout>
  );
}
