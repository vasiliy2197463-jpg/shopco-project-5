'use client';
import { useLanguage } from '@/context/LanguageContext';

export default function SizeSelector({ sizes = [], selectedSize, onSizeChange }) {
  const { language } = useLanguage();
  if (!sizes || !sizes.length) return null;

  return (
    <div>
      <span className="block text-gray-600 mb-3 text-sm md:text-base font-normal normal-case">{language === 'ru' ? 'Выберите размер' : 'Choose Size'}</span>
      <div className="flex gap-3 flex-wrap">
        {sizes.map((size, idx) => {
          const isSelected = selectedSize === size;
          return (
            <button
              key={idx}
              onClick={() => onSizeChange(size)}
              className={`px-6 py-3 rounded-pill text-sm font-medium cursor-pointer transition-all ${
                isSelected
                  ? 'bg-primary text-white'
                  : 'bg-gray-bg text-gray-600 hover:bg-gray-300'
              }`}
            >
              {size}
            </button>
          );
        })}
      </div>
    </div>
  );
}
