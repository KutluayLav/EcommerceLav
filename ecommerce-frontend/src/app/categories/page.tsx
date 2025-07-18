'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getCategories } from '@/services/categoryService';

interface Category {
  _id: string;
  name: string;
  description: string;
  image?: string;
  active: boolean;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await getCategories({ active: true });
        setCategories(response.data.categories || []);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Kategoriler yüklenemedi.');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const getCategoryIcon = (categoryName: string) => {
    const name = categoryName.toLowerCase();
    
    // Ana kategori eşleştirmeleri
    if (name.includes('electronics') || name.includes('electronic')) return '🔌';
    if (name.includes('clothing') || name.includes('fashion') || name.includes('wear')) return '👕';
    if (name.includes('home') || name.includes('house')) return '🏠';
    if (name.includes('garden') || name.includes('outdoor')) return '🌱';
    if (name.includes('sports') || name.includes('fitness')) return '⚽';
    if (name.includes('books') || name.includes('book')) return '📚';
    if (name.includes('health') || name.includes('beauty')) return '💄';
    if (name.includes('toys') || name.includes('toy')) return '🧸';
    if (name.includes('food') || name.includes('beverage')) return '🍎';
    if (name.includes('automotive') || name.includes('car')) return '🚗';
    if (name.includes('market') || name.includes('grocery')) return '🛒';
    
    // Varsayılan ikon
    return '📦';
  };

  if (loading) {
    return (
      <main className="max-w-7xl mx-auto px-4 py-10 mt-20">
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Kategoriler yükleniyor...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="max-w-7xl mx-auto px-4 py-10 mt-20">
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          {error}
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-10 mt-20">
      <h1 className="text-4xl font-extrabold mb-10 text-blackheading">Kategoriler</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <Link
            key={category._id}
            href={`/categories/${category._id}`}
            className="bg-white border border-gray-200 hover:border-primary rounded-xl shadow-sm p-6 flex flex-col items-center text-center transition-all duration-300 hover:shadow-lg"
          >
            <span className="text-4xl mb-2">{getCategoryIcon(category.name)}</span>
            <h2 className="text-lg font-bold text-blackheading mb-2">{category.name}</h2>
            {category.description && (
              <p className="text-gray-600 text-sm line-clamp-2">{category.description}</p>
            )}
          </Link>
        ))}
      </div>
    </main>
  );
}
