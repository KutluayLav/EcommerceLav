'use client';

export default function Footer() {
  return (
    <footer className="bg-primary text-bgwhite py-8 px-6 md:px-12  bottom-0 left-0 w-full">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
        <h2 className="text-xl font-bold text-white">LavShop</h2>

        <nav className="flex space-x-6 text-bgwhite text-sm font-medium">
          <a href="/privacy" className="hover:underline">
            Privacy Policy
          </a>
          <a href="/terms" className="hover:underline">
            Terms of Service
          </a>
          <a href="/contact" className="hover:underline">
            Contact
          </a>
        </nav>
      </div>

      <div className="w-full border-t border-bgwhite/30 mt-6 "></div>
      <div className="text-center text-bgwhite/70 text-xs mt-6">
        &copy; {new Date().getFullYear()} LavShop. All rights reserved.
      </div>
    </footer>
  );
}
