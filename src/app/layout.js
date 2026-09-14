import './globals.css';
import { CartProvider } from '@/context/CartContext';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import Navbar from '@/components/layout/Navbar';
import Newsletter from '@/components/layout/Newsletter';
import Footer from '@/components/layout/Footer';
import { LanguageProvider } from '@/context/LanguageContext';
import SiteTranslator from '@/components/common/SiteTranslator';

export const metadata = {
  title: 'SHOP.CO | Find Clothes That Matches Your Style',
  description: 'Discover the latest fashion trends and high-quality clothing at SHOP.CO. Find clothes that match your style for every occasion.',
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className="antialiased bg-white text-black min-h-screen flex flex-col">
        <LanguageProvider>
          <SiteTranslator />
          <CartProvider>
            <AnnouncementBar />
            <Navbar />
            <main className="flex-grow overflow-x-hidden">
              {children}
            </main>
            <Newsletter />
            <Footer />
          </CartProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
