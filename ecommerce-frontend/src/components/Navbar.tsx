'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ShoppingCart, Menu, X, UserCircle, LogOut, User, Settings, Search, Heart } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { logout, loginSuccess } from '@/features/auth/authSlice';
import { getProfile } from '@/services/authService';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const cartCount = useSelector((state: RootState) => state.cart.items.length);
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  const menuRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Component mount olduğunda set et
  useEffect(() => {
    setMounted(true);
  }, []);

  // Sayfa yüklendiğinde auth state'ini kontrol et
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (typeof window !== 'undefined') {
          const token = localStorage.getItem('token');
          if (token && !isAuthenticated) {
            const response = await getProfile();
            if (response.data && response.data.firstName) {
              dispatch(loginSuccess({
                id: response.data._id,
                name: response.data.firstName + ' ' + response.data.lastName,
                email: response.data.email,
                isEmailVerified: response.data.emailVerified || false,
                avatar: response.data.avatar || undefined
              }));
            }
          }
        }
      } catch (error) {
        // Token geçersizse localStorage'dan temizle
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
        }
      }
    };

    checkAuth();
  }, [dispatch, isAuthenticated]);

  const handleLogout = () => {
    dispatch(logout());
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      // Login sayfasına yönlendir
      window.location.href = '/auth/login';
    }
    setUserMenuOpen(false);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200' 
        : 'bg-white shadow-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="text-white font-bold text-lg">L</span>
            </div>
            <span className="font-extrabold text-xl lg:text-2xl text-blackheading group-hover:text-primary transition-colors">
              LavShop
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8 ml-12">
            <Link 
              href="/products" 
              className="text-gray-700 hover:text-primary font-medium transition-colors relative group"
            >
              Products
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
            </Link>
            <Link 
              href="/categories" 
              className="text-gray-700 hover:text-primary font-medium transition-colors relative group"
            >
              Categories
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
            </Link>
            <Link 
              href="/contact" 
              className="text-gray-700 hover:text-primary font-medium transition-colors relative group"
            >
              Contact
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
            </Link>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden lg:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="search"
                placeholder="Ürün ara..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all bg-gray-50 focus:bg-white"
              />
            </div>
          </div>

          {/* Right Icons */}
          <div className="flex items-center space-x-4 lg:space-x-6">
            {/* Cart - Always show */}
            <Link href="/cart" className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors group">
              <ShoppingCart className="h-5 w-5 ml-3 text-gray-600 group-hover:text-primary transition-colors" />
              {mounted && cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white rounded-full px-1.5 py-0.5 text-xs font-bold min-w-[20px] h-5 flex items-center justify-center animate-pulse">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Wishlist - Always show */}
            <Link href="/wishlist" className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors group">
              <Heart className="h-5 w-5 text-gray-600 group-hover:text-red-500 transition-colors" />
            </Link>

            {/* User Menu */}
            {mounted && (
              <>
                {isAuthenticated && user && user.name ? (
                  <div className="relative" ref={userMenuRef}>
                    <button
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none"
                    >
                      <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-md">
                        <span className="text-sm font-bold text-white">
                          {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                        </span>
                      </div>
                      <span className="hidden lg:block text-sm font-medium text-gray-700">{user.name || 'Kullanıcı'}</span>
                    </button>

                    {userMenuOpen && (
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl py-2 z-50 border border-gray-200">
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-sm font-semibold text-gray-900">{user.name || 'Kullanıcı'}</p>
                          <p className="text-xs text-gray-500">{user.email || 'email@example.com'}</p>
                        </div>
                        <Link 
                          href="/dashboard" 
                          className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <User className="mr-3 h-4 w-4" />
                          Dashboard
                        </Link>
                        <Link 
                          href="/profile" 
                          className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <Settings className="mr-3 h-4 w-4" />
                          Settings
                        </Link>
                        <hr className="my-1" />
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="mr-3 h-4 w-4" />
                          Sign Out
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="hidden lg:flex items-center space-x-3">
                    <Link 
                      href="/auth/login" 
                      className="text-sm font-medium text-gray-700 hover:text-primary transition-colors"
                    >
                      Sign In
                    </Link>
                    <Link 
                      href="/auth/signup" 
                      className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-md hover:shadow-lg"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </>
            )}

            {/* Mobile Menu Button - Always visible on mobile */}
            <button
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6 text-gray-600" />
              ) : (
                <Menu className="h-6 w-6 text-gray-600" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div ref={menuRef} className="lg:hidden bg-white border-t border-gray-200 shadow-xl max-h-[80vh] overflow-y-auto">
          <div className="px-4 py-4 space-y-3">

            {/* Mobile Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="search"
                placeholder="Ürün ara..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all bg-gray-50 focus:bg-white text-sm"
              />
            </div>

            {/* Mobile Navigation */}
            <nav className="space-y-1">
              <Link 
                href="/" 
                className="flex items-center px-3 py-2.5 rounded-lg hover:bg-gray-50 hover:text-primary font-medium transition-colors text-sm"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/products" 
                className="flex items-center px-3 py-2.5 rounded-lg hover:bg-gray-50 hover:text-primary font-medium transition-colors text-sm"
                onClick={() => setMobileMenuOpen(false)}
              >
                Products
              </Link>
              <Link 
                href="/categories" 
                className="flex items-center px-3 py-2.5 rounded-lg hover:bg-gray-50 hover:text-primary font-medium transition-colors text-sm"
                onClick={() => setMobileMenuOpen(false)}
              >
                Categories
              </Link>
              <Link 
                href="/contact" 
                className="flex items-center px-3 py-2.5 rounded-lg hover:bg-gray-50 hover:text-primary font-medium transition-colors text-sm"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>
              
            </nav>
            
            {/* Mobile Auth */}
            <div className="border-t border-gray-200 pt-3">
              {mounted && isAuthenticated && user ? (
                <div className="space-y-2">
                  {/* Compact User Info */}
                  <div className="flex items-center space-x-2 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                    <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-sm">
                      <span className="text-sm font-bold text-white">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm truncate">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                  </div>
                  
                  {/* Compact Menu Items */}
                  <div className="grid grid-cols-2 gap-2">
                    <Link 
                      href="/dashboard" 
                      className="flex items-center px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <User className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="font-medium">Dashboard</span>
                    </Link>
                    <Link 
                      href="/profile" 
                      className="flex items-center px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Settings className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="font-medium">Settings</span>
                    </Link>
                  </div>
                  
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center w-full px-3 py-2 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors text-sm"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    <span className="font-medium">Sign Out</span>
                  </button>
                </div>
              ) : mounted ? (
                <div className="space-y-2">
                  <Link 
                    href="/auth/login" 
                    className="block w-full px-3 py-2.5 text-center border-2 border-primary text-primary rounded-lg   font-semibold transition-colors text-sm"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link 
                    href="/auth/signup" 
                    className="block w-full px-3 py-2.5 text-center bg-primary text-white rounded-lg hover:bg-primary/90 font-semibold transition-colors shadow-md text-sm"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
