import express from 'express';
import {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategory,
  getCategories,
  uploadCategoryImage,
  getProductsByCategory
} from '../controllers/categoryController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { adminMiddleware } from '../middlewares/adminMiddleware';
import { upload } from '../middlewares/uploadMiddleware';

const router = express.Router();

// Kategori ekle
router.post('/', authMiddleware, adminMiddleware, createCategory);
// Kategori güncelle
router.put('/:id', authMiddleware, adminMiddleware, updateCategory);
// Kategori sil
router.delete('/:id', authMiddleware, adminMiddleware, deleteCategory);
// Kategori görseli yükle
router.post('/upload', authMiddleware, adminMiddleware, upload.single('image'), uploadCategoryImage);
// Kategorileri listele
router.get('/', getCategories);
// Tekil kategori getir
router.get('/:id', getCategory);
// Kategoriye göre ürünler
router.get('/:id/products', getProductsByCategory);

export default router;
