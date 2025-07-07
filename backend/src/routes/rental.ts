import { Router } from 'express';
import { body } from 'express-validator';
import { validate } from '../middleware/validation';
import * as rentalController from '../controllers/rentalController';

const router = Router();

router.post('/rent', [body('tokenId').isInt(), body('renter').isString(), body('duration').isInt(), validate], rentalController.rentOut);
router.post('/return', [body('tokenId').isInt(), validate], rentalController.returnToken);
router.post('/reclaim', [body('tokenId').isInt(), validate], rentalController.reclaimToken);

export default router; 