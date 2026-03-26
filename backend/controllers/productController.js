import Product from '../models/Product.js';
import User from '../models/User.js';
import { scrapePrice } from '../utils/scraper.js';
import { sendAlert } from '../utils/email.js';

const formatProduct = (product) => ({
  product_id: product._id,
  product_name: product.product_name,
  product_url: product.product_url,
  current_price: product.current_price,
  target_price: product.target_price,
  price_history: product.price_history,
});

export const getProducts = async (req, res) => {
  const products = await Product.find({ user: req.user.id });
  res.json(products.map(formatProduct));
};

export const createProduct = async (req, res) => {
  const product = await Product.create({
    ...req.body,
    user: req.user.id,
    price_history: [
      {
        price: req.body.current_price,
        checked_at: new Date(),
      },
    ],
  });

  res.json(formatProduct(product));
};

export const updateProduct = async (req, res) => {
  const product = await Product.findOne({
    _id: req.params.id,
    user: req.user.id,
  });

  if (!product) {
    return res.status(404).json({ message: 'Not found' });
  }

  if (product.current_price !== req.body.current_price) {
    product.price_history.push({
      price: req.body.current_price,
      checked_at: new Date(),
    });
  }

  product.product_name = req.body.product_name;
  product.current_price = req.body.current_price;
  product.target_price = req.body.target_price;

  await product.save();

  const user = await User.findById(req.user.id);

  if (product.current_price <= product.target_price) {
    await sendAlert(user.email, product);
  }

  res.json(formatProduct(product));
};

export const deleteProduct = async (req, res) => {
  await Product.findOneAndDelete({
    _id: req.params.id,
    user: req.user.id,
  });

  res.json({ message: 'Deleted' });
};

export const getProductById = async (req, res) => {
  const product = await Product.findOne({
    _id: req.params.id,
    user: req.user.id,
  });

  res.json(formatProduct(product));
};

export const refreshPrice = async (req, res) => {
  const product = await Product.findOne({
    _id: req.params.id,
    user: req.user.id,
  });

  if (!product) {
    return res.status(404).json({ message: 'Not found' });
  }

  const latestPrice = await scrapePrice(product.product_url);

  if (latestPrice) {
    product.current_price = latestPrice;

    product.price_history.push({
      price: latestPrice,
      checked_at: new Date(),
    });

    await product.save();
  }

  res.json(formatProduct(product));
};
