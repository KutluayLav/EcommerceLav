import express from 'express';
import {
  createProduct,
  updateProduct,
  deleteProduct,
  getProduct,
  getProducts,
  uploadProductImage as uploadProductImageController,
  bulkUpdateProducts
} from '../controllers/productController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { adminMiddleware } from '../middlewares/adminMiddleware';
import { uploadProductImage } from '../middlewares/uploadMiddleware';
import reviewsRouter from './products/reviews';

const router = express.Router();

// Ürün ekle
router.post('/', authMiddleware, adminMiddleware, createProduct);
// Ürün güncelle
router.put('/:id', authMiddleware, adminMiddleware, updateProduct);
// Ürün sil
router.delete('/:id', authMiddleware, adminMiddleware, deleteProduct);
// Ürün görseli yükle
router.post('/upload', authMiddleware, adminMiddleware, uploadProductImage.single('image'), uploadProductImageController);
// Çoklu ürün aktif/pasif yap
router.put('/bulk', authMiddleware, adminMiddleware, bulkUpdateProducts);
// Ürünleri listele
router.get('/', getProducts);
// Tekil ürün getir
router.get('/:id', getProduct);
// Ürün yorumları
router.use('/:id/reviews', reviewsRouter);

export default router;
