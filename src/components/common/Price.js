'use client';
import React from 'react';
import Badge from './Badge';
import { useLanguage } from '@/context/LanguageContext';

export default function Price({ price, originalPrice = null, discount = null, size = 'md' }) {
  const { language } = useLanguage();
  const money = (value) => language === 'ru' ? `${Number(value).toLocaleString('ru-RU')} $` : `$${Number(value).toLocaleString('en-US')}`;
  const sizes = {
    sm: "text-base sm:text-lg",
    md: "text-lg sm:text-xl",
    lg: "text-xl sm:text-2xl",
  };
  
  const textSize = sizes[size] || sizes.md;

  return (
    <div className={`flex items-center space-x-3 font-satoshi ${textSize}`}>
      <span className="font-bold text-primary">{money(price)}</span>
      
      {originalPrice && (
        <span className="font-bold text-gray-400 line-through">
          {money(originalPrice)}
        </span>
      )}
      
      {discount && (
        <Badge discount={discount} />
      )}
    </div>
  );
}
