'use client';

import Breadcrumb from '@/components/common/Breadcrumb';
import CartItem from '@/components/cart/CartItem';
import OrderSummary from '@/components/cart/OrderSummary';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';

export default function CartPage() {
  const { items } = useCart();
  
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Cart', href: '/cart' }
  ];

  return (
    <main className="container-main py-6">
      <div className="mb-6">
        <Breadcrumb items={breadcrumbItems} />
      </div>
      
      <h1 className="font-integral text-[32px] md:text-[40px] font-bold mb-6 text-primary uppercase">
        Your Cart
      </h1>

      {(!items || items.length === 0) ? (
        <div className="border border-border rounded-[20px] p-6 text-center flex flex-col items-center">
          <p className="text-lg text-gray-600 mb-6">Your cart is currently empty.</p>
          <Link 
            href="/"
            className="inline-flex bg-primary text-white font-medium rounded-pill px-8 py-3 hover:opacity-80 transition-opacity"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-5">
          <div className="flex-[1.5] border border-border rounded-[20px] p-4 md:p-6">
            <div className="flex flex-col">
              {items.map((item, index) => (
                <CartItem key={`${item.id}-${item.size}-${item.color}`} item={item} />
              ))}
            </div>
          </div>
          
          <div className="flex-1">
            <div className="sticky top-24">
              <OrderSummary />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
