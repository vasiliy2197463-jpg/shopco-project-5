'use client';
import React, { useState, useEffect, useRef } from 'react';

export default function PriceSlider({ min = 0, max = 500, value = [50, 200], onChange }) {
  const [minVal, setMinVal] = useState(value[0]);
  const [maxVal, setMaxVal] = useState(value[1]);
  const range = useRef(null);

  const getPercent = (val) => Math.round(((val - min) / (max - min)) * 100);

  useEffect(() => {
    if (range.current) {
      const minPercent = getPercent(minVal);
      const maxPercent = getPercent(maxVal);
      range.current.style.left = `${minPercent}%`;
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [minVal, maxVal, min, max]);

  const handleMinChange = (e) => {
    const val = Math.min(Number(e.target.value), maxVal - 1);
    setMinVal(val);
    onChange([val, maxVal]);
  };

  const handleMaxChange = (e) => {
    const val = Math.max(Number(e.target.value), minVal + 1);
    setMaxVal(val);
    onChange([minVal, val]);
  };

  return (
    <div className="w-full relative mt-4 mb-2">
      <input
        type="range"
        min={min}
        max={max}
        value={minVal}
        onChange={handleMinChange}
        className="absolute w-full z-[3] opacity-0 h-0 cursor-pointer pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5"
      />
      <input
        type="range"
        min={min}
        max={max}
        value={maxVal}
        onChange={handleMaxChange}
        className="absolute w-full z-[4] opacity-0 h-0 cursor-pointer pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5"
      />

      <div className="relative w-full h-1.5 flex items-center">
        <div className="absolute w-full h-1.5 bg-gray-300 rounded-full z-[1]" />
        <div ref={range} className="absolute h-1.5 bg-primary rounded-full z-[2]" />
        
        <div className="absolute w-5 h-5 bg-primary rounded-full z-[3] pointer-events-none" style={{ left: `calc(${getPercent(minVal)}% - 10px)` }} />
        <div className="absolute w-5 h-5 bg-primary rounded-full z-[4] pointer-events-none" style={{ left: `calc(${getPercent(maxVal)}% - 10px)` }} />
      </div>

      <div className="flex items-center justify-between mt-6 text-sm font-medium">
        <span>${minVal}</span>
        <span>${maxVal}</span>
      </div>
    </div>
  );
}
