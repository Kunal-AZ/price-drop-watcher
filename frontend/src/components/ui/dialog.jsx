import { useEffect } from "react";

export function Dialog({ children, open, onOpenChange }) {
  useEffect(() => {
    if (!open) return undefined;

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onOpenChange?.(false);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [onOpenChange, open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 sm:p-6"
      onClick={() => onOpenChange?.(false)}
    >
      <div className="w-full" onClick={(event) => event.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

export function DialogContent({ children, className = "" }) {
  return (
    <div
      className={`mx-auto max-h-[calc(100vh-2rem)] w-full max-w-md overflow-y-auto rounded-xl bg-slate-900 p-4 sm:p-6 ${className}`}
    >
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
