"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Breadcrumb from "@/components/common/Breadcrumb";
import SectionHeading from "@/components/common/SectionHeading";
import ProductCard from "@/components/cards/ProductCard";
import ProductGallery from "@/components/product/ProductGallery";
import ProductInfo from "@/components/product/ProductInfo";
import ProductTabs from "@/components/product/ProductTabs";
import RecentlyViewed, { rememberProduct } from "@/components/product/RecentlyViewed";
import { useCatalog } from "@/context/CatalogContext";
import { useLanguage } from "@/context/LanguageContext";
import { reviews } from "@/data/reviews";

function ItemContent() {
  const searchParams = useSearchParams();
  const { products, loading } = useCatalog();
  const { language } = useLanguage();
  const ru = language === "ru";
  const product = products.find((item) => item.id === Number(searchParams.get("id")));
  const [selectedColor, setSelectedColor] = useState(null);
  const [reviewSummary, setReviewSummary] = useState(null);

  useEffect(() => {
    setSelectedColor(product?.availableColors?.[0] || null);
  }, [product?.id]);

  useEffect(() => { if (product) rememberProduct(product); }, [product]);

  if (loading) return <main className="container-main min-h-[50vh] py-20 text-center">{ru ? "Загрузка товара…" : "Loading product…"}</main>;
  if (!product) return <main className="container-main min-h-[50vh] py-20 text-center"><h1 className="font-integral text-3xl font-bold">{ru ? "Товар недоступен" : "PRODUCT UNAVAILABLE"}</h1><p className="mt-3 text-black/50">{ru ? "Возможно, он снят с публикации." : "It may have been removed from the catalog."}</p></main>;

  const galleryImages = product.images?.length ? selectedColor?.images || (selectedColor?.image ? [selectedColor.image] : product.images) : [];
  const relatedProducts = products.filter((item) => item.id !== product.id).slice(0, 4);
  const displayedProduct = reviewSummary ? { ...product, rating: reviewSummary.rating, reviewCount: reviewSummary.count } : product;

  return <main className="container-main py-6 md:py-10">
    <div className="mb-6 md:mb-8"><Breadcrumb items={[{ label: ru ? "Главная" : "Home", href: "/" }, { label: ru ? "Магазин" : "Shop", href: "/category/all" }, { label: product.category, href: `/category/${product.category}` }, { label: product.name }]} /></div>
    <div className="mb-12 grid grid-cols-1 gap-8 md:mb-20 md:gap-12 lg:grid-cols-2"><ProductGallery images={galleryImages} /><ProductInfo product={displayedProduct} selectedColor={selectedColor} onColorChange={setSelectedColor} /></div>
    <div className="mb-16 md:mb-24"><ProductTabs product={product} reviews={reviews} onSummaryChange={setReviewSummary} /></div>
    {relatedProducts.length > 0 && <div><SectionHeading title={ru ? "ВАМ ТАКЖЕ МОЖЕТ ПОНРАВИТЬСЯ" : "YOU MIGHT ALSO LIKE"} center /><div className="mt-8 grid grid-cols-2 gap-4 md:mt-12 md:grid-cols-4 md:gap-6">{relatedProducts.map((item) => <ProductCard key={item.id} product={item} />)}</div></div>}
    <RecentlyViewed excludeId={product.id} />
  </main>;
}

export default function ItemPage() {
  const { language } = useLanguage();
  return <Suspense fallback={<main className="container-main min-h-[50vh] py-20 text-center">{language === "ru" ? "Загрузка…" : "Loading…"}</main>}><ItemContent /></Suspense>;
}
