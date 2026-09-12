'use client';
import { useState } from 'react';
import ReviewCard from '@/components/cards/ReviewCard';
import Button from '@/components/common/Button';
import { IoFilter, IoChevronDown } from 'react-icons/io5';

export default function ProductTabs({ product, reviews = [] }) {
  const [activeTab, setActiveTab] = useState('Product Details');

  const tabs = ['Product Details', 'Rating & Reviews', 'FAQs'];

  return (
    <div className="w-full">
      {/* Tab Bar */}
      <div className="flex border-b border-border overflow-x-auto no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-4 text-base font-medium cursor-pointer transition-colors whitespace-nowrap flex-1 -mb-[1px] ${
              activeTab === tab
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="pt-8">
        {activeTab === 'Product Details' && (
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>{product?.description || 'This is a premium product built for comfort and style. Ideal for daily wear. Made with high-quality materials to ensure longevity and maximum satisfaction.'}</p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Premium quality materials</li>
              <li>Comfortable fit for all-day wear</li>
              <li>Durable and long-lasting</li>
              <li>Machine washable</li>
            </ul>
          </div>
        )}

        {activeTab === 'Rating & Reviews' && (
          <div>
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <h3 className="text-xl font-bold flex items-center gap-2">
                All Reviews <span className="text-sm font-normal text-gray-500">({reviews.length})</span>
              </h3>
              <div className="flex items-center gap-3">
                <button className="w-12 h-12 rounded-full bg-gray-bg flex items-center justify-center hover:bg-gray-300 transition" aria-label="Filter reviews">
                  <IoFilter size={20} />
                </button>
                <div className="hidden md:flex items-center gap-2 bg-gray-bg px-4 py-3 rounded-pill cursor-pointer hover:bg-gray-300 transition">
                  <span className="font-medium text-sm">Latest</span>
                  <IoChevronDown size={16} />
                </div>
                <Button variant="primary" className="text-sm px-6 py-3">Write a Review</Button>
              </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
              {reviews.map((review, idx) => (
                <ReviewCard key={idx} review={review} />
              ))}
            </div>

            {/* Load More */}
            <div className="flex justify-center">
              <Button variant="outline" className="w-full md:w-auto px-8 py-3">
                Load More Reviews
              </Button>
            </div>
          </div>
        )}

        {activeTab === 'FAQs' && (
          <div className="space-y-6">
            <div className="border border-border rounded-xl p-5">
              <h4 className="font-bold mb-2">What is the return policy?</h4>
              <p className="text-gray-600">You can return any unworn items within 30 days of delivery for a full refund.</p>
            </div>
            <div className="border border-border rounded-xl p-5">
              <h4 className="font-bold mb-2">How do I track my order?</h4>
              <p className="text-gray-600">Once your order ships, you will receive a tracking link via email.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
