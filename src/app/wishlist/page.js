"use client";
import Link from "next/link";
import ProductCard from "@/components/cards/ProductCard";
import { useWishlist } from "@/context/WishlistContext";
import { useLanguage } from "@/context/LanguageContext";
export default function WishlistPage() {
  const { items } = useWishlist(); const { language } = useLanguage();
  return <main className="container-main py-10 md:py-16"><h1 className="font-integral text-3xl font-bold md:text-5xl">{language === "ru" ? "ИЗБРАННОЕ" : "WISHLIST"}</h1>{items.length ? <div className="mt-8 grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">{items.map((product)=><ProductCard key={product.id} product={product}/>)}</div> : <div className="mt-8 rounded-3xl bg-[#f2f2f2] p-10 text-center"><p>{language === "ru" ? "В избранном пока ничего нет." : "Your wishlist is empty."}</p><Link href="/category/all" className="mt-5 inline-block rounded-full bg-black px-7 py-3 font-semibold text-white">{language === "ru" ? "Перейти к товарам" : "Browse products"}</Link></div>}</main>;
}
