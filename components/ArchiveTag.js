import clsx from "clsx";

export function ArchiveTag({ children, propClass = "" }) {
  return (
    <>
      {/*text-sm text-gray-500 mx-2 text-nowrap flex items-center overflow-hidden*/}
      {/*cursor-pointer hover:text-blue-500*/}
      <span
        className={clsx([
          "text-xs",
          "text-nowrap",
          "text-blue-400",
          "border",
          "border-blue-300",
          "border-solid",
          "px-1.25",
          "py-0.25",
          "rounded-sm",
          "flex",
          "items-center",
          `${propClass}`,
        ])}
      >
        #&nbsp;{children}
      </span>
    </>
  );
}
