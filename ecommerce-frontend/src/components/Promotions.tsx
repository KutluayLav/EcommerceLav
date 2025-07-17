'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Clock } from 'lucide-react';

const promos = [
  {
    id: 1,
    title: 'Summer Sale - Up to 70% Off!',
    description: 'Grab your favorite items at incredible prices. Limited time offer!',
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80',
    badge: 'HOT DEAL',
    badgeColor: 'bg-red-500',
    category: 'electronics',
    discount: '70%',
    endDate: '2024-02-15',
  },
  {
    id: 2,
    title: 'New Arrivals for 2025',
    description: 'Discover the latest trends and innovative products in our store.',
    image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=800&q=80',
    badge: 'NEW',
    badgeColor: 'bg-blue-500',
    category: 'fashion',
    discount: '20%',
    endDate: '2024-02-20',
  },
  {
    id: 3,
    title: 'Free Shipping on Orders Over $50',
    description: 'Shop smart and save on shipping. Valid on all orders above $50.',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80',
    badge: 'FREE SHIPPING',
    badgeColor: 'bg-green-500',
    category: 'all',
    discount: '100%',
    endDate: '2024-12-31',
  },
  {
    id: 4,
    title: 'Student Discount - 15% Off',
    description: 'Special discount for students. Show your student ID and save more!',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80',
    badge: 'STUDENT',
    badgeColor: 'bg-purple-500',
    category: 'books',
    discount: '15%',
    endDate: '2024-06-30',
  },
];

export default function Promotions() {
  const [activePromo, setActivePromo] = useState(0);

  const getDaysLeft = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-extrabold text-blackheading mb-4">
          Special Offers & Promotions
        </h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Discover amazing deals, discounts, and exclusive offers. Don't miss out on these limited-time opportunities!
        </p>
      </div>

      {/* Main Promotions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {promos.map((promo, index) => (
          <div
            key={promo.id}
            className="relative group cursor-pointer overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500"
            onMouseEnter={() => setActivePromo(index)}
          >
            {/* Background Image */}
            <div className="relative h-80 overflow-hidden">
              <img
                src={promo.image}
                alt={promo.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
              
              {/* Badge */}
              <div className={`absolute top-4 left-4 ${promo.badgeColor} text-white px-3 py-1 rounded-full text-sm font-semibold`}>
                {promo.badge}
              </div>
              
              {/* Discount Badge */}
              <div className="absolute top-4 right-4 bg-white/90 text-black px-3 py-1 rounded-full text-sm font-bold">
                {promo.discount} OFF
              </div>
              
              {/* Countdown */}
              <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                <Clock className="inline h-4 w-4 mr-1" />
                {getDaysLeft(promo.endDate)} days left
              </div>
            </div>

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
                {promo.title}
              </h3>
              <p className="text-white/90 mb-4 text-sm">
                {promo.description}
              </p>
              
              {/* Action Button */}
              <Link
                href={`/categories/${promo.category}`}
                className="inline-flex items-center gap-2 bg-white text-black px-4 py-2 rounded-lg font-semibold hover:bg-primary hover:text-white transition-all duration-300 group-hover:translate-x-1"
              >
                Shop Now
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
