import Link from "next/link";

export default function First() {
  return (
    <main className="">
      <header>
        <h2>title</h2>
      </header>
      <nav className="py-2 flex items-center gap-3">
        <b className="text-sm">2024/03/01</b>
        <span className="cursor-pointer inline-flex items-center rounded-md font-semibold transition-colors border px-2.5 py-0.5 text-xs bg-slate-50">
          # tag
        </span>
      </nav>
      <section>
        <p>I’ve been part of the internet startup scene for a while. There are so many different camps: the
          bootstrappers, the VC-backed tech-bros, the crypto “investors”, the people marketing their courses on
          marketing courses, the newsletter gurus, the micro-saas homeboys. The list goes on.</p>
        <p>I’ve been part of the internet startup scene for a while. There are so many different camps: the
          bootstrappers, the VC-backed tech-bros, the crypto “investors”, the people marketing their courses on
          marketing courses, the newsletter gurus, the micro-saas homeboys. The list goes on.</p>
        <p>I’ve been part of the internet startup scene for a while. There are so many different camps: the
          bootstrappers, the VC-backed tech-bros, the crypto “investors”, the people marketing their courses on
          marketing courses, the newsletter gurus, the micro-saas homeboys. The list goes on.</p>
      </section>
    </main>
  );
}
