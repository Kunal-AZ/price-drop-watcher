export function Button({
  children,
  className = "",
  variant = "default",
  size = "default",
  ...props
}) {
  let styles = "px-6 py-3 rounded-lg font-medium transition";

  if (variant === "ghost") {
    styles += " bg-transparent";
  }

  if (size === "sm") {
    styles += " px-3 py-2 text-sm";
  }

  return (
    <button className={`${styles} ${className}`} {...props}>
      {children}
    </button>
  );
}