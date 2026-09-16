"use client";
import { createContext, useContext, useEffect, useState } from "react";

const CompareContext = createContext(undefined);
export function CompareProvider({ children }) {
  const [items, setItems] = useState([]);
  useEffect(() => { try { setItems(JSON.parse(localStorage.getItem("shopco_compare") || "[]")); } catch {} }, []);
  useEffect(() => { localStorage.setItem("shopco_compare", JSON.stringify(items)); }, [items]);
  const toggleCompare = (product) => setItems((current) => current.some((item) => Number(item.id) === Number(product.id)) ? current.filter((item) => Number(item.id) !== Number(product.id)) : current.length >= 4 ? [...current.slice(1), product] : [...current, product]);
  const isCompared = (id) => items.some((item) => Number(item.id) === Number(id));
  return <CompareContext.Provider value={{ items, toggleCompare, isCompared, clearCompare: () => setItems([]) }}>{children}</CompareContext.Provider>;
}
export const useCompare = () => useContext(CompareContext);
