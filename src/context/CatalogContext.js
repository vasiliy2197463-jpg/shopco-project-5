"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { products as sourceProducts } from "@/data/products";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

const CatalogContext = createContext({ products: sourceProducts, loading: false });

const mergeProduct = (source, row) => {
  const variants = row.product_variants || [];
  const variantColors = variants.filter((variant) => variant.image_url).map((variant) => ({ name: variant.color_name, hex: variant.color_hex || "#000000", image: variant.image_url }));
  const uniqueColors = [...new Map(variantColors.map((color) => [color.name.toLowerCase(), color])).values()];
  const variantSizes = [...new Set(variants.map((variant) => variant.size).filter(Boolean))];
  const firstImage = uniqueColors[0]?.image;
  return {
    ...source,
    name: row.name || source.name,
    description: row.description ?? source.description,
    category: row.category || source.category,
    dressStyle: row.dress_style || source.dressStyle,
    price: Number(row.price ?? source.price),
    originalPrice: row.old_price == null ? source.originalPrice : Number(row.old_price),
    rating: Number(row.rating ?? source.rating),
    stock: Number(row.stock ?? 0),
    active: row.active !== false,
    archived: row.archived === true,
    images: firstImage ? [firstImage, ...(source.images || []).filter((image) => image !== firstImage)] : source.images,
    availableColors: uniqueColors.length ? uniqueColors : source.availableColors,
    availableSizes: variantSizes.length ? variantSizes : source.availableSizes,
  };
};

const databaseProduct = (row) => {
  const variants = row.product_variants || [];
  const firstImage = variants.find((variant) => variant.image_url)?.image_url;
  return {
    id: Number(row.id),
    slug: row.slug,
    name: row.name,
    description: row.description || "",
    category: row.category,
    dressStyle: row.dress_style || "Casual",
    price: Number(row.price),
    originalPrice: row.old_price == null ? null : Number(row.old_price),
    rating: Number(row.rating || 0),
    reviewCount: 0,
    stock: Number(row.stock || 0),
    active: row.active !== false,
    archived: row.archived === true,
    images: firstImage ? [firstImage] : [],
    availableColors: variants.length ? variants.map((variant) => ({ name: variant.color_name, hex: variant.color_hex || "#000000", image: variant.image_url })) : [{ name: "Default", hex: "#000000", image: firstImage }],
    availableSizes: [...new Set(variants.map((variant) => variant.size).filter(Boolean))].length ? [...new Set(variants.map((variant) => variant.size).filter(Boolean))] : ["One Size"],
  };
};

export function CatalogProvider({ children }) {
  const [products, setProducts] = useState(sourceProducts);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setLoading(false);
      return;
    }

    supabase
      .from("products")
      .select("id,slug,name,description,category,dress_style,price,old_price,rating,stock,active,archived,product_variants(color_name,color_hex,size,image_url,stock)")
      .order("id")
      .then(({ data, error }) => {
        if (!error && data?.length) {
          const sources = new Map(sourceProducts.map((product) => [product.id, product]));
          setProducts(data
            .filter((row) => row.active !== false && row.archived !== true)
            .map((row) => sources.has(Number(row.id)) ? mergeProduct(sources.get(Number(row.id)), row) : databaseProduct(row)));
        }
        setLoading(false);
      });
  }, []);

  return <CatalogContext.Provider value={{ products, loading }}>{children}</CatalogContext.Provider>;
}

export function useCatalog() {
  return useContext(CatalogContext);
}
