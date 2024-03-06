import type {Metadata} from "next";
import "@/assets/css/globals.css";
import {inter} from "@/assets/font/fonts";
import {TITLE, DESCRIPTION} from '@/lib/data'
import {Header} from '@/components/Header'
import {Nav} from '@/components/Nav'
import {Footer} from '@/components/Footer'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
};

export default async function RootLayout({children,}: Readonly<{ children: React.ReactNode; }>) {
  return (
    <>
      <Header/>
      <Nav/>
      {children}
      <Footer/>
    </>
  );
}
