'use client';

import { Product } from '@/types';
import { useDispatch } from 'react-redux';
import { addToCart } from '@/features/cart/cartSlice';

type ProductCardProps = {
  product: Product;
  layout?: 'grid' | 'list';
};

export default function ProductCard({ product, layout = 'grid' }: ProductCardProps) {
  const dispatch = useDispatch();

  if (layout === 'list') {
    return (
      <div
        className="flex items-center border rounded-lg p-4 shadow-sm hover:shadow-lg transition cursor-pointer bg-bgwhite border-primary"
        onClick={() => dispatch(addToCart(product))}
      >
        <img
          src={product.image}
          alt={product.title}
          className="h-24 w-24 object-contain rounded mr-4"
        />
        <div className="flex flex-col flex-grow">
          <h2 className="text-dark text-lg font-semibold">{product.title}</h2>
          <p className="text-primary font-bold text-xl mt-2">${product.price.toFixed(2)}</p>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            dispatch(addToCart(product));
          }}
          className="ml-4 bg-primary text-bgwhite rounded-lg py-2 px-4 font-semibold hover:bg-[#b00812] transition"
        >
          Add to Cart
        </button>
      </div>
    );
  }

  // grid layout (default)
  return (
    <div className="border rounded-lg p-4 shadow-sm hover:shadow-lg transition cursor-pointer flex flex-col mb-6 bg-bgwhite border-primary">
      <img
        src={product.image}
        alt={product.title}
        className="h-48 w-full object-contain mb-4 rounded"
      />
      <h2 className="text-dark text-lg font-semibold">{product.title}</h2>
      <p className="text-primary font-bold text-xl mt-auto">${product.price.toFixed(2)}</p>
      <button
        onClick={(e) => {
          e.stopPropagation();
          dispatch(addToCart(product));
        }}
        className="mt-4 bg-primary text-bgwhite rounded-lg py-2 font-semibold hover:bg-[#b00812] transition"
      >
        Add to Cart
      </button>
    </div>
  );
}
