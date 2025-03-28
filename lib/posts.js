import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkEmbedImages from "remark-embed-images";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import rehypeHighlight from "rehype-highlight"; // 新增代码高亮插件
import remarkCodeExtra from "remark-code-extra";
import { toc } from "mdast-util-toc";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeRaw from "rehype-raw";
import _ from 'lodash'

// 定义文章目录路径
const postsDirectory = path.join(process.cwd(), "posts");

/**
 * 获取所有文章数据并按日期排序
 * @returns {Array} 排序后的文章数据数组，包含id和元数据
 */
export function getSortedPostsData(page = 1, pageSize = 10) {
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
  const sortedPosts = allPostsData.sort(({ date: a }, { date: b }) => {
    return a < b ? 1 : -1;
  });

  // 进行分页处理
  const paginatedPosts = _.chunk(sortedPosts, pageSize);
  return paginatedPosts[page - 1] || [];
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
 * 从Markdown内容中提取并处理目录(TOC)
 * @param {Object} matterResult - 包含frontmatter和内容的解析结果
 * @returns {Promise<string>} 生成的目录HTML字符串
 */
async function extractTocData(matterResult) {
  // 1. 将Markdown解析为MDAST(抽象语法树)
  const mdast = remark()
    .use(remarkGfm) // 添加GitHub风格Markdown支持
    .parse(matterResult.content); // 生成MDAST

  // 2. 从MDAST生成目录结构
  const tocResult = toc(mdast, {
    maxDepth: 3, // 目录最大深度
    heading: "", // 目录标题
    tight: true,
  });

  // 3. 构建完整的目录AST
  const tocAst = {
    type: "root",
    children: [
      {
        type: "heading",
        depth: 4,
        children: [{ type: "text", value: "目录" }],
      },
      tocResult.map, // 目录列表节点
    ],
  };

  // 4. 将目录AST转换为HTML
  const processor = remark()
    .use(remarkRehype, { allowDangerousHtml: true }) // MDAST转HAST
    // .use(rehypeRaw) // 处理原始HTML
    // .use(rehypeHighlight, {ignoreMissing: true}) // 代码高亮
    .use(rehypeStringify); // HAST转HTML

  const hast = await processor.run(tocAst); // 执行转换
  const processedContent = processor.stringify(hast); // 生成HTML字符串

  return processedContent.toString();
}

/**
 * 处理Markdown正文内容
 * @param {Object} matterResult - 包含frontmatter和内容的解析结果
 * @returns {Promise<string>} 处理后的HTML字符串
 */
async function extractContentData(matterResult) {
  // 使用remark管道处理Markdown内容
  const processedContent = await remark()
    // Markdown处理插件
    .use(remarkGfm) // GitHub风格Markdown
    .use(remarkEmbedImages) // 图片嵌入
    .use(remarkCodeExtra, {
      // 代码块增强
      transform: (node) => ({
        before: [
          {
            type: "element",
            tagName: "div",
            properties: {
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
                  className: ["font-semibold", "font-mono", "text-sm"],
                },
                children: [{ type: "text", value: node.lang || "" }],
              },
              {
                type: "element",
                tagName: "button",
                properties: {
                  "data-code": node.value,
                  className: [
                    "wmm-copy-btn",
                    "cursor-pointer",
                    "hover:text-blue-800",
                    "text-sm",
                    "font-mono",
                    "font-semibold",
                  ],
                },
                children: [{ type: "text", value: "Copy" }],
              },
            ],
          },
        ],
      }),
    })
    // 转换为HTML处理流程
    .use(remarkRehype, { allowDangerousHtml: true }) // 转HTML AST
    .use(rehypeRaw) // 处理原始HTML
    .use(rehypeHighlight, { ignoreMissing: true }) // 代码高亮
    .use(rehypeSlug) // 为标题添加ID
    .use(rehypeAutolinkHeadings, {
      behavior: "append",
      properties: {
        ariaHidden: true,
        tabIndex: -1,
        class: "wmm-anchor-link",
      },
    })
    .use(rehypeStringify) // 生成HTML字符串
    .process(matterResult.content); // 处理内容

  return processedContent.toString();
}

/**
 * 获取文章数据
 * @param {string} id - 文章ID(文件名)
 * @returns {Object} 包含文章数据、HTML内容和目录的对象
 */
export async function getPostData(id) {
  const fullPath = path.join(postsDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");

  // 解析Markdown文件和frontmatter
  const matterResult = matter(fileContents);

  // 并行处理目录和内容
  const [tocHtml, contentHtml] = await Promise.all([
    extractTocData(matterResult),
    extractContentData(matterResult),
  ]);

  return {
    id,
    contentHtml,
    tocHtml,
    ...matterResult.data,
  };
}
