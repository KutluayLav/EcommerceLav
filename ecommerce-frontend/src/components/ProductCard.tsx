'use client';

import { Product } from '@/types';
import { useDispatch } from 'react-redux';
import { addToCart } from '@/features/cart/cartSlice';
import Link from 'next/link';
import { Heart, Star } from 'lucide-react';
import { useState } from 'react';

type ProductCardProps = {
  product: Product;
  layout?: 'grid' | 'list';
};

export default function ProductCard({ product, layout = 'grid' }: ProductCardProps) {
  const dispatch = useDispatch();
  const [wishlist, setWishlist] = useState(false);

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlist(!wishlist);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addToCart(product));
  };

  if (layout === 'list') {
    return (
      <Link
        href={`/products/${product.id}`}
        className="flex items-center border rounded-lg p-4 shadow-sm hover:shadow-lg transition bg-bgwhite border-gray-200 hover:border-primary group"
      >
        <div className="relative h-24 w-24 mr-4">
          <img
            src={product.image}
            alt={product.title}
            className="h-full w-full object-cover rounded"
          />
          <button
            onClick={toggleWishlist}
            className={`absolute top-1 right-1 p-1 rounded-full transition-all duration-200 ${
              wishlist
                ? 'bg-red-500 text-white'
                : 'bg-white text-gray-400 hover:text-red-500 hover:bg-red-50'
            }`}
          >
            <Heart className={`h-4 w-4 ${wishlist ? 'fill-current' : ''}`} />
          </button>
        </div>
        
        <div className="flex flex-col flex-grow">
          <h2 className="text-dark text-lg font-semibold group-hover:text-primary transition-colors">
            {product.title}
          </h2>
          
          {product.description && (
            <p className="text-gray-600 text-sm mt-1 line-clamp-2">
              {product.description}
            </p>
          )}

          {/* Rating */}
          {product.rating && (
            <div className="flex items-center mt-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3 w-3 ${
                      i < Math.floor(product.rating!)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-500 ml-1">
                ({product.rating})
              </span>
            </div>
          )}

          <div className="flex items-center justify-between mt-2">
            <div>
              <span className="text-primary font-bold text-xl">
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-sm text-gray-500 line-through ml-2">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
            
            <button
              onClick={handleAddToCart}
              className="ml-4 bg-primary text-bgwhite rounded-lg py-2 px-4 font-semibold hover:bg-[#b00812] transition"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </Link>
    );
  }

  // grid layout (default)
  return (
    <Link
      href={`/products/${product.id}`}
      className="border rounded-lg p-4 shadow-sm hover:shadow-lg transition flex flex-col mb-6 bg-bgwhite border-gray-200 hover:border-primary group"
    >
      <div className="relative h-48 w-full mb-4">
        <img
          src={product.image}
          alt={product.title}
          className="h-full w-full object-cover rounded group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Wishlist Button */}
        <button
          onClick={toggleWishlist}
          className={`absolute top-2 right-2 p-2 rounded-full transition-all duration-200 ${
            wishlist
              ? 'bg-red-500 text-white'
              : 'bg-white text-gray-400 hover:text-red-500 hover:bg-red-50'
          }`}
        >
          <Heart className={`h-4 w-4 ${wishlist ? 'fill-current' : ''}`} />
        </button>

        {/* Badge */}
        {product.tag && product.tag !== 'all' && (
          <span className="absolute top-2 left-2 px-2 py-1 bg-primary text-white text-xs font-medium rounded-full">
            {product.tag}
          </span>
        )}
      </div>
      
      <h2 className="text-dark text-lg font-semibold group-hover:text-primary transition-colors">
        {product.title}
      </h2>
      
      {product.description && (
        <p className="text-gray-600 text-sm mt-1 line-clamp-2">
          {product.description}
        </p>
      )}

      {/* Rating */}
      {product.rating && (
        <div className="flex items-center mt-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${
                  i < Math.floor(product.rating!)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500 ml-1">
            ({product.rating})
          </span>
        </div>
      )}

      <div className="flex items-center justify-between mt-auto pt-2">
        <div>
          <span className="text-primary font-bold text-xl">
            ${product.price.toFixed(2)}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-sm text-gray-500 line-through ml-2">
              ${product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>
        
        <button
          onClick={handleAddToCart}
          className="bg-primary text-bgwhite rounded-lg py-2 px-4 font-semibold hover:bg-[#b00812] transition"
        >
          Add to Cart
        </button>
      </div>
    </Link>
  );
}
