"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function InfoContent({ page }) {
  const { language } = useLanguage();
  const content = page[language] || page.en;

  return (
    <main className="container-main py-12 md:py-20">
      <div className="mx-auto max-w-3xl rounded-[32px] bg-[#f2f2f2] p-7 md:p-12">
        <h1 className="font-integral text-3xl font-bold md:text-5xl">{content.title}</h1>
        <p className="mt-6 text-lg leading-8 text-black/65">{content.text}</p>
      </div>
    </main>
  );
}
