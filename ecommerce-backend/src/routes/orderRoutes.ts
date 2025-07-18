import express from 'express';
import { getOrders, getOrder, updateOrderStatus, createOrder } from '../controllers/orderController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { adminMiddleware } from '../middlewares/adminMiddleware';

const router = express.Router();

// Sipariş oluştur (müşteri için)
router.post('/', authMiddleware, createOrder);
// Siparişleri listele (admin için)
router.get('/', authMiddleware, adminMiddleware, getOrders);
// Tekil sipariş getir
router.get('/:id', authMiddleware, adminMiddleware, getOrder);
// Sipariş durumu güncelle
router.put('/:id/status', authMiddleware, adminMiddleware, updateOrderStatus);

export default router;
