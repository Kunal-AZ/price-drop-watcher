export function Input({ className = "", ...props }) {
  return (
    <input
      className={`w-full px-4 py-3 rounded-md bg-white border border-yellow-300 text-black focus:outline-none focus:border-yellow-500 ${className}`}
      {...props}
    />
  );
}