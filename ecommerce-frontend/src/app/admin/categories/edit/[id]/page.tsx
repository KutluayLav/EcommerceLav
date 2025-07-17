'use client';
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Upload, X, Tag } from 'lucide-react';
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
    slug: 'electronics',
    metaTitle: 'Electronics - Best Electronic Devices',
    metaDescription: 'Shop the latest electronic devices and accessories at great prices.'
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
    slug: 'clothing',
    metaTitle: 'Clothing - Fashion & Apparel',
    metaDescription: 'Discover the latest fashion trends and clothing for everyone.'
  }
];

const EditCategoryPage = () => {
  const params = useParams();
  const categoryId = params.id as string;
  
  const [category, setCategory] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [dragActive, setDragActive] = useState(false);

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

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      // Handle file upload here
      console.log(e.dataTransfer.files);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setCategory((prev: any) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    // Burada kaydetme işlemi yapılacak
    console.log('Saving category:', category);
  };

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
            <h1 className="text-2xl font-bold text-gray-800">Edit Category</h1>
            <p className="text-gray-500">{category.name}</p>
          </div>
        </div>
        <button 
          onClick={handleSave}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
        >
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category Name
                </label>
                <input
                  type="text"
                  value={category.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter category name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={4}
                  value={category.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter category description"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Slug
                </label>
                <input
                  type="text"
                  value={category.slug}
                  onChange={(e) => handleInputChange('slug', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="category-slug"
                />
              </div>
            </div>
          </div>

          {/* Category Image */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold mb-4">Category Image</h2>
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center ${
                dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center">
                {category.image ? (
                  <div className="relative mb-4">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-32 h-32 object-cover rounded-lg"
                    />
                    <button className="absolute -top-2 -right-2 p-1 bg-white rounded-full shadow-sm border border-gray-200 hover:bg-gray-100">
                      <X className="h-4 w-4 text-gray-500" />
                    </button>
                  </div>
                ) : (
                  <Upload className="h-10 w-10 text-gray-400 mb-3" />
                )}
                <p className="text-gray-600 mb-2">
                  Drag and drop your image here, or{' '}
                  <span className="text-blue-600">browse</span>
                </p>
                <p className="text-sm text-gray-500">
                  Recommended size: 800x600px, Max size: 2MB
                </p>
              </div>
            </div>
          </div>

          {/* SEO Information */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold mb-4">SEO Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meta Title
                </label>
                <input
                  type="text"
                  value={category.metaTitle}
                  onChange={(e) => handleInputChange('metaTitle', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter meta title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meta Description
                </label>
                <textarea
                  rows={3}
                  value={category.metaDescription}
                  onChange={(e) => handleInputChange('metaDescription', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter meta description"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Category Settings */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold mb-4">Category Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select 
                  value={category.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={category.featured}
                    onChange={(e) => handleInputChange('featured', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Featured Category</span>
                </label>
              </div>
            </div>
          </div>

          {/* Category Statistics */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold mb-4">Statistics</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total Products
                </label>
                <p className="text-gray-900 font-medium">{category.products}</p>
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
                href={`/admin/categories/view/${category.id}`}
                className="flex items-center w-full px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg"
              >
                <Tag className="h-4 w-4 mr-3" />
                View Category
              </Link>
              <Link
                href={`/admin/products?category=${category.id}`}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                <Tag className="h-4 w-4 mr-3" />
                View Products
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCategoryPage; 