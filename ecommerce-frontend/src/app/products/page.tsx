'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Product } from '@/types';
import { Search, Filter, Heart, Star, ChevronLeft, ChevronRight, Grid, List } from 'lucide-react';
import { getProducts } from '@/services/productService';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { addToWishlist, removeFromWishlist } from '@/services/userService';

const tabs = [
  { label: 'Tümü', value: 'all' },
  { label: 'Öne Çıkanlar', value: 'featured' },
  { label: 'Yeni Gelenler', value: 'new' },
  { label: 'Popüler', value: 'popular' },
];

const sortOptions = [
  { label: 'En Yeni', value: 'latest' },
  { label: 'Fiyat: Düşükten Yükseğe', value: 'price-asc' },
  { label: 'Fiyat: Yüksekten Düşüğe', value: 'price-desc' },
  { label: 'Değerlendirme', value: 'rating' },
  { label: 'Popülerlik', value: 'popularity' },
];

export default function ProductsPage() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [totalProducts, setTotalProducts] = useState(0);
  const [wishlist, setWishlist] = useState<string[]>([]);

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        let response;

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

        // Tab'a göre farklı API çağrıları
        switch (selectedCategory) {
          case 'featured':
            params.featured = true;
            response = await getProducts(params);
            setProducts(response.data.products || []);
            setTotalProducts(response.data.total || 0);
            break;
          case 'new':
            params.newArrival = true;
            response = await getProducts(params);
            setProducts(response.data.products || []);
            setTotalProducts(response.data.total || 0);
            break;
          case 'popular':
            params.popular = true;
            response = await getProducts(params);
            setProducts(response.data.products || []);
            setTotalProducts(response.data.total || 0);
            break;
          default:
            // 'all' veya kategori seçimi
            if (selectedCategory !== 'all') {
              params.category = selectedCategory;
            }
            response = await getProducts(params);
            setProducts(response.data.products || []);
            setTotalProducts(response.data.total || 0);
            break;
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Ürünler yüklenemedi.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage, itemsPerPage, searchTerm, selectedCategory, sortBy]);

  // Calculate pagination
  const totalPages = Math.ceil(totalProducts / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalProducts);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleWishlist = async (productId: string) => {
    if (!isAuthenticated) {
      // TODO: Login modal göster
      return;
    }

    try {
      if (wishlist.includes(productId)) {
        await removeFromWishlist(productId);
        setWishlist(prev => prev.filter(id => id !== productId));
      } else {
        await addToWishlist(productId);
        setWishlist(prev => [...prev, productId]);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Wishlist işlemi başarısız.');
    }
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

  return (
    <main className="max-w-7xl mx-auto px-4 py-10 mt-20">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold mb-2 text-blackheading">Ürünler</h1>
        <p className="text-gray-600">Harika ürün koleksiyonumuzu keşfedin</p>
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
                <Grid className="h-5 w-5" />
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

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-3 mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setSelectedCategory(tab.value)}
            className={`px-6 py-3 rounded-full border text-sm font-medium transition-all duration-200 ${
              selectedCategory === tab.value
                ? 'bg-primary text-white border-primary shadow-lg'
                : 'text-darkgray border-gray-300 hover:bg-gray-100 hover:border-gray-400'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Ürünler yükleniyor...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-6">
          {error}
        </div>
      )}

      {/* Results Info */}
      {!loading && !error && (
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
      )}

      {/* Product Grid/List */}
      {!loading && !error && products.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-gray-400 mb-4">
            <Search className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">Ürün bulunamadı</h3>
          <p className="text-gray-500">Arama kriterlerinizi değiştirmeyi deneyin</p>
        </div>
      ) : (
        <div className={`${
          viewMode === 'grid' 
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
            : 'space-y-4'
        }`}>
          {products.map((product) => {
            const productId = product._id || product.id;
            const productName = product.name || product.title || 'Ürün';
            const productImage = product.images?.[0] || product.image || '/placeholder-product.jpg';
            
            return (
              <div
                key={productId}
                className={`bg-white rounded-xl border border-gray-200 hover:shadow-xl transition-all duration-300 overflow-hidden group ${
                  viewMode === 'list' ? 'flex' : ''
                }`}
              >
                {/* Product Image */}
                <div className={`relative ${viewMode === 'list' ? 'w-48 h-48' : 'h-64'}`}>
                  <Link href={`/products/${productId}`}>
                    <img
                      src={productImage}
                      alt={productName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </Link>
                  
                  {/* Wishlist Button */}
                  <button
                    onClick={() => productId && toggleWishlist(productId)}
                    className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 ${
                      productId && wishlist.includes(productId)
                        ? 'bg-red-500 text-white'
                        : 'bg-white text-gray-400 hover:text-red-500 hover:bg-red-50'
                    }`}
                  >
                    <Heart className={`h-5 w-5 ${productId && wishlist.includes(productId) ? 'fill-current' : ''}`} />
                  </button>

                  {/* Badge */}
                  {product.featured && (
                    <span className="absolute top-3 left-3 px-2 py-1 bg-primary text-white text-xs font-medium rounded-full">
                      Öne Çıkan
                    </span>
                  )}
                </div>

                {/* Product Info */}
                <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                  <Link href={`/products/${productId}`} className="block">
                    <h3 className="text-lg font-semibold text-blackheading mb-2 group-hover:text-primary transition-colors">
                      {productName}
                    </h3>
                    
                    {product.description && (
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {product.description}
                      </p>
                    )}

                    {/* Rating */}
                    {product.rating && (
                      <div className="flex items-center mb-3">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < Math.floor(product.rating!)
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-500 ml-2">
                          ({product.rating})
                        </span>
                      </div>
                    )}

                    {/* Price */}
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-bold text-primary">
                          ₺{product.price.toFixed(2)}
                        </span>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <span className="text-sm text-gray-500 line-through ml-2">
                            ₺{product.originalPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                      
                      {/* Add to Cart Button */}
                      <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium">
                        Sepete Ekle
                      </button>
                    </div>
                  </Link>
                </div>
              </div>
            );
          })}
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
