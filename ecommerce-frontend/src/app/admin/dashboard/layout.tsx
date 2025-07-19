'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  FolderTree,
  Users,
  Settings,
  LogOut,
  Menu,
  X
} from 'lucide-react';

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const menuItems = [
    { title: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { title: 'Products', path: '/admin/dashboard/products', icon: Package },
    { title: 'Orders', path: '/admin/dashboard/orders', icon: ShoppingCart },
    { title: 'Categories', path: '/admin/dashboard/categories', icon: FolderTree },
    { title: 'Customers', path: '/admin/dashboard/customers', icon: Users },
    { title: 'Settings', path: '/admin/dashboard/settings', icon: Settings },
  ];

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Authentication kontrolü
  useEffect(() => {
    const checkAuth = () => {
      const adminToken = localStorage.getItem('adminToken');
      const token = localStorage.getItem('token');
      
      if (!adminToken && !token) {
        // Token yoksa direkt login'e yönlendir
        router.replace('/auth/login');
        return;
      }
      
      // Token varsa authenticated olarak işaretle
      setIsAuthenticated(true);
      setIsLoading(false);
    };

    checkAuth();
  }, [router]);

  const handleLogout = () => {
    // Cache temizle
    localStorage.clear();
    sessionStorage.clear();
    
    // Admin token'ı özellikle temizle
    localStorage.removeItem('adminToken');
    localStorage.removeItem('token');
    
    // Sidebar'ı kapat
    setIsSidebarOpen(false);
    
    // Login sayfasına yönlendir
    router.push('/auth/login');
  };

  // Loading durumunda boş sayfa göster
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Authenticated değilse boş sayfa göster (router zaten yönlendiriyor)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white shadow-sm p-4 flex items-center justify-between">
        <Link href="/admin" className="text-xl font-bold text-gray-800">
          Admin Panel
        </Link>
        <button onClick={toggleSidebar} className="p-2 hover:bg-gray-100 rounded-lg">
          {isSidebarOpen ? (
            <X className="h-6 w-6 text-gray-600" />
          ) : (
            <Menu className="h-6 w-6 text-gray-600" />
          )}
        </button>
      </div>

      <div className="flex">
        {/* Sidebar - Desktop and Mobile */}
        <aside className={`
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
          fixed lg:relative
          top-0 lg:top-auto
          left-0
          z-40
          w-64
          h-full
          bg-white
          shadow-sm
          transition-transform
          duration-300
          ease-in-out
          lg:min-h-screen
          p-4
          ${isSidebarOpen ? 'mt-0' : 'mt-16 lg:mt-0'}
        `}>
          <div className="mb-6 hidden lg:block">
            <Link href="/admin" className="text-xl font-bold text-gray-800">
              Admin Panel
            </Link>
          </div>
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg ${
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className={`h-5 w-5 mr-3 ${isActive ? 'text-blue-700' : 'text-gray-400'}`} />
                  {item.title}
                </Link>
              );
            })}
            <button 
              onClick={handleLogout}
              className="flex items-center px-4 py-3 text-sm font-medium rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900 w-full"
            >
              <LogOut className="h-5 w-5 mr-3 text-gray-400" />
              Logout
            </button>
          </nav>
        </aside>

        {/* Overlay for mobile sidebar */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8 w-full lg:w-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout; 