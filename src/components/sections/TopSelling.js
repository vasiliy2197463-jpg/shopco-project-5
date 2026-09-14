'use client';

import Link from 'next/link';
import SectionHeading from '@/components/common/SectionHeading';
import ProductCard from '@/components/cards/ProductCard';
import Button from '@/components/common/Button';
import { useCatalog } from '@/context/CatalogContext';

export default function TopSelling() {
  const { products } = useCatalog();
  const topSelling = [7, 8, 9, 12].map(id => products.find(p => p.id === id)).filter(Boolean);

  return (
    <section className="py-16">
      <div className="container-main mx-auto px-4 lg:px-8">
        <SectionHeading title="TOP SELLING" className="mb-10 text-center" />
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5 mb-10">
          {topSelling.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        
        <div className="flex justify-center">
          <Link href="/category/casual" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full sm:w-[218px] rounded-pill">
              View All
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
