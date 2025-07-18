import api from './api';

// Kullanıcı profil bilgilerini getir
export const getUserProfile = () =>
  api.get('/users/profile');

// Kullanıcı sipariş geçmişini getir
export const getUserOrders = () =>
  api.get('/users/orders');

// Kullanıcı wishlist'ini getir
export const getUserWishlist = () =>
  api.get('/users/wishlist');

// Wishlist'e ürün ekle
export const addToWishlist = (productId: string) =>
  api.post('/users/wishlist', { productId });

// Wishlist'ten ürün çıkar
export const removeFromWishlist = (productId: string) =>
  api.delete(`/users/wishlist/${productId}`);

// Kullanıcı yorumlarını getir
export const getUserReviews = () =>
  api.get('/users/reviews');

// Adres ekle
export const addAddress = (addressData: {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}) =>
  api.post('/users/addresses', addressData);

// Adres güncelle
export const updateAddress = (addressId: string, addressData: {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}) =>
  api.put(`/users/addresses/${addressId}`, addressData);

// Adres sil
export const deleteAddress = (addressId: string) =>
  api.delete(`/users/addresses/${addressId}`);

// Dashboard istatistiklerini getir (şimdilik hesaplanmış veri döndür)
export const getDashboardStats = () =>
  Promise.resolve({ data: { totalOrders: 0, wishlistItems: 0, reviewsWritten: 0 } }); 