export function Input({ className, ...props }) {
  return (
    <input
      className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 
        font-serif
        ${className}`}
      {...props}
    />
  );
}
