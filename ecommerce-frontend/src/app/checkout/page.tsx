'use client';

import { useState } from 'react';

export default function CheckoutPage() {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
    paymentMethod: 'creditCard',
  });

  const [orderConfirmed, setOrderConfirmed] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setOrderConfirmed(true);
  };

  if (orderConfirmed) {
    return (
      <main className="max-w-2xl mx-auto p-6 text-center flex flex-col items-center justify-center min-h-[70vh]">
        <h1 className="text-3xl font-bold mb-4 text-blackheading">
          Thank you for your order!
        </h1>
        <p className="mb-6 text-darkgray">
          Your order has been received and is being processed.
        </p>
        <a
          href="/"
          className="bg-primary text-bgwhite px-6 py-3 rounded hover:bg-red-700 transition font-semibold"
        >
          Back to Home
        </a>
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-extrabold mb-10 text-blackheading">Checkout</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-xl p-6 sm:p-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* SHIPPING */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blackheading">Shipping Address</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                required
                value={form.fullName}
                onChange={handleChange}
                className="input p-4 border col-span-full"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                required
                value={form.email}
                onChange={handleChange}
                className="input p-4 border col-span-full"
              />
              <input
                type="text"
                name="address"
                placeholder="Address"
                required
                value={form.address}
                onChange={handleChange}
                className="input col-span-full p-4 border"
              />
              <input
                type="text"
                name="city"
                placeholder="City"
                required
                value={form.city}
                onChange={handleChange}
                className="input p-4 border"
              />
              <input
                type="text"
                name="postalCode"
                placeholder="Postal Code"
                required
                value={form.postalCode}
                onChange={handleChange}
                className="input p-4 border"
              />
              <input
                type="text"
                name="country"
                placeholder="Country"
                required
                value={form.country}
                onChange={handleChange}
                className="input p-4 border"
              />
            </div>
          </section>

          {/* PAYMENT */}
          <section className="flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-semibold mb-4 text-blackheading">Payment Method</h2>
              <div className="space-y-3">
                {[
                  { id: 'creditCard', label: 'Credit Card (Simulated)' },
                  { id: 'paypal', label: 'PayPal (Simulated)' },
                  { id: 'cash', label: 'Cash on Delivery' },
                ].map((option) => (
                  <label
                    key={option.id}
                    className={`flex items-center border rounded-lg px-4 py-3 cursor-pointer transition ${
                      form.paymentMethod === option.id
                        ? 'border-primary bg-primary/10'
                        : 'border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={option.id}
                      checked={form.paymentMethod === option.id}
                      onChange={handleChange}
                      className="mr-3 accent-primary"
                    />
                    <span className="text-darkgray">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* SUBMIT */}
            <div className="mt-8 md:mt-auto">
              <button
                type="submit"
                className="w-full bg-primary text-bgwhite py-3 rounded text-lg font-semibold hover:bg-red-700 transition"
              >
                Confirm Order
              </button>
            </div>
          </section>
        </div>
      </form>
    </main>
  );
}
