import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '@/types';

interface CartItem extends Product {
  quantity: number;
}

interface CartState {
  items: CartItem[];
}

// Örnek cart verileri
const sampleCartItems: CartItem[] = [
  {
    id: 'fp1',
    title: 'Wireless Headphones',
    price: 199.99,
    originalPrice: 249.99,
    image: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=crop&w=400&q=80',
    category: 'electronics',
    tag: 'featured',
    rating: 4.6,
    popularity: 95,
    description: 'Premium wireless headphones with noise cancellation and 30-hour battery life.',
    quantity: 2,
  },
  {
    id: 'fp2',
    title: 'Smartphone',
    price: 699.99,
    originalPrice: 799.99,
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=400&q=80',
    category: 'electronics',
    tag: 'featured',
    rating: 4.8,
    popularity: 98,
    description: 'Latest smartphone with advanced camera system and powerful processor.',
    quantity: 1,
  },
  {
    id: 'na1',
    title: 'VR Headset',
    price: 299.99,
    image: 'https://images.unsplash.com/photo-1606813909289-1056b4d9a12b?auto=format&fit=crop&w=400&q=80',
    category: 'electronics',
    tag: 'new',
    rating: 4.4,
    popularity: 78,
    description: 'Immersive virtual reality headset for gaming and entertainment.',
    quantity: 1,
  },
];

const initialState: CartState = {
  items: sampleCartItems, // Örnek verilerle başlat
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<Product>) {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
    },
    removeFromCart(state, action: PayloadAction<string>) {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    updateQuantity(state, action: PayloadAction<{ id: string; quantity: number }>) {
      const item = state.items.find(item => item.id === action.payload.id);
      if (item) {
        item.quantity = action.payload.quantity;
      }
    },
    clearCart(state) {
      state.items = [];
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
