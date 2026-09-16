"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/cards/ProductCard";
import SectionHeading from "@/components/common/SectionHeading";
import { useLanguage } from "@/context/LanguageContext";

const STORAGE_KEY = "shopco_recently_viewed";

export function rememberProduct(product) {
  if (typeof window === "undefined" || !product) return;
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  const next = [product, ...saved.filter((item) => Number(item.id) !== Number(product.id))].slice(0, 8);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

export default function RecentlyViewed({ excludeId }) {
  const { language } = useLanguage();
  const [items, setItems] = useState([]);
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    setItems(saved.filter((item) => Number(item.id) !== Number(excludeId)).slice(0, 4));
  }, [excludeId]);
  if (!items.length) return null;
  return <section className="mt-16 md:mt-24"><SectionHeading title={language === "ru" ? "НЕДАВНО ПРОСМОТРЕННЫЕ" : "RECENTLY VIEWED"} center /><div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">{items.map((item) => <ProductCard key={item.id} product={item} />)}</div></section>;
}
