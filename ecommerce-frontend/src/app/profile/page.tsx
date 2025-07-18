'use client';

import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { RootState } from '@/store';
import { UserBasicInfo } from '@/components/profile/UserBasicInfo';
import { ProfileSettingsSection } from '@/components/profile/ProfileSettingsSection';
import { AddressBook } from '@/components/profile/AddressBook';
import Link from 'next/link';
import { ArrowLeft, User, Settings, MapPin, Package, RefreshCw } from 'lucide-react';
import { getUserProfile, getUserOrders, getUserWishlist } from '@/services/userService';

export default function ProfilePage() {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [profileData, setProfileData] = useState({
    profile: null,
    orders: [],
    wishlist: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Profile verilerini yükle
  useEffect(() => {
    if (isAuthenticated && user) {
      loadProfileData();
    }
  }, [isAuthenticated, user]);

  const loadProfileData = async () => {
    setLoading(true);
    setError('');
    
    try {
      const [profileRes, ordersRes, wishlistRes] = await Promise.all([
        getUserProfile(),
        getUserOrders(),
        getUserWishlist()
      ]);

      setProfileData({
        profile: profileRes.data,
        orders: ordersRes.data || [],
        wishlist: wishlistRes.data || []
      });
    } catch (err: any) {
      console.error('Profile data loading error:', err);
      setError('Profil verileri yüklenirken hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

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

  // Loading durumu
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center px-4 py-8 sm:px-6 lg:px-8 mt-20">
        <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-lg p-6 sm:p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Profil Yükleniyor...</h2>
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
            onClick={loadProfileData}
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
        {/* Header */}
        <div className="mb-6 sm:mb-8 flex justify-between items-start">
          <div>
            <div className="flex items-center mb-4">
              <Link 
                href="/dashboard"
                className="flex items-center text-blue-600 hover:text-blue-700 mr-4"
              >
                <ArrowLeft className="h-5 w-5 mr-1" />
                <span className="text-sm font-medium">Dashboard'a Dön</span>
              </Link>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Profil Ayarları</h1>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">Hesap bilgilerinizi ve tercihlerinizi yönetin.</p>
          </div>
          <button
            onClick={loadProfileData}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md text-sm inline-flex items-center"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Yenile
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
                             <nav className="space-y-2">
                 <a href="#personal" className="flex items-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md">
                   <User className="h-5 w-5 mr-3" />
                   Kişisel Bilgiler
                 </a>
                 <a href="#settings" className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md">
                   <Settings className="h-5 w-5 mr-3" />
                   Hesap Ayarları
                 </a>
                 <Link href="/orders" className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md">
                   <Package className="h-5 w-5 mr-3" />
                   Sipariş Geçmişi
                 </Link>
                 <a href="#addresses" className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md">
                   <MapPin className="h-5 w-5 mr-3" />
                   Adres Defteri
                 </a>
               </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <section id="personal" className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Kişisel Bilgiler</h2>
                <p className="text-sm text-gray-600">Kişisel detaylarınızı ve iletişim bilgilerinizi güncelleyin.</p>
              </div>
              <div className="p-6">
                {profileData.profile ? (
                  <UserBasicInfo user={profileData.profile} />
                ) : (
                  <div className="text-center py-8">
                    <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Profil bilgileri yüklenemedi.</p>
                  </div>
                )}
              </div>
            </section>

            {/* Account Settings */}
            <section id="settings" className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Hesap Ayarları</h2>
                <p className="text-sm text-gray-600">Hesap tercihlerinizi ve bildirimlerinizi yönetin.</p>
              </div>
              <div className="p-6">
                <ProfileSettingsSection profileSettings={{
                  receiveNewsletter: false,
                  preferredLanguage: 'Türkçe'
                }} />
                
                {/* Password Change Section */}
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h3 className="text-base font-medium text-gray-900 mb-4">Şifre Değiştir</h3>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="current-password" className="block text-sm font-medium text-gray-700">
                        Mevcut Şifre
                      </label>
                      <input
                        type="password"
                        id="current-password"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">
                        Yeni Şifre
                      </label>
                      <input
                        type="password"
                        id="new-password"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                        Yeni Şifreyi Onayla
                      </label>
                      <input
                        type="password"
                        id="confirm-password"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <button
                      type="button"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                    >
                      Şifreyi Güncelle
                    </button>
                  </div>
                </div>

                {/* Account Deactivation */}
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h3 className="text-base font-medium text-gray-900 mb-2">Tehlikeli Bölge</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Hesabınızı sildiğinizde, geri dönüş yoktur. Lütfen emin olun.
                  </p>
                  <button
                    type="button"
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                  >
                    Hesabı Sil
                  </button>
                </div>
              </div>
            </section>

            {/* Order History Link */}
            <section className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Sipariş Geçmişi</h2>
                <p className="text-sm text-gray-600">Siparişlerinizi görüntüleyin ve takip edin.</p>
              </div>
              <div className="p-6">
                <div className="text-center">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">
                    {profileData.orders.length > 0 
                      ? `${profileData.orders.length} siparişiniz bulunuyor.`
                      : 'Henüz siparişiniz bulunmuyor.'
                    }
                  </p>
                  <Link 
                    href="/orders"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium inline-block"
                  >
                    Tüm Siparişleri Gör
                  </Link>
                </div>
              </div>
            </section>

            {/* Wishlist Link */}
            <section className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Favori Ürünler</h2>
                <p className="text-sm text-gray-600">Favori ürünlerinizi yönetin.</p>
              </div>
              <div className="p-6">
                <div className="text-center">
                  {profileData.wishlist.length > 0 ? (
                    <>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
                        {profileData.wishlist.slice(0, 6).map((product: any) => (
                          <div key={product._id} className="bg-gray-50 rounded-lg p-3">
                            <img
                              src={product.images?.[0] || '/placeholder-product.jpg'}
                              alt={product.name}
                              className="w-full h-16 object-cover rounded mb-2"
                            />
                            <p className="text-xs font-medium text-center truncate">{product.name}</p>
                            <p className="text-xs text-blue-600 font-semibold text-center">₺{product.price?.toFixed(2) || '0.00'}</p>
                          </div>
                        ))}
                      </div>
                      {profileData.wishlist.length > 6 && (
                        <p className="text-sm text-gray-600 mb-4">
                          ve {profileData.wishlist.length - 6} ürün daha...
                        </p>
                      )}
                    </>
                  ) : (
                    <div className="py-8">
                      <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-4">Henüz favori ürününüz bulunmuyor.</p>
                    </div>
                  )}
                  <Link 
                    href="/wishlist"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium inline-block"
                  >
                    Tüm Favorileri Gör
                  </Link>
                </div>
              </div>
            </section>

            {/* Address Book */}
            <section id="addresses" className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Adres Defteri</h2>
                <p className="text-sm text-gray-600">Teslimat ve fatura adreslerinizi yönetin.</p>
              </div>
              <div className="p-6">
                {profileData.profile && (profileData.profile as any).addresses ? (
                  <AddressBook 
                    addresses={(profileData.profile as any).addresses} 
                    onAddressChange={loadProfileData}
                  />
                ) : (
                  <div className="text-center py-8">
                    <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Adres bilgileri yüklenemedi.</p>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
