import { Router } from 'express';
import { body } from 'express-validator';
import { validate } from '../middleware/validation';
import * as editionController from '../controllers/editionController';

const router = Router();

router.post('/register', [body('hashHex').isString(), body('metadataURI').isString(), body('amount').isInt(), validate], editionController.registerEdition);

export default router; 