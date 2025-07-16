'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ShoppingCart, Menu, X, UserCircle } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const cartCount = useSelector((state: RootState) => state.cart.items.length);

  const menuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

          <Link href="/profile" className="hover:text-primary transition">
            <UserCircle size={28} className="text-darkgray" />
          </Link>

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
        <div ref={menuRef} className="md:hidden bg-bgwhite shadow-lg px-6 pb-6">
          <input
            type="search"
            placeholder="Search products..."
            className="w-full border border-darkgray rounded-md px-4 py-2 placeholder-darkgray focus:outline-none focus:ring-2 focus:ring-primary mb-4 transition"
          />
          <nav className="flex flex-col space-y-3">
            <Link href="/" className="hover:text-primary font-semibold transition">
              Home
            </Link>
            <Link href="/products" className="hover:text-primary font-semibold transition">
              Products
            </Link>
            <Link href="/categories" className="hover:text-primary font-semibold transition">
              Categories
            </Link>
            <Link href="/contact" className="hover:text-primary font-semibold transition">
              Contact
            </Link>
          </nav>
        </div>
      )}
    </nav>
  );
}
