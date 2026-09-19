"use client";

import Image from "@/components/common/BaseImage";
import Link from "next/link";
import { useRef, useState } from "react";
import { IoCartOutline, IoCheckmark, IoChevronBack, IoChevronForward, IoHeart, IoHeartOutline, IoGitCompareOutline } from "react-icons/io5";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import RatingStars from "@/components/common/RatingStars";
import Price from "@/components/common/Price";
import { useCompare } from "@/context/CompareContext";
import { useLanguage } from "@/context/LanguageContext";

export default function ProductCard({ product, priority = false }) {
  const { items, addToCart, increaseQuantity, decreaseQuantity } = useCart();
  const { toggleWishlist, isFavorite } = useWishlist();
  const { toggleCompare, isCompared } = useCompare();
  const { language } = useLanguage();
  const [added, setAdded] = useState(false);
  const defaultSize = product.availableSizes?.[0] || "Medium";
  const [selectedColor, setSelectedColor] = useState(
    product.availableColors?.[0] || { name: "Default", hex: "#000000" },
  );
  const [slideIndex, setSlideIndex] = useState(0);
  const touchStartX = useRef(null);
  const suppressLink = useRef(false);
  const selectedColorName = selectedColor.name;
  const galleryImages = (selectedColor.images?.length
    ? selectedColor.images
    : selectedColor.image
      ? [selectedColor.image]
      : product.images || []).filter(Boolean);
  const currentImage = galleryImages[slideIndex % Math.max(galleryImages.length, 1)] || product.images?.[0];
  const cartItem = items.find(
    (item) =>
      item.id === product.id &&
      item.size === defaultSize &&
      item.color === selectedColorName,
  );
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

  const changeSlide = (direction) => {
    if (galleryImages.length < 2) return;
    setSlideIndex((current) => (current + direction + galleryImages.length) % galleryImages.length);
  };

  const finishSwipe = (clientX) => {
    if (touchStartX.current === null) return;
    const distance = clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(distance) < 35) return;
    suppressLink.current = true;
    changeSlide(distance < 0 ? 1 : -1);
    window.setTimeout(() => { suppressLink.current = false; }, 80);
  };

  return (
    <article className="block group relative">
      <Link href={`/item/?id=${product.id}`} className="block" onClick={(event) => { if (suppressLink.current) event.preventDefault(); }}>
        <div className="relative aspect-square touch-pan-y overflow-hidden rounded-[20px] bg-gray-bg p-4" onTouchStart={(event) => { touchStartX.current = event.touches[0]?.clientX ?? null; }} onTouchEnd={(event) => finishSwipe(event.changedTouches[0]?.clientX ?? 0)}>
          {currentImage && (
            <Image
              key={`${selectedColorName}-${slideIndex}`}
              src={currentImage}
              alt={product.name}
              fill
              priority={priority}
              className="object-contain group-hover:scale-105 transition-transform duration-300"
            />
          )}
          {galleryImages.length > 1 && <>
            <button type="button" aria-label={language === "ru" ? "Предыдущее фото" : "Previous image"} onClick={(event) => { event.preventDefault(); event.stopPropagation(); changeSlide(-1); }} className="absolute left-2 top-1/2 z-[5] hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow transition hover:bg-black hover:text-white sm:flex"><IoChevronBack size={20} /></button>
            <button type="button" aria-label={language === "ru" ? "Следующее фото" : "Next image"} onClick={(event) => { event.preventDefault(); event.stopPropagation(); changeSlide(1); }} className="absolute right-2 top-1/2 z-[5] hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow transition hover:bg-black hover:text-white sm:flex"><IoChevronForward size={20} /></button>
            <div className="absolute bottom-2 left-1/2 z-[5] flex -translate-x-1/2 gap-1.5 rounded-full bg-white/80 px-2 py-1 shadow-sm">
              {galleryImages.map((_, index) => <span key={index} className={`h-1.5 rounded-full transition-all ${index === slideIndex ? "w-4 bg-black" : "w-1.5 bg-black/30"}`} />)}
            </div>
          </>}
        </div>
      </Link>
      <button
        onClick={quickAdd}
        aria-label={`Add ${product.name} to cart`}
        className={`absolute right-3 top-3 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shadow-md transition-all duration-200 ${added ? "bg-[#01AB31] text-white scale-110" : "bg-white text-black hover:bg-black hover:text-white hover:scale-105"}`}
      >
        {added ? <IoCheckmark size={22} /> : <IoCartOutline size={22} />}
      </button>
      <button onClick={() => toggleWishlist(product)} aria-label={`Toggle ${product.name} in wishlist`} className="absolute left-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md transition hover:scale-105 sm:h-12 sm:w-12">
        {isFavorite(product.id) ? <IoHeart size={22} className="text-red-500" /> : <IoHeartOutline size={22} />}
      </button>
      {quantity > 0 && (
        <div
          className="absolute right-3 top-16 sm:top-[68px] z-10 flex items-center rounded-full bg-white shadow-md border border-black/10 overflow-hidden"
          aria-label="Product quantity"
        >
          <button
            onClick={() =>
              decreaseQuantity(product.id, defaultSize, selectedColorName)
            }
            className="w-9 h-9 sm:w-10 sm:h-10 text-xl font-bold hover:bg-black hover:text-white transition-colors"
            aria-label={`Remove one ${product.name}`}
          >
            −
          </button>
          <span
            className="min-w-8 text-center font-bold text-sm"
            aria-live="polite"
          >
            {quantity}
          </span>
          <button
            onClick={() =>
              increaseQuantity(product.id, defaultSize, selectedColorName)
            }
            className="w-9 h-9 sm:w-10 sm:h-10 text-xl font-bold hover:bg-black hover:text-white transition-colors"
            aria-label={`Add one more ${product.name}`}
          >
            +
          </button>
        </div>
      )}
      <Link href={`/item/?id=${product.id}`} className="block">
        <h3 className="font-bold text-sm sm:text-base mt-3 truncate">
          {product.name}
        </h3>
        <div className="mt-1 flex items-center gap-2">
          <RatingStars rating={product.rating} />
          <span className="text-xs sm:text-sm text-gray-600">
            {product.rating}/5
          </span>
        </div>
        <div className="mt-1">
          <Price
            price={product.price}
            originalPrice={product.originalPrice}
            discount={product.discount}
          />
        </div>
      </Link>
      <div
        className="flex items-center gap-1.5 mt-2"
        aria-label="Available colors"
      >
        {product.availableColors?.map((color) => (
          <button
            key={color.name}
            type="button"
            title={color.name}
            aria-label={`Choose ${color.name}`}
            aria-pressed={selectedColorName === color.name}
            onClick={() => { setSelectedColor(color); setSlideIndex(0); }}
            className={`w-5 h-5 rounded-full border-2 transition-transform hover:scale-110 ${selectedColorName === color.name ? "border-black scale-110" : "border-white ring-1 ring-black/20"}`}
            style={{ backgroundColor: color.hex }}
          />
        ))}
      </div>
      <button onClick={() => toggleCompare(product)} className={`mt-3 flex items-center gap-2 text-xs font-semibold ${isCompared(product.id) ? "text-green-700" : "text-black/55"}`}><IoGitCompareOutline size={17} />{isCompared(product.id) ? (language === "ru" ? "Добавлено к сравнению" : "Added to compare") : (language === "ru" ? "Сравнить" : "Compare")}</button>
    </article>
  );
}
