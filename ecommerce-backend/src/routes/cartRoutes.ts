import express from 'express';
import { getCart, addToCart, updateCartItem, removeFromCart, clearCart } from '../controllers/cartController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = express.Router();

// Sepeti getir
router.get('/', authMiddleware, getCart);

// Sepete ürün ekle
router.post('/add', authMiddleware, addToCart);

// Sepetteki ürün miktarını güncelle
router.put('/items/:itemId', authMiddleware, updateCartItem);

// Sepetten ürün çıkar
router.delete('/items/:itemId', authMiddleware, removeFromCart);

// Sepeti temizle
router.delete('/', authMiddleware, clearCart);

export default router;
