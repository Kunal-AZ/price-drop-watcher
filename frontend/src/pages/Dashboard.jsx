import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { productService } from '../services/productService';
import { Button } from '../components/ui/button';
import Navbar from '../components/Navbar';
import {
  TrendingDown,
  Plus,
  Package,
  Bell,
  IndianRupee,
  Activity,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
} from 'lucide-react';
import { toast } from 'sonner';
import ProductCard from '../components/ProductCard';
import AddProductModal from '../components/AddProductModal';
import EditProductModal from '../components/EditProductModal';
import { motion as Motion } from 'framer-motion';

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const fetchProducts = useCallback(async () => {
    try {
      const data = await productService.getAll();
      setProducts(data || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleProductAdded = (newProduct) => {
    setProducts((prev) => [newProduct, ...prev]);
    setShowAddModal(false);
  };

  const handleProductDeleted = (productId) => {
    setProducts((prev) => prev.filter((p) => p.product_id !== productId));
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowEditModal(true);
  };

  const handleProductUpdated = (updatedProduct) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.product_id === updatedProduct.product_id ? updatedProduct : p
      )
    );
    setEditingProduct(updatedProduct);
    setShowEditModal(false);
  };

  const totalProducts = products.length;
  const alerts = products.filter(
    (p) =>
      p?.current_price != null &&
      p?.target_price != null &&
      p.current_price <= p.target_price
  ).length;

  const averageTargetGap =
    products.length > 0
      ? Math.round(
          products.reduce((total, product) => {
            const currentPrice = Number(product.current_price) || 0;
            const targetPrice = Number(product.target_price) || 0;
            return total + Math.max(currentPrice - targetPrice, 0);
          }, 0) / products.length
        )
      : 0;

  const nearestDeal = [...products]
    .filter(
      (product) =>
        product?.current_price != null && product?.target_price != null
    )
    .sort(
      (a, b) =>
        Math.abs(a.current_price - a.target_price) -
        Math.abs(b.current_price - b.target_price)
    )[0];

  const stats = [
    {
      icon: Package,
      label: 'Products tracked',
      value: totalProducts,
      note: totalProducts === 1 ? '1 active item' : `${totalProducts} active items`,
      accent: 'from-amber-300/20 via-amber-200/5 to-transparent',
    },
    {
      icon: Bell,
      label: 'Alerts ready',
      value: alerts,
      note: alerts > 0 ? 'Targets reached' : 'Watching for drops',
      accent: 'from-emerald-300/20 via-emerald-200/5 to-transparent',
    },
    {
      icon: IndianRupee,
      label: 'Avg. gap',
      value: averageTargetGap > 0 ? `Rs. ${averageTargetGap}` : 'Rs. 0',
      note: 'Current vs target',
      accent: 'from-sky-300/20 via-sky-200/5 to-transparent',
    },
    {
      icon: Activity,
      label: 'Tracking status',
      value: 'Live',
      note: 'Connected to backend',
      accent: 'from-fuchsia-300/20 via-fuchsia-200/5 to-transparent',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fffdf7] via-[#fff9eb] to-[#fff4d8] text-slate-900">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-8%] top-[-8%] h-80 w-80 rounded-full bg-yellow-300/30 blur-3xl" />
        <div className="absolute right-[-6%] top-20 h-72 w-72 rounded-full bg-orange-200/35 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-amber-200/35 blur-3xl" />
      </div>

      <div className="relative z-10">
        <Navbar user={user} onLogout={handleLogout} />

        <div className="mx-auto max-w-7xl px-6 py-10 md:px-8">
          <Motion.section
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            className="overflow-hidden rounded-[2rem] border border-yellow-200 bg-[radial-gradient(circle_at_top_left,_rgba(250,204,21,0.22),_transparent_28%),linear-gradient(145deg,rgba(255,255,255,0.96),rgba(255,248,220,0.96))] p-8 shadow-[0_35px_90px_-45px_rgba(180,120,0,0.35)] md:p-10"
          >
            <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-yellow-300 bg-yellow-100 px-4 py-2 text-sm font-semibold text-yellow-700">
                  <Sparkles className="h-4 w-4" />
                  Price intelligence workspace
                </div>
                <h1 className="mt-6 text-4xl font-black tracking-tight text-slate-950 md:text-6xl">
                  Welcome back{user?.name ? `, ${user.name}` : ''}.
                </h1>
                <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
                  Watch the products you care about, track how close they are to target, and move on the best deals faster.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:min-w-[360px]">
                <div className="rounded-2xl border border-yellow-200 bg-white/80 p-5 backdrop-blur">
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                    <ShieldCheck className="h-4 w-4 text-emerald-600" />
                    Closest target
                  </div>
                  <div className="mt-3 text-xl font-bold text-slate-900">
                    {nearestDeal ? nearestDeal.product_name : 'No products yet'}
                  </div>
                  <div className="mt-2 text-sm text-slate-500">
                    {nearestDeal
                      ? `Gap: Rs. ${Math.max(
                          (nearestDeal.current_price || 0) -
                            (nearestDeal.target_price || 0),
                          0
                        )}`
                      : 'Add a product to start tracking'}
                  </div>
                </div>

                <Button
                  onClick={() => setShowAddModal(true)}
                  className="min-h-[120px] rounded-2xl bg-black px-8 py-6 text-left text-white shadow-[0_20px_50px_-25px_rgba(0,0,0,0.45)] transition hover:bg-slate-900"
                >
                  <div>
                    <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-white/70">
                      <Plus className="h-4 w-4" />
                      Add Product
                    </div>
                    <div className="mt-3 text-2xl font-black">
                      Start a new watchlist item
                    </div>
                    <div className="mt-2 flex items-center gap-2 text-sm font-medium text-white/70">
                      Track a fresh price target <ArrowUpRight className="h-4 w-4" />
                    </div>
                  </div>
                </Button>
              </div>
            </div>
          </Motion.section>

          <section className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {stats.map((item) => (
              <Motion.div
                key={item.label}
                whileHover={{ y: -4 }}
                className={`rounded-[1.75rem] border border-yellow-200 bg-gradient-to-br ${item.accent} p-[1px] shadow-[0_20px_50px_-35px_rgba(180,120,0,0.22)]`}
              >
                <div className="h-full rounded-[1.7rem] bg-white/90 p-6 backdrop-blur-xl">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-slate-500">{item.label}</p>
                      <h3 className="mt-3 text-3xl font-black text-slate-950">{item.value}</h3>
                    </div>
                    <div className="rounded-2xl bg-yellow-50 p-3">
                      <item.icon className="h-6 w-6 text-yellow-600" />
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-slate-500">{item.note}</p>
                </div>
              </Motion.div>
            ))}
          </section>

          <section className="mt-8 rounded-[2rem] border border-yellow-200 bg-white/80 p-6 shadow-[0_20px_60px_-40px_rgba(180,120,0,0.28)] backdrop-blur-xl md:p-8">
            <div className="flex flex-col gap-4 border-b border-yellow-100 pb-6 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Watchlist
                </p>
                <h2 className="mt-2 text-3xl font-black text-slate-950">
                  Your tracked products
                </h2>
                <p className="mt-2 max-w-2xl text-base leading-7 text-slate-600">
                  Keep an eye on every monitored product, see how close each one is to your target, and adjust the list whenever priorities shift.
                </p>
              </div>
              <div className="rounded-2xl border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm font-medium text-slate-700">
                {alerts > 0
                  ? `${alerts} alert${alerts === 1 ? '' : 's'} ready to act on`
                  : 'No targets hit yet'}
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center py-20">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-amber-400 border-t-transparent" />
              </div>
            ) : products.length === 0 ? (
              <Motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-8 rounded-[1.75rem] border border-dashed border-yellow-200 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(255,248,220,0.7))] px-6 py-20 text-center"
              >
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-yellow-100">
                  <TrendingDown className="text-yellow-600" size={38} />
                </div>
                <h3 className="mt-6 text-3xl font-black text-slate-950">
                  Your watchlist is empty
                </h3>
                <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-slate-600">
                  Add your first product to start tracking price movement, comparing current prices against your targets, and spotting deal opportunities sooner.
                </p>
                <Button
                  onClick={() => setShowAddModal(true)}
                  className="mt-8 rounded-2xl bg-black px-6 py-4 text-white hover:bg-slate-900"
                >
                  <Plus className="mr-2 h-5 w-5" />
                  Add Product
                </Button>
              </Motion.div>
            ) : (
              <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {products.map((product) => (
                  <ProductCard
                    key={product.product_id}
                    product={product}
                    onDelete={handleProductDeleted}
                    onUpdate={handleEditProduct}
                  />
                ))}
              </div>
            )}
          </section>
        </div>

        <AddProductModal
          open={showAddModal}
          onClose={() => setShowAddModal(false)}
          onProductAdded={handleProductAdded}
        />
        <EditProductModal
          open={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setEditingProduct(null);
          }}
          product={editingProduct}
          onProductUpdated={handleProductUpdated}
        />
      </div>
    </div>
  );
};

export default DashboardPage;
