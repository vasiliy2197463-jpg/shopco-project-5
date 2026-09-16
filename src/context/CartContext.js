"use client";

import React, { createContext, useContext, useState, useMemo, useEffect } from "react";
import { useCatalog } from "@/context/CatalogContext";

const CartContext = createContext(undefined);

export function CartProvider({ children }) {
  const { products } = useCatalog();
  const [items, setItems] = useState([]);
  const [promoCode, setPromoCode] = useState("");
  const [activePromo, setActivePromo] = useState(null);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("shopco_cart");
    if (savedCart) {
      try {
        const savedItems = JSON.parse(savedCart);
        const restoredItems = savedItems.map((item) => {
          const product = products.find((candidate) => candidate.name.toLowerCase() === String(item.name || "").toLowerCase()) || products.find((candidate) => String(candidate.id) === String(item.id));
          const savedColor = String(item.color || '').toLowerCase();
          const color = product?.availableColors?.find((candidate) => {
            const candidateColor = candidate.name.toLowerCase();
            return candidateColor === savedColor || savedColor.startsWith(candidateColor) || candidateColor.startsWith(savedColor);
          });

          return {
            ...item,
            image: color?.image || product?.images?.[0] || item.image || '/images/products/product-1.png'
          };
        });
        setItems(restoredItems);
      } catch (e) {
        console.error("Failed to parse cart items", e);
      }
    }
  }, []);

  useEffect(() => {
    if (!products?.length) return;
    setItems((current) => current.map((item) => {
      const product = products.find((candidate) => candidate.name.toLowerCase() === String(item.name || "").toLowerCase()) || products.find((candidate) => String(candidate.id) === String(item.id));
      if (!product) return item;
      const savedColor = String(item.color || "").toLowerCase();
      const color = product.availableColors?.find((candidate) => {
        const candidateColor = candidate.name.toLowerCase();
        return candidateColor === savedColor || savedColor.startsWith(candidateColor) || candidateColor.startsWith(savedColor);
      });
      return { ...item, image: color?.image || product.images?.[0] || item.image };
    }));
  }, [products]);

  // Sync cart to localStorage when items change
  useEffect(() => {
    localStorage.setItem("shopco_cart", JSON.stringify(items));
  }, [items]);

  const addToCart = (product) => {
    setItems((prev) => {
      const existingItem = prev.find(
        (item) => item.id === product.id && item.size === product.size && item.color === product.color
      );
      if (existingItem) {
        return prev.map((item) =>
          item.id === product.id && item.size === product.size && item.color === product.color
            ? { ...item, image: product.image || item.image, quantity: item.quantity + (product.quantity || 1) }
            : item
        );
      }
      return [...prev, product];
    });
  };

  const removeFromCart = (itemId, size, color) => {
    setItems((prev) => prev.filter((item) => !(item.id === itemId && item.size === size && item.color === color)));
  };

  const increaseQuantity = (itemId, size, color) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId && item.size === size && item.color === color
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decreaseQuantity = (itemId, size, color) => {
    setItems((prev) => {
      const existingItem = prev.find((item) => item.id === itemId && item.size === size && item.color === color);
      if (existingItem?.quantity === 1) {
        return prev.filter((item) => !(item.id === itemId && item.size === size && item.color === color));
      }
      return prev.map((item) =>
        item.id === itemId && item.size === size && item.color === color
          ? { ...item, quantity: item.quantity - 1 }
          : item
      );
    });
  };

  const clearCart = () => {
    setItems([]);
  };

  const applyPromo = (code) => {
    const codeToApply = typeof code === 'string' ? code : promoCode;
    const promoCodes = {
      sale20: 0.2,
      sale30: 0.3,
      sale50: 0.5,
      discount20: 0.2,
    };
    const normalizedCode = codeToApply?.trim().toLowerCase();
    const rate = promoCodes[normalizedCode];
    if (!rate) return false;
    const promo = { code: normalizedCode.toUpperCase(), rate };
    setActivePromo(promo);
    return promo;
  };

  const subtotal = useMemo(() => items.reduce((acc, item) => acc + item.price * item.quantity, 0), [items]);
  const discountRate = activePromo?.rate || 0;
  const discountAmount = useMemo(() => subtotal * discountRate, [subtotal, discountRate]);
  const deliveryFee = useMemo(() => (subtotal > 500 || subtotal === 0 ? 0 : 15), [subtotal]);
  const total = useMemo(() => {
    const discountedTotal = subtotal - discountAmount;
    return discountedTotal > 0 ? discountedTotal + deliveryFee : 0;
  }, [subtotal, discountAmount, deliveryFee]);

  const value = {
    items,
    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    subtotal,
    discountRate,
    discountAmount,
    deliveryFee,
    total,
    promoCode,
    setPromoCode,
    promoApplied: Boolean(activePromo),
    activePromo,
    applyPromo
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
