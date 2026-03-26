import express from 'express';
import cors from 'cors';

import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import dealsRoutes from './routes/dealsRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/deals', dealsRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.use(async (_req, _res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    next(error);
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

app.use((error, _req, res, _next) => {
  console.error(error);

  if (res.headersSent) {
    return;
  }

  res.status(500).json({
    message: error.message || 'Internal server error',
  });
});

export default app;
