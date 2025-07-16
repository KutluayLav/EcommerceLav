export default function Newsletter() {
  return (
    <section className="bg-gray-100 py-12 mt-20">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <h2 className="text-2xl font-semibold mb-4">Subscribe to Our Newsletter</h2>
        <p className="mb-6 text-gray-600">Get the latest updates, offers, and product news.</p>
        <form className="flex flex-col sm:flex-row justify-center gap-4">
          <input
            type="email"
            placeholder="Enter your email"
            className="px-4 py-2 border border-gray-300 rounded-md w-full sm:w-auto"
          />
          <button type="submit" className="bg-primary text-white px-6 py-2 rounded-md">
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}
