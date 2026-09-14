'use client';
import { useState, useEffect } from 'react';
import Image from '@/components/common/BaseImage';

export default function ProductGallery({ images = [] }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [imgSrcs, setImgSrcs] = useState(images);

  // Sync state if props change
  useEffect(() => {
    setImgSrcs(images);
    setSelectedIndex(0);
  }, [images]);

  if (!images || !images.length) return null;

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4">
      {/* Thumbnails */}
      <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto no-scrollbar">
        {images.map((img, idx) => (
          <div
            key={idx}
            onClick={() => setSelectedIndex(idx)}
            className={`w-[76px] h-[76px] sm:w-[100px] sm:h-[100px] md:w-[150px] md:h-[167px] shrink-0 rounded-[20px] overflow-hidden cursor-pointer border-2 transition-colors bg-gray-bg relative ${
              selectedIndex === idx ? 'border-primary' : 'border-transparent'
            }`}
          >
            <Image
              src={imgSrcs[idx] || img}
              alt={`Thumbnail ${idx}`}
              fill
              quality={100}
              className="object-cover"
              onError={() => {
                const newSrcs = [...imgSrcs];
                newSrcs[idx] = idx === 1 ? '/images/products/placeholder-back.svg' : '/images/products/placeholder-model.svg';
                setImgSrcs(newSrcs);
              }}
            />
          </div>
        ))}
      </div>

      {/* Main Image */}
      <div className="flex-1 aspect-square relative rounded-[20px] overflow-hidden bg-gray-bg">
        <Image
          src={imgSrcs[selectedIndex] || images[selectedIndex]}
          alt="Main product"
          fill
          priority
          quality={100}
          className="object-cover"
          onError={() => {
            const newSrcs = [...imgSrcs];
            newSrcs[selectedIndex] = selectedIndex === 1 ? '/images/products/placeholder-back.svg' : '/images/products/placeholder-model.svg';
            setImgSrcs(newSrcs);
          }}
        />
      </div>
    </div>
  );
}
