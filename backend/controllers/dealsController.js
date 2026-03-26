import { scrapeMarketplaceDeals } from '../utils/scraper.js';

let dealsCache = {
  data: null,
  expiresAt: 0,
};

const CACHE_TTL_MS = 15 * 60 * 1000;

const FALLBACK_DEALS = {
  popularProducts: [
    {
      id: 'amazon-fallback-earbuds',
      title: 'boAt Airdopes Wireless Earbuds',
      url: 'https://www.amazon.in/s?k=boat+airdopes',
      image: '/src/assets/p5.jpg',
      source: 'Amazon',
      current_price: 1299,
      original_price: 2990,
      discount_percent: 57,
    },
    {
      id: 'amazon-fallback-smartwatch',
      title: 'Noise Smartwatch',
      url: 'https://www.amazon.in/s?k=noise+smartwatch',
      image: '/src/assets/p6.jpg',
      source: 'Amazon',
      current_price: 1999,
      original_price: 4999,
      discount_percent: 60,
    },
    {
      id: 'flipkart-fallback-iphone',
      title: 'Apple iPhone Deals',
      url: 'https://www.flipkart.com/search?q=iphone',
      image: '/src/assets/p7.jpg',
      source: 'Flipkart',
      current_price: 49999,
      original_price: 59999,
      discount_percent: 17,
    },
    {
      id: 'flipkart-fallback-laptop',
      title: 'HP Laptop Offers',
      url: 'https://www.flipkart.com/search?q=hp+laptop',
      image: '/src/assets/p8.jpg',
      source: 'Flipkart',
      current_price: 42990,
      original_price: 54990,
      discount_percent: 22,
    },
  ],
  topPriceDrops: [
    {
      id: 'amazon-fallback-tv',
      title: 'Samsung Smart TV Deals',
      url: 'https://www.amazon.in/s?k=samsung+smart+tv',
      image: '/src/assets/p5.jpg',
      source: 'Amazon',
      current_price: 27990,
      original_price: 44990,
      discount_percent: 38,
    },
    {
      id: 'flipkart-fallback-headphones',
      title: 'Sony Headphone Offers',
      url: 'https://www.flipkart.com/search?q=sony+headphones',
      image: '/src/assets/p6.jpg',
      source: 'Flipkart',
      current_price: 7990,
      original_price: 14990,
      discount_percent: 47,
    },
    {
      id: 'amazon-fallback-ac',
      title: 'LG Air Conditioner Deals',
      url: 'https://www.amazon.in/s?k=lg+air+conditioner',
      image: '/src/assets/p7.jpg',
      source: 'Amazon',
      current_price: 32990,
      original_price: 51990,
      discount_percent: 37,
    },
    {
      id: 'flipkart-fallback-monitor',
      title: 'Gaming Monitor Offers',
      url: 'https://www.flipkart.com/search?q=gaming+monitor',
      image: '/src/assets/p8.jpg',
      source: 'Flipkart',
      current_price: 11999,
      original_price: 19999,
      discount_percent: 40,
    },
  ],
};

export const getHomepageDeals = async (_req, res) => {
  try {
    const now = Date.now();

    if (dealsCache.data && dealsCache.expiresAt > now) {
      return res.json(dealsCache.data);
    }

    const deals = await scrapeMarketplaceDeals();
    const hasLiveProducts =
      deals.popularProducts.length > 0 || deals.topPriceDrops.length > 0;
    const response = hasLiveProducts
      ? { ...deals, sourceMode: 'live' }
      : {
          ...FALLBACK_DEALS,
          fetchedAt: new Date().toISOString(),
          sourceMode: 'fallback',
        };

    dealsCache = {
      data: response,
      expiresAt: now + CACHE_TTL_MS,
    };

    res.json(response);
  } catch (error) {
    res.json({
      ...FALLBACK_DEALS,
      fetchedAt: new Date().toISOString(),
      sourceMode: 'fallback',
      message: 'Showing fallback marketplace deals right now.',
    });
  }
};
