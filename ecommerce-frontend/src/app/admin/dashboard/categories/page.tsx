'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Plus, Search, Edit, Trash, ChevronRight, MoreVertical, Eye } from 'lucide-react';
import Link from 'next/link';
import axios from 'axios';

const CategoriesPage = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [openActionMenu, setOpenActionMenu] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
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
      setLoading(true);
      setError('');
      try {
        const params: any = {
          page: currentPage,
          limit: itemsPerPage
        };
        if (searchTerm) params.search = searchTerm;
        if (selectedStatus) params.active = selectedStatus === 'active';

        const response = await axios.get('http://localhost:5050/api/categories', { params });
        setCategories(response.data.categories || []);
        setTotal(response.data.total || 0);
      } catch (err: any) {
        setError('Kategoriler alınamadı.');
        console.error('Kategoriler yüklenirken hata:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [currentPage, itemsPerPage, searchTerm, selectedStatus]);

  const getStatusDisplay = (active: boolean) => {
    return active ? 'Active' : 'Inactive';
  };

  const getStatusColor = (active: boolean) => {
    return active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
  };

  const totalPages = Math.ceil(total / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const toggleCategorySelection = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const toggleAllCategories = () => {
    const currentCategoryIds = categories.map(c => c._id);
    setSelectedCategories(prev =>
      prev.length === currentCategoryIds.length 
        ? prev.filter(id => !currentCategoryIds.includes(id))
        : [...prev.filter(id => !currentCategoryIds.includes(id)), ...currentCategoryIds]
    );
  };

  const toggleActionMenu = (categoryId: string) => {
    setOpenActionMenu(openActionMenu === categoryId ? null : categoryId);
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm('Bu kategoriyi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.')) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        alert('Admin token bulunamadı. Lütfen tekrar giriş yapın.');
        return;
      }

      await axios.delete(`http://localhost:5050/api/categories/${categoryId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setCategories(prev => prev.filter(c => c._id !== categoryId));
      setSelectedCategories(prev => prev.filter(id => id !== categoryId));
      setOpenActionMenu(null);
      
      alert('Kategori başarıyla silindi.');
    } catch (error: any) {
      console.error('Kategori silinirken hata:', error);
      alert(error.response?.data?.message || 'Kategori silinirken bir hata oluştu.');
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedCategories.length === 0) return;
    
    if (!confirm(`${selectedCategories.length} kategoriyi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`)) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        alert('Admin token bulunamadı. Lütfen tekrar giriş yapın.');
        return;
      }

      for (const categoryId of selectedCategories) {
        await axios.delete(`http://localhost:5050/api/categories/${categoryId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      }

      setCategories(prev => prev.filter(c => !selectedCategories.includes(c._id)));
      setSelectedCategories([]);
      
      alert(`${selectedCategories.length} kategori başarıyla silindi.`);
    } catch (error: any) {
      console.error('Kategoriler silinirken hata:', error);
      alert(error.response?.data?.message || 'Kategoriler silinirken bir hata oluştu.');
    }
  };

  const handleStatusChangeSelected = async (newStatus: string) => {
    if (selectedCategories.length === 0 || !newStatus) return;
    
    if (!confirm(`${selectedCategories.length} kategorinin durumunu "${newStatus}" olarak güncellemek istediğinizden emin misiniz?`)) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        alert('Admin token bulunamadı. Lütfen tekrar giriş yapın.');
        return;
      }

      await axios.put(`http://localhost:5050/api/categories/bulk`, {
        categoryIds: selectedCategories,
        active: newStatus === 'Active'
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setCategories(prev => prev.map(c => 
        selectedCategories.includes(c._id) ? { ...c, active: newStatus === 'Active' } : c
      ));
      setSelectedCategories([]);
      
      alert(`${selectedCategories.length} kategorinin durumu başarıyla güncellendi.`);
    } catch (error: any) {
      console.error('Kategori durumları güncellenirken hata:', error);
      alert(error.response?.data?.message || 'Kategori durumları güncellenirken bir hata oluştu.');
    }
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

  return (
    <div className="space-y-6">
      {/* Header with Bulk Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Categories</h1>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          {selectedCategories.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-2 bg-blue-50 p-3 rounded-lg border border-blue-200 w-full sm:w-auto">
              <div className="flex items-center justify-between sm:justify-start gap-3">
                <span className="text-sm font-medium text-blue-800">
                  {selectedCategories.length} categor{selectedCategories.length > 1 ? 'ies' : 'y'} selected
                </span>
                <button
                  onClick={() => setSelectedCategories([])}
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
                  <option value="Active">Mark as Active</option>
                  <option value="Inactive">Mark as Inactive</option>
                </select>
              </div>
            </div>
          )}
          <Link href="/admin/dashboard/categories/add" className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center hover:bg-blue-700">
            <Plus className="h-5 w-5 mr-2" />
            Add Category
          </Link>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        <select 
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg bg-white w-full sm:w-auto"
        >
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Categories Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <p className="ml-2 text-gray-500">Loading categories...</p>
        </div>
      ) : error ? (
        <div className="text-center py-8 text-red-600">
          {error}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div
              key={category._id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="h-48 bg-gray-100 relative">
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                  {category.image ? (
                    <img
                      src={`http://localhost:5050/uploads/categories/${category.image}`}
                      alt={category.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>No image</span>
                  )}
                </div>
                <div className="absolute top-2 left-2">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category._id)}
                    onChange={() => toggleCategorySelection(category._id)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </div>
                <div className="absolute top-2 right-2">
                  <div className="relative">
                    <button 
                      onClick={() => toggleActionMenu(category._id)}
                      className="text-gray-400 hover:text-gray-600 p-1 rounded bg-white shadow-sm"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>
                    
                    {openActionMenu === category._id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50" ref={actionMenuRef}>
                        <div className="py-1">
                          <Link
                            href={`/admin/dashboard/categories/view/${category._id}`}
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <Eye className="h-4 w-4 mr-3" />
                            View Details
                          </Link>
                          <Link
                            href={`/admin/dashboard/categories/edit/${category._id}`}
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <Edit className="h-4 w-4 mr-3" />
                            Edit Category
                          </Link>
                          <Link
                            href={`/admin/dashboard/products?category=${category._id}`}
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <ChevronRight className="h-4 w-4 mr-3" />
                            View Products
                          </Link>
                          <button
                            onClick={() => handleDeleteCategory(category._id)}
                            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                          >
                            <Trash className="h-4 w-4 mr-3" />
                            Delete Category
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {category.name}
                  </h3>
                  <span className="text-sm text-gray-500">
                    {category.productCount || 0} products
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  {category.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(category.active)}`}>
                    {getStatusDisplay(category.active)}
                  </span>
                  <Link
                    href={`/admin/dashboard/products?category=${category._id}`}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
                  >
                    View Products
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

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
              <option value={6}>6 per page</option>
              <option value={12}>12 per page</option>
              <option value={24}>24 per page</option>
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

export default CategoriesPage; 