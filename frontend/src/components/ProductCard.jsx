import React, { useState } from "react";
import {
  Trash2,
  Pencil,
  IndianRupee,
  Bell,
  ExternalLink,
  ArrowDown,
} from "lucide-react";
import { productService } from "../services/productService";
import { toast } from "sonner";

const formatPrice = (price) => new Intl.NumberFormat("en-IN").format(price);

const ProductCard = ({ product, onDelete, onUpdate }) => {
  const [deleting, setDeleting] = useState(false);

  const isAlert = product.current_price <= product.target_price;
  const sourceLabel = product.product_url?.includes("flipkart")
    ? "Flipkart"
    : product.product_url?.includes("amazon")
      ? "Amazon"
      : "Store";
  const gap = Math.max(
    Number(product.current_price || 0) - Number(product.target_price || 0),
    0
  );
  const progress =
    product.target_price > 0 && product.current_price > 0
      ? Math.min((product.target_price / product.current_price) * 100, 100)
      : 0;

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (!confirmDelete) return;

    setDeleting(true);

    try {
      await productService.delete(product.product_id);
      onDelete(product.product_id);
      toast.success("Product deleted");
    } catch {
      toast.error("Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="group relative overflow-hidden rounded-[1.75rem] border border-yellow-200 bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(255,249,235,0.95))] p-5 shadow-[0_24px_70px_-40px_rgba(180,120,0,0.28)] transition-all duration-300 hover:-translate-y-1 hover:border-yellow-300">
      <div className="absolute inset-x-0 top-0 h-24 bg-[radial-gradient(circle_at_top_left,rgba(250,204,21,0.18),transparent_42%)]" />

      <div className="relative">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="inline-flex items-center rounded-full border border-yellow-200 bg-yellow-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-600">
              {sourceLabel}
            </div>
            <h3 className="mt-3 line-clamp-2 text-xl font-bold text-slate-950">
              {product.product_name}
            </h3>
          </div>

          <div className="flex gap-2 opacity-80 transition group-hover:opacity-100">
            <button
              onClick={() => onUpdate(product)}
              className="rounded-xl border border-yellow-200 bg-white p-2.5 text-slate-600 hover:bg-yellow-50"
            >
              <Pencil className="h-4 w-4" />
            </button>

            <button
              onClick={handleDelete}
              disabled={deleting}
              className="rounded-xl border border-red-200 bg-red-50 p-2.5 text-red-500 hover:bg-red-100"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="rounded-[1.5rem] border border-yellow-100 bg-white p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-slate-500">Current price</p>
              <div className="mt-2 flex items-center gap-1 text-3xl font-black text-slate-950">
                <IndianRupee className="h-5 w-5 text-yellow-600" />
                {formatPrice(product.current_price)}
              </div>
            </div>

            <div
              className={`rounded-2xl px-3 py-2 text-xs font-bold uppercase tracking-[0.15em] ${
                isAlert
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {isAlert ? "Target hit" : "Tracking"}
            </div>
          </div>

          <div className="mt-5">
            <div className="mb-2 flex items-center justify-between text-sm text-slate-500">
              <span>Progress to target</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-yellow-100">
              <div
                className={`h-full rounded-full ${
                  isAlert ? "bg-emerald-500" : "bg-yellow-500"
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-yellow-100 bg-white p-4">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
              <ArrowDown className="h-4 w-4 text-emerald-600" />
              Target price
            </div>
            <div className="mt-2 text-xl font-bold text-slate-950">
              Rs. {formatPrice(product.target_price)}
            </div>
          </div>

          <div className="rounded-2xl border border-yellow-100 bg-white p-4">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
              <Bell className="h-4 w-4 text-yellow-600" />
              Gap remaining
            </div>
            <div className="mt-2 text-xl font-bold text-slate-950">
              {gap > 0 ? `Rs. ${formatPrice(gap)}` : "Reached"}
            </div>
          </div>
        </div>

        <a
          href={product.product_url}
          target="_blank"
          rel="noreferrer"
          className="mt-4 flex items-center justify-between rounded-2xl border border-yellow-100 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-yellow-50"
        >
          <span>Open product page</span>
          <span className="flex items-center gap-1 text-yellow-700">
            View <ExternalLink className="h-4 w-4" />
          </span>
        </a>
      </div>

      {isAlert && (
        <div className="pointer-events-none absolute inset-0 rounded-[1.75rem] border border-emerald-300" />
      )}
    </div>
  );
};

export default ProductCard;
