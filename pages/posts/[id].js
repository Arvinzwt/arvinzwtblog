import PostsLayout from "../../components/PostsLayout";
import { getAllPostIds, getPostData } from "../../lib/posts";
import Head from "next/head";
import { ArchiveTag } from "../../components/ArchiveTag";
import { Gitalk } from "../../components/Gitalk";
import clsx from "clsx";
import "highlight.js/styles/github.css";
import CopyButton from "../../components/CopyButton"; // 或者其他你喜欢的主题

export default function Post({ postData }) {
  return (
    <PostsLayout
      sidebarContent={
        <div
          className="markdown-body wmm-catalogue"
          dangerouslySetInnerHTML={{ __html: postData.tocHtml }}
        />
      }
    >
      <Head>
        <title>{postData.title}</title>
      </Head>
      <article className="bg-white px-6 pb-6 rounded-lg relative">
        <h1 className="font-bold py-5 text-2xl text-center">
          {postData.title}
        </h1>
        <ArchiveTag propClass="absolute top-[20px] right-[20px] rotate-10">
          {postData.tag}
        </ArchiveTag>
        <p
          className={clsx([
            "text-sm",
            "font-semibold",
            "bg-[#f7f8fb]",
            { "p-5 m-5": postData.description },
          ])}
        >
          {postData.description}
        </p>
        <div className="text-right mb-6">
          <span className="text-xs text-gray-400 text-nowrap">
            posted @{postData.date} by arvin
          </span>
        </div>
        <div
          className="markdown-body"
          dangerouslySetInnerHTML={{ __html: postData.contentHtml }}
        />
      </article>
      <Gitalk />
      <CopyButton />
    </PostsLayout>
  );
}

export async function getStaticPaths() {
  const paths = getAllPostIds();
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const postData = await getPostData(params.id);
  return {
    props: {
      postData,
    },
  };
}
