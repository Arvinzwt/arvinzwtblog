import Head from "next/head";
import Layout, { siteTitle } from "../../components/layout";
import utilStyles from "../../styles/utils.module.css";
import { getSortedPostsData } from "../../lib/posts";
import Link from "next/link";
import Date from "../../components/date";

export default function Posts({ allPostsData }) {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <main className="flex mt-3">
        <section className="p-3 rounded-lg bg-white flex-1 shadow-sm mr-3">
          <ul>
            {/*{archivesList.map((aItem) => (*/}
            {/*  <li className="px-3 py-2" key={aItem.path}>*/}
            {/*    <Link to={aItem.path}>*/}
            {/*      <p className="text-base font-semibold">{aItem.title}</p>*/}
            {/*      <span className="text-sm text-gray-500 mr-4">{aItem.date}</span>*/}
            {/*      {aItem.remark.map((rItem) => {*/}
            {/*        return <ArchiveRemark key={rItem}>{rItem}</ArchiveRemark>;*/}
            {/*      })}*/}
            {/*    </Link>*/}
            {/*  </li>*/}
            {/*))}*/}
          </ul>
        </section>
        <section className="p-3 rounded-lg bg-white shadow-sm w-80">
          {/*<Input type="text" className="mb-2" />*/}
          {/*<Space size={16} wrap>*/}
          {/*  <div className="mr-2">*/}
          {/*    <Text className="text-xs text-gray-500"># </Text>*/}
          {/*    <span className="text-xs text-gray-500 cursor-pointer hover:text-blue-500">标签1</span>*/}
          {/*  </div>*/}
          {/*</Space>*/}
        </section>
      </main>
      {/*<section className={utilStyles.headingMd}>*/}
      {/*  <p className="border border-solid border-red-500">[Your Self Introduction]</p>*/}
      {/*  <p>*/}
      {/*    (This is a sample website - you’ll be building a site like this in{" "}*/}
      {/*    <a href="https://nextjs.org/learn">our Next.js tutorial</a>.)*/}
      {/*  </p>*/}
      {/*</section>*/}
      {/*<section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>*/}
      {/*  <h2 className={utilStyles.headingLg}>Blog</h2>*/}
      {/*  <ul className={utilStyles.list}>*/}
      {/*    {allPostsData.map(({ id, date, title }) => (*/}
      {/*      <li className={utilStyles.listItem} key={id}>*/}
      {/*        <Link href={`/posts/${id}`}>{title}</Link>*/}
      {/*        <br />*/}
      {/*        <small className={utilStyles.lightText}>*/}
      {/*          <Date dateString={date} />*/}
      {/*        </small>*/}
      {/*      </li>*/}
      {/*    ))}*/}
      {/*  </ul>*/}
      {/*</section>*/}
    </Layout>
  );
}

export async function getStaticProps() {
  const allPostsData = getSortedPostsData();
  return {
    props: {
      allPostsData,
    },
  };
}
