'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';
import { allProducts } from '@/data/products'; // Merkezi ürün verisi
import { Product } from '@/types';

export default function ProductDetailPage() {
  const { id } = useParams();
  const product = allProducts.find((p) => p.id === id);

  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return <p className="text-center text-darkgray mt-12">Product not found.</p>;
  }

  const increaseQty = () => setQuantity((q) => Math.min(q + 1, 99));
  const decreaseQty = () => setQuantity((q) => Math.max(q - 1, 1));

  return (
    <main className="max-w-5xl mx-auto px-6 py-12" style={{ color: 'var(--color-darkgray)' }}>
      <div className="flex flex-col md:flex-row gap-8">
        {/* Image Gallery - For now only main image */}
        <div className="md:w-1/2 rounded-lg overflow-hidden shadow-lg">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-96 object-cover"
          />
        </div>

        {/* Product Info */}
        <div className="md:w-1/2 flex flex-col justify-between">
          <div>
            <h1
              className="text-4xl font-bold mb-4"
              style={{ color: 'var(--color-blackheading)' }}
            >
              {product.title}
            </h1>
            <p className="text-2xl font-semibold mb-6" style={{ color: 'var(--color-primary)' }}>
              ${product.price.toFixed(2)}
            </p>

            <p className="mb-6 leading-relaxed">
              {/* Placeholder for product description/specs */}
              High-quality {product.title} with excellent sound and build quality. Perfect for everyday use, commuting, and more.
            </p>

            {/* Basic Product Specifications */}
            <ul className="mb-8 list-disc list-inside text-darkgray">
              <li>Battery life: Up to 20 hours</li>
              <li>Bluetooth 5.0 connectivity</li>
              <li>Noise cancellation technology</li>
              <li>Built-in microphone for calls</li>
            </ul>
          </div>

          {/* Quantity selector and Add to Cart */}
          <div className="flex items-center gap-4 mb-6">
            <label htmlFor="quantity" className="font-semibold">
              Quantity:
            </label>
            <div className="flex items-center border border-gray-300 rounded">
              <button
                onClick={decreaseQty}
                className="px-3 py-1 hover:bg-gray-100"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <input
                type="text"
                id="quantity"
                value={quantity}
                readOnly
                className="w-12 text-center border-x border-gray-300"
              />
              <button
                onClick={increaseQty}
                className="px-3 py-1 hover:bg-gray-100"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
            <button
              type="button"
              className="ml-auto bg-primary text-bgwhite font-semibold px-6 py-2 rounded hover:bg-red-700 transition"
            >
              Add to Cart
            </button>
          </div>

          {/* Customer Reviews Placeholder */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Customer Reviews</h2>
            <p className="text-sm text-darkgray/70 mb-6">No reviews yet. Be the first to review this product!</p>
          </section>

          {/* Related Products Placeholder */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Related Products</h2>
            <div className="grid grid-cols-2 gap-4">
              {/* Örnek olarak aynı kategoriden 2 ürün gösterebilirsin */}
              {allProducts
                .filter((p) => p.category === product.category && p.id !== product.id)
                .slice(0, 2)
                .map((related) => (
                  <div
                    key={related.id}
                    className="border p-3 rounded shadow hover:shadow-lg transition cursor-pointer"
                  >
                    <img
                      src={related.image}
                      alt={related.title}
                      className="w-full h-24 object-cover rounded mb-2"
                    />
                    <p className="font-semibold">{related.title}</p>
                    <p className="text-primary font-semibold">${related.price.toFixed(2)}</p>
                  </div>
                ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
