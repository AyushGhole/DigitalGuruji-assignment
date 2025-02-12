export function Textarea({ className, ...props }) {
  return (
    <textarea
      className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 ${className}
      font-sans
      `}
      {...props}
    />
  );
}
