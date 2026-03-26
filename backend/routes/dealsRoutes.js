import express from 'express';
import { getHomepageDeals } from '../controllers/dealsController.js';

const router = express.Router();

router.get('/homepage', getHomepageDeals);

export default router;
