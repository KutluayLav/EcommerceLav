import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import cartReducer from '@/features/cart/cartSlice';
import authReducer from '@/features/auth/authSlice';
import reviewsReducer from '@/features/reviews/reviewsSlice';

// Client-side storage için güvenli storage
const createNoopStorage = () => {
  return {
    getItem(_key: string) {
      return Promise.resolve(null);
    },
    setItem(_key: string, value: any) {
      return Promise.resolve(value);
    },
    removeItem(_key: string) {
      return Promise.resolve();
    },
  };
};

const storage = typeof window !== 'undefined' ? require('redux-persist/lib/storage').default : createNoopStorage();

const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['user', 'isAuthenticated'], // Sadece bu alanları sakla
};

const cartPersistConfig = {
  key: 'cart',
  storage,
  whitelist: ['items'], // Sadece sepet öğelerini sakla
};

export const store = configureStore({
  reducer: {
    cart: persistReducer(cartPersistConfig, cartReducer),
    auth: persistReducer(authPersistConfig, authReducer),
    reviews: reviewsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;