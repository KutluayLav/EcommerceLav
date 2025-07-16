'use client';

import Hero from '@/components/Hero';
import Categories from '@/components/Categories';
import Promotions from '@/components/Promotions';
import ProductCard from '@/components/ProductCard';
import Newsletter from '@/components/Newsletter';
import { allProducts } from '@/data/products';
import type { Product } from '@/types';

export default function HomePage() {
  const featuredProducts = allProducts.filter((p) => p.tag === 'featured');
  const newArrivals = allProducts.filter((p) => p.tag === 'new');
  const popularProducts = allProducts.filter((p) => p.tag === 'popular');

  return (
    <>
      <Hero />
      <Categories />
      <Promotions />

      <ProductSection title="Featured Products" products={featuredProducts} />
      <ProductSection title="New Arrivals" products={newArrivals} />
      <ProductSection title="Popular Products" products={popularProducts} />

      <Newsletter />
    </>
  );
}

function ProductSection({
  title,
  products,
}: {
  title: string;
  products: Product[];
}) {
  return (
    <section className="mt-12 max-w-7xl mx-auto px-6 md:px-12">
      <h2 className="text-2xl font-semibold mb-6">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
