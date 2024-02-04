import Link from "next/link";
import Image from 'next/image';

export default function Layout({children}: { children: React.ReactNode }) {
  return (
    // sticky top-0 z-40 w-full backdrop-blur flex-none transition-colors duration-500 lg:z-50 lg:border-b lg:border-slate-900/10 dark:border-slate-50/[0.06] bg-white supports-backdrop-blur:bg-white/95 dark:bg-slate-900/75
    <main className="mx-auto md:w-[720px] px-4 min-h-screen border border-solid border-current">
      <header className="sticky top-0 z-40 w-full">
        {/*<div className="">*/}
        {/*  <Image*/}
        {/*    src="/images/logo.svg"*/}
        {/*    width={50}*/}
        {/*    height={50}*/}
        {/*    className=""*/}
        {/*    alt="Screenshots of the dashboard project showing desktop version"*/}
        {/*  />*/}
        {/*</div>*/}
        {/*<div className="title md:my-4 font-bold text-2xl">*/}
        {/*  搜索，*/}
        {/*  <Link href="/">首页</Link>*/}
        {/*  <Link href="/dashboard/setting">关于</Link>*/}
        {/*</div>*/}
        <h1 className="title font-bold text-2xl">arvin's测试</h1>
        <p className="nav flex gap-2">
          <Link className="hover:text-blue-500 text-blue-700" href="/">首页</Link>
          <Link className="hover:text-blue-500 text-blue-700" href="/dashboard/setting">关于</Link>
        </p>
      </header>
      <div className="flex">
        <div className="">{children}</div>
      </div>
    </main>
  );
}
