import React, { useEffect, useState } from "react";
import { productService } from "../services/productService";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { toast } from "sonner";
import { Link, Loader2, Sparkles, Target } from "lucide-react";

const defaultFormData = {
  product_name: "",
  product_url: "",
  target_price: "",
};

const AddProductModal = ({ open, onClose, onProductAdded, initialData }) => {
  const [formData, setFormData] = useState({
    ...defaultFormData,
    ...initialData,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;

    setFormData({
      ...defaultFormData,
      ...initialData,
    });
  }, [initialData, open]);

  const validate = () => {
    if (!formData.product_url.trim().startsWith("http")) {
      return "Enter a valid product URL";
    }

    if (!formData.target_price || Number(formData.target_price) <= 0) {
      return "Enter valid target price";
    }

    return null;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const error = validate();
    if (error) {
      toast.error(error);
      return;
    }

    setLoading(true);

    try {
      const newProduct = await productService.create({
        product_name: formData.product_name.trim(),
        product_url: formData.product_url.trim(),
        target_price: parseFloat(formData.target_price),
      });

      onProductAdded(newProduct);
      toast.success("Product added with live price");
      setFormData(defaultFormData);
      onClose();
    } catch (err) {
      toast.error(err.message || "Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg rounded-2xl border border-slate-200 bg-white p-0 text-slate-950 shadow-2xl">
        <div className="border-b border-slate-100 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 px-6 py-6 text-white">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-100">
            <Sparkles className="h-3.5 w-3.5" />
            Auto price fetch
          </div>

          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white">
              Add a product watch
            </DialogTitle>
            <DialogDescription>
              Paste a product link and set your target. BargainIt will fetch the current price automatically.
            </DialogDescription>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          <div className="grid gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 sm:grid-cols-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-emerald-800">
              <Link className="h-4 w-4" />
              Paste link
            </div>
            <div className="flex items-center gap-2 text-sm font-semibold text-emerald-800">
              <Target className="h-4 w-4" />
              Set target
            </div>
            <div className="flex items-center gap-2 text-sm font-semibold text-emerald-800">
              <Sparkles className="h-4 w-4" />
              Price appears
            </div>
          </div>

          <div>
            <Label>Product nickname</Label>
            <Input
              placeholder="Optional, fetched from page if empty"
              value={formData.product_name}
              onChange={(event) =>
                setFormData({ ...formData, product_name: event.target.value })
              }
              className="mt-2 border-slate-200 bg-slate-50 focus:border-emerald-500"
            />
          </div>

          <div>
            <Label>Product URL</Label>
            <Input
              placeholder="https://amazon.in/... or https://flipkart.com/..."
              value={formData.product_url}
              onChange={(event) =>
                setFormData({ ...formData, product_url: event.target.value })
              }
              className="mt-2 border-slate-200 bg-slate-50 focus:border-emerald-500"
            />
          </div>

          <div>
            <Label>Target Price</Label>
            <Input
              type="number"
              min="1"
              step="1"
              placeholder="9000"
              value={formData.target_price}
              onChange={(event) =>
                setFormData({
                  ...formData,
                  target_price: event.target.value,
                })
              }
              className="mt-2 border-slate-200 bg-slate-50 text-lg font-semibold focus:border-emerald-500"
            />
            <p className="mt-2 text-sm text-slate-500">
              Current price will be fetched from the product page when you add it.
            </p>
          </div>

          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              onClick={onClose}
              className="border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              disabled={loading}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={loading}
              className="bg-slate-950 text-white hover:bg-slate-800 sm:min-w-[180px]"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Fetching price
                </span>
              ) : (
                "Add Product"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddProductModal;
