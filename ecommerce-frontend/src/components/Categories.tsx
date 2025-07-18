'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getCategories } from '@/services/categoryService';
import { ArrowRight, Sparkles } from 'lucide-react';

interface Category {
  _id: string;
  name: string;
  description: string;
  image?: string;
  active: boolean;
}

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await getCategories({ active: true, limit: 8 });
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
    const icons: { [key: string]: string } = {
      'electronics': '🔌',
      'clothing': '👕',
      'home and garden': '🏠',
      'sports': '⚽',
      'books': '📚',
      'health and beauty': '💄',
      'toys': '🧸',
      'food': '🍎',
      'fashion': '👟',
      'beauty': '💄',
      'health': '💊',
      'automotive': '🚗',
      'garden': '🌱',
      'outdoor': '🏕️',
      'market': '🛒'
    };
    return icons[categoryName.toLowerCase()] || '📦';
  };

  const getCategoryImage = (category: Category) => {
    // Backend'den gelen resim varsa onu kullan
    if (category.image) {
      // Eğer tam URL ise direkt kullan
      if (category.image.startsWith('http')) {
        return category.image;
      }
      // Eğer dosya adı ise backend URL'ine ekle
      const imageUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5050'}/uploads/categories/${category.image}`;
      return imageUrl;
    }
    
    // Eğer resim yoksa boş string döndür
    return '';
  };

  if (loading) {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Kategoriler yükleniyor...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-center">
          {error}
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
      {/* Header */}
      <div className="text-center mb-12 lg:mb-16">
        <div className="flex items-center justify-center mb-4">
          <Sparkles className="h-6 w-6 text-blue-600 mr-2" />
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
            Popüler Kategoriler
          </h2>
          <Sparkles className="h-6 w-6 text-blue-600 ml-2" />
        </div>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          İhtiyacınız olan her şeyi bulabileceğiniz geniş kategori koleksiyonumuzu keşfedin
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
        {categories.map((category) => (
          <Link
            key={category._id}
            href={`/categories/${category._id}`}
            className="group relative aspect-square rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-200 transform hover:-translate-y-1 hover:scale-102"
          >
            {/* Background Image */}
            <div className="relative w-full h-full">
              {getCategoryImage(category) ? (
                <>
                  <img
                    src={getCategoryImage(category)}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/70 transition-all duration-200 flex items-center justify-center">
                    {/* Category Name - Hidden by default, visible on hover */}
                    <div className="opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
                      <h3 className="text-white text-lg lg:text-xl font-bold text-center px-4">
                        {category.name}
                      </h3>
                      {/* Subtle description on hover */}
                      {category.description && (
                        <p className="text-white/80 text-sm text-center mt-2 px-4 line-clamp-2">
                          {category.description}
                        </p>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                /* Resim yoksa gradient arka plan */
                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <div className="text-center">
                    <span className="text-4xl mb-2 block">{getCategoryIcon(category.name)}</span>
                    <h3 className="text-white text-lg font-bold">{category.name}</h3>
                  </div>
                </div>
              )}
              
              {/* Subtle border effect */}
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-white/30 rounded-2xl transition-colors duration-200" />
            </div>
          </Link>
        ))}
      </div>

      {/* View All Categories Button */}
      <div className="text-center mt-12 lg:mt-16">
        <Link
          href="/categories"
          className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          <span>Tüm Kategorileri Gör</span>
          <ArrowRight className="h-5 w-5 ml-2" />
        </Link>
      </div>
    </section>
  );
}
