export function Dialog({ children, open }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      {children}
    </div>
  );
}

export function DialogContent({ children, className = "" }) {
  return (
    <div className={`bg-slate-900 p-6 rounded-xl w-full max-w-md ${className}`}>
      {children}
    </div>
  );
}

export function DialogHeader({ children }) {
  return <div className="mb-4">{children}</div>;
}

export function DialogTitle({ children }) {
  return <h2 className="text-xl font-bold text-white">{children}</h2>;
}

export function DialogDescription({ children }) {
  return <p className="text-slate-400 text-sm mt-2">{children}</p>;
}