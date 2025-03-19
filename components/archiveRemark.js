export function ArchiveRemark({children}) {
  return (
    <>
      <span className="text-xs text-gray-500 mx-2 cursor-pointer hover:text-blue-500 text-nowrap flex items-center overflow-hidden">
        #&nbsp;{children}
      </span>
    </>
  );
}
