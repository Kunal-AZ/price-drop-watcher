import { api } from "./api";

export const productService = {
  // 🔥 Get all products
  getAll: async () => {
    try {
      const res = await api.get("/products");
      return res.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch products"
      );
    }
  },

  // 🔥 Get single product
  getById: async (id) => {
    try {
      const res = await api.get(`/products/${id}`);
      return res.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch product"
      );
    }
  },

  // 🔥 Create product
  create: async (productData) => {
    try {
      const res = await api.post("/products", productData);
      return res.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to create product"
      );
    }
  },

  // 🔥 Update product
  update: async (id, productData) => {
    try {
      const res = await api.put(`/products/${id}`, productData);
      return res.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to update product"
      );
    }
  },

  // 🔥 Delete product
  delete: async (id) => {
    try {
      const res = await api.delete(`/products/${id}`);
      return res.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to delete product"
      );
    }
  },

  // 🔥 (Optional but recommended) Price History
  getPriceHistory: async (id) => {
    try {
      const res = await api.get(`/products/${id}/history`);
      return res.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch price history"
      );
    }
  },
};
