export function ArchiveRemark({children, propClass = ''}) {
  return (
    <>
      {/*cursor-pointer hover:text-blue-500*/}
      <span className="text-sm text-gray-500 mx-2 text-nowrap flex items-center overflow-hidden">
        <span className={`${propClass}`}>#&nbsp;{children}</span>
      </span>
    </>
  );
}
