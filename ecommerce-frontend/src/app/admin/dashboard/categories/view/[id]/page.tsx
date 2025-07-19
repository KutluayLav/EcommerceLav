'use client';
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Edit, Package, Eye, Tag } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import axios from 'axios';

const ViewCategoryPage = () => {
  const params = useParams();
  const categoryId = params.id as string;
  
  const [category, setCategory] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCategoryData = async () => {
      setLoading(true);
      setError('');
      try {
        // Kategori bilgilerini al
        const categoryResponse = await axios.get(`http://localhost:5050/api/categories/${categoryId}`);
        setCategory(categoryResponse.data);

        // Kategoriye ait ürünleri al
        const productsResponse = await axios.get(`http://localhost:5050/api/categories/${categoryId}/products?limit=5`);
        setProducts(productsResponse.data.products || []);
      } catch (err: any) {
        setError('Kategori yüklenirken hata oluştu.');
        console.error('Kategori yüklenirken hata:', err);
      } finally {
        setLoading(false);
      }
    };

    if (categoryId) {
      fetchCategoryData();
    }
  }, [categoryId]);

  const getStatusDisplay = (active: boolean) => {
    return active ? 'Active' : 'Inactive';
  };

  const getStatusColor = (active: boolean) => {
    return active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <p className="ml-2 text-gray-500">Loading category...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-600">{error}</div>
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
            href="/admin/dashboard/categories"
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
          href={`/admin/dashboard/categories/edit/${category._id}`}
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
                  src={`http://localhost:5050/uploads/categories/${category.image}`}
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

          {/* SEO Information */}
          {(category.metaTitle || category.metaDescription) && (
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold mb-4">SEO Information</h2>
              <div className="space-y-4">
                {category.metaTitle && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Meta Title
                    </label>
                    <p className="text-gray-900">{category.metaTitle}</p>
                  </div>
                )}
                {category.metaDescription && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Meta Description
                    </label>
                    <p className="text-gray-900">{category.metaDescription}</p>
                  </div>
                )}
                {category.slug && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Slug
                    </label>
                    <p className="text-gray-900">{category.slug}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Top Products */}
          {products.length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold mb-4">Recent Products</h2>
              <div className="space-y-3">
                {products.map((product: any) => (
                  <div key={product._id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                    <div>
                      <h3 className="font-medium text-gray-900">{product.name}</h3>
                      <p className="text-sm text-gray-500">
                        {product.category?.name || 'No category'} • {product.stock || 0} in stock
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="font-medium text-gray-900">${product.price}</span>
                      <p className="text-sm text-gray-500">
                        {product.active ? 'Active' : 'Inactive'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <Link
                  href={`/admin/dashboard/products?category=${category._id}`}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
                >
                  View All Products
                  <Package className="h-4 w-4 ml-1" />
                </Link>
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
                <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(category.active)}`}>
                  {getStatusDisplay(category.active)}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total Products
                </label>
                <p className="text-gray-900 font-medium">{category.productCount || 0}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Featured
                </label>
                <p className="text-gray-900">{category.featured ? 'Yes' : 'No'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sort Order
                </label>
                <p className="text-gray-900">{category.sortOrder || 0}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Created
                </label>
                <p className="text-gray-900">
                  {category.createdAt ? new Date(category.createdAt).toLocaleDateString('tr-TR') : 'N/A'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Updated
                </label>
                <p className="text-gray-900">
                  {category.updatedAt ? new Date(category.updatedAt).toLocaleDateString('tr-TR') : 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link
                href={`/admin/dashboard/products?category=${category._id}`}
                className="flex items-center w-full px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg"
              >
                <Package className="h-4 w-4 mr-3" />
                View Products
              </Link>
              <Link
                href={`/admin/dashboard/categories/edit/${category._id}`}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                <Edit className="h-4 w-4 mr-3" />
                Edit Category
              </Link>
              <Link
                href="/admin/dashboard/categories"
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                <Tag className="h-4 w-4 mr-3" />
                Back to Categories
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewCategoryPage; 