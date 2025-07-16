'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { Product } from '@/types';
import ProductCard from '@/components/ProductCard';
import { Search, List, Grid3X3 } from 'lucide-react';

// Ürünleri merkezi yerden import ediyoruz
import { allProducts } from '@/data/products';

export default function CategoryPage() {
  const { category } = useParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [sort, setSort] = useState('');
  const [view, setView] = useState<'grid' | 'list'>('grid');

  // Eğer category undefined ise tüm ürünler gösterilir, değilse kategoriye göre filtre
  const filteredProducts = allProducts
    .filter((p) => !category || p.category === category)
    .filter((p) => p.title.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sort === 'price') return a.price - b.price;
      if (sort === 'rating') return (b.rating ?? 0) - (a.rating ?? 0);
      return 0;
    });

  return (
    <main className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-blackheading capitalize mb-8">
        {category ?? 'All Products'}
      </h1>

      {/* Filtreler ve Kontroller */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        {/* Arama */}
        <div className="flex items-center w-full md:w-1/3 bg-white border border-gray-300 rounded-lg px-3 py-2">
          <Search className="w-5 h-5 text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search products..."
            className="w-full focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Sıralama */}
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 text-sm w-full md:w-auto"
        >
          <option value="">Sort by</option>
          <option value="price">Price (Low to High)</option>
          <option value="rating">Rating (High to Low)</option>
        </select>

        {/* Görünüm Değiştirici */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setView('grid')}
            className={`p-2 rounded ${view === 'grid' ? 'bg-primary text-white' : 'bg-gray-200'}`}
            aria-label="Grid view"
          >
            <Grid3X3 className="w-5 h-5" />
          </button>
          <button
            onClick={() => setView('list')}
            className={`p-2 rounded ${view === 'list' ? 'bg-primary text-white' : 'bg-gray-200'}`}
            aria-label="List view"
          >
            <List className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Ürün Listesi */}
      {filteredProducts.length === 0 ? (
        <p className="text-gray-500 mt-10">No products found.</p>
      ) : (
        <div className={view === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6' : 'space-y-6'}>
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} layout={view} />
          ))}
        </div>
      )}

      {/* Örnek Pagination */}
      <div className="mt-12 flex justify-center space-x-2">
        <button className="px-4 py-2 border rounded hover:bg-gray-100">1</button>
        <button className="px-4 py-2 border rounded hover:bg-gray-100">2</button>
        <button className="px-4 py-2 border rounded hover:bg-gray-100">3</button>
      </div>
    </main>
  );
}
