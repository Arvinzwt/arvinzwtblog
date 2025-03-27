import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkToc from "remark-toc";
import remarkEmbedImages from "remark-embed-images";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import rehypeHighlight from "rehype-highlight"; // 新增代码高亮插件
import remarkCodeExtra from "remark-code-extra";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

// 定义文章目录路径
const postsDirectory = path.join(process.cwd(), "posts");

/**
 * 获取所有文章数据并按日期排序
 * @returns {Array} 排序后的文章数据数组，包含id和元数据
 */
export function getSortedPostsData() {
  // 读取posts目录下的所有文件名
  const fileNames = fs.readdirSync(postsDirectory);

  // 处理每个文件获取文章数据
  const allPostsData = fileNames.map((fileName) => {
    // 移除文件扩展名获取文章ID
    const id = fileName.replace(/\.md$/, "");

    // 读取Markdown文件内容
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");

    // 使用gray-matter解析文章元数据
    const matterResult = matter(fileContents);

    // 返回包含id和元数据的对象
    return {
      id,
      ...matterResult.data,
    };
  });

  // 按日期降序排序文章
  return allPostsData.sort(({ date: a }, { date: b }) => {
    return a < b ? 1 : -1;
  });
}

/**
 * 获取所有不重复的标签数据
 * @returns {Array} 去重后的标签数组
 */
export function getSortedTagData() {
  const allPostsData = getSortedPostsData();

  // 使用Set来去重标签
  const uniqueTags = new Set();

  allPostsData.forEach((post) => {
    if (post.tag) {
      // 如果tag是数组，则添加所有元素；否则直接添加
      Array.isArray(post.tag)
        ? post.tag.forEach((t) => uniqueTags.add(t))
        : uniqueTags.add(post.tag);
    }
  });

  return Array.from(uniqueTags);
}

/**
 * 获取所有文章的ID，用于静态生成路径
 * @returns {Array} 包含params对象的数组，每个params对象包含id属性
 */
export function getAllPostIds() {
  const fileNames = fs.readdirSync(postsDirectory);

  return fileNames.map((fileName) => ({
    params: {
      id: fileName.replace(/\.md$/, ""),
    },
  }));
}

/**
 * 异步函数，用于获取指定ID的文章数据，并将Markdown内容转换为HTML格式
 * @param {string} id - 文章的唯一标识符，通常对应文章文件名（不包含扩展名）
 * @returns {Object} - 返回一个包含文章ID、转换后的HTML内容以及文章元数据的对象
 */
export async function getPostData(id) {
  // 结合文章目录路径和文章ID，构建文章Markdown文件的完整路径
  const fullPath = path.join(postsDirectory, `${id}.md`);
  // 以UTF-8编码同步读取Markdown文件的内容
  const fileContents = fs.readFileSync(fullPath, "utf8");
  // 使用gray-matter库解析Markdown文件内容，分离出元数据和实际内容
  const matterResult = matter(fileContents);

  // 借助remark库处理Markdown内容，进行一系列转换操作
  const processedContent = await remark()
    // 启用GitHub Flavored Markdown（GFM）支持，让Markdown解析更符合GitHub风格
    .use(remarkGfm)
    // 生成文章目录，最大深度为6，目录标题为“目录”
    .use(remarkToc, { maxDepth: 6, heading: "目录" })
    // 自动嵌入Markdown中引用的图片
    .use(remarkEmbedImages)
    // 使用remark-code-extra插件对代码块进行额外处理
    .use(remarkCodeExtra, {
      // 对每个代码块节点进行转换操作
      transform: (node) => ({
        // 在代码块前插入一个包含语言信息和复制按钮的div元素
        before: [
          {
            type: "element",
            tagName: "div",
            properties: {
              // 应用Tailwind CSS类名来设置样式
              className: [
                "flex",
                "items-center",
                "justify-between",
                "px-3",
                "py-2",
                "bg-gray-200",
                "rounded-t-lg",
              ],
            },
            children: [
              {
                type: "element",
                tagName: "span",
                properties: {
                  // 应用Tailwind CSS类名来设置样式
                  className: ["font-semibold", "font-mono", "text-sm"],
                },
                // 显示代码块的语言类型
                children: [{ type: "text", value: node.lang || "" }],
              },
              {
                type: "element",
                tagName: "button",
                properties: {
                  // 存储代码块的原始内容，方便后续复制操作
                  "data-code": node.value,
                  // 应用Tailwind CSS类名来设置样式
                  className: [
                    "wmm-copy-btn",
                    "cursor-pointer",
                    "hover:text-blue-800",
                    "text-sm",
                    "font-mono",
                    "font-semibold",
                  ],
                },
                // 按钮文本显示为“Copy”
                children: [{ type: "text", value: "Copy" }],
              },
            ],
          },
        ],
      }),
    })
    // 将Markdown AST转换为HTML AST，允许使用危险的HTML标签
    .use(remarkRehype, { allowDangerousHtml: true })
    // 为HTML中的标题元素添加唯一的id属性，方便目录跳转
    .use(rehypeSlug)
    // 为标题元素添加自动链接，将标题内容包裹在链接中，并应用自定义类名
    .use(rehypeAutolinkHeadings, {
      behavior: 'wrap',
      properties: {
        className: 'heading-link'
      }
    })
    // 对代码块进行语法高亮处理，忽略不存在的语言高亮规则
    .use(rehypeHighlight, { ignoreMissing: true })
    // 将HTML AST序列化为字符串形式的HTML
    .use(rehypeStringify)
    // 处理Markdown内容
    .process(matterResult.content);

  // 将处理后的内容转换为字符串形式的HTML
  const contentHtml = processedContent.toString();

  // 返回包含文章ID、HTML内容和文章元数据的对象
  return {
    id,
    contentHtml,
    ...matterResult.data,
  };
}
