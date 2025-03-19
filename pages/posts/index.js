import Head from "next/head";
import Layout, {siteTitle} from "../../components/layout";
import {getSortedPostsData, getSortedRemarkData} from "../../lib/posts";
import Link from "next/link";
import {ArchiveRemark} from "../../components/archiveRemark";
import {useState} from "react";
import clsx from "clsx";

function HighlightText({text, filterText}) {
  if (!filterText) return text; // 如果没有筛选条件，返回原文本

  // 找到匹配的部分
  const regex = new RegExp(`(${filterText})`, 'gi');
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
        )
      )}
    </>
  );
}

export default function Posts({allPostsData, allRemarkData}) {
  const [remark, setRemark] = useState('');
  const [filterText, setFilterText] = useState('');

  const postsData = allPostsData.filter(aItem => {
    return (aItem.title.toLowerCase().includes(filterText.toLowerCase()))
  }).filter(aItem => {
    return aItem.remark.some((rItem) =>
      rItem.toLowerCase().includes(remark)
    )
  })

  function handleRemarkTap(rRemark) {
    if (remark === rRemark) {
      setRemark('')
    } else {
      setRemark(rRemark)
    }
  }

  function lineHeightTxt(txt = '') {
    const regex = new RegExp(filterText, 'gi')
    return txt.replace(regex, (match) => `<span style="color: #1dcbcb;">${match}</span>`)
  }

  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <main className="flex mt-3">
        <section className="p-3 rounded-lg bg-white flex-1 shadow-sm mr-3">
          <ul>
            {postsData.length > 0 ?
              postsData.map((aItem) => (
                <li className="px-3 py-2" key={aItem.id}>
                  <Link href={`/posts/${aItem.id}`}>
                    <p className="text-base font-semibold">
                      <HighlightText text={aItem.title} filterText={filterText}/>
                    </p>
                  </Link>
                  <div className="flex items-center mt-2">
                    <span className="text-sm text-gray-500 text-nowrap mr-4">{aItem.date}</span>
                    <p className="flex items-center flex-wrap overflow-hidden">
                      {aItem.remark.map((rItem) => {
                        return <ArchiveRemark key={rItem}>{rItem}</ArchiveRemark>;
                      })}
                    </p>
                  </div>
                </li>
              )) :
              <li className="text-center text-gray-500 py-4">
                没有找到相关数据
              </li>
            }
          </ul>
        </section>
        <section className="p-3 rounded-lg bg-white shadow-sm w-80">
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
            {allRemarkData.map((rItem) => {
              return (
                <span className="my-2" key={rItem} onClick={() => handleRemarkTap(rItem)}>
                <ArchiveRemark propClass={clsx([
                  `cursor-pointer`,
                  {
                    'text-blue-500': rItem === remark
                  }
                ])}>{rItem}</ArchiveRemark>
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
