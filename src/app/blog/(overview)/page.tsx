// import CardWrapper from '@/app/components/dashboard/cards';
// import RevenueChart from '@/app/components/dashboard/revenue-chart';
// import LatestInvoices from '@/app/components/dashboard/latest-invoices';
// import { lusitana } from '@/app/components/fonts';
// import { Suspense } from 'react';
// import {
//   RevenueChartSkeleton,
//   LatestInvoicesSkeleton,
//   CardsSkeleton,
// } from '@/app/components/skeletons';
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
import {TagWrapper} from '@/components/tags'
import {fetchBlogListData} from '@/lib/data';
import {Pagination} from "@/components/Pagination";

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
      <Pagination/>
    </main>
  );
}
