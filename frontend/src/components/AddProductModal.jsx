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

const defaultFormData = {
  product_name: "",
  product_url: "",
  current_price: "",
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

  // 🔥 Validation
  const validate = () => {
    if (!formData.product_name.trim())
      return "Product name is required";

    if (!formData.product_url.startsWith("http"))
      return "Enter a valid product URL";

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
      const newProduct = await productService.create({
        ...formData,
        current_price: parseFloat(formData.current_price),
        target_price: parseFloat(formData.target_price),
      });

      onProductAdded(newProduct);

      toast.success("Product added successfully");

      // Reset form
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
      <DialogContent className="rounded-2xl border border-yellow-200 bg-white shadow-xl">

        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Add Product
          </DialogTitle>
          <DialogDescription>
            Track a product and get price alerts
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">

          {/* Product Name */}
          <div>
            <Label>Product Name</Label>
            <Input
              placeholder="e.g. iPhone 15"
              value={formData.product_name}
              onChange={(e) =>
                setFormData({ ...formData, product_name: e.target.value })
              }
            />
          </div>

          {/* URL */}
          <div>
            <Label>Product URL</Label>
            <Input
              placeholder="https://amazon.in/..."
              value={formData.product_url}
              onChange={(e) =>
                setFormData({ ...formData, product_url: e.target.value })
              }
            />
          </div>

          {/* Prices */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label>Current Price</Label>
              <Input
                type="number"
                placeholder="10000"
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
                placeholder="9000"
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
              className="bg-gray-100 text-black hover:bg-gray-200"
              disabled={loading}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-yellow-400 text-black hover:bg-yellow-500"
            >
              {loading ? "Adding..." : "Add Product"}
            </Button>
          </div>

        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddProductModal;
