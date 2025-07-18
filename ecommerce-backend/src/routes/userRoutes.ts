import express from 'express';
import {
  register,
  login,
  verifyEmail,
  resetPassword,
  getProfile,
  updateProfile,
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  getWishlist,
  addWishlist,
  removeWishlist,
  getOrderHistory,
  getUserReviews,
  uploadAvatar
} from '../controllers/userController';
import { getUserOrders } from '../controllers/orderController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { uploadUserAvatar } from '../middlewares/uploadMiddleware';

const router = express.Router();

// Auth
router.post('/register', register);
router.post('/login', login);
router.get('/verify-email', verifyEmail);
router.post('/reset-password', resetPassword);

// Profil
router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, updateProfile);

// Profil resmi yükleme
router.post('/upload-avatar', authMiddleware, uploadUserAvatar.single('image'), uploadAvatar);

// Adresler
router.get('/addresses', authMiddleware, getAddresses);
router.post('/addresses', authMiddleware, addAddress);
router.put('/addresses/:addressId', authMiddleware, updateAddress);
router.delete('/addresses/:addressId', authMiddleware, deleteAddress);

// Wishlist
router.get('/wishlist', authMiddleware, getWishlist);
router.post('/wishlist', authMiddleware, addWishlist);
router.delete('/wishlist/:productId', authMiddleware, removeWishlist);

// Sipariş geçmişi
router.get('/orders', authMiddleware, getOrderHistory);

// Kullanıcı yorumları
router.get('/reviews', authMiddleware, getUserReviews);

export default router;
