"use client";

import Link from "next/link";
import { FaGithub } from "react-icons/fa";
import { useLanguage } from "@/context/LanguageContext";

const columns = {
  ru: [
    ["Магазин", [["О нас", "/info/about"], ["Каталог", "/category/all"], ["Новинки", "/category/new-arrivals"], ["Распродажа", "/category/on-sale"]]],
    ["Помощь", [["Поддержка покупателей", "/info/support"], ["Доставка", "/info/delivery"], ["Возврат", "/info/returns"], ["Условия использования", "/info/terms"]]],
    ["Покупателю", [["Личный кабинет", "/account"], ["Мои заказы", "/account"], ["Избранное", "/wishlist"], ["Сравнение", "/compare"]]],
    ["Информация", [["Таблица размеров", "/info/sizes"], ["Оплата", "/info/payments"], ["Конфиденциальность", "/info/privacy"], ["Исходный код", "https://github.com/vasiliy2197463-jpg/shopco-project-5"]]],
  ],
  en: [
    ["Shop", [["About us", "/info/about"], ["Catalog", "/category/all"], ["New arrivals", "/category/new-arrivals"], ["On sale", "/category/on-sale"]]],
    ["Help", [["Customer support", "/info/support"], ["Delivery", "/info/delivery"], ["Returns", "/info/returns"], ["Terms and conditions", "/info/terms"]]],
    ["Customer", [["My account", "/account"], ["My orders", "/account"], ["Wishlist", "/wishlist"], ["Compare", "/compare"]]],
    ["Information", [["Size guide", "/info/sizes"], ["Payments", "/info/payments"], ["Privacy", "/info/privacy"], ["Source code", "https://github.com/vasiliy2197463-jpg/shopco-project-5"]]],
  ],
};

export default function Footer() {
  const { language } = useLanguage();
  const ru = language === "ru";

  return (
    <footer className="relative bg-[#f0f0f0] px-4 pb-8 pt-20 font-satoshi md:px-6 md:pt-24">
      <div className="mx-auto max-w-[1240px]">
        <div className="grid gap-10 border-b border-black/10 pb-12 sm:grid-cols-2 lg:grid-cols-[1.25fr_repeat(4,1fr)]">
          <div>
            <h2 className="font-integral text-[30px] font-bold tracking-tight">LUCHIK.CO</h2>
            <p className="mt-5 max-w-xs text-sm leading-6 text-black/55">{ru ? "Демонстрационный интернет-магазин одежды с каталогом, заказами и личным кабинетом." : "A demo fashion store with a catalog, orders, and customer accounts."}</p>
            <a href="https://github.com/vasiliy2197463-jpg/shopco-project-5" target="_blank" rel="noreferrer" className="mt-5 inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white transition-colors hover:bg-black hover:text-white" aria-label="GitHub"><FaGithub /></a>
          </div>
          {columns[language].map(([title, links]) => <div key={title}><h3 className="mb-5 font-semibold uppercase tracking-[0.16em]">{title}</h3><ul className="space-y-3 text-sm">{links.map(([label,href])=><li key={label}><Link href={href} className="text-black/55 transition-colors hover:text-black">{label}</Link></li>)}</ul></div>)}
        </div>

        <div className="flex flex-col gap-5 pt-7 lg:flex-row lg:items-center lg:justify-between">
          <div><p className="text-sm text-black/55">LUCHIK.CO © 2026. {ru ? "Учебная демонстрация." : "Training demo."}</p><p className="mt-1 text-xs text-black/35">{ru ? "Реальные платежи и доставка не подключены." : "Real payments and delivery are not connected."}</p></div>
          <div className="flex flex-wrap gap-2">{["VISA", "Mastercard", "PayPal", "Apple Pay", "Google Pay"].map((name)=><span key={name} className="rounded-lg border border-black/5 bg-white px-3 py-2 text-xs font-bold shadow-sm">{name}</span>)}</div>
        </div>
      </div>
    </footer>
  );
}
