'use client';

const categories = [
  {
    id: 1,
    name: 'Electronics',
    image:
      'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 2,
    name: 'Fashion',
    image:
      'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 3,
    name: 'Home & Garden',
    image:
      'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 4,
    name: 'Sports',
    image:
      'https://images.unsplash.com/photo-1508609349937-5ec4ae374ebf?auto=format&fit=crop&w=400&q=80',
  },
];

export default function Categories() {
  return (
    <section className="max-w-7xl mx-auto px-6 md:px-12 my-16">
      <h2 className="text-2xl font-semibold mb-8">Popular Categories</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="relative rounded-lg overflow-hidden cursor-pointer group shadow-md hover:shadow-lg transition"
          >
            <img
              src={cat.image}
              alt={cat.name}
              className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <h3 className="text-white text-lg font-semibold">{cat.name}</h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
