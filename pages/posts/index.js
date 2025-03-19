import Head from "next/head";
import Layout, {siteTitle} from "../../components/layout";
import utilStyles from "../../styles/utils.module.css";
import {getSortedPostsData, getSortedRemarkData} from "../../lib/posts";
import Link from "next/link";
import Date from "../../components/date";
import {ArchiveRemark} from "../../components/archiveRemark";
import ArchiveInput from "../../components/archiveInput";

export default function Posts({allPostsData, allRemarkData}) {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <main className="flex mt-3">
        <section className="p-3 rounded-lg bg-white flex-1 shadow-sm mr-3">
          <ul>
            {allPostsData.map((aItem) => (
              <li className="px-3 py-2" key={aItem.id}>
                <Link href={`/posts/${aItem.id}`}>
                  <p className="text-base font-semibold">{aItem.title}</p>
                  <div className="flex items-center mt-2">
                    <span className="text-sm text-gray-500 text-nowrap mr-4">{aItem.date}</span>
                    <p className="flex items-center flex-wrap overflow-hidden">
                      {aItem.remark.map((rItem) => {
                        return <ArchiveRemark key={rItem}>{rItem}</ArchiveRemark>;
                      })}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
        <section className="p-3 rounded-lg bg-white shadow-sm w-80">
          <div className="mb-2">
            <ArchiveInput/>
          </div>
          <div className="mr-2 flex items-center flex-wrap">
            {allRemarkData.map((rItem) => {
              return (
                <span className="my-2" key={rItem}>
                <ArchiveRemark>{rItem}</ArchiveRemark>
              </span>
              );
            })}
          </div>
        </section>
      </main>
    </Layout>
  );
}

export async function getStaticProps() {
  const allPostsData = getSortedPostsData();
  const allRemarkData = getSortedRemarkData();
  return {
    props: {
      allPostsData,
      allRemarkData,
    },
  };
}
