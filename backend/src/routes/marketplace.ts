import { Router } from 'express';
import { body } from 'express-validator';
import { validate } from '../middleware/validation';
import * as mpController from '../controllers/marketplaceController';

const router = Router();

router.post('/list', [body('tokenId').isInt(), body('priceWei').isString(), validate], mpController.listToken);
router.post('/purchase', [body('tokenId').isInt(), body('valueWei').isString(), validate], mpController.purchaseToken);
router.get('/items', mpController.getMarketplaceItems);
router.get('/activity', mpController.getMarketplaceActivity);

export default router; 