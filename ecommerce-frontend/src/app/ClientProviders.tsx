'use client';

import { Provider } from 'react-redux';
import { store } from '@/store';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { usePathname } from 'next/navigation';

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith('/admin');

  return (
    <Provider store={store}>
      <div className="min-h-screen flex flex-col">
        {!isAdminPage && <Navbar />}
        <main className="flex-grow">
          {children}
        </main>
        {!isAdminPage && <Footer />}
      </div>
    </Provider>
  );
}
