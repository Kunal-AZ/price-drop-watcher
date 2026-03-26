import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  const [quickQuery, setQuickQuery] = useState('');

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

  const handleQuickSearch = (event) => {
    event.preventDefault();

    const normalizedQuery = quickQuery.trim();
    if (!normalizedQuery) return;

    const isProductLink =
      normalizedQuery.includes('amazon') || normalizedQuery.includes('flipkart');

    navigate(
      isProductLink
        ? `/dashboard?add=1&url=${encodeURIComponent(normalizedQuery)}`
        : `/dashboard?q=${encodeURIComponent(normalizedQuery)}`
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-yellow-50 text-black">
      <nav className="sticky top-0 z-50 border-b border-yellow-100 bg-white px-4 py-4 shadow-sm sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 py-1 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-fit items-center gap-3">
            <img src={logo} alt="logo" className="h-12 w-12 object-contain" />
            <h1 className="text-2xl font-bold">BargainIt</h1>
          </div>

          <div className="flex w-full flex-col gap-4 lg:flex-1 lg:flex-row lg:items-center lg:justify-end">
            <form onSubmit={handleQuickSearch} className="relative w-full lg:max-w-xl">
              <input
                type="text"
                value={quickQuery}
                onChange={(event) => setQuickQuery(event.target.value)}
                placeholder="Find products to track or paste a product link..."
                className="w-full rounded-full border border-yellow-200 bg-gray-50 px-6 py-3 shadow-sm focus:border-yellow-400 focus:outline-none"
              />
            </form>

            <div className="flex flex-wrap gap-4 text-sm font-medium text-gray-700 sm:gap-6">
              <a href="#popular-products" className="hover:text-yellow-500">
                Popular Products
              </a>
              <a href="#top-price-drops" className="hover:text-yellow-500">
                Top Price Drops
              </a>
              <Link to="/features" className="hover:text-yellow-500">
                Features
              </Link>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 sm:gap-4">
            <Button
              onClick={() => navigate('/register')}
              className="rounded-full bg-black px-6 text-white hover:bg-gray-900 sm:px-8"
            >
              Sign Up
            </Button>

            <Button
              onClick={() => navigate('/login')}
              className="rounded-full border border-yellow-300 bg-white px-6 text-black hover:bg-yellow-50 sm:px-8"
            >
              Sign In
            </Button>
          </div>
        </div>
      </nav>

      <section className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-20 lg:px-8 lg:py-24">
        <div>
          <div className="mb-6 inline-block rounded-full bg-yellow-100 px-4 py-2 text-sm font-medium text-yellow-700">
            Smart shopping starts here
          </div>

          <h1 className="mb-8 text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-7xl">
            Never Miss a <span className="text-yellow-500">Price Drop</span>
          </h1>

          <p className="mb-10 max-w-xl text-lg leading-relaxed text-gray-600 sm:text-xl lg:text-2xl">
            Track products from Amazon, Flipkart and your favorite stores.
            Get instant alerts the moment prices fall.
          </p>

          <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:gap-5">
            <Button
              onClick={() => navigate('/register')}
              className="rounded-xl bg-yellow-400 px-8 py-4 text-base text-black shadow-md hover:bg-yellow-500 sm:px-10 sm:text-lg"
            >
              Start Tracking
            </Button>

            <Button
              onClick={() => navigate('/login')}
              className="rounded-xl border border-yellow-300 bg-white px-8 py-4 text-base text-black hover:bg-yellow-50 sm:px-10 sm:text-lg"
            >
              Dashboard <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>

          <div className="flex flex-col gap-4 text-gray-600 sm:flex-row sm:gap-10">
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
          <div className="absolute -left-10 -top-10 h-72 w-72 rounded-full bg-yellow-200 opacity-30 blur-3xl" />

          <div className="relative rounded-3xl border border-yellow-100 bg-white p-4 shadow-2xl">
            <img
              src={image1}
              alt="Hero"
              className="h-auto w-full rounded-3xl object-cover"
            />
          </div>
        </div>
      </section>

      <section className="bg-white py-16 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 md:grid-cols-3 lg:gap-8 lg:px-8">
          {[
            {
              icon: TrendingDown,
              title: 'Track Products',
              desc: 'Add products and monitor prices automatically',
            },
            {
              icon: LineChart,
              title: 'Price History',
              desc: 'Visual price history with trend analysis',
            },
            {
              icon: Bell,
              title: 'Alerts',
              desc: 'Receive alerts when target price is reached',
            },
          ].map((item, index) => (
            <div
              key={index}
              className="rounded-3xl border border-yellow-100 bg-yellow-50 p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:scale-[1.03] hover:shadow-xl lg:p-10"
            >
              <item.icon className="mb-6 h-10 w-10 text-yellow-500" />
              <h3 className="mb-4 text-2xl font-bold lg:text-3xl">{item.title}</h3>
              <p className="text-base text-gray-600 lg:text-lg">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section
        id="popular-products"
        className="bg-gradient-to-b from-yellow-50 to-white py-16 lg:py-24"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-yellow-100 px-4 py-2 text-sm font-semibold text-yellow-700">
                <Flame className="h-4 w-4" />
                Live from Amazon and Flipkart
              </div>
              <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
                Popular Products
              </h2>
              <p className="mt-3 max-w-2xl text-base text-gray-600 sm:text-lg">
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
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="rounded-3xl border border-yellow-100 bg-white p-6 shadow-sm"
                >
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
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
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

      <section id="top-price-drops" className="bg-white py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700">
              <TrendingDown className="h-4 w-4" />
              Biggest visible discounts
            </div>
            <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
              Top Price Drops
            </h2>
            <p className="mt-3 max-w-2xl text-base text-gray-600 sm:text-lg">
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
                <div
                  key={index}
                  className="flex items-center justify-between rounded-3xl border border-yellow-100 bg-yellow-50/60 p-6"
                >
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

      <footer className="border-t border-yellow-300 bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-8">
            <div className="flex flex-wrap justify-center gap-6 text-center font-medium text-blue-600 sm:gap-8">
              <Link to="/about" className="hover:underline">
                About
              </Link>
              <Link to="/blog" className="hover:underline">
                Blog
              </Link>
              <Link to="/features" className="hover:underline">
                Features
              </Link>
              <Link to="/contact" className="hover:underline">
                Contact
              </Link>
            </div>

            <div className="flex flex-col items-center gap-4 text-center md:flex-row md:items-start md:text-left">
              <img src={logo} alt="logo" className="mt-1 h-12 w-12 object-contain" />
              <div>
                <h1 className="text-2xl font-bold">BargainIt</h1>
                <p className="mt-2 max-w-md leading-7 text-gray-600">
                  Smart product tracking platform for monitoring price drops,
                  alerts, and saving money automatically.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-yellow-300 pt-6 text-center md:flex-row md:text-left">
            <p className="text-sm text-gray-600">
              Copyright 2026 BargainIt Technologies. All rights reserved.
            </p>

            <div className="mt-1 flex flex-wrap justify-center gap-6 text-sm text-gray-500 md:mt-0">
              <Link to="/terms" className="hover:text-yellow-500">
                Terms
              </Link>
              <Link to="/privacy" className="hover:text-yellow-500">
                Privacy
              </Link>
              <Link to="/help" className="hover:text-yellow-500">
                Help
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
