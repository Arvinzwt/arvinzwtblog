import Head from "next/head";
import PostsLayout from "../../components/PostsLayout";
import Link from "next/link";
import { getSortedPostsData } from "../../lib/tools";
import Image from "next/image";
import clsx from "clsx";

export default function Tool({ allPostsData }) {
  return (
    <PostsLayout propsClass="bg-white px-3">
      <Head>
        <title>TOOLS</title>
      </Head>
      <div>
        {allPostsData.length > 0 ? (
          allPostsData.map((aItem) => (
            <div key={aItem.id}>
              <h4 className="pt-5 px-4 font-semibold text-lg">{aItem.title}</h4>
              <p className="leading-normal text-sm ml-4">{aItem.description}</p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4">
                {aItem.children.length > 0 ? (
                  aItem.children.map((cItem) => (
                    <li
                      className={clsx([
                        "border",
                        "border-solid",
                        "border-gray-200",
                        "rounded-lg",
                        "hover:shadow-sm",
                        "my-3",
                        "transition-all",
                        "duration-300",
                        "p-4",
                        "bg-white",
                        "relative",
                        "cursor-pointer",
                        "flex",
                        "items-center",
                      ])}
                      key={cItem.id}
                    >
                      <Image
                        priority
                        src={`/images/${cItem.icon}`}
                        height={50}
                        width={50}
                        alt={cItem.title}
                        className="mr-4 rounded-full border-1 border-gray-100"
                      />
                      <Link href={cItem.href ? cItem.href : ``}>
                        <div className="text-base font-semibold">
                          {cItem.title}
                        </div>
                        <div className="leading-normal text-sm mt-1">
                          {cItem.description}
                        </div>
                      </Link>
                    </li>
                  ))
                ) : (
                  <li className="text-center text-gray-500 py-4">
                    没有找到相关数据
                  </li>
                )}
              </ul>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 py-4">没有找到相关数据</div>
        )}
      </div>
    </PostsLayout>
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
