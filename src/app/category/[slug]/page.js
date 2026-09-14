'use client';
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Breadcrumb from '@/components/common/Breadcrumb';
import FilterSidebar from '@/components/category/FilterSidebar';
import ProductGrid from '@/components/category/ProductGrid';
import Pagination from '@/components/category/Pagination';
import { useCatalog } from '@/context/CatalogContext';

export default function CategoryPage() {
  const { products: allProducts } = useCatalog();
  const params = useParams();
  const slug = params?.slug || 'all';
  const displayCategory = slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' ');
  const categoryBySlug = {
    't-shirts': 't-shirts',
    shorts: 'shorts',
    shirts: 'shirts',
    hoodie: 'hoodie',
    jeans: 'jeans'
  };

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 9;

  const stylesList = ['casual', 'formal', 'party', 'gym'];
  const isStyleSlug = stylesList.includes(slug.toLowerCase());
  
  const initialCategory = !isStyleSlug && slug !== 'all' ? (categoryBySlug[slug.toLowerCase()] || slug) : null;
  const initialStyle = isStyleSlug ? displayCategory : null;

  const [filters, setFilters] = useState({
    selectedCategory: initialCategory,
    priceRange: [0, 300], // Start with full range to show all products by default
    selectedColors: [],
    selectedSizes: [],
    selectedStyle: initialStyle,
    sortBy: 'popular'
  });

  // Sync selectedCategory and selectedStyle when URL slug changes
  useEffect(() => {
    const isStyle = stylesList.includes(slug.toLowerCase());
    setFilters(prev => ({
      ...prev,
      selectedCategory: !isStyle && slug !== 'all' ? (categoryBySlug[slug.toLowerCase()] || slug) : null,
      selectedStyle: isStyle ? displayCategory : null
    }));
  }, [slug, displayCategory]);

  const [filteredProducts, setFilteredProducts] = useState(() =>
    (allProducts || []).filter((product) => {
      const categoryMatches = !initialCategory || product.category.toLowerCase() === initialCategory.toLowerCase();
      const styleMatches = !initialStyle || product.dressStyle.toLowerCase() === initialStyle.toLowerCase();
      return categoryMatches && styleMatches;
    })
  );

  useEffect(() => {
    let result = [...(allProducts || [])];

    // Filter by Category
    if (filters.selectedCategory && filters.selectedCategory.toLowerCase() !== 'all') {
      result = result.filter(
        p => p.category.toLowerCase() === filters.selectedCategory.toLowerCase()
      );
    }

    // Filter by Price Range
    if (filters.priceRange) {
      result = result.filter(
        p => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
      );
    }

    // Filter by Colors
    if (filters.selectedColors && filters.selectedColors.length > 0) {
      result = result.filter(p =>
        p.availableColors.some(color =>
          filters.selectedColors.some(selectedColor => {
            const cName = color.name.toLowerCase();
            const sName = selectedColor.toLowerCase();
            return cName === sName || cName.includes(sName) || sName.includes(cName);
          })
        )
      );
    }

    // Filter by Sizes
    if (filters.selectedSizes && filters.selectedSizes.length > 0) {
      result = result.filter(p =>
        p.availableSizes.some(size => filters.selectedSizes.includes(size))
      );
    }

    // Filter by Dress Style
    if (filters.selectedStyle) {
      result = result.filter(
        p => p.dressStyle.toLowerCase() === filters.selectedStyle.toLowerCase()
      );
    }

    // Sorting
    switch (filters.sortBy) {
      case 'price_asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        result.sort((a, b) => b.id - a.id);
        break;
      case 'popular':
      default:
        result.sort((a, b) => {
          if (b.rating !== a.rating) return b.rating - a.rating;
          return b.reviewCount - a.reviewCount;
        });
        break;
    }

    setFilteredProducts(result);
    setCurrentPage(1); 
  }, [filters, allProducts]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleSortChange = (sortBy) => {
    setFilters(prev => ({ ...prev, sortBy }));
  };

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE, 
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="container-main py-6">
      <div className="mb-6">
        <Breadcrumb items={[
          { label: 'Home', href: '/' },
          { label: displayCategory }
        ]} />
      </div>

      <div className="flex flex-col lg:flex-row gap-5 items-start">
        {/* Sidebar */}
        <div className="hidden lg:block sticky top-24 shrink-0">
          <FilterSidebar 
            filters={filters} 
            onFilterChange={handleFilterChange} 
            isOpen={false}
            onClose={() => {}} 
          />
        </div>

        {/* Mobile Sidebar */}
        <div className="lg:hidden">
          <FilterSidebar 
            filters={filters} 
            onFilterChange={handleFilterChange} 
            isOpen={isMobileFilterOpen}
            onClose={() => setIsMobileFilterOpen(false)} 
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 w-full min-w-0">
          <ProductGrid 
            products={paginatedProducts} 
            category={displayCategory} 
            totalProducts={filteredProducts.length} 
            onSortChange={handleSortChange}
            onOpenFilter={() => setIsMobileFilterOpen(true)}
          />

          <Pagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            onPageChange={setCurrentPage} 
          />
        </div>
      </div>
    </div>
  );
}
