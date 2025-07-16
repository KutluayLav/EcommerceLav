'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { ShoppingBag, Heart, MapPin, Star } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  // Auth kontrolü - gerçek uygulamada middleware ile yapılacak
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

  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Dashboard Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">Welcome back, {user.name}! Here's your account overview.</p>
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
                    <p className="text-sm text-gray-600">Total Orders</p>
                    <p className="text-2xl font-semibold text-gray-900">12</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Heart className="h-8 w-8 text-red-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Wishlist Items</p>
                    <p className="text-2xl font-semibold text-gray-900">5</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Star className="h-8 w-8 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Reviews Written</p>
                    <p className="text-2xl font-semibold text-gray-900">8</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
                <Link href="/orders" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  View All
                </Link>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">Order #12345</p>
                      <p className="text-sm text-gray-600">Wireless Headphones, Smartphone Case</p>
                      <p className="text-xs text-gray-500">Ordered on Jan 15, 2024</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">$299.99</p>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Delivered
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">Order #12344</p>
                      <p className="text-sm text-gray-600">Laptop, Wireless Mouse</p>
                      <p className="text-xs text-gray-500">Ordered on Jan 10, 2024</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">$1,399.99</p>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Shipped
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between py-3">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">Order #12343</p>
                      <p className="text-sm text-gray-600">Fitness Tracker</p>
                      <p className="text-xs text-gray-500">Ordered on Jan 5, 2024</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">$89.99</p>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Processing
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Link 
                    href="/products"
                    className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                  >
                    <ShoppingBag className="h-6 w-6 text-blue-600 mr-3" />
                    <span className="font-medium text-gray-900">Browse Products</span>
                  </Link>
                  
                  <Link 
                    href="/orders"
                    className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                  >
                    <MapPin className="h-6 w-6 text-blue-600 mr-3" />
                    <span className="font-medium text-gray-900">Track Orders</span>
                  </Link>
                  
                  <Link 
                    href="/profile"
                    className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                  >
                    <Star className="h-6 w-6 text-blue-600 mr-3" />
                    <span className="font-medium text-gray-900">Account Settings</span>
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