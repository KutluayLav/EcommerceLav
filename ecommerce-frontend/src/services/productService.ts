import api from './api';

// Tüm ürünleri getir
export const getProducts = (params?: {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
  featured?: boolean;
  popular?: boolean;
  newArrival?: boolean;
}) =>
  api.get('/products', { params });

// Tekil ürün getir
export const getProduct = (id: string) =>
  api.get(`/products/${id}`);



// Kategoriye göre ürünler
export const getProductsByCategory = (categoryId: string, params?: {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}) =>
  api.get(`/categories/${categoryId}/products`, { params });

// Öne çıkan ürünler
export const getFeaturedProducts = (limit: number = 3) =>
  api.get('/products', { params: { featured: true, limit } });

// Popüler ürünler
export const getPopularProducts = (limit: number = 3) =>
  api.get('/products', { params: { popular: true, limit } });

// Yeni gelen ürünler
export const getNewArrivalProducts = (limit: number = 3) =>
  api.get('/products', { params: { newArrival: true, limit } });

// Ürün için review ekle
export const addProductReview = (productId: string, data: { rating: number; comment: string }) =>
  api.post(`/products/${productId}/reviews`, data); 