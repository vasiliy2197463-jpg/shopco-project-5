'use client';

import { useRef } from 'react';
import SectionHeading from '@/components/common/SectionHeading';
import ReviewCard from '@/components/cards/ReviewCard';
import { IoArrowBack, IoArrowForward } from 'react-icons/io5';
import { storeReviews } from '@/data/reviews';

export default function HappyCustomers() {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = window.innerWidth < 768 ? 300 : 400;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="pt-10 pb-0 overflow-hidden">
      <div className="container-main mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between mb-8 md:mb-10 gap-4">
          <SectionHeading title="OUR HAPPY CUSTOMERS" className="text-left m-0" />
          <div className="flex items-center gap-2 sm:gap-3">
            <button 
              onClick={() => scroll('left')}
              className="flex items-center justify-center w-8 h-8 sm:w-11 sm:h-11 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors"
              aria-label="Previous reviews"
            >
               <IoArrowBack className="text-xl" />
            </button>
            <button 
              onClick={() => scroll('right')}
              className="flex items-center justify-center w-8 h-8 sm:w-11 sm:h-11 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors"
              aria-label="Next reviews"
            >
               <IoArrowForward className="text-xl" />
            </button>
          </div>
        </div>
        
        <div 
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4 -mx-4 px-4 lg:mx-0 lg:px-0"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {storeReviews.map(review => (
            <div key={review.id} className="w-[80vw] sm:w-[358px] md:w-[370px] lg:w-[400px] snap-start shrink-0">
              <ReviewCard review={review} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
