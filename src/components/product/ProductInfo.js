"use client";
import { useState } from "react";
import RatingStars from "@/components/common/RatingStars";
import Price from "@/components/common/Price";
import Button from "@/components/common/Button";
import ColorPicker from "./ColorPicker";
import SizeSelector from "./SizeSelector";
import QuantitySelector from "./QuantitySelector";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { IoHeart, IoHeartOutline } from "react-icons/io5";
import { useLanguage } from "@/context/LanguageContext";

export default function ProductInfo({
  product,
  selectedColor: controlledColor,
  onColorChange,
}) {
  const { addToCart } = useCart();
  const { toggleWishlist, isFavorite } = useWishlist();
  const { language } = useLanguage();
  const ru = language === "ru";

  // Default values
  const defaultColors = product?.availableColors || [
    { name: "Black", hex: "#000000" },
    { name: "Olive", hex: "#4B5320" },
    { name: "Navy", hex: "#000080" },
  ];
  const defaultSizes = product?.availableSizes || [
    "Small",
    "Medium",
    "Large",
    "X-Large",
  ];

  const [localColor, setLocalColor] = useState(defaultColors[0]);
  const selectedColor = controlledColor || localColor;
  const changeColor = onColorChange || setLocalColor;
  const [selectedSize, setSelectedSize] = useState(
    defaultSizes[2] || defaultSizes[0],
  ); // Default 'Large'
  const [quantity, setQuantity] = useState(1);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      color: selectedColor.name,
      size: selectedSize,
      quantity,
      image:
        selectedColor.image ||
        product.images?.[0] ||
        "/images/products/product-1.png",
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="flex flex-col space-y-6">
      {/* Title */}
      <h1 className="font-integral text-xl sm:text-2xl md:text-[40px] leading-tight font-bold uppercase">
        {product.name}
      </h1>

      {/* Rating */}
      <div className="flex items-center gap-2">
        <RatingStars rating={product.rating || 4.5} />
        <span className="text-sm md:text-base text-gray-700">
          {product.rating || 4.5}/5
        </span>
      </div>

      {/* Price */}
      <div className="flex items-center gap-3">
        <Price
          price={product.price}
          originalPrice={product.originalPrice}
          discount={product.discount}
          size="lg"
        />
      </div>

      {/* Description */}
      <p className="text-gray-600 text-sm md:text-base leading-relaxed">
        {product.description ||
          "This graphic t-shirt which is perfect for any occasion. Crafted from a soft and breathable fabric, it offers superior comfort and style."}
      </p>
      <div className={`w-fit rounded-full px-4 py-2 text-sm font-semibold ${Number(product.stock) === 0 ? "bg-red-100 text-red-700" : Number(product.stock) <= 5 ? "bg-amber-100 text-amber-800" : "bg-green-100 text-green-800"}`}>
        {Number(product.stock) === 0 ? (ru ? "Нет в наличии" : "Out of stock") : Number(product.stock) <= 5 ? (ru ? `Осталось: ${product.stock}` : `Only ${product.stock} left`) : (ru ? "В наличии" : "In stock")}
      </div>

      <hr className="border-border" />

      {/* Colors */}
      <ColorPicker
        colors={defaultColors}
        selectedColor={selectedColor}
        onColorChange={changeColor}
      />

      <hr className="border-border" />

      {/* Sizes */}
      <SizeSelector
        sizes={defaultSizes}
        selectedSize={selectedSize}
        onSizeChange={setSelectedSize}
      />
      <button onClick={() => setSizeGuideOpen(true)} className="w-fit text-sm font-semibold underline">{ru ? "Таблица размеров" : "Size guide"}</button>

      <hr className="border-border" />

      {/* Actions */}
      <div className="flex items-center gap-3 sm:gap-4 pt-2">
        <button onClick={() => toggleWishlist(product)} className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-black/15" aria-label="Toggle wishlist">
          {isFavorite(product.id) ? <IoHeart size={25} className="text-red-500" /> : <IoHeartOutline size={25} />}
        </button>
        <QuantitySelector quantity={quantity} onQuantityChange={setQuantity} />
        <Button
          variant={added ? "secondary" : "primary"}
          onClick={handleAddToCart}
          disabled={Number(product.stock) === 0}
          className={`flex-1 py-4 text-sm sm:text-base whitespace-nowrap transition-colors duration-300 ${added ? "bg-green-verified text-white hover:bg-green-700" : ""}`}
        >
          {Number(product.stock) === 0 ? (ru ? "Нет в наличии" : "Out of stock") : added ? (ru ? "Добавлено в корзину! ✓" : "Added to Cart! ✓") : (ru ? "Добавить в корзину" : "Add to Cart")}
        </Button>
      </div>
      {sizeGuideOpen && <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/55 p-4" onClick={()=>setSizeGuideOpen(false)}><div className="w-full max-w-xl rounded-[28px] bg-white p-6 md:p-8" onClick={(event)=>event.stopPropagation()}><div className="flex items-center justify-between"><h2 className="font-integral text-2xl font-bold">{ru ? "ТАБЛИЦА РАЗМЕРОВ" : "SIZE GUIDE"}</h2><button onClick={()=>setSizeGuideOpen(false)} className="text-3xl" aria-label={ru ? "Закрыть" : "Close"}>×</button></div><p className="mt-2 text-sm text-black/55">{ru ? "Измерьте обхват груди и талии, не затягивая сантиметровую ленту." : "Measure around your chest and waist without pulling the tape tight."}</p><div className="mt-5 overflow-x-auto"><table className="w-full text-left"><thead><tr className="border-b border-black/15"><th className="py-3">{ru ? "Размер" : "Size"}</th><th>{ru ? "Грудь" : "Chest"}</th><th>{ru ? "Талия" : "Waist"}</th></tr></thead><tbody>{[["XS","82–87 cm","66–71 cm"],["S","88–93 cm","72–77 cm"],["M","94–101 cm","78–85 cm"],["L","102–109 cm","86–93 cm"],["XL","110–117 cm","94–101 cm"],["XXL","118–125 cm","102–109 cm"]].map((row)=><tr key={row[0]} className="border-b border-black/10">{row.map((cell)=><td key={cell} className="py-3">{cell}</td>)}</tr>)}</tbody></table></div></div></div>}
    </div>
  );
}
