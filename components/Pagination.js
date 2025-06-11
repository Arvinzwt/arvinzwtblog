import Link from "next/link";
import clsx from "clsx";

export default function Pagination({ total, current, size, path }) {
  const totalPages = Math.ceil(total / size);

  // 生成页码按钮 (最多显示4个页码)
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 4; // 最多显示4个页码

    let start = Math.max(1, current - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);

    // 调整起始位置，确保显示maxVisible个页码
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  // 构建带查询参数的URL
  const buildUrl = (page) => {
    const queryParams = new URLSearchParams({
      page: page.toString(),
    }).toString();
    return `${path}?${queryParams}`;
  };

  return (
    <div className="flex items-center justify-center gap-2 my-8 flex-wrap text-sm">
      {/* 上一页按钮 - 改为左尖角 */}
      <Link
        href={buildUrl(current - 1)}
        className={clsx(
          "px-3 py-1 border border-gray-200 rounded hover:bg-gray-100 transition-colors flex items-center justify-center",
          current <= 1 && "opacity-50 cursor-not-allowed hover:bg-transparent",
        )}
        aria-disabled={current <= 1}
        tabIndex={current <= 1 ? -1 : 0}
      >
        &lt;
      </Link>

      {/* 第一页和省略号 */}
      {getPageNumbers()[0] > 1 && (
        <>
          <Link
            href={buildUrl(1)}
            className={clsx(
              "px-4 py-1 border border-gray-200 rounded hover:bg-gray-100 transition-colors",
              current === 1 && "bg-blue-500 text-white border-blue-500",
            )}
          >
            1
          </Link>
          {getPageNumbers()[0] > 2 && <span className="px-2">...</span>}
        </>
      )}

      {/* 页码按钮 */}
      {getPageNumbers().map((page) => (
        <Link
          key={page}
          href={buildUrl(page)}
          className={clsx(
            "px-4 py-1 border border-gray-200 rounded hover:bg-gray-100 transition-colors",
            current === page && "bg-blue-500 text-white border-blue-500",
          )}
        >
          {page}
        </Link>
      ))}

      {/* 最后一页和省略号 */}
      {getPageNumbers()[getPageNumbers().length - 1] < totalPages && (
        <>
          {getPageNumbers()[getPageNumbers().length - 1] < totalPages - 1 && (
            <span className="px-2">...</span>
          )}
          <Link
            href={buildUrl(totalPages)}
            className={clsx(
              "px-4 py-1 border border-gray-200 rounded hover:bg-gray-100 transition-colors",
              current === totalPages &&
                "bg-blue-500 text-white border-blue-500",
            )}
          >
            {totalPages}
          </Link>
        </>
      )}

      {/* 下一页按钮 - 改为右尖角 */}
      <Link
        href={buildUrl(current + 1)}
        className={clsx(
          "px-3 py-1 border border-gray-200 rounded hover:bg-gray-100 transition-colors flex items-center justify-center",
          current >= totalPages &&
            "opacity-50 cursor-not-allowed hover:bg-transparent",
        )}
        aria-disabled={current >= totalPages}
        tabIndex={current >= totalPages ? -1 : 0}
      >
        &gt;
      </Link>

      {/* 简单统计信息 */}
      <div className="ml-4 text-sm text-gray-600 whitespace-nowrap">
        显示 {(current - 1) * size + 1} - {Math.min(current * size, total)}{" "}
        条，共 {total} 条
      </div>
    </div>
  );
}
