
import {fetchBlogDetailData} from '@/lib/data';
import {Tag} from '@/ui/tags'

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
      <section dangerouslySetInnerHTML={{ __html: blog.content }}>
      </section>
    </main>
  );
}
