import api from './api';

export interface CartItem {
  _id: string;
  product: {
    _id: string;
    name: string;
    description: string;
    price: number;
    images: string[];
    stock: number;
  };
  quantity: number;
  price: number;
}

export interface CartResponse {
  _id: string;
  user: string;
  items: CartItem[];
  total: number;
  createdAt: string;
  updatedAt: string;
}

// Sepeti getir
export const getCart = async (): Promise<CartResponse> => {
  const response = await api.get('/cart');
  return response.data;
};

// Sepete ürün ekle
export const addToCart = async (productId: string, quantity: number = 1) => {
  const response = await api.post('/cart/add', { productId, quantity });
  return response.data;
};

// Sepetten ürün çıkar
export const removeFromCart = async (itemId: string) => {
  const response = await api.delete(`/cart/items/${itemId}`);
  return response.data;
};

// Sepetteki ürün miktarını güncelle
export const updateCartItemQuantity = async (itemId: string, quantity: number) => {
  const response = await api.put(`/cart/items/${itemId}`, { quantity });
  return response.data;
};

// Sepeti temizle
export const clearCart = async () => {
  const response = await api.delete('/cart');
  return response.data;
}; 