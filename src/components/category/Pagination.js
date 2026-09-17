'use client';
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

export default function Pagination({ currentPage = 1, totalPages = 1, onPageChange }) {
  const { language } = useLanguage();
  const ru = language === 'ru';
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5; 
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage, '...', totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-between w-full border-t border-border pt-5 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center gap-2 border border-border rounded-pill px-4 py-2 text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span aria-hidden="true">←</span><span className="hidden xs:inline">{ru ? 'Назад' : 'Previous'}</span>
      </button>
      
      <div className="hidden items-center gap-1 sm:flex md:gap-2">
        {getPageNumbers().map((page, idx) => (
          <button
            key={idx}
            onClick={() => typeof page === 'number' && onPageChange(page)}
            disabled={typeof page !== 'number'}
            className={`w-11 h-11 flex items-center justify-center rounded-lg text-sm font-medium
              ${page === currentPage ? 'bg-gray-bg text-primary' : typeof page === 'number' ? 'hover:bg-gray-100 text-gray-600' : 'text-gray-500 cursor-default'}`}
          >
            {page}
          </button>
        ))}
      </div>
      <div className="text-sm font-medium text-black/55 sm:hidden">
        {ru ? `Страница ${currentPage} из ${totalPages}` : `Page ${currentPage} of ${totalPages}`}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center gap-2 border border-border rounded-pill px-4 py-2 text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="hidden xs:inline">{ru ? 'Далее' : 'Next'}</span><span aria-hidden="true">→</span>
      </button>
    </div>
  );
}
