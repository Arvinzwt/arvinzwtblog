import Link from "next/link";

export async function Footer() {
  return (
    <footer className="p-7 flex font-semibold items-center justify-center gap-2">
      <span>Powered</span>
      <span>by</span>
      <span><Link href='/about'>Arvin</Link></span>
    </footer>
  )
}
