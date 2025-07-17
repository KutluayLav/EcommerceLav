'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import Link from 'next/link';
import { ArrowLeft, Package, Truck, CheckCircle } from 'lucide-react';

export default function OrdersPage() {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  // Auth kontrolü
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-lg p-6 sm:p-8 text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6 text-sm sm:text-base">You need to sign in to view this page.</p>
          <Link 
            href="/auth/login" 
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md text-sm sm:text-base inline-block"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  // Mock order data
  const orders = [
    {
      id: '12345',
      date: '2024-01-15',
      status: 'delivered',
      total: 299.99,
      items: ['Wireless Headphones', 'Smartphone Case'],
      trackingNumber: 'TR123456789'
    },
    {
      id: '12344',
      date: '2024-01-10',
      status: 'shipped',
      total: 1399.99,
      items: ['Laptop', 'Wireless Mouse'],
      trackingNumber: 'TR123456788'
    },
    {
      id: '12343',
      date: '2024-01-05',
      status: 'processing',
      total: 89.99,
      items: ['Fitness Tracker'],
      trackingNumber: null
    },
    {
      id: '12342',
      date: '2024-01-01',
      status: 'delivered',
      total: 199.99,
      items: ['Smartwatch', 'Charging Cable'],
      trackingNumber: 'TR123456787'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'shipped':
        return <Truck className="h-5 w-5 text-blue-600" />;
      case 'processing':
        return <Package className="h-5 w-5 text-yellow-600" />;
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
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Orders</h1>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">Track and manage your orders.</p>
        </div>

        {/* Orders List */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Order History</h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {orders.map((order) => (
              <div key={order.id} className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-2">
                      <h3 className="text-lg font-medium text-gray-900">Order #{order.id}</h3>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(order.status)}
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>Ordered on {new Date(order.date).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}</p>
                      <p>Items: {order.items.join(', ')}</p>
                      {order.trackingNumber && (
                        <p>Tracking Number: <span className="font-mono">{order.trackingNumber}</span></p>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-4 sm:mt-0 sm:ml-6 text-right">
                    <p className="text-lg font-medium text-gray-900">${order.total.toFixed(2)}</p>
                    <div className="flex flex-col sm:items-end space-y-2 mt-2">
                      <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                        View Details
                      </button>
                      {order.status === 'delivered' && (
                        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                          Write Review
                        </button>
                      )}
                      {order.trackingNumber && (
                        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                          Track Package
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Empty State (if no orders) */}
        {orders.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
            <p className="text-gray-600 mb-6">Start shopping to see your orders here.</p>
            <Link 
              href="/products"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium inline-block"
            >
              Browse Products
            </Link>
          </div>
        )}
      </div>
    </main>
  );
} 