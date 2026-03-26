export function Label({ children, className = "", ...props }) {
  return (
    <label className={`text-sm text-slate-300 ${className}`} {...props}>
      {children}
    </label>
  );
}