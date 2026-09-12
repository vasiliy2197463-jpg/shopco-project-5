'use client';

import { useState } from 'react';
import { IoClose } from 'react-icons/io5';
import Link from 'next/link';

export default function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-black text-white w-full h-[38px] flex items-center justify-center relative px-4 z-50">
      <div className="text-xs sm:text-sm font-satoshi flex items-center justify-center space-x-1">
        <span>Sign up and get 20% off to your first order.</span>
        <Link href="/signup" className="underline font-medium hover:text-gray-300 transition-colors ml-1">
          Sign Up Now
        </Link>
      </div>
      <button 
        onClick={() => setIsVisible(false)}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors"
        aria-label="Close announcement"
      >
        <IoClose size={20} />
      </button>
    </div>
  );
}
