export default function Newsletter() {
  return (
    <section className="bg-primary py-16">
      <div className="max-w-4xl mx-auto px-4 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">
          Stay Updated with Our Deals!
        </h2>
        <p className="text-white/90 mb-8 text-lg max-w-2xl mx-auto">
          Subscribe to our newsletter and be the first to know about exclusive offers, new products, and special discounts.
        </p>
        
        <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 px-4 py-3 rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white bg-white"
            required
          />
          <button 
            type="submit" 
            className="bg-white text-primary px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Subscribe
          </button>
        </form>
        
        <p className="text-white/70 text-sm mt-4">
          No spam, unsubscribe at any time. We respect your privacy.
        </p>
      </div>
    </section>
  );
}
