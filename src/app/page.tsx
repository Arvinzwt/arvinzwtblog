import Link from 'next/link';
import Clock from "@/components/home/clock";

export default function Home() {
  return (
    <main className="mx-auto md:w-[720px] p-4 min-h-screen border border-solid border-current">
      <div className="flex items-end justify-center md:h-40 mb-2">
        <Link className="" href="/dashboard"><Clock/></Link>
      </div>
    </main>
  );
}
