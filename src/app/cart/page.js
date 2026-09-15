'use client';

import Breadcrumb from '@/components/common/Breadcrumb';
import CartItem from '@/components/cart/CartItem';
import OrderSummary from '@/components/cart/OrderSummary';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { useMemo, useState } from 'react';

export default function CartPage() {
  const { items, clearCart, subtotal, discountAmount, deliveryFee, total } = useCart();
  const { user } = useAuth();
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const [booking, setBooking] = useState(false);
  const [bookingNotice, setBookingNotice] = useState('');

  const reserveOrder = async () => {
    if (!user) {
      setBookingNotice('Чтобы забронировать заказ, войдите в аккаунт.');
      return;
    }
    if (!supabase || !items.length) return;
    setBooking(true);
    setBookingNotice('');
    const { data: order, error } = await supabase.from('orders').insert({
      user_id: user.id,
      customer_email: user.email,
      status: 'new',
      subtotal: Number(subtotal),
      discount: Number(discountAmount),
      delivery_fee: Number(deliveryFee),
      total: Number(total),
    }).select().single();
    if (error) {
      setBookingNotice(`Не удалось создать заказ: ${error.message}`);
      setBooking(false);
      return;
    }
    const orderItems = items.map((item) => ({
      order_id: order.id,
      product_id: Number(item.id),
      product_name: item.name,
      color: item.color || null,
      size: item.size || null,
      quantity: Number(item.quantity),
      unit_price: Number(item.price),
    }));
    const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
    if (itemsError) {
      await supabase.from('orders').delete().eq('id', order.id);
      setBookingNotice(`Не удалось сохранить состав заказа: ${itemsError.message}`);
      setBooking(false);
      return;
    }
    clearCart();
    setBookingNotice(`Заказ №${order.id} забронирован. Администратор уже увидит его в панели.`);
    setBooking(false);
  };
  
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

      {bookingNotice && <div className="mb-5 rounded-[20px] bg-[#d7ff5f] px-5 py-4 font-medium">{bookingNotice} {!user && <Link href="/signup" className="ml-2 underline">Войти</Link>}</div>}

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
              <OrderSummary onCheckout={reserveOrder} booking={booking} />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
