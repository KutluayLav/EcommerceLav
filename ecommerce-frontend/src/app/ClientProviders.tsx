'use client';

import { Provider } from 'react-redux';
import { store } from '@/store';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </div>
    </Provider>
  );
}
