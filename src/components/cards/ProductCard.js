'use client';

import Image from '@/components/common/BaseImage';
import Link from 'next/link';
import { useState } from 'react';
import { IoCartOutline, IoCheckmark } from 'react-icons/io5';
import { useCart } from '@/context/CartContext';
import RatingStars from '@/components/common/RatingStars';
import Price from '@/components/common/Price';

export default function ProductCard({ product, priority = false }) {
  const { items, addToCart, increaseQuantity, decreaseQuantity } = useCart();
  const [added, setAdded] = useState(false);
  const defaultSize = product.availableSizes?.[0] || 'Medium';
  const [selectedColor, setSelectedColor] = useState(product.availableColors?.[0] || { name: 'Default', hex: '#000000' });
  const selectedColorName = selectedColor.name;
  const cartItem = items.find((item) => item.id === product.id && item.size === defaultSize && item.color === selectedColorName);
  const quantity = cartItem?.quantity || 0;

  const quickAdd = () => {
    addToCart({
      ...product,
      quantity: 1,
      size: defaultSize,
      color: selectedColorName,
      image: selectedColor.image || product.images?.[0],
    });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1300);
  };

  return (
    <article className="block group relative">
      <Link href={`/product/${product.id || product.slug || '#'}`} className="block">
        <div className="relative aspect-square rounded-[20px] bg-gray-bg overflow-hidden p-4">
        {product.images && product.images[0] && (
          <Image
            src={selectedColor.image || product.images[0]}
            alt={product.name}
            fill
            priority={priority}
            className="object-contain group-hover:scale-105 transition-transform duration-300"
          />
        )}
        </div>
      </Link>
      <button onClick={quickAdd} aria-label={`Add ${product.name} to cart`} className={`absolute right-3 top-3 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shadow-md transition-all duration-200 ${added ? 'bg-[#01AB31] text-white scale-110' : 'bg-white text-black hover:bg-black hover:text-white hover:scale-105'}`}>
        {added ? <IoCheckmark size={22}/> : <IoCartOutline size={22}/>} 
      </button>
      {quantity > 0 && <div className="absolute right-3 top-16 sm:top-[68px] z-10 flex items-center rounded-full bg-white shadow-md border border-black/10 overflow-hidden" aria-label="Product quantity">
        <button onClick={() => decreaseQuantity(product.id, defaultSize, selectedColorName)} className="w-9 h-9 sm:w-10 sm:h-10 text-xl font-bold hover:bg-black hover:text-white transition-colors" aria-label={`Remove one ${product.name}`}>−</button>
        <span className="min-w-8 text-center font-bold text-sm" aria-live="polite">{quantity}</span>
        <button onClick={() => increaseQuantity(product.id, defaultSize, selectedColorName)} className="w-9 h-9 sm:w-10 sm:h-10 text-xl font-bold hover:bg-black hover:text-white transition-colors" aria-label={`Add one more ${product.name}`}>+</button>
      </div>}
      <Link href={`/product/${product.id || product.slug || '#'}`} className="block">
        <h3 className="font-bold text-sm sm:text-base mt-3 truncate">{product.name}</h3>
      <div className="mt-1 flex items-center gap-2">
        <RatingStars rating={product.rating} />
        <span className="text-xs sm:text-sm text-gray-600">{product.rating}/5</span>
      </div>
      <div className="mt-1">
        <Price
          price={product.price}
          originalPrice={product.originalPrice}
          discount={product.discount}
        />
      </div>
      </Link>
      <div className="flex items-center gap-1.5 mt-2" aria-label="Available colors">
        {product.availableColors?.map((color) => (
          <button
            key={color.name}
            type="button"
            title={color.name}
            aria-label={`Choose ${color.name}`}
            aria-pressed={selectedColorName === color.name}
            onClick={() => setSelectedColor(color)}
            className={`w-5 h-5 rounded-full border-2 transition-transform hover:scale-110 ${selectedColorName === color.name ? 'border-black scale-110' : 'border-white ring-1 ring-black/20'}`}
            style={{ backgroundColor: color.hex }}
          />
        ))}
      </div>
    </article>
  );
}
