import Link from "next/link";

export default function Blog() {
  return (
    <main className="">
      <nav className="flex flex-wrap gap-3">
        <span
          className="cursor-pointer inline-flex items-center rounded-md font-semibold transition-colors border px-2.5 py-0.5 text-xs bg-slate-50">
          # tag
        </span>
        <span
          className="cursor-pointer inline-flex items-center rounded-md font-semibold transition-colors border px-2.5 py-0.5 text-xs bg-slate-50">
          # tag
        </span>
        <span
          className="cursor-pointer inline-flex items-center rounded-md font-semibold transition-colors border px-2.5 py-0.5 text-xs bg-slate-50">
          # tag
        </span>
        <span
          className="cursor-pointer inline-flex items-center rounded-md font-semibold transition-colors border px-2.5 py-0.5 text-xs bg-slate-50">
          # tag
        </span>
      </nav>
      <ul className="py-2">{
        new Array(10).fill(null).map((item, index) => (
          <li key={index} className="py-2 flex items-center gap-3 font-medium">
            <span className="text-sm">2024/03/01</span>
            <Link href="/blog/first">yhi is test page</Link>
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

          {/*<a href="#"*/}
          {/*   className="block bg-gray-200 hover:bg-gray-300 py-2 px-4 border-r border-gray-300 first:rounded-l-lg">1</a>*/}
          {/*<a href="#" className="block bg-gray-200 hover:bg-gray-300 py-2 px-4 border-r border-gray-300">2</a>*/}
          {/*<a href="#" className="block bg-gray-200 hover:bg-gray-300 py-2 px-4 border-r border-gray-300">3</a>*/}
          {/*<a href="#"*/}
          {/*   className="block bg-gray-200 hover:bg-gray-300 py-2 px-4 border-gray-300 last:rounded-r-lg">4</a>*/}
        </ul>
      </footer>
    </main>
  );
}
