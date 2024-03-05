import Link from "next/link";
import {TITLE, DESCRIPTION,fetchNavListData} from '@/lib/data'


export async function Header() {
  return (
    <header className="flex items-end	gap-3">
      <h3 className="leading-7">{TITLE}</h3>
      <span className="leading-7">{DESCRIPTION}</span>
    </header>
  )
}

export async function Nav() {
  const navList = await fetchNavListData()

  return (
    <nav className="mb-4">
      <ul className="flex py-3 gap-4 font-medium">
        {
          navList.map(item => (
            <li key={item.id}>
              <Link href={item.path}>{item.name}</Link>
            </li>
          ))
        }
      </ul>
    </nav>
  )
}

export async function Footer() {
  return (
    <footer className="p-7 flex font-semibold items-center justify-center gap-2">
      <span>Powered</span>
      <span>by</span>
      <span><Link href='/about'>Arvin</Link></span>
    </footer>
  )
}
