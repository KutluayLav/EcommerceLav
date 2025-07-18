'use client';

import { useState, useEffect } from 'react';
import Hero from '@/components/Hero';
import Categories from '@/components/Categories';
import Promotions from '@/components/Promotions';
import Features from '@/components/Features';
import ProductCard from '@/components/ProductCard';
import Newsletter from '@/components/Newsletter';
import { getFeaturedProducts, getPopularProducts, getNewArrivalProducts } from '@/services/productService';
import type { Product } from '@/types';
import { Loader2 } from 'lucide-react';

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [popularProducts, setPopularProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        
        // Paralel olarak tüm ürünleri çek
        const [featuredRes, popularRes, newArrivalRes] = await Promise.all([
          getFeaturedProducts(3),
          getPopularProducts(3),
          getNewArrivalProducts(3)
        ]);

        setFeaturedProducts(featuredRes.data.products || []);
        setPopularProducts(popularRes.data.products || []);
        setNewArrivals(newArrivalRes.data.products || []);
      } catch (error) {
        console.error('Ürünler yüklenemedi:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <>
      <Hero />
      <Categories />
      <Promotions />
      <Features />

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          <ProductSection title="Öne Çıkan Ürünler" products={featuredProducts} />
          <ProductSection title="Yeni Gelenler" products={newArrivals} />
          <ProductSection title="Popüler Ürünler" products={popularProducts} />
        </>
      )}

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
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </section>
  );
}
