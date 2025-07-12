import express from 'express';
import { registerMedia } from '../controllers/mediaController';
import { listToken, purchaseToken } from '../controllers/marketplaceController';
import { getMarketplaceItems, getMarketplaceActivity } from '../controllers/marketplaceController';
import { getUserMedia, getUserTransactions, getDashboardStats } from '../controllers/dashboardController';
import multer from 'multer';

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
  },
});

// Media routes
router.post('/media/register', upload.single('file'), registerMedia);

// Marketplace routes
router.post('/marketplace/list', listToken);
router.post('/marketplace/purchase', purchaseToken);
router.get('/marketplace/items', getMarketplaceItems);
router.get('/marketplace/activity', getMarketplaceActivity);

// Dashboard routes
router.get('/media/user', getUserMedia);
router.get('/transactions/user', getUserTransactions);
router.get('/dashboard/stats', getDashboardStats);

export default router; 