import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
// import Script from "next/script";

import Link from "next/link";

export const siteTitle = "Handy Record";
const nvaList = [
  { name: "HOME", path: "/", code: "HOME" },
  { name: "POSTS", path: "/posts", code: "POSTS" },
  { name: "ABOUT", path: "/about", code: "ABOUT" },
];

const NavLink = ({ href, children }) => {
  const router = useRouter();

  // 判断当前路由是否激活
  const isActive =
    router.pathname === href || router.pathname.startsWith(`${href}/`);
  // 判断路由是否处于 pending 状态（例如，正在加载新页面）
  const isPending = router.asPath === href && !router.isReady;

  // 根据 isActive 和 isPending 动态生成 className
  const activeName = ({ isActive, isPending }) => {
    return isActive
      ? "text-yellow-600 font-semibold"
      : isPending
        ? "text-gray-300 font-semibold"
        : "font-semibold";
  };

  const className = activeName({ isActive, isPending });

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
};

export default function Layout({ children, home }) {
  return (
    <div className="wmm-container">
      <Head>
        <link rel="icon" type="image/svg+xml" href="/images/logo_black.svg" />
        <meta name="description" content="Jotting down occasional thoughts." />
        <meta
          property="og:image"
          content={`https://og-image.vercel.app/${encodeURI(
            siteTitle,
          )}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.zeit.co%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
        />
        <meta name="og:title" content={siteTitle} />
        <meta name="twitter:card" content="summary_large_image" />
        <title>{siteTitle}</title>
      </Head>
      <header className="wmm-header">
        <main className="wmm-wrap flex items-center justify-between">
          <div className="flex items-center">
            <Image
              priority
              src="/images/logo_white.svg"
              height={20}
              width={20}
              alt={siteTitle}
            />
            <Link href="/">
              <span className="font-semibold ml-2">{siteTitle}</span>
            </Link>
          </div>
          <div>
            {nvaList.map((navItem) => (
              <NavLink href={navItem.path} key={navItem.path}>
                <span className="ml-3">{navItem.name}</span>
              </NavLink>
            ))}
          </div>
        </main>
      </header>
      <main className="wmm-main">
        <div className="wmm-wrap">{children}</div>
      </main>
      <footer className="wmm-footer">
        <div className="wmm-wrap">
          Handy Record ©{new Date().getFullYear()} Created by Arvin
        </div>
      </footer>
    </div>
  );
}
