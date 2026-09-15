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

export default function ProductInfo({
  product,
  selectedColor: controlledColor,
  onColorChange,
}) {
  const { addToCart } = useCart();
  const { toggleWishlist, isFavorite } = useWishlist();

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

  if (!product) return null;

  const [added, setAdded] = useState(false);

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
          className={`flex-1 py-4 text-sm sm:text-base whitespace-nowrap transition-colors duration-300 ${added ? "bg-green-verified text-white hover:bg-green-700" : ""}`}
        >
          {added ? "Added to Cart! ✓" : "Add to Cart"}
        </Button>
      </div>
    </div>
  );
}
