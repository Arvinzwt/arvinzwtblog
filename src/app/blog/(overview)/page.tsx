// import CardWrapper from '@/app/ui/dashboard/cards';
// import RevenueChart from '@/app/ui/dashboard/revenue-chart';
// import LatestInvoices from '@/app/ui/dashboard/latest-invoices';
// import { lusitana } from '@/app/ui/fonts';
// import { Suspense } from 'react';
// import {
//   RevenueChartSkeleton,
//   LatestInvoicesSkeleton,
//   CardsSkeleton,
// } from '@/app/ui/skeletons';
//
// export default async function Page() {
//   return (
//     <main>
//       <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
//         Dashboard
//       </h1>
//       <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
//         <Suspense fallback={<CardsSkeleton />}>
//           <CardWrapper />
//         </Suspense>
//       </div>
//       <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
//         <Suspense fallback={<RevenueChartSkeleton />}>
//           <RevenueChart />
//         </Suspense>
//         <Suspense fallback={<LatestInvoicesSkeleton />}>
//           <LatestInvoices />
//         </Suspense>
//       </div>
//     </main>
//   );
// }
import Link from "next/link";
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
