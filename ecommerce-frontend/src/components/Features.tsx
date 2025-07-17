import { Truck, Shield, Clock, Star } from 'lucide-react';

const features = [
  {
    icon: Truck,
    title: 'Free Shipping',
    description: 'On orders over $50',
    color: 'text-green-500',
  },
  {
    icon: Shield,
    title: 'Secure Payment',
    description: '100% secure checkout',
    color: 'text-blue-500',
  },
  {
    icon: Clock,
    title: 'Fast Delivery',
    description: 'Same day shipping',
    color: 'text-orange-500',
  },
  {
    icon: Star,
    title: 'Premium Quality',
    description: 'Best products guaranteed',
    color: 'text-yellow-500',
  },
];

export default function Features() {
  return (
    <section className="bg-gradient-to-r from-gray-50 to-gray-100 py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-blackheading mb-4">
            Why Choose Us?
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            We provide the best shopping experience with premium services and exceptional customer support.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="text-center group hover:transform hover:scale-105 transition-all duration-300"
            >
              <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full bg-white shadow-lg mb-6 group-hover:shadow-xl transition-shadow ${feature.color}`}>
                <feature.icon className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-semibold text-blackheading mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 