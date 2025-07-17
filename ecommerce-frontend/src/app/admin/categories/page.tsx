'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Plus, Search, Edit, Trash, ChevronRight, MoreVertical, Eye } from 'lucide-react';
import Link from 'next/link';

// Örnek veri
const categories = [
  {
    id: 'CAT001',
    name: 'Electronics',
    description: 'Electronic devices and accessories',
    products: 156,
    image: '/path/to/electronics.jpg',
    status: 'Active'
  },
  {
    id: 'CAT002',
    name: 'Clothing',
    description: 'Fashion and apparel',
    products: 243,
    image: '/path/to/clothing.jpg',
    status: 'Active'
  },
  {
    id: 'CAT003',
    name: 'Books',
    description: 'Books and literature',
    products: 89,
    image: '/path/to/books.jpg',
    status: 'Active'
  },
  {
    id: 'CAT004',
    name: 'Home & Garden',
    description: 'Home decor and garden supplies',
    products: 178,
    image: '/path/to/home.jpg',
    status: 'Active'
  },
  {
    id: 'CAT005',
    name: 'Sports & Outdoors',
    description: 'Sports equipment and outdoor gear',
    products: 134,
    image: '/path/to/sports.jpg',
    status: 'Active'
  },
  {
    id: 'CAT006',
    name: 'Beauty & Health',
    description: 'Beauty products and health supplements',
    products: 201,
    image: '/path/to/beauty.jpg',
    status: 'Inactive'
  },
  {
    id: 'CAT007',
    name: 'Toys & Games',
    description: 'Toys, games and entertainment',
    products: 95,
    image: '/path/to/toys.jpg',
    status: 'Active'
  },
  {
    id: 'CAT008',
    name: 'Automotive',
    description: 'Car parts and accessories',
    products: 167,
    image: '/path/to/automotive.jpg',
    status: 'Active'
  }
];

const CategoriesPage = () => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [openActionMenu, setOpenActionMenu] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
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

  // Filter categories based on search and status
  const filteredCategories = categories.filter(category => {
    const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         category.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === '' || category.status.toLowerCase() === selectedStatus.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCategories = filteredCategories.slice(startIndex, endIndex);

  const toggleCategorySelection = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const toggleAllCategories = () => {
    const currentCategoryIds = currentCategories.map(c => c.id);
    setSelectedCategories(prev =>
      prev.length === currentCategoryIds.length 
        ? prev.filter(id => !currentCategoryIds.includes(id))
        : [...prev.filter(id => !currentCategoryIds.includes(id)), ...currentCategoryIds]
    );
  };

  const toggleActionMenu = (categoryId: string) => {
    setOpenActionMenu(openActionMenu === categoryId ? null : categoryId);
  };

  const handleDeleteCategory = (categoryId: string) => {
    // Burada silme işlemi yapılacak
    console.log('Deleting category:', categoryId);
    setOpenActionMenu(null);
  };

  const handleDeleteSelected = () => {
    // Burada seçili kategorileri silme işlemi yapılacak
    console.log('Deleting selected categories:', selectedCategories);
    setSelectedCategories([]);
  };

  const handleStatusChangeSelected = (newStatus: string) => {
    // Burada seçili kategorilerin durumunu güncelleme işlemi yapılacak
    console.log('Updating status for selected categories:', selectedCategories, 'to', newStatus);
    setSelectedCategories([]);
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

  // Generate page numbers
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
          <Link href="/admin/categories/add" className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center hover:bg-blue-700">
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentCategories.map((category) => (
          <div
            key={category.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="h-48 bg-gray-100 relative">
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                {category.image ? (
                  <img
                    src={category.image}
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
                  checked={selectedCategories.includes(category.id)}
                  onChange={() => toggleCategorySelection(category.id)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </div>
              <div className="absolute top-2 right-2">
                <div className="relative">
                  <button 
                    onClick={() => toggleActionMenu(category.id)}
                    className="text-gray-400 hover:text-gray-600 p-1 rounded bg-white shadow-sm"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </button>
                  
                  {openActionMenu === category.id && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50" ref={actionMenuRef}>
                      <div className="py-1">
                        <Link
                          href={`/admin/categories/view/${category.id}`}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <Eye className="h-4 w-4 mr-3" />
                          View Details
                        </Link>
                        <Link
                          href={`/admin/categories/edit/${category.id}`}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <Edit className="h-4 w-4 mr-3" />
                          Edit Category
                        </Link>
                        <Link
                          href={`/admin/products?category=${category.id}`}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <ChevronRight className="h-4 w-4 mr-3" />
                          View Products
                        </Link>
                        <button
                          onClick={() => handleDeleteCategory(category.id)}
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
                  {category.products} products
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                {category.description}
              </p>
              <div className="flex items-center justify-between">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  category.status === 'Active'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {category.status}
                </span>
                <Link
                  href={`/admin/products?category=${category.id}`}
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-700">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredCategories.length)} of {filteredCategories.length} results
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