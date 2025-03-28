import Layout from "./Layout";
import clsx from "clsx";

export default function PostsLayout({ children, sidebarContent, propsClass }) {
  return (
    <Layout>
      <main className="flex py-3">
        <section
          className={clsx([
            "mr-3 rounded-lg flex-1 overflow-hidden",
            propsClass,
          ])}
        >
          {children}
        </section>
        {sidebarContent ? (
          <section className="w-60">
            <div className="sticky p-3 bg-white rounded-lg shadow-sm top-[62px]">
              {sidebarContent}
            </div>
          </section>
        ) : (
          ""
        )}
      </main>
    </Layout>
  );
}
