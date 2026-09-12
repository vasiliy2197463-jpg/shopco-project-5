'use client';
import React from 'react';
import ProductCard from '@/components/cards/ProductCard';
import { IoOptionsOutline } from 'react-icons/io5';

export default function ProductGrid({ products = [], category = 'All', totalProducts = 0, onSortChange, onOpenFilter }) {
  return (
    <div className="flex flex-col w-full">
      <div className="flex items-center justify-between mb-6 gap-4">
        <h1 className="font-integral text-2xl md:text-[32px] font-bold truncate">{category}</h1>
        
        <div className="flex items-center gap-3">
          <span className="hidden lg:block text-gray-500 text-base">Showing 1-{products.length} of {totalProducts} Products</span>
          
          <div className="hidden lg:flex items-center gap-2 text-gray-500">
            <span>Sort by:</span>
            <select 
              className="font-medium text-primary bg-transparent border-none outline-none cursor-pointer"
              onChange={(e) => onSortChange(e.target.value)}
              defaultValue="popular"
            >
              <option value="popular">Most Popular</option>
              <option value="newest">Newest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Rating</option>
            </select>
          </div>

          {/* Mobile Filter Button */}
          <button 
            onClick={onOpenFilter}
            className="lg:hidden flex items-center justify-center bg-gray-bg w-11 h-11 rounded-full"
            aria-label="Open Filters"
          >
            <IoOptionsOutline className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      {/* Mobile Sort & Count */}
      <div className="lg:hidden flex items-center justify-between mb-4 text-sm text-gray-500">
        <span>Showing 1-{products.length} of {totalProducts}</span>
        <select 
          className="font-medium text-primary bg-transparent border-none outline-none cursor-pointer"
          onChange={(e) => onSortChange(e.target.value)}
          defaultValue="popular"
        >
          <option value="popular">Popular</option>
          <option value="newest">Newest</option>
          <option value="price_asc">Low-High</option>
          <option value="price_desc">High-Low</option>
          <option value="rating">Rating</option>
        </select>
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} priority={index < 4} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center text-gray-500">
          No products found matching your filters.
        </div>
      )}
    </div>
  );
}
