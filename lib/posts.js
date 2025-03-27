import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkToc from "remark-toc";
import remarkEmbedImages from "remark-embed-images";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import rehypeSanitize from "rehype-sanitize";
import rehypeHighlight from "rehype-highlight"; // 新增代码高亮插件

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
 * 获取指定ID的文章数据，包括转换后的HTML内容
 * @param {string} id 文章ID
 * @returns {Object} 包含文章ID、HTML内容和元数据的对象
 */
export async function getPostData(id) {
  // 构建完整文件路径
  const fullPath = path.join(postsDirectory, `${id}.md`);

  // 读取文件内容
  const fileContents = fs.readFileSync(fullPath, "utf8");

  // 解析文章元数据和内容
  const matterResult = matter(fileContents);

  // 使用remark处理Markdown内容
  const processedContent = await remark()
    // 支持GitHub风格的Markdown
    .use(remarkGfm)
    // 添加目录，最多6级标题
    .use(remarkToc, { maxDepth: 6, heading: "目录" })
    // 嵌入图片
    .use(remarkEmbedImages)
    // 转换为rehype格式
    .use(remarkRehype, { allowDangerousHtml: true })
    // 安全
    .use(rehypeSanitize)
    // 添加代码高亮
    .use(rehypeHighlight, {
      // 这里可以添加highlight.js的配置选项
      // 例如指定语言别名或忽略未知语言
      ignoreMissing: true
    })
    // 序列化为HTML字符串
    .use(rehypeStringify)
    .process(matterResult.content);

  const contentHtml = processedContent.toString();

  // 返回组合后的数据
  return {
    id,
    contentHtml,
    ...matterResult.data,
  };
}
