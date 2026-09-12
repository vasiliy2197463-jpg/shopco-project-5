import Hero from '@/components/sections/Hero';
import BrandLogos from '@/components/sections/BrandLogos';
import NewArrivals from '@/components/sections/NewArrivals';
import TopSelling from '@/components/sections/TopSelling';
import DressStyle from '@/components/sections/DressStyle';
import HappyCustomers from '@/components/sections/HappyCustomers';

export const metadata = {
  title: 'SHOP.CO - Find Clothes That Matches Your Style',
  description: 'Browse through our diverse range of meticulously crafted garments, designed to bring out your individuality and cater to your sense of style.',
};

export default function Home() {
  return (
    <main>
      <Hero />
      <BrandLogos />
      <NewArrivals />
      <TopSelling />
      <DressStyle />
      <HappyCustomers />
    </main>
  );
}
