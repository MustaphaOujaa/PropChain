import express from 'express';
import { getUserPortfolio, purchaseProperty, updateUserProfile, changePassword } from '../controllers/userController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/portfolio', protect, getUserPortfolio);
router.post('/purchase', protect, purchaseProperty);
router.put('/profile', protect, updateUserProfile);
router.put('/password', protect, changePassword);

export default router;
