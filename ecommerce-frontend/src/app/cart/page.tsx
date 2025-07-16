'use client';

import { useState } from 'react';

interface CartItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
}

const initialCart: CartItem[] = [
  {
    id: '1',
    title: 'Wireless Headphones',
    price: 199.99,
    quantity: 1,
    image:
      'https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=crop&w=80&q=80',
  },
  {
    id: '2',
    title: 'Smartphone',
    price: 699.99,
    quantity: 2,
    image:
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=80&q=80',
  },
];

const TAX_RATE = 0.18;
const SHIPPING_FEE = 15;

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCart);

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return;
    setCartItems((items) =>
      items.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const removeItem = (id: string) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax + (cartItems.length > 0 ? SHIPPING_FEE : 0);

  return (
    <main className="max-w-7xl mx-auto p-4 sm:p-8 text-darkgray min-h-screen flex flex-col">
      <h1 className="text-4xl font-extrabold mb-10 text-blackheading">Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <p className="text-center text-gray-500 text-lg mt-20">Your cart is empty.</p>
      ) : (
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Ürün listesi */}
          <section className="flex-1 space-y-6">
            {cartItems.map(({ id, title, price, quantity, image }) => (
              <article
                key={id}
                className="flex flex-col sm:flex-row items-center sm:items-start gap-5 border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition"
              >
                <img
                  src={image}
                  alt={title}
                  className="w-32 h-32 rounded-lg object-cover flex-shrink-0"
                />

                <div className="flex-1 w-full">
                  <h2 className="text-xl font-semibold text-blackheading">{title}</h2>
                  <p className="text-primary font-semibold text-lg mt-1">${price.toFixed(2)}</p>

                  {/* Miktar seçici */}
                  <div className="mt-4 flex items-center gap-3">
                    <button
                      aria-label={`Decrease quantity of ${title}`}
                      onClick={() => updateQuantity(id, quantity - 1)}
                      className="w-10 h-10 rounded border border-gray-300 flex justify-center items-center hover:bg-gray-100 transition text-xl font-bold select-none"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      min={1}
                      value={quantity}
                      onChange={(e) => updateQuantity(id, Number(e.target.value))}
                      aria-label={`Quantity of ${title}`}
                      className="w-16 text-center border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <button
                      aria-label={`Increase quantity of ${title}`}
                      onClick={() => updateQuantity(id, quantity + 1)}
                      className="w-10 h-10 rounded border border-gray-300 flex justify-center items-center hover:bg-gray-100 transition text-xl font-bold select-none"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Kaldır butonu */}
                <button
                  onClick={() => removeItem(id)}
                  aria-label={`Remove ${title} from cart`}
                  className="text-red-600 hover:underline mt-3 sm:mt-0 font-semibold"
                >
                  Remove
                </button>
              </article>
            ))}
          </section>

          {/* Özet */}
          <aside className="w-full max-w-md bg-bgwhite rounded-xl shadow-lg p-6 flex flex-col sticky top-24 h-fit">
            <h3 className="text-2xl font-bold mb-6 text-blackheading">Order Summary</h3>
            <div className="flex justify-between mb-3 text-lg">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-3 text-lg">
              <span>Tax (18%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-6 text-lg">
              <span>Shipping</span>
              <span>${cartItems.length > 0 ? SHIPPING_FEE.toFixed(2) : '0.00'}</span>
            </div>
            <div className="border-t border-gray-300 pt-4 flex justify-between font-extrabold text-2xl text-blackheading">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <a
              href="/checkout"
              className="mt-8 bg-primary text-bgwhite py-3 rounded-lg text-center font-semibold hover:bg-red-700 transition"
            >
              Proceed to Checkout
            </a>
          </aside>
        </div>
      )}
    </main>
  );
}
