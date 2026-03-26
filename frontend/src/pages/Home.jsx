import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TrendingDown,
  Bell,
  LineChart,
  Shield,
  ArrowRight,
  Flame,
  ExternalLink,
  Store,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import logo from '../assets/logo.jpg';
import image1 from '../assets/image1.png';
import { homeService } from '../services/homeService';


const LandingPage = () => {
  const navigate = useNavigate();
  const [popularProducts, setPopularProducts] = useState([]);
  const [topPriceDrops, setTopPriceDrops] = useState([]);
  const [loadingDeals, setLoadingDeals] = useState(true);
  const [dealsError, setDealsError] = useState('');
  const [sourceMode, setSourceMode] = useState('live');

  useEffect(() => {
    const loadDeals = async () => {
      try {
        const data = await homeService.getHomepageDeals();
        setPopularProducts(data.popularProducts || []);
        setTopPriceDrops(data.topPriceDrops || []);
        setSourceMode(data.sourceMode || 'live');
        setDealsError(data.message || '');
      } catch {
        setDealsError('Marketplace products are temporarily unavailable.');
      } finally {
        setLoadingDeals(false);
      }
    };

    loadDeals();
  }, []);

  const formatPrice = (price) =>
    new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 0,
    }).format(price || 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-yellow-50 text-black">

      <nav className="sticky top-0 z-50 bg-white border-b border-yellow-100 px-8 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-10 py-1">

          <div className="flex items-center gap-3 min-w-fit">
            <img src={logo} alt="logo" className="h-12 w-12 object-contain" />
            <h1 className="text-2xl font-bold">BargainIt</h1>
          </div>

          <div className="flex-1 max-w-xl relative">
            <input
              type="text"
              placeholder="Find products to track..."
              className="w-full px-6 py-3 rounded-full border border-yellow-200 bg-gray-50 focus:outline-none focus:border-yellow-400 shadow-sm"
            />
          </div>

          <div className="hidden md:flex gap-8 text-gray-700 font-medium">
            <a href="#popular-products" className="hover:text-yellow-500">Popular Products</a>
            <a href="#top-price-drops" className="hover:text-yellow-500">Top Price Drops</a>
            <a href="#" className="hover:text-yellow-500">Extensions</a>
          </div>

          <div className="flex gap-4">
            <Button
              onClick={() => navigate('/register')}
              className="bg-black text-white rounded-full px-8 hover:bg-gray-900"
            >
              Sign Up
            </Button>

            <Button
              onClick={() => navigate('/login')}
              className="bg-white text-black border border-yellow-300 rounded-full px-8 hover:bg-yellow-50"
            >
              Sign In
            </Button>
          </div>

        </div>
      </nav>

      <section className="max-w-7xl mx-auto px-8 py-24 grid lg:grid-cols-2 gap-20 items-center">

        <div>
          <div className="inline-block px-4 py-2 rounded-full bg-yellow-100 text-yellow-700 text-sm font-medium mb-6">
            Smart shopping starts here
          </div>

          <h1 className="text-7xl font-bold leading-tight tracking-tight mb-8">
            Never Miss a <span className="text-yellow-500">Price Drop</span>
          </h1>

          <p className="text-gray-600 text-2xl leading-relaxed mb-10 max-w-xl">
            Track products from Amazon, Flipkart and your favorite stores.
            Get instant alerts the moment prices fall.
          </p>

          <div className="flex gap-5 mb-12">
            <Button
              onClick={() => navigate('/register')}
              className="bg-yellow-400 hover:bg-yellow-500 text-black px-10 py-4 rounded-xl shadow-md text-lg"
            >
              Start Tracking
            </Button>

            <Button
              onClick={() => navigate('/login')}
              className="bg-white border border-yellow-300 text-black px-10 py-4 rounded-xl hover:bg-yellow-50 text-lg"
            >
              Dashboard <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>

          <div className="flex gap-10 text-gray-600">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-yellow-500" />
              Free forever
            </div>

            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-yellow-500" />
              Instant alerts
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -top-10 -left-10 w-72 h-72 bg-yellow-200 rounded-full blur-3xl opacity-30"></div>

          <div className="relative bg-white rounded-3xl p-4 shadow-2xl border border-yellow-100">
            <img
              src={image1}
              alt="Hero"
              className="rounded-3xl w-full h-auto object-cover"
            />
          </div>
        </div>

      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-8 grid md:grid-cols-3 gap-8">
          {[
            { icon: TrendingDown, title: 'Track Products', desc: 'Add products and monitor prices automatically' },
            { icon: LineChart, title: 'Price History', desc: 'Visual price history with trend analysis' },
            { icon: Bell, title: 'Alerts', desc: 'Receive alerts when target price is reached' },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-yellow-50 rounded-3xl p-10 border border-yellow-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 hover:scale-[1.03]"
            >
              <item.icon className="h-10 w-10 text-yellow-500 mb-6" />
              <h3 className="text-3xl font-bold mb-4">{item.title}</h3>
              <p className="text-gray-600 text-lg">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="popular-products" className="py-24 bg-gradient-to-b from-yellow-50 to-white">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex items-end justify-between gap-6 mb-10">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-yellow-100 px-4 py-2 text-sm font-semibold text-yellow-700">
                <Flame className="h-4 w-4" />
                Live from Amazon and Flipkart
              </div>
              <h2 className="mt-4 text-4xl font-bold">Popular Products</h2>
              <p className="mt-3 max-w-2xl text-lg text-gray-600">
                Fresh product picks pulled from popular marketplace listings so shoppers can jump straight into tracking.
              </p>
              {sourceMode === 'fallback' ? (
                <p className="mt-3 text-sm font-medium text-yellow-700">
                  Live scraping is limited right now, so these are fallback marketplace links.
                </p>
              ) : null}
            </div>
          </div>

          {loadingDeals ? (
            <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="rounded-3xl border border-yellow-100 bg-white p-6 shadow-sm">
                  <div className="h-40 rounded-2xl bg-yellow-100/60 animate-pulse" />
                  <div className="mt-5 h-5 rounded bg-yellow-100/70 animate-pulse" />
                  <div className="mt-3 h-4 w-2/3 rounded bg-yellow-100/50 animate-pulse" />
                  <div className="mt-6 h-10 rounded-xl bg-yellow-100/70 animate-pulse" />
                </div>
              ))}
            </div>
          ) : dealsError && popularProducts.length === 0 ? (
            <div className="rounded-3xl border border-yellow-100 bg-white p-10 text-center shadow-sm">
              <p className="text-lg font-medium text-gray-700">{dealsError}</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
              {popularProducts.map((product) => (
                <a
                  key={product.id}
                  href={product.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group rounded-3xl border border-yellow-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="flex h-44 items-center justify-center overflow-hidden rounded-2xl bg-yellow-50">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.title}
                        className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="text-sm font-medium text-gray-400">No image</div>
                    )}
                  </div>

                  <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-gray-500">
                    <Store className="h-4 w-4 text-yellow-500" />
                    {product.source}
                  </div>

                  <h3 className="mt-3 line-clamp-2 text-lg font-bold text-slate-900">
                    {product.title}
                  </h3>

                  <div className="mt-4 flex items-end justify-between gap-3">
                    <div>
                      <div className="text-2xl font-bold text-slate-900">
                        Rs. {formatPrice(product.current_price)}
                      </div>
                      {product.original_price ? (
                        <div className="mt-1 text-sm text-gray-400 line-through">
                          Rs. {formatPrice(product.original_price)}
                        </div>
                      ) : null}
                    </div>

                    <div className="flex items-center gap-1 text-sm font-semibold text-yellow-700">
                      View <ExternalLink className="h-4 w-4" />
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </section>

      <section id="top-price-drops" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-8">
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700">
              <TrendingDown className="h-4 w-4" />
              Biggest visible discounts
            </div>
            <h2 className="mt-4 text-4xl font-bold">Top Price Drops</h2>
            <p className="mt-3 max-w-2xl text-lg text-gray-600">
              Deals ranked by the strongest discount signal we can read directly from public marketplace listings.
            </p>
            {sourceMode === 'fallback' ? (
              <p className="mt-3 text-sm font-medium text-emerald-700">
                Discount cards below are fallback examples until live deal scraping returns data again.
              </p>
            ) : null}
          </div>

          {loadingDeals ? (
            <div className="grid gap-5">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="flex items-center justify-between rounded-3xl border border-yellow-100 bg-yellow-50/60 p-6">
                  <div className="h-5 w-1/3 rounded bg-yellow-100 animate-pulse" />
                  <div className="h-10 w-40 rounded-xl bg-yellow-100 animate-pulse" />
                </div>
              ))}
            </div>
          ) : topPriceDrops.length === 0 ? (
            <div className="rounded-3xl border border-yellow-100 bg-yellow-50/60 p-10 text-center">
              <p className="text-lg font-medium text-gray-700">
                Price-drop data is limited right now, but popular products are still live above.
              </p>
            </div>
          ) : (
            <div className="grid gap-5">
              {topPriceDrops.map((product, index) => (
                <a
                  key={product.id}
                  href={product.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex flex-col gap-5 rounded-3xl border border-yellow-100 bg-gradient-to-r from-yellow-50 to-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg md:flex-row md:items-center md:justify-between"
                >
                  <div className="flex items-center gap-5">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-black text-lg font-bold text-white">
                      {index + 1}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-sm font-semibold text-gray-500">
                        <Store className="h-4 w-4 text-yellow-500" />
                        {product.source}
                      </div>
                      <h3 className="mt-2 text-xl font-bold text-slate-900">
                        {product.title}
                      </h3>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 md:justify-end">
                    <div className="rounded-2xl bg-emerald-100 px-4 py-2 text-sm font-bold text-emerald-700">
                      {product.discount_percent}% OFF
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-slate-900">
                        Rs. {formatPrice(product.current_price)}
                      </div>
                      {product.original_price ? (
                        <div className="text-sm text-gray-400 line-through">
                          Rs. {formatPrice(product.original_price)}
                        </div>
                      ) : null}
                    </div>
                    <div className="flex items-center gap-1 text-sm font-semibold text-yellow-700">
                      Open deal <ExternalLink className="h-4 w-4" />
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </section>

<footer className="bg-white border-t border-yellow-300 py-12">
  <div className="max-w-7xl mx-auto px-8">

    {/* Links + Logo Section */}
    <div className="flex flex-col items-center gap-8">

      {/* Top Links */}
      <div className="flex justify-center gap-8 text-blue-600 font-medium">
        <a href="/about" className="hover:underline">About</a>
        <a href="/blog" className="hover:underline">Blog</a>
        <a href="features" className="hover:underline">Features</a>
        <a href="contact" className="hover:underline">Contact</a>
      </div>

      {/* Logo left + info right */}
      <div className="flex items-start gap-4">
        <img src={logo} alt="logo" className="h-12 w-12 object-contain mt-1" />
<h1 className="text-2xl font-bold">BargainIt</h1>
        <div>
          <p className="text-gray-600 leading-7 max-w-md">
            Smart product tracking platform for monitoring price drops,
            alerts, and saving money automatically.
          </p>
        </div>
      </div>

    </div>

    {/* Bottom Footer */}
    <div className="border-t border-yellow-300 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
      <p className="text-gray-600 text-sm">
        © 2026 BargainIt Technologies. All rights reserved.
      </p>

      <div className="flex gap-6 text-sm text-gray-500 mt-4 md:mt-0">
        <a href="/terms" className="hover:text-yellow-500">Terms</a>
        <a href="/privacy" className="hover:text-yellow-500">Privacy</a>
        <a href="/help" className="hover:text-yellow-500">Help</a>
      </div>
    </div>

  </div>
</footer>
    </div>
  );
};

export default LandingPage;
