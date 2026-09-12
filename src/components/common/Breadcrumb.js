import React from 'react';
import Link from 'next/link';

export default function Breadcrumb({ items = [] }) {
  if (!items || items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="w-full">
      <ol className="flex flex-wrap items-center space-x-2 text-sm text-gray-600 font-satoshi">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          
          return (
            <li key={index} className="flex items-center">
              {isLast ? (
                <span className="text-primary font-medium" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <>
                  <Link href={item.href} className="hover:text-primary transition-all duration-300">
                    {item.label}
                  </Link>
                  <span className="mx-2 text-gray-400">&gt;</span>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
