"use client";
import Link from "next/link";
import Image from "@/components/common/BaseImage";
import { useCompare } from "@/context/CompareContext";
import { useLanguage } from "@/context/LanguageContext";

export default function ComparePage() {
  const { items, toggleCompare, clearCompare } = useCompare();
  const { language } = useLanguage();
  const ru = language === "ru";
  const money = (value) => ru ? `${Number(value).toLocaleString("ru-RU")} $` : `$${Number(value).toLocaleString("en-US")}`;
  if (!items.length) return <main className="container-main min-h-[50vh] py-20 text-center"><h1 className="font-integral text-4xl font-bold">{ru ? "СРАВНЕНИЕ ТОВАРОВ" : "COMPARE PRODUCTS"}</h1><p className="mt-4 text-black/50">{ru ? "Добавьте товары, чтобы сравнить их характеристики." : "Add products to compare their details."}</p><Link href="/category/all" className="mt-7 inline-block rounded-full bg-black px-8 py-3 font-semibold text-white">{ru ? "Открыть каталог" : "Open catalog"}</Link></main>;
  return <main className="container-main py-8 md:py-16"><div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center"><h1 className="font-integral text-2xl font-bold sm:text-3xl md:text-5xl">{ru ? "СРАВНЕНИЕ ТОВАРОВ" : "COMPARE PRODUCTS"}</h1><button onClick={clearCompare} className="rounded-full border border-black/15 px-5 py-2.5 text-sm font-semibold sm:text-base">{ru ? "Очистить всё" : "Clear all"}</button></div><div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">{items.map((product)=><article key={product.id} className="min-w-0 rounded-3xl border border-black/10 p-4"><Link href={`/item/?id=${product.id}`}><div className="relative aspect-square rounded-2xl bg-[#f2f2f2]"><Image src={product.images?.[0]} alt={product.name} fill className="object-contain p-3" /></div><h2 className="mt-4 break-words font-bold">{product.name}</h2></Link><div className="mt-4 space-y-3 break-words text-sm"><p><b>{ru?"Цена":"Price"}:</b> {money(product.price)}</p><p><b>{ru?"Оценка":"Rating"}:</b> {product.rating}/5</p><p><b>{ru?"Категория":"Category"}:</b> {product.category}</p><p><b>{ru?"Цвета":"Colors"}:</b> {product.availableColors?.map((color)=>color.name).join(", ") || "—"}</p><p><b>{ru?"Размеры":"Sizes"}:</b> {product.availableSizes?.join(", ") || "—"}</p><p><b>{ru?"Остаток":"Stock"}:</b> {product.stock ?? "—"}</p></div><button onClick={()=>toggleCompare(product)} className="mt-5 w-full rounded-full bg-black py-2.5 font-semibold text-white">{ru ? "Убрать" : "Remove"}</button></article>)}</div></main>;
}
