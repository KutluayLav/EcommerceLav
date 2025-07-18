import api from './api';

// Tüm kategorileri getir
export const getCategories = (params?: {
  search?: string;
  active?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}) =>
  api.get('/categories', { params });

// Tekil kategori getir
export const getCategory = (id: string) =>
  api.get(`/categories/${id}`);

// Kategoriye göre ürünler
export const getProductsByCategory = (categoryId: string, params?: {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}) =>
  api.get(`/categories/${categoryId}/products`, { params }); 