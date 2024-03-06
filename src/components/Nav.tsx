import {fetchNavListData} from '../api/nav'
import Link from "next/link";

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
