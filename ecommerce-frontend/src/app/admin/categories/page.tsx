'use client';
import React, { useState } from 'react';
import { Plus, Search, Edit, Trash, ChevronRight } from 'lucide-react';

// Örnek veri
const categories = [
  {
    id: 'CAT001',
    name: 'Electronics',
    description: 'Electronic devices and accessories',
    products: 156,
    image: '/path/to/electronics.jpg'
  },
  {
    id: 'CAT002',
    name: 'Clothing',
    description: 'Fashion and apparel',
    products: 243,
    image: '/path/to/clothing.jpg'
  },
  {
    id: 'CAT003',
    name: 'Books',
    description: 'Books and literature',
    products: 89,
    image: '/path/to/books.jpg'
  },
  {
    id: 'CAT004',
    name: 'Home & Garden',
    description: 'Home decor and garden supplies',
    products: 178,
    image: '/path/to/home.jpg'
  }
];

const CategoriesPage = () => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const toggleCategorySelection = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const toggleAllCategories = () => {
    setSelectedCategories(prev =>
      prev.length === categories.length ? [] : categories.map(c => c.id)
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Categories</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700">
          <Plus className="h-5 w-5 mr-2" />
          Add Category
        </button>
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search categories..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
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
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center">
                  View Products
                  <ChevronRight className="h-4 w-4 ml-1" />
                </button>
                <div className="flex space-x-2">
                  <button className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-gray-50">
                    <Edit className="h-5 w-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-gray-50">
                    <Trash className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Category Modal - To be implemented */}
    </div>
  );
};

export default CategoriesPage; 