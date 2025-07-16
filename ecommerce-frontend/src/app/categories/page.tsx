'use client';

import Link from 'next/link';

const categories = [
  { name: 'electronics', label: 'Electronics', icon: '🔌' },
  { name: 'fashion', label: 'Fashion', icon: '👟' },
  { name: 'books', label: 'Books', icon: '📚' },
];

export default function CategoriesPage() {
  return (
    <main className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-extrabold mb-10 text-blackheading">Shop by Category</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <Link
            key={cat.name}
            href={`/categories/${cat.name}`}
            className="bg-white border border-gray-200 hover:border-primary rounded-xl shadow-sm p-6 flex flex-col items-center text-center transition"
          >
            <span className="text-4xl mb-2">{cat.icon}</span>
            <h2 className="text-lg font-bold text-blackheading">{cat.label}</h2>
          </Link>
        ))}
      </div>
    </main>
  );
}
