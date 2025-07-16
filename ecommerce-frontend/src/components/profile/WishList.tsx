import type { Product } from '@/types';

type WishlistProps = {
  wishlist?: Product[];
};

export function Wishlist({ wishlist }: WishlistProps) {
  if (!wishlist || wishlist.length === 0) return null;

  return (
    <section className="mt-10">
      <h2 className="text-xl font-semibold mb-4">Wishlist</h2>
      <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-60 overflow-y-auto">
        {wishlist.map((product) => (
          <li
            key={product.id}
            className="bg-white rounded-lg shadow p-3 flex flex-col items-center"
          >
            <img
              src={product.image}
              alt={product.title}
              className="w-20 h-20 object-cover rounded mb-2"
            />
            <p className="text-sm font-semibold text-center">{product.title}</p>
            <p className="text-primary font-semibold">${product.price.toFixed(2)}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
