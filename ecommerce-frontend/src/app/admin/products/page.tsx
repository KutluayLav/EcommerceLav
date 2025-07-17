'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Plus, Search, Filter, MoreVertical, Edit, Trash, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

const products = [
  {
    id: 'PRD001',
    name: 'Wireless Headphones',
    category: 'Electronics',
    price: 89.99,
    stock: 120,
    status: 'Active'
  },
  {
    id: 'PRD002',
    name: 'Smart Watch',
    category: 'Electronics',
    price: 199.99,
    stock: 85,
    status: 'Active'
  },
  {
    id: 'PRD003',
    name: 'Bluetooth Speaker',
    category: 'Electronics',
    price: 79.99,
    stock: 95,
    status: 'Inactive'
  },
  {
    id: 'PRD004',
    name: 'Laptop Stand',
    category: 'Electronics',
    price: 45.99,
    stock: 200,
    status: 'Active'
  },
  {
    id: 'PRD005',
    name: 'Wireless Mouse',
    category: 'Electronics',
    price: 29.99,
    stock: 150,
    status: 'Active'
  },
  {
    id: 'PRD006',
    name: 'Mechanical Keyboard',
    category: 'Electronics',
    price: 129.99,
    stock: 75,
    status: 'Active'
  },
  {
    id: 'PRD007',
    name: 'Gaming Headset',
    category: 'Electronics',
    price: 89.99,
    stock: 60,
    status: 'Active'
  },
  {
    id: 'PRD008',
    name: 'USB-C Hub',
    category: 'Electronics',
    price: 39.99,
    stock: 180,
    status: 'Inactive'
  },
  {
    id: 'PRD009',
    name: 'Webcam',
    category: 'Electronics',
    price: 69.99,
    stock: 90,
    status: 'Active'
  },
  {
    id: 'PRD010',
    name: 'External SSD',
    category: 'Electronics',
    price: 149.99,
    stock: 45,
    status: 'Active'
  },
  {
    id: 'PRD011',
    name: 'Monitor Stand',
    category: 'Electronics',
    price: 79.99,
    stock: 110,
    status: 'Active'
  },
  {
    id: 'PRD012',
    name: 'Cable Organizer',
    category: 'Electronics',
    price: 19.99,
    stock: 300,
    status: 'Active'
  }
];

const ProductsPage = () => {
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [openActionMenu, setOpenActionMenu] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
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

  // Filter products based on search and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === '' || product.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  const toggleProductSelection = (productId: string) => {
    setSelectedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const toggleAllProducts = () => {
    const currentProductIds = currentProducts.map(p => p.id);
    setSelectedProducts(prev =>
      prev.length === currentProductIds.length 
        ? prev.filter(id => !currentProductIds.includes(id))
        : [...prev.filter(id => !currentProductIds.includes(id)), ...currentProductIds]
    );
  };

  const toggleActionMenu = (productId: string) => {
    setOpenActionMenu(openActionMenu === productId ? null : productId);
  };

  const handleDeleteProduct = (productId: string) => {
    // Burada silme işlemi yapılacak
    console.log('Deleting product:', productId);
    setOpenActionMenu(null);
  };

  const handleDeleteSelected = () => {
    // Burada seçili ürünleri silme işlemi yapılacak
    console.log('Deleting selected products:', selectedProducts);
    setSelectedProducts([]);
  };

  const handleStatusChangeSelected = (newStatus: string) => {
    // Burada seçili ürünlerin durumunu güncelleme işlemi yapılacak
    console.log('Updating status for selected products:', selectedProducts, 'to', newStatus);
    setSelectedProducts([]);
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
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">Products</h1>
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
                  <option value="Active">Mark as Active</option>
                  <option value="Inactive">Mark as Inactive</option>
                </select>
              </div>
            </div>
          )}
          <Link href="/admin/products/add" className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center hover:bg-blue-700">
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
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg bg-white w-full sm:w-auto"
          >
            <option value="">All Categories</option>
            <option value="electronics">Electronics</option>
            <option value="clothing">Clothing</option>
            <option value="books">Books</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto min-h-[400px]">
        <table className="w-full min-w-[800px]">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 sm:px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={currentProducts.length > 0 && selectedProducts.length === currentProducts.length}
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
              <th className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {currentProducts.map((product) => (
              <tr key={product.id}>
                <td className="px-4 sm:px-6 py-3 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedProducts.includes(product.id)}
                    onChange={() => toggleProductSelection(product.id)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </td>
                <td className="px-4 sm:px-6 py-3 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{product.name}</div>
                  <div className="text-sm text-gray-500 sm:hidden">{product.category}</div>
                </td>
                <td className="px-4 sm:px-6 py-3 whitespace-nowrap hidden sm:table-cell">
                  <div className="text-sm text-gray-900">{product.category}</div>
                </td>
                <td className="px-4 sm:px-6 py-3 whitespace-nowrap">
                  <div className="text-sm text-gray-900">${product.price}</div>
                </td>
                <td className="px-4 sm:px-6 py-3 whitespace-nowrap hidden md:table-cell">
                  <div className="text-sm text-gray-900">{product.stock}</div>
                </td>
                <td className="px-4 sm:px-6 py-3 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    product.status === 'Active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {product.status}
                  </span>
                </td>
                <td className="px-4 sm:px-6 py-3 whitespace-nowrap text-right text-sm font-medium">
                  <div className="relative">
                    <button 
                      onClick={() => toggleActionMenu(product.id)}
                      className="text-gray-400 hover:text-gray-600 p-1 rounded"
                    >
                      <MoreVertical className="h-5 w-5" />
                    </button>
                    
                    {openActionMenu === product.id && (
                      <div className={`absolute right-0 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50 ${
                        product.id === currentProducts[currentProducts.length - 1].id ? 'bottom-full mb-2' : 'top-full mt-2'
                      }`} ref={actionMenuRef}>
                        <div className="py-1">
                          <Link
                            href={`/admin/products/view/${product.id}`}
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <Eye className="h-4 w-4 mr-3" />
                            View Details
                          </Link>
                          <Link
                            href={`/admin/products/edit/${product.id}`}
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <Edit className="h-4 w-4 mr-3" />
                            Edit Product
                          </Link>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
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
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-700">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredProducts.length)} of {filteredProducts.length} results
            </span>
            <select
              value={itemsPerPage}
              onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
              className="px-2 py-1 border border-gray-300 rounded text-sm"
            >
              <option value={5}>5 per page</option>
              <option value={10}>10 per page</option>
              <option value={20}>20 per page</option>
              <option value={50}>50 per page</option>
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <ChevronLeft className="h-4 w-4" />
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
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage; 