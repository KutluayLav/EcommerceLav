'use client';

const promos = [
  {
    id: 1,
    title: 'Summer Sale - Up to 50% Off!',
    description: 'Grab your favorite items at half price.',
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 2,
    title: 'New Arrivals for 2025',
    description: 'Check out the latest products in our store.',
    image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=800&q=80',
  },
];

export default function Promotions() {
  return (
    <section className="max-w-7xl mx-auto px-6 md:px-12 my-16">
      <h2 className="text-2xl font-semibold mb-6">Promotions</h2>
      <div className="space-y-8">
        {promos.map((promo) => (
          <div key={promo.id} className="relative rounded-lg overflow-hidden shadow-lg group cursor-pointer">
            <img
              src={promo.image}
              alt={promo.title}
              className="w-full h-56 sm:h-72 object-cover transition-transform group-hover:scale-105 duration-300"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center items-center text-center p-6 text-white">
              <h3 className="text-3xl font-bold mb-2">{promo.title}</h3>
              <p className="max-w-xl">{promo.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
