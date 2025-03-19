export default function ArchiveInput({ placeholder, disabled }) {
  return (
    <input
      type="text"
      placeholder={placeholder}
      disabled={disabled}
      className={`
        w-full px-2 py-1
        border border-gray-300 rounded-md
        focus:outline-none focus:ring-0.5 focus:ring-blue-500 focus:border-blue-500
        placeholder-gray-400
        disabled:bg-gray-100 disabled:cursor-not-allowed
        transition duration-200 ease-in-out
      `}
    />
  );
}
