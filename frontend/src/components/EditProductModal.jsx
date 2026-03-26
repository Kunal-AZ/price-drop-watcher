import React, { useState, useEffect } from "react";
import { productService } from "../services/productService";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { toast } from "sonner";

const EditProductModal = ({ open, onClose, product, onProductUpdated }) => {
  const [formData, setFormData] = useState({
    product_name: "",
    current_price: "",
    target_price: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        product_name: product.product_name || "",
        current_price: product.current_price || "",
        target_price: product.target_price || "",
      });
    }
  }, [product]);

  if (!product) return null;

  // 🔥 Validation
  const validate = () => {
    if (!formData.product_name.trim())
      return "Product name is required";

    if (!formData.current_price || formData.current_price <= 0)
      return "Enter valid current price";

    if (!formData.target_price || formData.target_price <= 0)
      return "Enter valid target price";

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const error = validate();
    if (error) {
      toast.error(error);
      return;
    }

    setLoading(true);

    try {
      const updated = await productService.update(product.product_id, {
        ...formData,
        current_price: parseFloat(formData.current_price),
        target_price: parseFloat(formData.target_price),
      });

      onProductUpdated(updated);

      toast.success("Product updated successfully");
      onClose();
    } catch (err) {
      toast.error(err.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="rounded-2xl border border-yellow-200 bg-white shadow-xl">

        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Edit Product
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">

          {/* Name */}
          <div>
            <Label>Product Name</Label>
            <Input
              value={formData.product_name}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  product_name: e.target.value,
                })
              }
            />
          </div>

          {/* Prices */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label>Current Price</Label>
              <Input
                type="number"
                value={formData.current_price}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    current_price: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <Label>Target Price</Label>
              <Input
                type="number"
                value={formData.target_price}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    target_price: e.target.value,
                  })
                }
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            <Button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="bg-gray-100 text-black hover:bg-gray-200"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-yellow-400 text-black hover:bg-yellow-500"
            >
              {loading ? "Updating..." : "Update Product"}
            </Button>
          </div>

        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProductModal;
