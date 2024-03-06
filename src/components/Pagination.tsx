export async function Pagination() {
  return (
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
  )
}
