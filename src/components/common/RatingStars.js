import React from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

export default function RatingStars({ rating = 0, showCount = false, count = 0, size = 'md' }) {
  const sizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };
  
  const starSize = sizes[size] || sizes.md;
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className={`flex items-center space-x-1 ${starSize}`}>
      <div className="flex items-center text-star">
        {[...Array(fullStars)].map((_, i) => (
          <FaStar key={`full-${i}`} />
        ))}
        {hasHalfStar && <FaStarHalfAlt />}
        {[...Array(emptyStars)].map((_, i) => (
          <FaRegStar key={`empty-${i}`} />
        ))}
      </div>
      {showCount && (
        <span className="text-primary font-satoshi ml-2 text-sm">
          {rating.toFixed(1)}/5
        </span>
      )}
    </div>
  );
}
