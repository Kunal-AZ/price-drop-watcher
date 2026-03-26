import axios from 'axios';
import * as cheerio from 'cheerio';

const REQUEST_HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
  'Accept-Language': 'en-IN,en;q=0.9',
};

const MAX_ITEMS_PER_SOURCE = 6;

const normalizePrice = (value = '') => {
  const numericValue = value.replace(/[^\d.]/g, '');
  return numericValue ? parseFloat(numericValue) : null;
};

const resolveUrl = (baseUrl, href = '') => {
  if (!href) return '';
  if (href.startsWith('http')) return href;
  return new URL(href, baseUrl).toString();
};

const getDiscountPercent = (currentPrice, originalPrice) => {
  if (!currentPrice || !originalPrice || originalPrice <= currentPrice) {
    return 0;
  }

  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
};

const extractAmazonProducts = ($, baseUrl) => {
  return $('[data-component-type="s-search-result"]')
    .map((_, element) => {
      const card = $(element);
      const linkNode = card.find('h2 a').first();
      const title =
        linkNode.find('span').first().text().trim() ||
        card.find('.a-size-base-plus').first().text().trim();

      const currentPrice = normalizePrice(
        card.find('.a-price .a-offscreen').first().text() ||
          card.find('.a-price-whole').first().text()
      );

      const originalPrice = normalizePrice(
        card.find('.a-text-price .a-offscreen').first().text()
      );

      const image =
        card.find('img.s-image').attr('src') ||
        card.find('img').first().attr('src') ||
        '';

      const url = resolveUrl(baseUrl, linkNode.attr('href'));

      if (!title || !currentPrice || !url) {
        return null;
      }

      return {
        id: `amazon-${Buffer.from(url).toString('base64').slice(0, 12)}`,
        title,
        url,
        image,
        source: 'Amazon',
        current_price: currentPrice,
        original_price: originalPrice,
        discount_percent: getDiscountPercent(currentPrice, originalPrice),
      };
    })
    .get()
    .filter(Boolean)
    .slice(0, MAX_ITEMS_PER_SOURCE);
};

const extractFlipkartProducts = ($, baseUrl) => {
  return $('a[href*="/p/"]')
    .map((_, element) => {
      const card = $(element);
      const title =
        card.find('div.KzDlHZ').first().text().trim() ||
        card.find('div._4rR01T').first().text().trim() ||
        card.attr('title') ||
        card.find('img').attr('alt') ||
        '';

      const currentPrice = normalizePrice(
        card.find('div.Nx9bqj').first().text() ||
          card.find('div._30jeq3').first().text()
      );

      const originalPrice = normalizePrice(
        card.find('div.yRaY8j').first().text() ||
          card.find('div._3I9_wc').first().text()
      );

      const image =
        card.find('img').attr('src') ||
        card.find('img').attr('data-src') ||
        '';

      const url = resolveUrl(baseUrl, card.attr('href'));

      if (!title || !currentPrice || !url) {
        return null;
      }

      return {
        id: `flipkart-${Buffer.from(url).toString('base64').slice(0, 12)}`,
        title,
        url,
        image,
        source: 'Flipkart',
        current_price: currentPrice,
        original_price: originalPrice,
        discount_percent: getDiscountPercent(currentPrice, originalPrice),
      };
    })
    .get()
    .filter(Boolean)
    .slice(0, MAX_ITEMS_PER_SOURCE);
};

const fetchHtml = async (url) => {
  const { data } = await axios.get(url, {
    headers: REQUEST_HEADERS,
    timeout: 15000,
  });

  return data;
};

const dedupeProducts = (products) => {
  const seen = new Set();

  return products.filter((product) => {
    if (seen.has(product.url)) {
      return false;
    }

    seen.add(product.url);
    return true;
  });
};

export const scrapePrice = async (url) => {
  try {
    const { data } = await axios.get(url, {
      headers: REQUEST_HEADERS,
    });

    const $ = cheerio.load(data);

    let price =
      $('.a-price-whole').first().text() ||   // Amazon
      $('._30jeq3').first().text();           // Flipkart

    price = price.replace(/[₹,]/g, '');

    return parseFloat(price);
  } catch {
    return null;
  }
};

export const scrapeMarketplaceDeals = async () => {
  const sources = [
    {
      url: 'https://www.amazon.in/s?k=best+sellers+electronics',
      parser: extractAmazonProducts,
    },
    {
      url: 'https://www.flipkart.com/search?q=best%20selling%20electronics',
      parser: extractFlipkartProducts,
    },
  ];

  const settledResults = await Promise.allSettled(
    sources.map(async ({ url, parser }) => {
      const html = await fetchHtml(url);
      const $ = cheerio.load(html);
      return parser($, url);
    })
  );

  const products = dedupeProducts(
    settledResults.flatMap((result) =>
      result.status === 'fulfilled' ? result.value : []
    )
  );

  const popularProducts = products.slice(0, 8);
  const topPriceDrops = [...products]
    .filter((product) => product.discount_percent > 0)
    .sort((a, b) => b.discount_percent - a.discount_percent)
    .slice(0, 8);

  return {
    popularProducts,
    topPriceDrops,
    fetchedAt: new Date().toISOString(),
  };
};
