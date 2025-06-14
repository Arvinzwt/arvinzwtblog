import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
// import Script from "next/script";

import Link from "next/link";
import clsx from "clsx";
import MobileMenu from "./MobileMenu";

export const siteTitle = "Handy Record";
const nvaList = [
  { name: "HOME", path: "/", code: "HOME" },
  { name: "POSTS", path: "/posts", code: "POSTS" },
  { name: "TOOLS", path: "/tools", code: "TOOLS" },
  { name: "GITHUB", path: "https://github.com/Arvinzwt", code: "GITHUB" },
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
      ? "font-semibold text-white bg-[#ffffff1f]"
      : isPending
        ? "text-gray-300 font-semibold"
        : "font-semibold";
  };

  const activeClassName = activeName({ isActive, isPending });

  return (
    <Link
      href={href}
      className={clsx([
        activeClassName,
        "px-2",
        "py-1.5",
        "mx-1",
        "rounded-sm",
        "hover:font-semibold",
        "hover:text-white",
        "hover:bg-[#ffffff1f]",
      ])}
    >
      {children}
    </Link>
  );
};

export default function Layout({ children }) {
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
      <header className="wmm-header hidden md:block">
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
              <span className="font-semibold text-white ml-2">{siteTitle}</span>
            </Link>
          </div>
          <div>
            {nvaList.map((navItem) => (
              <NavLink href={navItem.path} key={navItem.code}>
                <span>{navItem.name}</span>
              </NavLink>
            ))}
          </div>
        </main>
      </header>
      <header className="wmm-header block md:hidden">
        <main className="wmm-wrap flex items-center justify-between">
          <MobileMenu nvaList={nvaList} />
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
