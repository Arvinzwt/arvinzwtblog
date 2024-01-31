import Link from "next/link";
export default function Layout({children}: { children: React.ReactNode }) {
  return (
    <main className="container">
      <div className="flex">
        <div>logo</div>
        <div>
          搜索，
          <Link href="/">首页</Link>
          <Link href="/dashboard/setting">关于</Link>
        </div>
      </div>
      <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
        <div className="grow p-6 md:overflow-y-auto md:p-12">{children}</div>
      </div>
    </main>
  );
}
