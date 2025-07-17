'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { UserBasicInfo } from '@/components/profile/UserBasicInfo';
import { ProfileSettingsSection } from '@/components/profile/ProfileSettingsSection';
import { AddressBook } from '@/components/profile/AddressBook';
import { mockUser } from '@/data/user';
import Link from 'next/link';
import { ArrowLeft, User, Settings, MapPin, Package } from 'lucide-react';

export default function ProfilePage() {
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
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Profile Settings</h1>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">Manage your account information and preferences.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
                             <nav className="space-y-2">
                 <a href="#personal" className="flex items-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md">
                   <User className="h-5 w-5 mr-3" />
                   Personal Information
                 </a>
                 <a href="#settings" className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md">
                   <Settings className="h-5 w-5 mr-3" />
                   Account Settings
                 </a>
                 <Link href="/orders" className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md">
                   <Package className="h-5 w-5 mr-3" />
                   Order History
                 </Link>
                 <a href="#addresses" className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md">
                   <MapPin className="h-5 w-5 mr-3" />
                   Address Book
                 </a>
               </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <section id="personal" className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Personal Information</h2>
                <p className="text-sm text-gray-600">Update your personal details and contact information.</p>
              </div>
              <div className="p-6">
                <UserBasicInfo user={mockUser} />
              </div>
            </section>

            {/* Account Settings */}
            <section id="settings" className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Account Settings</h2>
                <p className="text-sm text-gray-600">Manage your account preferences and notifications.</p>
              </div>
              <div className="p-6">
                <ProfileSettingsSection profileSettings={mockUser.profileSettings} />
                
                {/* Password Change Section */}
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h3 className="text-base font-medium text-gray-900 mb-4">Change Password</h3>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="current-password" className="block text-sm font-medium text-gray-700">
                        Current Password
                      </label>
                      <input
                        type="password"
                        id="current-password"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">
                        New Password
                      </label>
                      <input
                        type="password"
                        id="new-password"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                        Confirm New Password
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
                      Update Password
                    </button>
                  </div>
                </div>

                {/* Account Deactivation */}
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h3 className="text-base font-medium text-gray-900 mb-2">Danger Zone</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Once you delete your account, there is no going back. Please be certain.
                  </p>
                  <button
                    type="button"
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            </section>

            {/* Order History Link */}
            <section className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Order History</h2>
                <p className="text-sm text-gray-600">View and track your orders.</p>
              </div>
              <div className="p-6">
                <div className="text-center">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">View your complete order history and track packages.</p>
                  <Link 
                    href="/orders"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium inline-block"
                  >
                    View All Orders
                  </Link>
                </div>
              </div>
            </section>

            {/* Wishlist Link */}
            <section className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Wishlist</h2>
                <p className="text-sm text-gray-600">Manage your favorite products.</p>
              </div>
              <div className="p-6">
                <div className="text-center">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
                    {mockUser.wishlist?.slice(0, 6).map((product) => (
                      <div key={product.id} className="bg-gray-50 rounded-lg p-3">
                        <img
                          src={product.image}
                          alt={product.title}
                          className="w-full h-16 object-cover rounded mb-2"
                        />
                        <p className="text-xs font-medium text-center truncate">{product.title}</p>
                        <p className="text-xs text-blue-600 font-semibold text-center">${product.price.toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                  {mockUser.wishlist && mockUser.wishlist.length > 6 && (
                    <p className="text-sm text-gray-600 mb-4">
                      and {mockUser.wishlist.length - 6} more items...
                    </p>
                  )}
                  <Link 
                    href="/wishlist"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium inline-block"
                  >
                    View Full Wishlist
                  </Link>
                </div>
              </div>
            </section>

            {/* Address Book */}
            <section id="addresses" className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Address Book</h2>
                <p className="text-sm text-gray-600">Manage your shipping and billing addresses.</p>
              </div>
              <div className="p-6">
                <AddressBook addresses={mockUser.addresses} />
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
