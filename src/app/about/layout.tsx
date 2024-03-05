import type {Metadata} from "next";
import {Header, Footer, Nav} from '@/ui/layoutTemplate'

export const metadata: Metadata = {
  title: "About",
  description: "about",
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
