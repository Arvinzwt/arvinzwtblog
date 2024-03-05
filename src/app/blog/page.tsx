import Link from "next/link";
// import {TAGS,BLOG} from '@/route/index'
import {TagWrapper} from '@/ui/tags'
import {fetchBlogListData} from '@/lib/data';

export default async function Blog() {
  const {blogList} = await fetchBlogListData()

  return (
    <main className="">
      <nav className="flex flex-wrap gap-3">
        <TagWrapper/>
      </nav>
      <ul className="py-2">{
        blogList.map((item) => (
          <li key={item.id} className="py-2 flex items-center gap-3 font-medium">
            <span className="text-sm">{item.date}</span>
            <Link href={item.path}>{item.title}</Link>
          </li>
        ))
      }
      </ul>
      <footer className="py-2">
        <ul className="flex text-xs items-center gap-3">
          <li className="">共 100 条</li>
          <li className="cursor-pointer w-5 h-5 border flex items-center justify-center"> &laquo; </li>
          <li className="cursor-pointer w-5 h-5 border flex items-center justify-center"> 1</li>
          <li className="cursor-pointer w-5 h-5 border flex items-center justify-center"> 2</li>
          <li className="cursor-pointer w-5 h-5 border flex items-center justify-center"> 3</li>
          <li className="cursor-pointer w-5 h-5 border flex items-center justify-center"> &raquo; </li>
        </ul>
      </footer>
    </main>
  );
}
