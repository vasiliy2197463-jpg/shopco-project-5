'use client';
import React, { useState } from 'react';
import { IoOptionsOutline, IoCheckmark, IoChevronUp, IoChevronDown, IoChevronForward, IoClose } from 'react-icons/io5';
import Button from '@/components/common/Button';
import PriceSlider from './PriceSlider';
import { useLanguage } from '@/context/LanguageContext';

const CATEGORIES = ['T-shirts', 'Shorts', 'Shirts', 'Hoodie', 'Jeans'];
const COLORS = [
  { name: 'green', hex: '#00C12B' },
  { name: 'red', hex: '#F50606' },
  { name: 'yellow', hex: '#F5DD06' },
  { name: 'orange', hex: '#F57906' },
  { name: 'cyan', hex: '#06CAF5' },
  { name: 'blue', hex: '#063AF5' },
  { name: 'purple', hex: '#7D06F5' },
  { name: 'pink', hex: '#F506A4' },
  { name: 'white', hex: '#FFFFFF', border: true },
  { name: 'black', hex: '#000000' }
];
const SIZES = ['XX-Small', 'X-Small', 'Small', 'Medium', 'Large', 'X-Large', 'XX-Large', '3X-Large', '4X-Large'];
const DRESS_STYLES = ['Casual', 'Formal', 'Party', 'Gym'];

export default function FilterSidebar({ filters, onFilterChange, isOpen, onClose, maxPrice = 300 }) {
  const { language } = useLanguage();
  const ru = language === 'ru';
  const categoryNames = { 'T-shirts': 'Футболки', Shorts: 'Шорты', Shirts: 'Рубашки', Hoodie: 'Толстовки', Jeans: 'Джинсы' };
  const styleNames = { Casual: 'Повседневный', Formal: 'Деловой', Party: 'Для вечеринки', Gym: 'Спортивный' };
  const [expanded, setExpanded] = useState({
    price: true,
    colors: true,
    size: true,
    style: true
  });

  const toggleSection = (section) => {
    setExpanded(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleCategoryClick = (category) => {
    onFilterChange({ ...filters, selectedCategory: category });
  };

  const handleColorClick = (colorName) => {
    const newColors = filters.selectedColors?.includes(colorName)
      ? filters.selectedColors.filter(c => c !== colorName)
      : [...(filters.selectedColors || []), colorName];
    onFilterChange({ ...filters, selectedColors: newColors });
  };

  const handleSizeClick = (size) => {
    const newSizes = filters.selectedSizes?.includes(size)
      ? filters.selectedSizes.filter(s => s !== size)
      : [...(filters.selectedSizes || []), size];
    onFilterChange({ ...filters, selectedSizes: newSizes });
  };

  const handleStyleClick = (style) => {
    onFilterChange({ ...filters, selectedStyle: style });
  };

  const handlePriceChange = (value) => {
    onFilterChange({ ...filters, priceRange: value });
  };

  const sidebarContent = (
    <div className="w-full flex flex-col gap-6">
      <div className="flex items-center justify-between pb-5 border-b border-border">
        <h2 className="text-xl font-bold">{ru ? 'Фильтры' : 'Filters'}</h2>
        <IoOptionsOutline className="w-6 h-6 text-gray-500 hidden lg:block" />
        <button onClick={onClose} className="lg:hidden p-1">
          <IoClose className="w-6 h-6" />
        </button>
      </div>

      <div className="flex flex-col gap-4 pb-5 border-b border-border">
        {CATEGORIES.map(category => (
          <button 
            key={category} 
            onClick={() => handleCategoryClick(category)}
            className={`flex items-center justify-between py-1 text-base ${filters.selectedCategory?.toLowerCase() === category.toLowerCase() ? 'font-semibold text-primary' : 'text-gray-600'}`}
          >
            <span>{ru ? categoryNames[category] : category}</span>
            <IoChevronForward className="text-gray-400" />
          </button>
        ))}
      </div>

      <div className="pb-5 border-b border-border">
        <button onClick={() => toggleSection('price')} className="flex items-center justify-between w-full py-2 mb-2 font-bold text-lg">
          <span>{ru ? 'Цена' : 'Price'}</span>
          {expanded.price ? <IoChevronUp /> : <IoChevronDown />}
        </button>
        {expanded.price && (
          <PriceSlider min={0} max={maxPrice} value={filters.priceRange || [0, maxPrice]} onChange={handlePriceChange} />
        )}
      </div>

      <div className="pb-5 border-b border-border">
        <button onClick={() => toggleSection('colors')} className="flex items-center justify-between w-full py-2 mb-2 font-bold text-lg">
          <span>{ru ? 'Цвета' : 'Colors'}</span>
          {expanded.colors ? <IoChevronUp /> : <IoChevronDown />}
        </button>
        {expanded.colors && (
          <div className="grid grid-cols-5 gap-3 mt-2">
            {COLORS.map(color => (
              <button
                key={color.name}
                onClick={() => handleColorClick(color.name)}
                className={`w-9 h-9 rounded-full flex items-center justify-center ${color.border ? 'border border-gray-300' : ''}`}
                style={{ backgroundColor: color.hex }}
                aria-label={ru ? `Выбрать цвет ${color.name}` : `Select ${color.name}`}
              >
                {filters.selectedColors?.includes(color.name) && (
                  <IoCheckmark className={`w-5 h-5 ${color.name === 'white' ? 'text-black' : 'text-white'}`} />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="pb-5 border-b border-border">
        <button onClick={() => toggleSection('size')} className="flex items-center justify-between w-full py-2 mb-2 font-bold text-lg">
          <span>{ru ? 'Размер' : 'Size'}</span>
          {expanded.size ? <IoChevronUp /> : <IoChevronDown />}
        </button>
        {expanded.size && (
          <div className="flex flex-wrap gap-2 mt-2">
            {SIZES.map(size => (
              <button
                key={size}
                onClick={() => handleSizeClick(size)}
                className={`px-5 py-2 rounded-pill text-sm border ${filters.selectedSizes?.includes(size) ? 'bg-primary text-white border-primary' : 'bg-gray-bg text-gray-600 border-transparent hover:border-gray-300'}`}
              >
                {size}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="pb-5">
        <button onClick={() => toggleSection('style')} className="flex items-center justify-between w-full py-2 mb-2 font-bold text-lg">
          <span>{ru ? 'Стиль одежды' : 'Dress Style'}</span>
          {expanded.style ? <IoChevronUp /> : <IoChevronDown />}
        </button>
        {expanded.style && (
          <div className="flex flex-col gap-4 mt-2">
            {DRESS_STYLES.map(style => (
              <button 
                key={style} 
                onClick={() => handleStyleClick(style)}
                className={`flex items-center justify-between py-1 text-base ${filters.selectedStyle === style ? 'font-semibold text-primary' : 'text-gray-600'}`}
              >
                <span>{ru ? styleNames[style] : style}</span>
                <IoChevronForward className="text-gray-400" />
              </button>
            ))}
          </div>
        )}
      </div>

      <Button variant="primary" className="w-full mt-2" onClick={onClose}>{ru ? 'Применить фильтр' : 'Apply Filter'}</Button>
    </div>
  );

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />
      )}
      
      {/* Sidebar Container */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-full max-w-xs bg-white p-5 overflow-y-auto transition-transform duration-300 ease-in-out
        lg:static lg:translate-x-0 lg:block lg:w-[250px] xl:w-[295px] lg:z-0 lg:p-6 lg:border lg:border-border lg:rounded-card
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {sidebarContent}
      </aside>
    </>
  );
}
