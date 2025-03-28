import Layout from "./Layout";

export default function Layout2({ children, sidebarContent }) {
  return (
    <Layout home>
      <main className="flex py-3">
        <section className="px-3 bg-white mr-3 rounded-lg flex-1">
          {children}
        </section>
        <section className="w-60">
          <div className="sticky p-3 bg-white rounded-lg shadow-sm top-[62px]">
            {sidebarContent}
          </div>
        </section>
      </main>
    </Layout>
  );
}
