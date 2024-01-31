import Link from 'next/link';

export default async function Page() {
  return (
    <main>
      <div>
        标签
      </div>
      <Link href="/dashboard/23fczxcadf/edit">
        列表页面
        （点击进入详情）
      </Link>
      <div>
        分页
      </div>
    </main>
  );
}
