import "@/components/globals.css";
import {monaco} from "@/components/font/fonts";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${monaco.className} antialiased`}>{children}</body>
    </html>
  );
}
