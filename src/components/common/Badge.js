import React from 'react';

export default function Badge({ discount, className = '' }) {
  if (!discount) return null;
  
  return (
    <span className={`bg-badge-red text-red-discount text-xs font-medium px-3 py-1 rounded-pill ${className}`}>
      -{discount}%
    </span>
  );
}
