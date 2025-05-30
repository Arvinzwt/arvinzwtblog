import clsx from "clsx";

export function ArchiveButton({ children, propClass = "", onClick }) {
  return (
    <>
      <button
        className={clsx([
          "text-sm",
          "leading-[1.57142857]",
          "h-8",
          "px-[15px]",
          "py-1",
          "rounded-[6px]",
          "shadow-[0_2px_0_rgba(0,0,0,0.02)]",
          "outline-none",
          "relative",
          "inline-flex",
          "gap-2",
          "items-center",
          "justify-center",
          "font-normal",
          "whitespace-nowrap",
          "text-center",
          "bg-transparent",
          "border",
          "border-[#d9d9d9]",
          "cursor-pointer",
          "transition-all",
          "duration-200",
          "ease-[cubic-bezier(0.645,0.045,0.355,1)]",
          "select-none",
          "touch-manipulation",
          "text-[rgba(0,0,0,0.88)]",

          "hover:text-[#4096ff]",
          "hover:border-[#4096ff]",
          "hover:bg-white",

          // Focus states
          "focus:text-[#4096ff]",
          "focus:border-[#4096ff]",
          "focus:bg-white",

          // Active states
          "active:text-[#0958d9]",
          "active:border-[#0958d9]",
          "active:bg-white",
          `${propClass}`,
        ])}
        onClick={onClick}
      >
        #&nbsp;{children}
      </button>
    </>
  );
}
