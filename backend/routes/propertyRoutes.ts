import express from 'express';
import { getProperties, getPropertyById, getTopPicks, getDashboardStats } from '../controllers/propertyController';

const router = express.Router();

router.get('/', getProperties);
router.get('/top-picks', getTopPicks);
router.get('/stats', getDashboardStats);
router.get('/:id', getPropertyById);

export default router;
