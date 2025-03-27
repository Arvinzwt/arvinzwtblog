import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "gitalk/dist/gitalk.css";

const GitalkComponent = dynamic(() => import("gitalk/dist/gitalk-component"), {
  ssr: false,
});

export function UserComment({ children, propClass = "" }) {
  const [id, setId] = useState("default-id"); // 设置默认值

  useEffect(() => {
    // useEffect只在客户端执行
    setId(window.location.href);
  }, []);

  return (
    <GitalkComponent
      options={{
        clientID: "c656259abe587f9b494f",
        clientSecret: "8d7017bad1009e4c80c6e1c696a3bdb2a7133ab7",
        repo: "Arvinzwt.github.io",
        owner: "Arvinzwt",
        admin: ["Arvinzwt"],
        id: id, // 直接使用id
        distractionFreeMode: false,
      }}
    />
  );
}
