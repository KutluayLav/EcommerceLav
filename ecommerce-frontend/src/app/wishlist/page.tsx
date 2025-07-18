'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import Link from 'next/link';
import { ArrowLeft, Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getUserWishlist, removeFromWishlist } from '@/services/userService';
import { Product } from '@/types';

export default function WishlistPage() {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const response = await getUserWishlist();
        setWishlistItems(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Favori ürünler yüklenemedi.');
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchWishlist();
    }
  }, [isAuthenticated]);

  // Auth kontrolü
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-lg p-6 sm:p-8 text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Erişim Reddedildi</h2>
          <p className="text-gray-600 mb-6 text-sm sm:text-base">Bu sayfayı görüntülemek için giriş yapmanız gerekiyor.</p>
          <Link 
            href="/auth/login" 
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md text-sm sm:text-base inline-block"
          >
            Giriş Yap
          </Link>
        </div>
      </div>
    );
  }

  const handleRemoveFromWishlist = async (productId: string) => {
    if (!productId) return;
    try {
      await removeFromWishlist(productId);
      setWishlistItems(prev => prev.filter(item => (item._id || item.id) !== productId));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ürün favorilerden çıkarılamadı.');
    }
  };

  const handleAddToCart = (productId: string) => {
    if (!productId) return;
    // TODO: Sepete ekleme işlemi
    console.log('Add to cart:', productId);
  };

  return (
    <main className="bg-gray-50 min-h-screen mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Favori ürünler yükleniyor...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}

        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center mb-4">
            <Link 
              href="/profile"
              className="flex items-center text-blue-600 hover:text-blue-700 mr-4"
            >
              <ArrowLeft className="h-5 w-5 mr-1" />
              <span className="text-sm font-medium">Profile'a Dön</span>
            </Link>
          </div>
          <div className="flex items-center space-x-3">
            <Heart className="h-8 w-8 text-red-600" />
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Favori Ürünlerim</h1>
          </div>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">
            {wishlistItems.length} ürün favorilerinizde
          </p>
        </div>

        {/* Wishlist Content */}
        {!loading && !error && wishlistItems.length > 0 ? (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Favori Ürünler</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {wishlistItems.map((product) => {
                const productId = product._id || product.id;
                const productName = product.name || product.title || 'Ürün';
                const productImage = product.images?.[0] || product.image || '/placeholder-product.jpg';
                
                return (
                  <div key={productId} className="group relative bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    {/* Product Image */}
                    <div className="aspect-square w-full overflow-hidden rounded-t-lg bg-gray-200">
                      <img
                        src={productImage}
                        alt={productName}
                        className="h-full w-full object-cover object-center group-hover:opacity-75 transition-opacity"
                      />
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => productId && handleRemoveFromWishlist(productId)}
                      className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow"
                      aria-label="Remove from wishlist"
                    >
                      <Trash2 className="h-4 w-4 text-gray-600 hover:text-red-600" />
                    </button>

                    {/* Product Info */}
                    <div className="p-4">
                      <h3 className="text-lg font-medium text-gray-900 truncate">
                        <Link href={`/products/${productId}`} className="hover:text-blue-600">
                          {productName}
                        </Link>
                      </h3>
                      
                      <div className="flex items-center mt-2">
                        <span className="text-xl font-bold text-gray-900">
                          ₺{product.price.toFixed(2)}
                        </span>
                        {product.rating && (
                          <div className="flex items-center ml-auto">
                            <span className="text-yellow-400">★</span>
                            <span className="text-sm text-gray-600 ml-1">{product.rating}</span>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex space-x-2 mt-4">
                        <button
                          onClick={() => productId && handleAddToCart(productId)}
                          className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Sepete Ekle
                        </button>
                        
                        <Link
                          href={`/products/${productId}`}
                          className="flex-1 bg-gray-100 text-gray-900 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors text-center"
                        >
                          Detayları Gör
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* Empty Wishlist */
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Favori listeniz boş</h3>
            <p className="text-gray-600 mb-6">Beğendiğiniz ürünleri favorilere ekleyerek burada görebilirsiniz.</p>
            <Link 
              href="/products"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium inline-block"
            >
              Ürünleri Keşfet
            </Link>
          </div>
        )}

        {/* Quick Actions */}
        {!loading && !error && wishlistItems.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Hızlı İşlemler</h3>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition-colors">
                Tümünü Sepete Ekle
              </button>
              <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 px-6 py-3 rounded-md font-medium transition-colors">
                Listeyi Paylaş
              </button>
              <button className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 px-6 py-3 rounded-md font-medium transition-colors">
                Listeyi Temizle
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
} 