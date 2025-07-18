import api from './api';

export interface OrderItem {
  product: {
    _id: string;
    name: string;
    price: number;
    images: string[];
  };
  quantity: number;
  price: number;
  variant?: {
    size?: string;
    color?: string;
  };
}

export interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  label?: string;
  phone?: string;
}

export interface Order {
  _id: string;
  user: string;
  items: OrderItem[];
  totalPrice: number;
  shippingAddress: ShippingAddress;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderRequest {
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
}

// Sipariş oluştur
export const createOrder = async (orderData: CreateOrderRequest): Promise<Order> => {
  const response = await api.post('/orders', orderData);
  return response.data;
};

// Kullanıcının siparişlerini getir
export const getUserOrders = async (): Promise<Order[]> => {
  const response = await api.get('/orders');
  return response.data;
};

// Sipariş detayını getir
export const getOrder = async (orderId: string): Promise<Order> => {
  const response = await api.get(`/orders/${orderId}`);
  return response.data;
};

// Kullanıcının adreslerini getir
export const getUserAddresses = async () => {
  const response = await api.get('/users/addresses');
  return { addresses: response.data };
};

// Yeni adres ekle
export const addAddress = async (addressData: ShippingAddress) => {
  const response = await api.post('/users/addresses', addressData);
  return response.data;
};

// Adres güncelle
export const updateAddress = async (addressId: string, addressData: ShippingAddress) => {
  const response = await api.put(`/users/addresses/${addressId}`, addressData);
  return response.data;
};

// Adres sil
export const deleteAddress = async (addressId: string) => {
  const response = await api.delete(`/users/addresses/${addressId}`);
  return response.data;
}; 