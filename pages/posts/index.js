import Head from "next/head";
import { siteTitle } from "../../components/Layout";
import PostsLayout from "../../components/PostsLayout";
import { getSortedPostsData, getSortedTagData } from "../../lib/posts";
import Link from "next/link";
import { ArchiveTag } from "../../components/ArchiveTag";
import { useState } from "react";
import clsx from "clsx";
import Pagination from "../../components/Pagination";

function HighlightText({ text, filterText }) {
  if (!filterText) return text; // 如果没有筛选条件，返回原文本

  // 找到匹配的部分
  const regex = new RegExp(`(${filterText})`, "gi");
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, index) =>
        part.toLowerCase() === filterText.toLowerCase() ? (
          <span key={index} className="text-blue-500">
            {part}
          </span>
        ) : (
          part
        ),
      )}
    </>
  );
}

export default function Posts({ allPostsData, allTagData, pagination }) {
  const [tag, setTag] = useState("");
  const [filterText, setFilterText] = useState("");

  const postsData = allPostsData
    .filter((aItem) => {
      return aItem.title.toLowerCase().includes(filterText.toLowerCase());
    })
    .filter((aItem) => {
      return aItem.tag.includes(tag);
    });

  function handleTagTap(rTag) {
    if (tag === rTag) {
      setTag("");
    } else {
      setTag(rTag);
    }
  }

  return (
    <PostsLayout
      propsClass="bg-white px-3"
      sidebarContent={
        <div>
          <div className="mb-2">
            <input
              type="text"
              onChange={(e) => setFilterText(e.target.value)}
              className={`
                w-full px-2 py-1
                border border-gray-300 rounded-md
                focus:outline-none focus:ring-0.5 focus:ring-blue-500 focus:border-blue-500
                placeholder-gray-400
                disabled:bg-gray-100 disabled:cursor-not-allowed
                transition duration-200 ease-in-out
              `}
            />
          </div>
          <div className="mr-2 flex items-center flex-wrap">
            {allTagData.map((rItem) => {
              return (
                <span
                  className="my-2"
                  key={rItem}
                  onClick={() => handleTagTap(rItem)}
                >
                  <ArchiveTag
                    propClass={clsx([
                      `cursor-pointer`,
                      "mx-3",
                      {
                        "text-white bg-blue-500": rItem === tag,
                      },
                    ])}
                  >
                    {rItem}
                  </ArchiveTag>
                </span>
              );
            })}
          </div>
        </div>
      }
    >
      <Head>
        <title>POSTS</title>
      </Head>
      <ul className="">
        {postsData.length > 0 ? (
          postsData.map((aItem) => (
            <li
              className="border border-solid border-gray-200 rounded-lg hover:shadow-sm my-3 transition-all duration-300 p-6 bg-white relative cursor-pointer"
              key={aItem.id}
            >
              <Link href={`/posts/${aItem.id}`}>
                <div className="text-base font-semibold flex items-center justify-between">
                  <p>
                    <HighlightText text={aItem.title} filterText={filterText} />
                  </p>
                  <ArchiveTag>{aItem.tag}</ArchiveTag>
                </div>
                <div className="leading-normal text-sm mb-5">
                  {aItem.description}
                </div>
                <div className="mt-1 text-right">
                  <span className="text-xs text-gray-400 text-nowrap">
                    posted @{aItem.date}
                  </span>
                </div>
              </Link>
            </li>
          ))
        ) : (
          <li className="text-center text-gray-500 py-4">没有找到相关数据</li>
        )}
      </ul>

      <Pagination
        total={pagination.total}
        current={pagination.current}
        size={pagination.size}
        path="/posts"
      />
    </PostsLayout>
  );
}

export async function getServerSideProps({ query = {} }) {
  const currentPage = Number(query.page) || 1; // 默认第一页
  const pageSize = 15; // 每页文章数量

  const postsData = getSortedPostsData(currentPage, pageSize);
  const allTagData = getSortedTagData();

  return {
    props: {
      allPostsData: postsData.records,
      allTagData,
      pagination: {
        total: postsData.total,
        current: postsData.current,
        size: postsData.size,
      },
    },
  };
}
