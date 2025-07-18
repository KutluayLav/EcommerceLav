'use client';

import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { fetchCart, removeFromCart, updateQuantity, clearError } from '@/features/cart/cartSlice';
import Link from 'next/link';
import { Trash2, Minus, Plus, ShoppingBag, ArrowLeft, Truck, Shield, CreditCard, Loader2 } from 'lucide-react';

const TAX_RATE = 0.18;
const SHIPPING_FEE = 15;

export default function CartPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { items: cartItems, loading, error, total } = useSelector((state: RootState) => state.cart);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    dispatch(updateQuantity({ itemId, quantity: newQuantity }));
  };

  const handleRemoveItem = (itemId: string) => {
    dispatch(removeFromCart(itemId));
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const tax = subtotal * TAX_RATE;
  const finalTotal = subtotal + tax + (cartItems.length > 0 ? SHIPPING_FEE : 0);

  return (
    <main className="max-w-7xl mx-auto px-4 py-10 mt-20">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Link 
            href="/products"
            className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Alışverişe Devam Et</span>
          </Link>
        </div>
        <h1 className="text-4xl font-extrabold text-blackheading">Alışveriş Sepeti</h1>
        <p className="text-gray-600 mt-2">
          Sepetinizde {cartItems.length} {cartItems.length === 1 ? 'ürün' : 'ürün'} bulunuyor
        </p>
      </div>

      {cartItems.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-gray-400 mb-6">
            <ShoppingBag className="h-24 w-24 mx-auto" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-600 mb-4">Sepetiniz boş</h2>
          <p className="text-gray-500 mb-8">Henüz sepetinize ürün eklememişsiniz.</p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
          >
            <ShoppingBag className="h-5 w-5" />
            Alışverişe Başla
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <section className="flex-1">
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-blackheading">Sepet Ürünleri</h2>
              </div>
              
              <div className="divide-y divide-gray-200">
                {loading ? (
                  <div className="p-12 text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                    <p className="text-gray-600">Sepet yükleniyor...</p>
                  </div>
                ) : error ? (
                  <div className="p-6">
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-center">
                      {error}
                    </div>
                  </div>
                ) : (
                  cartItems.map((item) => (
                    <div
                      key={item._id}
                      className="p-6 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row gap-4">
                        {/* Product Image */}
                        <div className="relative w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0">
                          <img
                            src={item.product.images && item.product.images.length > 0 ? item.product.images[0] : '/placeholder-product.jpg'}
                            alt={item.product.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <div className="flex-1 min-w-0">
                              <h3 className="text-lg font-semibold text-blackheading truncate">
                                {item.product.name}
                              </h3>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-xl font-bold text-primary">
                                  ₺{item.price.toFixed(2)}
                                </span>
                              </div>
                            </div>
                            
                            {/* Remove Button */}
                            <button
                              onClick={() => handleRemoveItem(item._id)}
                              className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors"
                              title="Remove item"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center gap-3">
                              <span className="text-sm text-gray-600">Adet:</span>
                              <div className="flex items-center border border-gray-300 rounded-lg">
                                <button
                                  onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}
                                  className="p-2 hover:bg-gray-100 transition-colors"
                                  disabled={item.quantity <= 1}
                                >
                                  <Minus className="h-4 w-4" />
                                </button>
                                <span className="px-4 py-2 text-center min-w-[3rem] font-medium">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
                                  className="p-2 hover:bg-gray-100 transition-colors"
                                >
                                  <Plus className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                            
                            <div className="text-right">
                              <span className="text-lg font-semibold text-blackheading">
                                ₺{(item.price * item.quantity).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>

          {/* Order Summary */}
          <aside className="w-full lg:w-96">
            <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-6">
              <h3 className="text-xl font-semibold text-blackheading mb-6">Sipariş Özeti</h3>
              
              {/* Price Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Ara Toplam ({cartItems.length} ürün)</span>
                  <span>₺{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>KDV (%18)</span>
                  <span>₺{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Kargo</span>
                  <span>₺{SHIPPING_FEE.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between text-lg font-semibold text-blackheading">
                  <span>Toplam</span>
                  <span>₺{finalTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <Link
                href="/checkout"
                className="w-full bg-primary text-white py-4 rounded-lg text-center font-semibold hover:bg-primary/90 transition-colors mb-4 block"
              >
                Proceed to Checkout
              </Link>

              {/* Continue Shopping */}
              <Link
                href="/products"
                className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg text-center font-medium hover:bg-gray-50 transition-colors block"
              >
                Alışverişe Devam Et
              </Link>

              {/* Trust Indicators */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Truck className="h-5 w-5 text-green-500" />
                    <span>50₺ üzeri ücretsiz kargo</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Shield className="h-5 w-5 text-blue-500" />
                    <span>Güvenli ödeme</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <CreditCard className="h-5 w-5 text-purple-500" />
                    <span>Çoklu ödeme seçenekleri</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}
    </main>
  );
}
