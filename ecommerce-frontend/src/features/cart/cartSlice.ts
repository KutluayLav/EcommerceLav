import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { CartItem, CartResponse, getCart, addToCart as addToCartAPI, removeFromCart as removeFromCartAPI, updateCartItemQuantity as updateCartItemQuantityAPI, clearCart as clearCartAPI } from '@/services/cartService';
import { logout } from '@/features/auth/authSlice';

interface CartState {
  items: CartItem[];
  loading: boolean;
  error: string | null;
  total: number;
}

const initialState: CartState = {
  items: [],
  loading: false,
  error: null,
  total: 0,
};

// Async thunks
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getCart();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Sepet yüklenemedi');
    }
  }
);

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ productId, quantity }: { productId: string; quantity: number }, { rejectWithValue }) => {
    try {
      const response = await addToCartAPI(productId, quantity);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ürün sepete eklenemedi');
    }
  }
);

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (itemId: string, { rejectWithValue }) => {
    try {
      await removeFromCartAPI(itemId);
      return itemId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ürün sepetten çıkarılamadı');
    }
  }
);

export const updateQuantity = createAsyncThunk(
  'cart/updateQuantity',
  async ({ itemId, quantity }: { itemId: string; quantity: number }, { rejectWithValue }) => {
    try {
      const response = await updateCartItemQuantityAPI(itemId, quantity);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Miktar güncellenemedi');
    }
  }
);

export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async (_, { rejectWithValue }) => {
    try {
      await clearCartAPI();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Sepet temizlenemedi');
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch cart
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.total = action.payload.total;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Add to cart
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.total = action.payload.total;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Remove from cart
      .addCase(removeFromCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(item => item._id !== action.payload);
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Update quantity
      .addCase(updateQuantity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateQuantity.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.total = action.payload.total;
      })
      .addCase(updateQuantity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Clear cart
      .addCase(clearCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.loading = false;
        state.items = [];
        state.total = 0;
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Logout - sepeti temizle
      .addCase(logout, (state) => {
        state.items = [];
        state.total = 0;
        state.loading = false;
        state.error = null;
      });
  },
});

export const { clearError } = cartSlice.actions;
export default cartSlice.reducer;
