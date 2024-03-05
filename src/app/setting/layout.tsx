import type {Metadata} from "next";
import {Header, Footer, Nav} from '@/ui/layoutTemplate'

export const metadata: Metadata = {
  title: "Setting",
  description: "setting",
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
