import fs from "fs";
import path from "path";
import matter from "gray-matter";
import {remark} from "remark";
import remarkGfm from "remark-gfm";
import remarkEmbedImages from "remark-embed-images";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import rehypeHighlight from "rehype-highlight"; // 新增代码高亮插件
import remarkCodeExtra from "remark-code-extra";
import remarkToc from "remark-toc";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeRaw from "rehype-raw";
import {toc} from 'mdast-util-toc';

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
  return allPostsData.sort(({date: a}, {date: b}) => {
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

async function extractTocData(matterResult) {
  // 1. 第一步：Markdown → MDAST（使用 remark 解析）
  const mdast = remark()
    .use(remarkGfm)
    .use(remarkEmbedImages)
    .use(remarkCodeExtra, {
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
                children: [{type: "text", value: node.lang || ""}],
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
                children: [{type: "text", value: "Copy"}],
              },
            ],
          },
        ],
      }),
    })
    .parse(matterResult.content); // 使用 parse 获取 MDAST


  // 2. 第二步：MDAST → HAST → HTML（使用 unified 处理）
  const processor = remark()
    .use(remarkRehype, {allowDangerousHtml: true}) // MDAST → HAST
    .use(rehypeRaw) // 处理原始 HTML
    .use(rehypeHighlight, {ignoreMissing: true}) // 代码高亮
    .use(rehypeStringify); // HAST → HTML

  // 运行转换流程
  const hast = await processor.run(mdast); // 转换 AST
  const processedContent = processor.stringify(hast); // 生成最终 HTML

  return processedContent.toString()
}

/**
 * 异步函数，用于获取指定ID的文章数据，并将Markdown内容转换为HTML格式
 * @param {string} id - 文章的唯一标识符，通常对应文章文件名（不包含扩展名）
 * @returns {Object} - 返回一个包含文章ID、转换后的HTML内容、文章元数据和目录HTML的对象
 */
export async function getPostData(id) {
  const fullPath = path.join(postsDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const matterResult = matter(fileContents);

  const processedContent = await remark()
    // 1. 首先应用Markdown相关插件
    .use(remarkGfm) // GitHub Flavored Markdown支持
    // .use(remarkToc, { maxDepth: 6, heading: "目录" }) // 生成目录
    .use(remarkEmbedImages) // 嵌入图片
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
                children: [{type: "text", value: node.lang || ""}],
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
                children: [{type: "text", value: "Copy"}],
              },
            ],
          },
        ],
      }),
    })

    // 2. 将Markdown转换为HTML AST
    .use(remarkRehype, {allowDangerousHtml: true})

    // 3. 处理原始HTML（因为上面使用了allowDangerousHtml）
    .use(rehypeRaw)

    // 4. 现在可以应用HTML相关插件
    .use(rehypeHighlight, {ignoreMissing: true}) // 代码高亮
    // .use(rehypeSlug) // 为标题添加ID
    // .use(() => (tree) => {
    //   console.log(JSON.stringify(tree, null, 2)); // 打印AST结构
    //   return tree;
    // })
    // .use(rehypeAutolinkHeadings, {
    //   // 为标题添加链接
    //   behavior: "wrap",
    //   properties: {
    //     className: "heading-link",
    //   },
    // })

    // 5. 最后将AST转换为HTML字符串
    .use(rehypeStringify)
    .process(matterResult.content);

  const contentHtml = processedContent.toString();

  const tocHtml = await extractTocData(matterResult)

  console.log(tocHtml, 'tocHtml')

  return {
    id,
    contentHtml,
    tocHtml,
    ...matterResult.data,
  };
}
