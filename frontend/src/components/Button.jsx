export function Button({ children, className, ...props }) {
  return (
    <button
      className={`bg-blue-500 transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 mb-3  px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 ${className}
       font-mono 
      `}
      {...props}>
      {children}
    </button>
  );
}
