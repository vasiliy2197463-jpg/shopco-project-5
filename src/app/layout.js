import './globals.css';
import { CartProvider } from '@/context/CartContext';
import StorefrontChrome from '@/components/layout/StorefrontChrome';
import { LanguageProvider } from '@/context/LanguageContext';
import SiteTranslator from '@/components/common/SiteTranslator';
import { AuthProvider } from '@/context/AuthContext';

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
          <AuthProvider>
            <CartProvider>
              <StorefrontChrome>{children}</StorefrontChrome>
            </CartProvider>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
