import express from 'express';
import { getDashboardStats, adminLogin } from '../controllers/adminController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { adminMiddleware } from '../middlewares/adminMiddleware';

const router = express.Router();

router.post('/login', adminLogin);
router.get('/dashboard', authMiddleware, adminMiddleware, getDashboardStats);

export default router;
