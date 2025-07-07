import { Router } from 'express';
import * as mediaController from '../controllers/mediaController';

const router = Router();

router.post('/register', mediaController.registerMedia);

export default router; 