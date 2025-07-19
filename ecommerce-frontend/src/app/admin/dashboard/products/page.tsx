'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Plus, Search, Filter, MoreVertical, Edit, Trash, Eye, ChevronLeft, ChevronRight, X } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import axios from 'axios';

const ProductsPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [openActionMenu, setOpenActionMenu] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const actionMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (actionMenuRef.current && !actionMenuRef.current.contains(event.target as Node)) {
        setOpenActionMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:5050/api/categories');
        setCategories(response.data.categories || []);
      } catch (err) {
        console.error('Kategoriler yüklenemedi:', err);
      }
    };
    fetchCategories();
  }, []);

  // URL'den kategori parametresini al ve değişiklikleri takip et
  useEffect(() => {
    const categoryFromUrl = searchParams.get('category');
    if (categoryFromUrl && categoryFromUrl !== selectedCategory) {
      // 0.2 saniye sonra kategoriyi set et
      setTimeout(() => {
        setSelectedCategory(categoryFromUrl);
        setCurrentPage(1);
        setLoading(true); // Tabloyu yenilemek için loading göster
      }, 200);
    }
  }, [searchParams, selectedCategory]);

  // Ürünleri çek
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError('');
      try {
        const params: any = {
          page: currentPage,
          limit: itemsPerPage
        };
        if (searchTerm) params.search = searchTerm;
        if (selectedCategory) params.category = selectedCategory;
        
        const response = await axios.get('http://localhost:5050/api/products', { params });
        setProducts(response.data.products);
        setTotal(response.data.total);
      } catch (err: any) {
        setError('Ürünler alınamadı.');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [currentPage, itemsPerPage, searchTerm]);

  // selectedCategory değiştiğinde ürünleri yeniden çek
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError('');
      try {
        const params: any = {
          page: 1, // Kategori değiştiğinde ilk sayfaya dön
          limit: itemsPerPage
        };
        if (searchTerm) params.search = searchTerm;
        if (selectedCategory) params.category = selectedCategory;
        
        // Kısa bir gecikme ekle (loading animasyonunu görmek için)
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const response = await axios.get('http://localhost:5050/api/products', { params });
        
        setProducts(response.data.products);
        setTotal(response.data.total);
        setCurrentPage(1);
      } catch (err: any) {
        setError('Ürünler alınamadı.');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [selectedCategory, searchTerm, itemsPerPage]);

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat._id === categoryId);
    return category ? category.name : categoryId;
  };

  const getStatusDisplay = (status: string | null) => {
    if (!status || status === 'active') return 'Active';
    if (status === 'draft') return 'Draft';
    if (status === 'inactive') return 'Inactive';
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const getStatusClass = (status: string | null) => {
    const displayStatus = getStatusDisplay(status);
    if (displayStatus === 'Active') return 'bg-green-100 text-green-800';
    if (displayStatus === 'Draft') return 'bg-yellow-100 text-yellow-800';
    if (displayStatus === 'Inactive') return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-800';
  };

  const totalPages = Math.ceil(total / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = products;

  const toggleProductSelection = (productId: string) => {
    setSelectedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const toggleAllProducts = () => {
    const currentProductIds = currentProducts.map(p => p._id || p.id);
    setSelectedProducts(prev =>
      prev.length === currentProductIds.length
        ? prev.filter(id => !currentProductIds.includes(id))
        : [...prev.filter(id => !currentProductIds.includes(id)), ...currentProductIds]
    );
  };

  const toggleActionMenu = (productId: string) => {
    setOpenActionMenu(openActionMenu === productId ? null : productId);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Bu ürünü silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.')) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        alert('Admin token bulunamadı. Lütfen tekrar giriş yapın.');
        return;
      }

      await axios.delete(`http://localhost:5050/api/products/${productId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Ürünü listeden kaldır
      setProducts(prev => prev.filter(p => p._id !== productId));
      setSelectedProducts(prev => prev.filter(id => id !== productId));
      setOpenActionMenu(null);
      
      alert('Ürün başarıyla silindi.');
    } catch (error: any) {
      console.error('Ürün silinirken hata:', error);
      alert(error.response?.data?.message || 'Ürün silinirken bir hata oluştu.');
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedProducts.length === 0) return;
    
    if (!confirm(`${selectedProducts.length} ürünü silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`)) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        alert('Admin token bulunamadı. Lütfen tekrar giriş yapın.');
        return;
      }

      // Her ürünü tek tek sil
      for (const productId of selectedProducts) {
        await axios.delete(`http://localhost:5050/api/products/${productId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      }

      // Silinen ürünleri listeden kaldır
      setProducts(prev => prev.filter(p => !selectedProducts.includes(p._id)));
      setSelectedProducts([]);
      
      alert(`${selectedProducts.length} ürün başarıyla silindi.`);
    } catch (error: any) {
      console.error('Ürünler silinirken hata:', error);
      alert(error.response?.data?.message || 'Ürünler silinirken bir hata oluştu.');
    }
  };

  const handleStatusChangeSelected = async (newStatus: string) => {
    if (selectedProducts.length === 0 || !newStatus) return;
    
    if (!confirm(`${selectedProducts.length} ürünün durumunu "${newStatus}" olarak güncellemek istediğinizden emin misiniz?`)) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        alert('Admin token bulunamadı. Lütfen tekrar giriş yapın.');
        return;
      }

      await axios.put(`http://localhost:5050/api/products/bulk`, {
        productIds: selectedProducts,
        status: newStatus
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Ürünlerin durumunu güncelle
      setProducts(prev => prev.map(p => 
        selectedProducts.includes(p._id) ? { ...p, status: newStatus } : p
      ));
      setSelectedProducts([]);
      
      alert(`${selectedProducts.length} ürünün durumu başarıyla güncellendi.`);
    } catch (error: any) {
      console.error('Ürün durumları güncellenirken hata:', error);
      alert(error.response?.data?.message || 'Ürün durumları güncellenirken bir hata oluştu.');
    }
  };

  const clearCategoryFilter = () => {
    setSelectedCategory('');
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.delete('category');
    router.push(`/admin/dashboard/products?${newSearchParams.toString()}`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setOpenActionMenu(null);
  };

  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1);
    setOpenActionMenu(null);
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

  const getSelectedCategoryName = () => {
    if (!selectedCategory) return null;
    const category = categories.find(cat => cat._id === selectedCategory);
    return category ? category.name : selectedCategory;
  };

  return (
    <div className="space-y-6">
      {/* Header with Bulk Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">Products</h1>
          {selectedCategory && (
            <div className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-lg">
              <span className="text-sm text-blue-800">
                Category: {getSelectedCategoryName()}
              </span>
              <button
                onClick={clearCategoryFilter}
                className="text-blue-600 hover:text-blue-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          {selectedProducts.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-2 bg-blue-50 p-3 rounded-lg border border-blue-200 w-full sm:w-auto">
              <div className="flex items-center justify-between sm:justify-start gap-3">
                <span className="text-sm font-medium text-blue-800">
                  {selectedProducts.length} product{selectedProducts.length > 1 ? 's' : ''} selected
                </span>
                <button
                  onClick={() => setSelectedProducts([])}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  Clear
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleDeleteSelected}
                  className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 flex items-center"
                >
                  <Trash className="h-4 w-4 mr-1" />
                  Delete Selected
                </button>
                <select
                  onChange={(e) => e.target.value && handleStatusChangeSelected(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded text-sm bg-white hover:bg-gray-50"
                  defaultValue=""
                >
                  <option value="" disabled>Update Status</option>
                  <option value="active">Mark as Active</option>
                  <option value="inactive">Mark as Inactive</option>
                </select>
              </div>
            </div>
          )}
          <Link href="/admin/dashboard/products/add" className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center hover:bg-blue-700">
            <Plus className="h-5 w-5 mr-2" />
            Add Product
          </Link>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col gap-4">
        <div className="w-full">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <button 
            onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
            className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 w-full sm:w-auto"
          >
            <Filter className="h-5 w-5 mr-2 text-gray-400" />
            Filters
          </button>
          <select 
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
              setLoading(true);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg bg-white w-full sm:w-auto"
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto min-h-[400px]">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p className="ml-2 text-gray-500">
              {selectedCategory ? 'Filtering products...' : 'Loading products...'}
            </p>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-600">
            {error}
          </div>
        ) : (
          <table className="w-full min-w-[800px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={currentProducts.length > 0 && selectedProducts.length === currentProducts.map(p => p._id || p.id).length && currentProducts.every(p => selectedProducts.includes(p._id || p.id))}
                    onChange={toggleAllProducts}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                  Category
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Stock
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentProducts.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50">
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(product._id)}
                      onChange={() => toggleProductSelection(product._id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        {product.images && product.images.length > 0 ? (
                          <img
                            className="h-10 w-10 rounded-lg object-cover"
                            src={`http://localhost:5050/uploads/products/${product.images[0]}`}
                            alt={product.name}
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-lg bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-400 text-xs">No img</span>
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        <div className="text-sm text-gray-500">{product.sku}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden sm:table-cell">
                    {getCategoryName(product.category)}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${product.price}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden md:table-cell">
                    {product.stock || 0}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusClass(product.status)}`}>
                      {getStatusDisplay(product.status)}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="relative">
                      <button 
                        onClick={() => toggleActionMenu(product._id)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <MoreVertical className="h-5 w-5" />
                      </button>
                      
                      {openActionMenu === product._id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50" ref={actionMenuRef}>
                          <div className="py-1">
                            <Link
                              href={`/admin/dashboard/products/view/${product._id}`}
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              <Eye className="h-4 w-4 mr-3" />
                              View Details
                            </Link>
                            <Link
                              href={`/admin/dashboard/products/edit/${product._id}`}
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              <Edit className="h-4 w-4 mr-3" />
                              Edit Product
                            </Link>
                            <button
                              onClick={() => handleDeleteProduct(product._id)}
                              className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                            >
                              <Trash className="h-4 w-4 mr-3" />
                              Delete Product
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-700">
              Showing {startIndex + 1} to {Math.min(endIndex, total)} of {total} results
            </span>
            <select
              value={itemsPerPage}
              onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
              className="px-2 py-1 border border-gray-300 rounded text-sm"
            >
              <option value={5}>5 per page</option>
              <option value={10}>10 per page</option>
              <option value={20}>20 per page</option>
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>
            
            {getPageNumbers().map((page, index) => (
              <button
                key={index}
                onClick={() => typeof page === 'number' && handlePageChange(page)}
                disabled={page === '...'}
                className={`px-3 py-1 border rounded text-sm ${
                  page === currentPage
                    ? 'bg-blue-600 text-white border-blue-600'
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
              className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;