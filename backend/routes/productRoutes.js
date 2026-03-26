import express from 'express';
import protect from '../middleware/authMiddleware.js';

import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductById,
  refreshPrice,
} from '../controllers/productController.js';

const router = express.Router();

router.use(protect);

router.get('/', getProducts);
router.post('/', createProduct);
router.get('/:id', getProductById);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);
router.put('/refresh/:id', refreshPrice);

export default router;