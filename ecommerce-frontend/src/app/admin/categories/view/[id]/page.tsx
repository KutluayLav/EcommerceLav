'use client';
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Edit, Package, Eye, Tag } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

// Mock category data - gerçek uygulamada API'den gelecek
const mockCategories = [
  {
    id: 'CAT001',
    name: 'Electronics',
    description: 'Electronic devices and accessories including smartphones, laptops, tablets, and other digital gadgets.',
    products: 156,
    image: '/path/to/electronics.jpg',
    status: 'Active',
    createdAt: '2024-01-15',
    updatedAt: '2024-03-20',
    featured: true,
    parentCategory: null,
    subcategories: [
      { id: 'SUB001', name: 'Smartphones', products: 45 },
      { id: 'SUB002', name: 'Laptops', products: 32 },
      { id: 'SUB003', name: 'Tablets', products: 28 },
      { id: 'SUB004', name: 'Accessories', products: 51 }
    ],
    topProducts: [
      { id: 'PRD001', name: 'Wireless Headphones', price: 89.99, sales: 234 },
      { id: 'PRD002', name: 'Smart Watch', price: 199.99, sales: 189 },
      { id: 'PRD003', name: 'Bluetooth Speaker', price: 79.99, sales: 156 }
    ]
  },
  {
    id: 'CAT002',
    name: 'Clothing',
    description: 'Fashion and apparel for men, women, and children including casual wear, formal attire, and seasonal clothing.',
    products: 243,
    image: '/path/to/clothing.jpg',
    status: 'Active',
    createdAt: '2024-01-10',
    updatedAt: '2024-03-18',
    featured: true,
    parentCategory: null,
    subcategories: [
      { id: 'SUB005', name: 'Men\'s Clothing', products: 78 },
      { id: 'SUB006', name: 'Women\'s Clothing', products: 89 },
      { id: 'SUB007', name: 'Kids\' Clothing', products: 45 },
      { id: 'SUB008', name: 'Shoes', products: 31 }
    ],
    topProducts: [
      { id: 'PRD004', name: 'Denim Jacket', price: 59.99, sales: 312 },
      { id: 'PRD005', name: 'Summer Dress', price: 45.99, sales: 278 },
      { id: 'PRD006', name: 'Running Shoes', price: 89.99, sales: 201 }
    ]
  }
];

const ViewCategoryPage = () => {
  const params = useParams();
  const categoryId = params.id as string;
  
  const [category, setCategory] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const fetchCategory = () => {
      const foundCategory = mockCategories.find(c => c.id === categoryId);
      if (foundCategory) {
        setCategory(foundCategory);
      }
      setLoading(false);
    };

    fetchCategory();
  }, [categoryId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Category not found</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            href="/admin/categories"
            className="text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{category.name}</h1>
            <p className="text-gray-500">Category Details</p>
          </div>
        </div>
        <Link
          href={`/admin/categories/edit/${category.id}`}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
        >
          <Edit className="h-4 w-4 mr-2" />
          Edit Category
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Category Image */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold mb-4">Category Image</h2>
            <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              {category.image ? (
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <div className="text-gray-400 flex flex-col items-center">
                  <Tag className="h-12 w-12 mb-2" />
                  <span>No image available</span>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold mb-4">Description</h2>
            <p className="text-gray-700 leading-relaxed">{category.description}</p>
          </div>

          {/* Subcategories */}
          {category.subcategories && category.subcategories.length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold mb-4">Subcategories</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {category.subcategories.map((sub: any) => (
                  <div key={sub.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <span className="font-medium text-gray-900">{sub.name}</span>
                    <span className="text-sm text-gray-500">{sub.products} products</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Top Products */}
          {category.topProducts && category.topProducts.length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold mb-4">Top Products</h2>
              <div className="space-y-3">
                {category.topProducts.map((product: any) => (
                  <div key={product.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                    <div>
                      <h3 className="font-medium text-gray-900">{product.name}</h3>
                      <p className="text-sm text-gray-500">{product.sales} sales</p>
                    </div>
                    <span className="font-medium text-gray-900">${product.price}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Category Information */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold mb-4">Category Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  category.status === 'Active'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {category.status}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total Products
                </label>
                <p className="text-gray-900 font-medium">{category.products}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Featured
                </label>
                <p className="text-gray-900">{category.featured ? 'Yes' : 'No'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Created
                </label>
                <p className="text-gray-900">{category.createdAt}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Updated
                </label>
                <p className="text-gray-900">{category.updatedAt}</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link
                href={`/admin/products?category=${category.id}`}
                className="flex items-center w-full px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg"
              >
                <Package className="h-4 w-4 mr-3" />
                View Products
              </Link>
              <Link
                href={`/admin/categories/edit/${category.id}`}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                <Edit className="h-4 w-4 mr-3" />
                Edit Category
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewCategoryPage; 