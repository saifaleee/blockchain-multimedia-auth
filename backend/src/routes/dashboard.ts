import { Router } from 'express';
import * as dashboardController from '../controllers/dashboardController';

const router = Router();

// Dashboard endpoints
router.get('/stats', dashboardController.getDashboardStats);
router.get('/transactions/user', dashboardController.getUserTransactions);

export default router; 