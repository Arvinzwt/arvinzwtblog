import Link from 'next/link';

export default async function Page() {
  return (
    <main>
      {/*<div>*/}
      {/*  标签*/}
      {/*</div>*/}
      {/*<Link href="/dashboard/23fczxcadf/edit">*/}
      {/*  列表页面*/}
      {/*  （点击进入详情）*/}
      {/*</Link>*/}
      {/*<div>*/}
      {/*  分页*/}
      {/*</div>*/}
      <ul>
        <li className="blog-item flex gap-4">
          <span>2024/01/26</span>
          <Link href="/dashboard/23fczxcadf/edit" className="title hover:text-blue-500 text-blue-700">aaa</Link>
        </li>
      </ul>
    </main>
  );
}
