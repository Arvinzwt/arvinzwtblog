import Layout from "../components/Layout";
import dynamic from "next/dynamic";

const Clock = dynamic(() => import("../components/Clock"), { ssr: false });

export default function Home() {
  return (
    <Layout>
      <Clock />
    </Layout>
  );
}
