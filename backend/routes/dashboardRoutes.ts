import express from 'express';
import { getDashboardData } from '../controllers/dashboardController';
import { optionalProtect } from '../middleware/authMiddleware';

const router = express.Router();

// GET /api/dashboard – public (enriched if authenticated)
router.get('/', optionalProtect, getDashboardData);

export default router;
