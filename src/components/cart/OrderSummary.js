'use client';
import React, { useState } from 'react';
import { IoPricetagOutline, IoArrowForward } from 'react-icons/io5';
import Button from '@/components/common/Button';
import { useCart } from '@/context/CartContext';

export default function OrderSummary() {
  const { subtotal, discountAmount, deliveryFee, total, promoCode, setPromoCode, applyPromo, promoApplied, activePromo, discountRate } = useCart();
  const [promoError, setPromoError] = useState('');

  const handleApplyPromo = () => {
    setPromoError('');
    if (!promoCode) return;
    const success = applyPromo(promoCode);
    if (!success) {
      setPromoError("Invalid code. Try SALE20, SALE30 or SALE50.");
    }
  };

  return (
    <div className="border border-border rounded-[20px] p-4 sm:p-6 bg-white">
      <h2 className="text-xl md:text-2xl font-bold mb-6 text-primary">Order Summary</h2>
      
      <div className="space-y-4 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-gray-600 text-base">Subtotal</span>
          <span className="font-bold text-base text-primary">${subtotal || 0}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-600 text-base">Discount (-{Math.round(discountRate * 100)}%)</span>
          <span className="text-red-discount font-bold text-base">-${Number(discountAmount || 0).toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-600 text-base">Delivery Fee</span>
          <span className="font-bold text-base text-primary">${deliveryFee || 0}</span>
        </div>
        
        <div className="border-t border-border my-2"></div>
        
        <div className="flex justify-between items-center">
          <span className="font-medium text-base text-primary">Total</span>
          <span className="text-xl md:text-2xl font-bold text-primary">${total || 0}</span>
        </div>
      </div>
      
      <div className="flex flex-col gap-2 mb-6">
        <div className="flex flex-row gap-2 sm:gap-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-3 sm:left-4 flex items-center pointer-events-none">
              <IoPricetagOutline className="text-gray-500" size={18} />
            </div>
            <input
              type="text"
              value={promoCode || ''}
              onChange={(e) => {
                setPromoCode && setPromoCode(e.target.value);
                setPromoError('');
              }}
              placeholder="Add promo code"
              className="w-full bg-gray-bg rounded-pill pl-9 pr-3 sm:pl-12 sm:pr-4 py-3 outline-none text-sm sm:text-base text-primary placeholder-gray-500"
            />
          </div>
          <Button variant="primary" onClick={handleApplyPromo} className="rounded-pill px-4 sm:px-6 py-3 shrink-0 text-sm sm:text-base">
            Apply
          </Button>
        </div>
        {promoApplied && (
          <p className="text-sm text-green-verified font-medium pl-2">
            Code "{activePromo?.code}" applied! {Math.round((activePromo?.rate || 0) * 100)}% discount has been deducted.
          </p>
        )}
        {promoError && (
          <p className="text-sm text-red-discount font-medium pl-2">
            {promoError}
          </p>
        )}
      </div>
      
      <Button variant="primary" className="w-full rounded-pill py-4 flex items-center justify-center gap-2 text-sm sm:text-base whitespace-nowrap">
        Go to Checkout
        <IoArrowForward size={18} />
      </Button>
    </div>
  );
}
