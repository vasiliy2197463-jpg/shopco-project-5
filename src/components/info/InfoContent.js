"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function InfoContent({ page }) {
  const { language } = useLanguage();
  const content = page[language] || page.en;

  return (
    <main className="container-main py-12 md:py-20">
      <div className="mx-auto max-w-3xl rounded-[32px] bg-[#f2f2f2] p-7 md:p-12">
        <div className="mb-5 inline-flex rounded-full bg-[#d7ff5f] px-4 py-2 text-xs font-bold uppercase tracking-wider">{language === "ru" ? "Демонстрационный магазин" : "Demo store"}</div>
        <h1 className="font-integral text-3xl font-bold md:text-5xl">{content.title}</h1>
        <p className="mt-6 text-lg leading-8 text-black/65">{content.text}</p>
        {content.sections?.length > 0 && <div className="mt-8 space-y-4">{content.sections.map((section)=><section key={section.title} className="rounded-2xl bg-white p-5 md:p-6"><h2 className="text-lg font-bold md:text-xl">{section.title}</h2><p className="mt-2 leading-7 text-black/60">{section.text}</p></section>)}</div>}
        <p className="mt-8 border-t border-black/10 pt-5 text-sm leading-6 text-black/45">{language === "ru" ? "Последнее обновление: 18 сентября 2026 года. Эти правила описывают учебную демонстрацию и не являются публичной офертой." : "Last updated: September 18, 2026. These rules describe a training demo and do not constitute a commercial offer."}</p>
      </div>
    </main>
  );
}
