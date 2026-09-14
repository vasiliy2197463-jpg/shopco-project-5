'use client';

import { useState } from 'react';
import { IoClose } from 'react-icons/io5';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export default function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true);
  const { language } = useLanguage();

  const copy = language === 'ru'
    ? { message: 'Большая распродажа в SHOP.CO — скидки до 50% на избранные товары.', action: 'Перейти к покупкам' }
    : { message: 'Big sale at SHOP.CO — save up to 50% on selected items.', action: 'Shop Now' };

  if (!isVisible) return null;

  return (
    <div className="announcement-bar bg-black text-white w-full h-[40px] flex items-center relative z-50 overflow-hidden">
      <div className="announcement-marquee" aria-label={copy.message}>
        {[0, 1].map((copyIndex) => (
          <div className="announcement-marquee__group" aria-hidden={copyIndex === 1} key={copyIndex}>
            {[0, 1, 2].map((itemIndex) => (
              <span className="announcement-marquee__item" key={itemIndex}>
                {copy.message}
                <Link href="/category/all" className="underline font-semibold hover:text-gray-300 transition-colors">
                  {copy.action}
                </Link>
              </span>
            ))}
          </div>
        ))}
      </div>

      <button 
        onClick={() => setIsVisible(false)}
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-10"
        aria-label="Close announcement"
      >
        <IoClose size={20} />
      </button>
    </div>
  );
}
