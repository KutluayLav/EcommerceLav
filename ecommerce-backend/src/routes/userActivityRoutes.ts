import express from 'express';
import { getRecentViews, addRecentView } from '../controllers/userActivityController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/recent', authMiddleware, getRecentViews);
router.post('/view', authMiddleware, addRecentView);

export default router;
