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
    let isMounted = true;
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await getCategories({ active: true, limit: 8 });
        if (isMounted) setCategories(response.data.categories || []);
      } catch (err: any) {
        if (isMounted) setError(err.response?.data?.message || 'Kategoriler yüklenemedi.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchCategories();
    return () => { isMounted = false; };
  }, []);

  // Skeleton Loader
  const skeletonArray = Array.from({ length: 8 });

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
        <div className="text-center mb-12 lg:mb-16">
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="h-6 w-6 text-blue-600 mr-2" />
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">Popüler Kategoriler</h2>
            <Sparkles className="h-6 w-6 text-blue-600 ml-2" />
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            İhtiyacınız olan her şeyi bulabileceğiniz geniş kategori koleksiyonumuzu keşfedin
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
          {skeletonArray.map((_, i) => (
            <div key={i} className="aspect-square rounded-2xl overflow-hidden shadow-lg bg-gray-100 animate-pulse flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full mb-4" />
              <div className="w-24 h-4 bg-gray-200 rounded mb-2" />
              <div className="w-16 h-3 bg-gray-200 rounded" />
            </div>
          ))}
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
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20">
      {/* Header */}
      <div className="text-center mb-10 md:mb-12 lg:mb-16">
        <div className="flex items-center justify-center mb-4">
          <Sparkles className="h-6 w-6 text-blue-600 mr-2" />
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">
            Popüler Kategoriler
          </h2>
          <Sparkles className="h-6 w-6 text-blue-600 ml-2" />
        </div>
        <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
          İhtiyacınız olan her şeyi bulabileceğiniz geniş kategori koleksiyonumuzu keşfedin
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 lg:gap-6">
        {categories.map((category) => (
          <Link
            key={category._id}
            href={`/categories/${category._id}`}
            className="group relative aspect-square rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {/* Background Image */}
            <div className="relative w-full h-full">
              {getCategoryImage(category) ? (
                <>
                  <img
                    src={getCategoryImage(category)}
                    alt={category.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    width={400}
                    height={400}
                  />
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/70 transition-all duration-200 flex items-center justify-center">
                    {/* Sadece yazı animasyonu, resme dokunma */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <h3 className="text-white text-lg lg:text-xl font-bold text-center px-4">
                        {category.name}
                      </h3>
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
      <div className="text-center mt-10 md:mt-12 lg:mt-16">
        <Link
          href="/categories"
          className="inline-flex items-center px-6 py-3 md:px-8 md:py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          <span>Tüm Kategorileri Gör</span>
          <ArrowRight className="h-5 w-5 ml-2" />
        </Link>
      </div>
    </section>
  );
}
