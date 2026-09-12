import React from 'react';

export default function SectionHeading({ title, className = '' }) {
  return (
    <div className={`w-full ${className}`}>
      <h2 className="font-integral text-center text-2xl sm:text-3xl md:text-[48px] text-primary uppercase font-bold tracking-tight">
        {title}
      </h2>
    </div>
  );
}
