import type {Metadata} from "next";
import {inter} from "@/assets/font/fonts";
import {TITLE, DESCRIPTION} from '@/api/common'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
};

export default async function RootLayout({children,}: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="en">
    <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  )
}
