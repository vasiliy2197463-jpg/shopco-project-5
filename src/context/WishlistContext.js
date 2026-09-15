"use client";
import { createContext, useContext, useEffect, useState } from "react";
const WishlistContext = createContext(undefined);
export function WishlistProvider({ children }) {
  const [items, setItems] = useState([]);
  useEffect(() => { try { setItems(JSON.parse(localStorage.getItem("shopco_wishlist") || "[]")); } catch {} }, []);
  useEffect(() => { localStorage.setItem("shopco_wishlist", JSON.stringify(items)); }, [items]);
  const toggleWishlist = (product) => setItems((current) => current.some((item) => String(item.id) === String(product.id)) ? current.filter((item) => String(item.id) !== String(product.id)) : [...current, product]);
  const isFavorite = (id) => items.some((item) => String(item.id) === String(id));
  return <WishlistContext.Provider value={{ items, toggleWishlist, isFavorite }}>{children}</WishlistContext.Provider>;
}
export const useWishlist = () => { const value = useContext(WishlistContext); if (!value) throw new Error("useWishlist must be used within WishlistProvider"); return value; };
