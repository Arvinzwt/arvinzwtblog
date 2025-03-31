import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "gitalk/dist/gitalk.css";

const GitalkComponent = dynamic(() => import("gitalk/dist/gitalk-component"), {
  ssr: false,
});

export function Gitalk({ children, propClass = "" }) {
  const [id, setId] = useState("default-id"); // 设置默认值

  useEffect(() => {
    // useEffect只在客户端执行
    setId(window.location.href);
  }, []);

  return (
    <GitalkComponent
      options={{
        clientID: "Ov23liVpmCIjLpYWX0zP",
        clientSecret: "0eeaaab3d6a4bc82843c28b2e25e5167b7857626",
        repo: "arvinzwtblog",
        owner: "Arvinzwt",
        admin: ["Arvinzwt"],
        id: id, // 直接使用id
        distractionFreeMode: false,
      }}
    />
  );
}
