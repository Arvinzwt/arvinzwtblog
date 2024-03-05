import {fetchBlogDetailData} from '@/lib/data';
import {Tag} from '@/components/Tags'

export default async function First() {
  const blog = await fetchBlogDetailData()
  return (
    <main className="">
      <header>
        <h2>{blog.title}</h2>
      </header>
      <nav className="py-2 flex items-center gap-3">
        <b className="text-sm">{blog.date}</b>
        <Tag tag={blog.tag}/>
      </nav>
      <section dangerouslySetInnerHTML={{__html: blog.content}}>
      </section>
    </main>
  );
}







// import Form from '@/app/components/invoices/edit-form';
// import Breadcrumbs from '@/app/components/invoices/breadcrumbs';
// import { fetchInvoiceById, fetchCustomers } from '@/app/lib/data';
// import { notFound } from 'next/navigation';
// import { Metadata } from 'next';
//
// export const metadata: Metadata = {
//   title: 'Edit Invoice',
// };
//
// export default async function Page({ params }: { params: { id: string } }) {
//   const id = params.id;
//   const [invoice, customers] = await Promise.all([
//     fetchInvoiceById(id),
//     fetchCustomers(),
//   ]);
//
//   if (!invoice) {
//     notFound();
//   }
//
//   return (
//     <main>
//       <Breadcrumbs
//         breadcrumbs={[
//           { label: 'Invoices', href: '/dashboard/invoices' },
//           {
//             label: 'Edit Invoice',
//             href: `/dashboard/invoices/${id}/edit`,
//             active: true,
//           },
//         ]}
//       />
//       <Form invoice={invoice} customers={customers} />
//     </main>
//   );
// }
// import {Metadata} from 'next';
//
// export const metadata: Metadata = {
//   title: 'Edit Blog',
// };
//
// export default async function Page() {
//   return (
//     <main>
//       Edit Blog
//     </main>
//   );
// }
