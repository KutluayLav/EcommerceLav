'use client';

import { useState } from 'react';
import Link from 'next/link';
import { allProducts } from '@/data/products';  // ürünleri buradan alıyoruz
import { Product } from '@/types';

const tabs = [
  { label: 'All', value: 'all' },
  { label: 'Featured', value: 'featured' },
  { label: 'New Arrivals', value: 'new' },
  { label: 'Popular', value: 'popular' },
];

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filtered: Product[] =
    selectedCategory === 'all'
      ? allProducts
      : allProducts.filter((p) => p.tag === selectedCategory);

  return (
    <main className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-extrabold mb-6 text-blackheading">Products</h1>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-3 mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setSelectedCategory(tab.value)}
            className={`px-4 py-2 rounded-full border text-sm font-medium transition ${
              selectedCategory === tab.value
                ? 'bg-primary text-white border-primary'
                : 'text-darkgray border-gray-300 hover:bg-gray-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      {filtered.length === 0 ? (
        <p className="text-gray-500">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filtered.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="bg-white rounded-xl border border-gray-200 hover:shadow-lg transition overflow-hidden"
            >
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-56 object-cover"
              />
              <div className="p-4">
                <h2 className="text-lg font-semibold text-blackheading">{product.title}</h2>
                <p className="text-primary font-bold mt-1">${product.price.toFixed(2)}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
