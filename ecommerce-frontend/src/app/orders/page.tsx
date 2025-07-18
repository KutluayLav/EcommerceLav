'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import Link from 'next/link';
import { ArrowLeft, Package, Truck, CheckCircle, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getUserOrders } from '@/services/userService';
import { Order } from '@/types';

export default function OrdersPage() {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await getUserOrders();
        setOrders(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Siparişler yüklenemedi.');
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchOrders();
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'shipped':
        return <Truck className="h-5 w-5 text-blue-600" />;
      case 'confirmed':
        return <Package className="h-5 w-5 text-blue-600" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      default:
        return <Package className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'Teslim Edildi';
      case 'shipped':
        return 'Kargoda';
      case 'confirmed':
        return 'Onaylandı';
      case 'pending':
        return 'Beklemede';
      default:
        return status;
    }
  };

  return (
    <main className="bg-gray-50 min-h-screen mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center mb-4">
            <Link 
              href="/dashboard"
              className="flex items-center text-blue-600 hover:text-blue-700 mr-4"
            >
              <ArrowLeft className="h-5 w-5 mr-1" />
              <span className="text-sm font-medium">Back to Dashboard</span>
            </Link>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Siparişlerim</h1>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">Siparişlerinizi takip edin ve yönetin.</p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Siparişler yükleniyor...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}

        {/* Orders List */}
        {!loading && !error && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Sipariş Geçmişi</h2>
            </div>
            
            <div className="divide-y divide-gray-200">
              {orders.map((order) => (
                <div key={order._id} className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-2">
                        <h3 className="text-lg font-medium text-gray-900">Sipariş #{order._id.slice(-6)}</h3>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(order.status)}
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {getStatusText(order.status)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="space-y-1 text-sm text-gray-600">
                        <p>Sipariş tarihi: {new Date(order.createdAt).toLocaleDateString('tr-TR', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}</p>
                        <p>Ürünler: {order.items.map(item => `${item.product.name} (${item.quantity} adet)`).join(', ')}</p>
                        <p>Toplam: ₺{order.totalPrice.toFixed(2)}</p>
                        <p>Teslimat adresi: {order.shippingAddress.street}, {order.shippingAddress.city}</p>
                      </div>
                    </div>
                    
                    <div className="mt-4 sm:mt-0 sm:ml-6 text-right">
                      <p className="text-lg font-medium text-gray-900">₺{order.totalPrice.toFixed(2)}</p>
                      <div className="flex flex-col sm:items-end space-y-2 mt-2">
                        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                          Detayları Görüntüle
                        </button>
                        {order.status === 'delivered' && (
                          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                            Yorum Yaz
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State (if no orders) */}
        {!loading && !error && orders.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Henüz siparişiniz yok</h3>
            <p className="text-gray-600 mb-6">Alışverişe başlayarak siparişlerinizi burada görebilirsiniz.</p>
            <Link 
              href="/products"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium inline-block"
            >
              Ürünleri Keşfet
            </Link>
          </div>
        )}
      </div>
    </main>
  );
} 