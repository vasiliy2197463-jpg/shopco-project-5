'use client';
import { IoCheckmark } from 'react-icons/io5';
import { useLanguage } from '@/context/LanguageContext';

export default function ColorPicker({ colors = [], selectedColor, onColorChange }) {
  const { language } = useLanguage();
  if (!colors || !colors.length) return null;

  return (
    <div>
      <span className="block text-gray-600 mb-3 text-sm md:text-base font-normal normal-case">{language === 'ru' ? 'Выберите цвет' : 'Select Colors'}</span>
      <div className="flex gap-3">
        {colors.map((color, idx) => {
          const isSelected = selectedColor?.name === color.name;
          return (
            <div
              key={idx}
              onClick={() => onColorChange(color)}
              className={`w-9 h-9 rounded-full cursor-pointer flex items-center justify-center border-2 transition-transform hover:scale-110 ${
                isSelected ? 'border-primary shadow-sm' : 'border-border'
              }`}
              style={{ backgroundColor: color.hex }}
              title={color.name}
            >
              {isSelected && (
                <IoCheckmark 
                  className={color.hex.toLowerCase() === '#ffffff' ? 'text-black' : 'text-white'} 
                  size={20} 
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
