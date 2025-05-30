import Layout from "./Layout";
import clsx from "clsx";

export default function PostsLayout({ children, sidebarContent, propsClass }) {
  return (
    <Layout>
      <main className="flex py-3">
        <section
          className={clsx([
            "w-full rounded-lg flex-1 overflow-hidden",
            propsClass,
          ])}
        >
          {children}
        </section>
        {sidebarContent ? (
          <section className="hidden md:block md:w-60 ml-3">
            <div className="sticky p-5 bg-white rounded-lg shadow-sm top-[62px]">
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
