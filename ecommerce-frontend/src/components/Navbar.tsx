'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ShoppingCart, Menu, X, UserCircle, LogOut, User, Settings } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { logout } from '@/features/auth/authSlice';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const cartCount = useSelector((state: RootState) => state.cart.items.length);
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  const menuRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  
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

  const handleLogout = () => {
    dispatch(logout());
    setUserMenuOpen(false);
  };

  return (
    <nav className="bg-bgwhite text-darkgray shadow sticky top-0 z-50 border-b">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="font-extrabold text-2xl text-blackheading hover:text-primary transition">
          LavShop
        </Link>

        {/* Desktop Menü */}
        <div className="hidden md:flex flex-1 mx-8 items-center space-x-6">
          <input
            type="search"
            placeholder="Search products..."
            className="flex-grow border border-darkgray rounded-md px-4 py-2 placeholder-darkgray focus:outline-none focus:ring-2 focus:ring-primary transition"
          />

          <Link href="/" className="hover:text-primary transition font-medium">
            Home
          </Link>
          <Link href="/products" className="hover:text-primary transition font-medium">
            Products
          </Link>
          <Link href="/categories" className="hover:text-primary transition font-medium">
            Categories
          </Link>
          <Link href="/contact" className="hover:text-primary transition font-medium">
            Contact
          </Link>
        </div>

        {/* Sağ ikonlar */}
        <div className="flex items-center space-x-6">
          <Link href="/cart" className="relative hover:text-primary transition">
            <ShoppingCart size={24} className="text-darkgray" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-bgwhite rounded-full px-1 text-xs font-bold min-w-[18px] h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Kullanıcı Menüsü */}
          {isAuthenticated && user ? (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center space-x-2 hover:text-primary transition focus:outline-none"
              >
                <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-blue-600">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="hidden md:block text-sm font-medium">{user.name}</span>
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border">
                  <Link 
                    href="/dashboard" 
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <User className="mr-3 h-4 w-4" />
                    Dashboard
                  </Link>
                  <hr className="my-1" />
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <LogOut className="mr-3 h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden md:flex items-center space-x-4">
              <Link 
                href="/auth/login" 
                className="text-sm font-medium hover:text-primary transition"
              >
                Sign In
              </Link>
              <Link 
                href="/auth/signup" 
                className="bg-primary text-bgwhite px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition"
              >
                Sign Up
              </Link>
            </div>
          )}

          {/* Hamburger Menü - Mobil */}
          <button
            className="md:hidden hover:text-primary focus:outline-none transition"
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={28} className="text-darkgray" /> : <Menu size={28} className="text-darkgray" />}
          </button>
        </div>
      </div>

      {/* Mobil Menü */}
      {mobileMenuOpen && (
        <div ref={menuRef} className="md:hidden bg-bgwhite shadow-xl border-t border-gray-200">
          <div className="px-4 py-4 space-y-4">
            {/* Arama Kutusu */}
            <div className="relative">
              <input
                type="search"
                placeholder="Ürün ara..."
                className="w-full border border-gray-300 rounded-lg px-4 py-3 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition text-sm"
              />
            </div>

            {/* Navigasyon Linkleri */}
            <nav className="flex flex-col space-y-1">
              <Link 
                href="/" 
                className="px-3 py-3 rounded-lg hover:bg-gray-50 hover:text-primary font-medium transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Ana Sayfa
              </Link>
              <Link 
                href="/products" 
                className="px-3 py-3 rounded-lg hover:bg-gray-50 hover:text-primary font-medium transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Ürünler
              </Link>
              <Link 
                href="/categories" 
                className="px-3 py-3 rounded-lg hover:bg-gray-50 hover:text-primary font-medium transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Kategoriler
              </Link>
              <Link 
                href="/contact" 
                className="px-3 py-3 rounded-lg hover:bg-gray-50 hover:text-primary font-medium transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                İletişim
              </Link>
            </nav>
            
            {/* Mobil Auth Menüsü */}
            <div className="border-t border-gray-200 pt-4 mt-4">
              {isAuthenticated && user ? (
                <div className="space-y-2">
                  {/* Kullanıcı Profil Kartı */}
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                    <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-base font-bold text-blue-600">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                  </div>
                  
                  {/* Kullanıcı Menü Öğeleri */}
                  <Link 
                    href="/dashboard" 
                    className="flex items-center px-3 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User className="h-5 w-5 mr-3 text-gray-500" />
                    <span className="font-medium">Dashboard</span>
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center w-full px-3 py-3 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors"
                  >
                    <LogOut className="h-5 w-5 mr-3" />
                    <span className="font-medium">Sign Out</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Link 
                    href="/auth/login" 
                    className="block w-full px-4 py-3 text-center border border-primary text-primary rounded-lg hover:bg-primary hover:text-white font-semibold transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link 
                    href="/auth/signup" 
                    className="block w-full px-4 py-3 text-center bg-primary text-white rounded-lg hover:bg-red-700 font-semibold transition-colors shadow-sm"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
