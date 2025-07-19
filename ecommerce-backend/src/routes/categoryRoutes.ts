import express from 'express';
import {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategory,
  getCategories,
  uploadCategoryImage as uploadCategoryImageController,
  getProductsByCategory,
  bulkUpdateCategories
} from '../controllers/categoryController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { adminMiddleware } from '../middlewares/adminMiddleware';
import { uploadCategoryImage } from '../middlewares/uploadMiddleware';

const router = express.Router();

// Kategori ekle
router.post('/', authMiddleware, adminMiddleware, createCategory);
// Kategori güncelle
router.put('/:id', authMiddleware, adminMiddleware, updateCategory);
// Kategori sil
router.delete('/:id', authMiddleware, adminMiddleware, deleteCategory);
// Kategori görseli yükle
router.post('/upload', authMiddleware, adminMiddleware, uploadCategoryImage.single('image'), uploadCategoryImageController);
// Kategorileri listele
router.get('/', getCategories);
// Tekil kategori getir
router.get('/:id', getCategory);
// Kategoriye göre ürünler
router.get('/:id/products', getProductsByCategory);
// Toplu kategori güncelle
router.put('/bulk', authMiddleware, adminMiddleware, bulkUpdateCategories);

export default router;
