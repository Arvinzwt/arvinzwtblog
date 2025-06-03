// import path from "path";

// 定义文章目录路径
// const postsDirectory = path.join(process.cwd(), "posts");

/**
 * 获取所有文章数据并按日期排序
 * @returns {Array} 排序后的文章数据数组，包含id和元数据
 */
export function getSortedToolsData() {
  return [
    // {
    //   id: "001",
    //   title: "AI工具",
    //   description: "让人工智能帮助你完成枯燥的工作",
    //   children: [
    //     {
    //       id: "001-001",
    //       icon: "deepSeek.svg",
    //       title: "DeepSeek",
    //       description: "探索未至之境",
    //       href: "https://chat.deepseek.com",
    //     },
    //     {
    //       id: "001-002",
    //       icon: "doubao.png",
    //       title: "豆包",
    //       description: "您的工作助手",
    //       href: "https://www.doubao.com/chat",
    //     },
    //     {
    //       id: "001-003",
    //       icon: "chatgpt.svg",
    //       title: "chatGPT",
    //       description: "AI文字的巅峰",
    //       href: "https://chat.openai.com/",
    //     },
    //     // {
    //     //   id: "001-003",
    //     //   icon: "midjourney.png",
    //     //   title: "midjourney",
    //     //   description: "AI绘画工具",
    //     //   href: "https://www.midjourney.com",
    //     // },
    //   ],
    // },
    {
      id: "002",
      title: "随手小工具",
      description: "本站小工具",
      children: [
        {
          id: "002-001",
          icon: "logo_black.svg",
          title: "常用开发指令",
          description: "程序员的备忘录",
          href: "/tools/tool-001",
        },
      ],
    },
  ];
}
