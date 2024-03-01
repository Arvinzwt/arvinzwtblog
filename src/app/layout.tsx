import type {Metadata} from "next";
import "@/assets/css/globals.css";
import {inter} from "@/assets/font/fonts";
import Link from 'next/link'
import {title, nav} from '@/route/index'

export const metadata: Metadata = {
  title: "arvin's blog",
  description: "Just to record life",
};

export default function RootLayout({children,}: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="en">
    <body className={inter.className}>
    <header className="flex items-end	gap-3">
      <h3 className="leading-7">{title}</h3>
      <span className="leading-7">Just to record life</span>
    </header>
    <nav className="mb-4">
      <ul className="flex py-3 gap-4 font-medium">
        {
          nav.map(item => (
            <li key={item.id}>
              <Link href={item.path}>{item.name}</Link>
            </li>
          ))
        }
      </ul>
    </nav>
    {children}
    <footer className="p-7 flex font-semibold items-center justify-center gap-1">
      <span>Powered</span>
      <span>by</span>
      <span><Link href='/about'>arvin</Link></span>
    </footer>
    </body>
    </html>
  );
}
