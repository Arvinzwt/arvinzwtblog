import Link from 'next/link';
import Clock from "@/components/home/clock";

export default function Home() {
  return (
    <main className="border border-solid border-current	min-h-screen">
      {/*<Link*/}
      {/*  className="mb-2 flex h-20 items-end justify-start rounded-md bg-blue-600 p-4 md:h-40"*/}
      {/*  href="/dashboard"*/}
      {/*>*/}
      {/*  <div className="w-32 text-white md:w-40">*/}
      {/*    home*/}
      {/*    （点击进入dashboard）*/}
      {/*  </div>*/}
      {/*</Link>*/}
      <Clock/>
    </main>
  );
}
