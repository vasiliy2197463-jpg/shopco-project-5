'use client';
import { use, useState } from 'react';
import Breadcrumb from '@/components/common/Breadcrumb';
import SectionHeading from '@/components/common/SectionHeading';
import ProductCard from '@/components/cards/ProductCard';
import ProductGallery from '@/components/product/ProductGallery';
import ProductInfo from '@/components/product/ProductInfo';
import ProductTabs from '@/components/product/ProductTabs';
import { getProductById, products } from '@/data/products';
import { reviews } from '@/data/reviews';

export default function ProductPage({ params }) {
  // Unwrap params using React.use() for Next.js 15
  const unwrappedParams = use(params);
  const { id } = unwrappedParams;
  
  const product = getProductById(id) || products[0]; // fallback to first product if not found
  const [selectedColor, setSelectedColor] = useState(product.availableColors?.[0] || null);
  const galleryImages = product?.images?.length
    ? [selectedColor?.image || product.images[0], ...product.images.slice(1)]
    : [];
  
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Shop', href: '/shop' },
    { label: product?.category || 'Men', href: '/shop?category=men' },
    { label: product?.name || 'Product', href: `/product/${id}` }
  ];

  // Get 4 related products (dummy logic: just take first 4)
  const relatedProducts = products.slice(0, 4);

  return (
    <main className="container-main py-6 md:py-10">
      <div className="mb-6 md:mb-8">
        <Breadcrumb items={breadcrumbItems} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 mb-12 md:mb-20">
        {/* Left: Gallery */}
        <div>
          <ProductGallery images={galleryImages} />
        </div>

        {/* Right: Info */}
        <div>
          <ProductInfo product={product} selectedColor={selectedColor} onColorChange={setSelectedColor} />
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-16 md:mb-24">
        <ProductTabs product={product} reviews={reviews} />
      </div>

      {/* You Might Also Like */}
      <div>
        <SectionHeading title="YOU MIGHT ALSO LIKE" center />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-8 md:mt-12">
          {relatedProducts.map((rp) => (
            <ProductCard key={rp.id} product={rp} />
          ))}
        </div>
      </div>
    </main>
  );
}
