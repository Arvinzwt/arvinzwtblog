import Layout from "../../components/layout";
import { getAllPostIds, getPostData } from "../../lib/posts";
import Head from "next/head";
import {ArchiveTag} from "../../components/archiveTag";

export default function Post({ postData }) {
  return (
    <Layout>
      <Head>
        <title>{postData.title}</title>
      </Head>
      <article className='bg-white p-5 relative'>
        <h1 className="font-bold text-2xl text-center">
          {postData.title}
          {/*<span className="text-xs text-gray-400 text-nowrap">{postData.remark}</span>*/}
        </h1>
        <ArchiveTag propClass="absolute top-[20px] right-[20px] rotate-10">
          {postData.tag}
        </ArchiveTag>
        <p className="text-sm font-semibold p-5 m-5 bg-[#f7f8fb]">{postData.description}</p>
        <div className="text-right mb-6">
          <span className="text-xs text-gray-400 text-nowrap">
            posted @{postData.date} by arvin
          </span>
        </div>
        <div className="wmm-posts" dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
      </article>
    </Layout>
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
