'use client';

import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { RootState } from '@/store';
import { ShoppingBag, Heart, MapPin, Star, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { getUserProfile, getUserOrders, getUserWishlist, getUserReviews } from '@/services/userService';

export default function DashboardPage() {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [dashboardData, setDashboardData] = useState({
    profile: null,
    orders: [],
    wishlist: [],
    reviews: [],
    stats: {
      totalOrders: 0,
      wishlistItems: 0,
      reviewsWritten: 0
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Dashboard verilerini yükle
  useEffect(() => {
    if (isAuthenticated && user) {
      loadDashboardData();
    }
  }, [isAuthenticated, user]);

  const loadDashboardData = async () => {
    setLoading(true);
    setError('');
    
    try {
      const [profileRes, ordersRes, wishlistRes, reviewsRes] = await Promise.all([
        getUserProfile(),
        getUserOrders(),
        getUserWishlist(),
        getUserReviews()
      ]);

      setDashboardData({
        profile: profileRes.data,
        orders: ordersRes.data || [],
        wishlist: wishlistRes.data || [],
        reviews: reviewsRes.data || [],
        stats: {
          totalOrders: ordersRes.data?.length || 0,
          wishlistItems: wishlistRes.data?.length || 0,
          reviewsWritten: reviewsRes.data?.length || 0
        }
      });
    } catch (err: any) {
      console.error('Dashboard data loading error:', err);
      setError('Dashboard verileri yüklenirken hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  // Auth kontrolü - gerçek uygulamada middleware ile yapılacak
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

  // Loading durumu
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center px-4 py-8 sm:px-6 lg:px-8 mt-20">
        <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-lg p-6 sm:p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Dashboard Yükleniyor...</h2>
          <p className="text-gray-600">Lütfen bekleyin</p>
        </div>
      </div>
    );
  }

  // Hata durumu
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center px-4 py-8 sm:px-6 lg:px-8 mt-20">
        <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-lg p-6 sm:p-8 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Hata Oluştu</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadDashboardData}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md text-sm inline-flex items-center"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="bg-gray-50 min-h-screen mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Dashboard Header */}
        <div className="mb-6 sm:mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">Hoş geldin, {user.name}! İşte hesap özetin.</p>
          </div>
          <button
            onClick={loadDashboardData}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md text-sm inline-flex items-center"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Yenile
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* User Profile Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-xl font-bold text-blue-600">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-semibold text-gray-900 truncate">{user.name}</h2>
                  <p className="text-gray-600 text-sm truncate">{user.email}</p>
                  <div className="flex items-center mt-1">
                    <div className={`w-2 h-2 rounded-full mr-2 ${
                      user.isEmailVerified ? 'bg-green-500' : 'bg-yellow-500'
                    }`}></div>
                    <span className={`text-xs ${
                      user.isEmailVerified ? 'text-green-600' : 'text-yellow-600'
                    }`}>
                      {user.isEmailVerified ? 'Verified' : 'Unverified'}
                    </span>
                  </div>
                </div>
              </div>
              
              <Link 
                href="/profile"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-md transition-colors inline-block text-center"
              >
                Edit Profile
              </Link>
            </div>
          </div>

          {/* Main Dashboard Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <ShoppingBag className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Toplam Sipariş</p>
                    <p className="text-2xl font-semibold text-gray-900">{dashboardData.stats.totalOrders}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Heart className="h-8 w-8 text-red-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Wishlist Öğeleri</p>
                    <p className="text-2xl font-semibold text-gray-900">{dashboardData.stats.wishlistItems}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Star className="h-8 w-8 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Yazılan Yorumlar</p>
                    <p className="text-2xl font-semibold text-gray-900">{dashboardData.stats.reviewsWritten}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Son Siparişler</h3>
                <Link href="/orders" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  Tümünü Gör
                </Link>
              </div>
              <div className="p-6">
                {dashboardData.orders.length > 0 ? (
                  <div className="space-y-4">
                    {dashboardData.orders.slice(0, 3).map((order: any) => (
                      <div key={order._id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">Sipariş #{order._id.slice(-6)}</p>
                          <p className="text-sm text-gray-600">
                            {order.items?.map((item: any) => item.product?.name).join(', ') || 'Ürün bilgisi yok'}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(order.createdAt).toLocaleDateString('tr-TR')}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">₺{order.total?.toFixed(2) || '0.00'}</p>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                            order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                            order.status === 'confirmed' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {order.status === 'delivered' ? 'Teslim Edildi' :
                             order.status === 'shipped' ? 'Kargoda' :
                             order.status === 'confirmed' ? 'Onaylandı' :
                             order.status === 'pending' ? 'Beklemede' : order.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Henüz siparişiniz bulunmuyor.</p>
                    <Link 
                      href="/products" 
                      className="text-blue-600 hover:text-blue-700 font-medium mt-2 inline-block"
                    >
                      Alışverişe başla
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Hızlı İşlemler</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Link 
                    href="/products"
                    className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                  >
                    <ShoppingBag className="h-6 w-6 text-blue-600 mr-3" />
                    <span className="font-medium text-gray-900">Ürünleri Keşfet</span>
                  </Link>
                  
                  <Link 
                    href="/orders"
                    className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                  >
                    <MapPin className="h-6 w-6 text-blue-600 mr-3" />
                    <span className="font-medium text-gray-900">Siparişleri Takip Et</span>
                  </Link>
                  
                  <Link 
                    href="/profile"
                    className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                  >
                    <Star className="h-6 w-6 text-blue-600 mr-3" />
                    <span className="font-medium text-gray-900">Hesap Ayarları</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 