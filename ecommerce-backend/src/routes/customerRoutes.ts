import express from 'express';
import { getCustomers, getCustomer } from '../controllers/customerController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { adminMiddleware } from '../middlewares/adminMiddleware';

const router = express.Router();

// Müşterileri listele
router.get('/', authMiddleware, adminMiddleware, getCustomers);
// Tekil müşteri getir (detay)
router.get('/:id', authMiddleware, adminMiddleware, getCustomer);

export default router;
