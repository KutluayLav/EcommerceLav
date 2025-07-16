'use client';

export default function Hero() {
  return (
    <section className="bg-primary text-bgwhite py-20 px-6 md:px-12  shadow-lg">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Sol metin alanı */}
        <div className="max-w-xl">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
            Discover the latest <br /> in tech & fashion
          </h1>
          <p className="text-bgwhite/80 mb-6">
            Shop the newest gadgets, clothes, and more. Quality products at unbeatable prices.
          </p>
          <button className="bg-bgwhite text-primary font-semibold px-6 py-3 rounded-lg shadow hover:bg-gray-100 transition">
            Shop Now
          </button>
        </div>
        {/* Sağdaki görsel */}
        <img
          src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=600&q=80"
          alt="Hero Banner"
          className="w-full max-w-md rounded-lg shadow-lg object-cover"
        />
      </div>
    </section>
  );
}
