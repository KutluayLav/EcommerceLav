'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Product } from '@/types';
import ProductCard from '@/components/ProductCard';
import { Search, List, Grid3X3, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { getProductsByCategory, getCategory } from '@/services/categoryService';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { getUserWishlist, addToWishlist, removeFromWishlist } from '@/services/userService';
import { Heart } from 'lucide-react';

const sortOptions = [
  { label: 'En Yeni', value: 'latest' },
  { label: 'Fiyat: Düşükten Yükseğe', value: 'price-asc' },
  { label: 'Fiyat: Yüksekten Düşüğe', value: 'price-desc' },
  { label: 'Değerlendirme', value: 'rating' },
  { label: 'Popülerlik', value: 'popularity' },
];

export default function CategoryPage() {
  const { category } = useParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categoryData, setCategoryData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [totalProducts, setTotalProducts] = useState(0);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [wishlist, setWishlist] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!category) return;
      
      try {
        setLoading(true);
        
        // Kategori bilgilerini al
        const categoryResponse = await getCategory(category as string);
        setCategoryData(categoryResponse.data);
        
        // Kategoriye göre ürünleri al
        const params: any = {
          page: currentPage,
          limit: itemsPerPage,
        };

        if (searchTerm) {
          params.search = searchTerm;
        }

        if (sortBy !== 'latest') {
          params.sortBy = sortBy;
          params.sortOrder = sortBy === 'price-asc' ? 'asc' : 'desc';
        }

        const productsResponse = await getProductsByCategory(category as string, params);
        setProducts(productsResponse.data.products || []);
        setTotalProducts(productsResponse.data.total || 0);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Veriler yüklenemedi.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [category, currentPage, itemsPerPage, searchTerm, sortBy]);

  useEffect(() => {
    const fetchWishlist = async () => {
      if (isAuthenticated) {
        try {
          const response = await getUserWishlist();
          const ids = Array.isArray(response.data)
            ? response.data.map((item: any) => item._id || item)
            : [];
          setWishlist(ids);
        } catch (err) {
          setWishlist([]);
        }
      } else {
        setWishlist([]);
      }
    };
    fetchWishlist();
  }, [isAuthenticated]);

  const toggleWishlist = async (productId: string) => {
    if (!isAuthenticated) return;
    try {
      if (wishlist.includes(productId)) {
        await removeFromWishlist(productId);
        setWishlist(prev => prev.filter(id => id !== productId));
      } else {
        await addToWishlist(productId);
        setWishlist(prev => [...prev, productId]);
      }
    } catch (err) {}
  };

  // Calculate pagination
  const totalPages = Math.ceil(totalProducts / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalProducts);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  if (loading) {
    return (
      <main className="max-w-7xl mx-auto px-4 py-10 mt-20">
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Ürünler yükleniyor...</p>
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
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold mb-2 text-blackheading">
          {categoryData?.name || 'Kategori'}
        </h1>
        <p className="text-gray-600">
          {categoryData?.description || 'Bu kategorideki ürünleri keşfedin'}
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Ürün ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Sort */}
          <div className="flex gap-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            {/* View Mode Toggle */}
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-3 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
              >
                <Grid3X3 className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-3 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
              >
                <List className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results Info */}
      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-600">
          {totalProducts > 0 ? `${startIndex + 1} - ${endIndex} arası ${totalProducts} ürün` : 'Ürün bulunamadı'}
        </p>
        <select
          value={itemsPerPage}
          onChange={(e) => {
            setItemsPerPage(Number(e.target.value));
            setCurrentPage(1);
          }}
          className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm"
        >
          <option value={12}>Sayfa başına 12</option>
          <option value={24}>Sayfa başına 24</option>
          <option value={48}>Sayfa başına 48</option>
        </select>
      </div>

      {/* Ürün Listesi */}
      {products.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-gray-400 mb-4">
            <Search className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">Ürün bulunamadı</h3>
          <p className="text-gray-500">Arama kriterlerinizi değiştirmeyi deneyin</p>
        </div>
      ) : (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-4'}>
          {products.map((product) => (
            <ProductCard
              key={product._id || product.id}
              product={product}
              layout={viewMode}
              wishlist={wishlist}
              toggleWishlist={toggleWishlist}
              isAuthenticated={isAuthenticated}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-12">
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            
            {getPageNumbers().map((page, index) => (
              <button
                key={index}
                onClick={() => typeof page === 'number' && handlePageChange(page)}
                disabled={page === '...'}
                className={`px-3 py-2 border rounded-lg text-sm ${
                  page === currentPage
                    ? 'bg-primary text-white border-primary'
                    : page === '...'
                    ? 'border-gray-300 text-gray-500 cursor-default'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
