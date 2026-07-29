import React, { useState } from "react";
import {
  Trash2,
  Pencil,
  IndianRupee,
  Bell,
  ExternalLink,
  ArrowDown,
  RefreshCw,
} from "lucide-react";
import { productService } from "../services/productService";
import { toast } from "sonner";

const formatPrice = (price) => new Intl.NumberFormat("en-IN").format(price || 0);

const ProductCard = ({ product, onDelete, onUpdate, onRefresh }) => {
  const [deleting, setDeleting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const currentPrice = Number(product.current_price || 0);
  const targetPrice = Number(product.target_price || 0);
  const isAlert = currentPrice <= targetPrice;
  const sourceLabel = product.product_url?.includes("flipkart")
    ? "Flipkart"
    : product.product_url?.includes("amazon")
      ? "Amazon"
      : "Store";
  const gap = Math.max(currentPrice - targetPrice, 0);
  const progress =
    targetPrice > 0 && currentPrice > 0
      ? Math.min((targetPrice / currentPrice) * 100, 100)
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

  const handleRefresh = async () => {
    setRefreshing(true);

    try {
      const updatedProduct = await productService.refresh(product.product_id);
      onRefresh?.(updatedProduct);
      toast.success("Current price refreshed");
    } catch (error) {
      toast.error(error.message || "Refresh failed");
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <div className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_24px_70px_-48px_rgba(15,23,42,0.45)] transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-[0_28px_80px_-48px_rgba(16,185,129,0.5)]">
      <div className="relative">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-600">
              {sourceLabel}
            </div>
            <h3 className="mt-3 line-clamp-2 text-xl font-bold text-slate-950">
              {product.product_name}
            </h3>
          </div>

          <div className="flex gap-2 opacity-80 transition group-hover:opacity-100">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="rounded-xl border border-emerald-200 bg-emerald-50 p-2.5 text-emerald-700 hover:bg-emerald-100"
              title="Refresh current price"
            >
              <RefreshCw
                className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
              />
            </button>

            <button
              onClick={() => onUpdate(product)}
              className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-600 hover:bg-slate-50"
              title="Edit target"
            >
              <Pencil className="h-4 w-4" />
            </button>

            <button
              onClick={handleDelete}
              disabled={deleting}
              className="rounded-xl border border-red-200 bg-red-50 p-2.5 text-red-500 hover:bg-red-100"
              title="Delete product"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-slate-500">Current price</p>
              <div className="mt-2 flex items-center gap-1 text-3xl font-black text-slate-950">
                <IndianRupee className="h-5 w-5 text-emerald-600" />
                {formatPrice(currentPrice)}
              </div>
            </div>

            <div
              className={`rounded-2xl px-3 py-2 text-xs font-bold uppercase tracking-[0.15em] ${
                isAlert
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-amber-100 text-amber-700"
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
            <div className="h-2 overflow-hidden rounded-full bg-slate-200">
              <div
                className={`h-full rounded-full ${
                  isAlert ? "bg-emerald-500" : "bg-amber-500"
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-100 bg-white p-4">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
              <ArrowDown className="h-4 w-4 text-emerald-600" />
              Target price
            </div>
            <div className="mt-2 text-xl font-bold text-slate-950">
              Rs. {formatPrice(targetPrice)}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-4">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
              <Bell className="h-4 w-4 text-amber-600" />
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
          className="mt-4 flex items-center justify-between rounded-2xl border border-slate-100 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50"
        >
          <span>Open product page</span>
          <span className="flex items-center gap-1 text-emerald-700">
            View <ExternalLink className="h-4 w-4" />
          </span>
        </a>
      </div>

      {isAlert && (
        <div className="pointer-events-none absolute inset-0 rounded-3xl border border-emerald-300" />
      )}
    </div>
  );
};

export default ProductCard;
