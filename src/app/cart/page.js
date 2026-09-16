"use client";

import Breadcrumb from "@/components/common/Breadcrumb";
import CartItem from "@/components/cart/CartItem";
import OrderSummary from "@/components/cart/OrderSummary";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

export default function CartPage() {
  const { items, clearCart, subtotal, discountAmount, deliveryFee, total } =
    useCart();
  const { user } = useAuth();
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const [booking, setBooking] = useState(false);
  const [bookingNotice, setBookingNotice] = useState("");
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkout, setCheckout] = useState({ fullName: "", phone: "", city: "", address: "", postalCode: "", deliveryMethod: "courier", paymentMethod: "reservation", notes: "" });

  useEffect(() => {
    const details = user?.user_metadata;
    if (!details) return;
    setCheckout((current) => ({ ...current, fullName: current.fullName || details.full_name || "", phone: current.phone || details.phone || "", city: current.city || details.city || "", address: current.address || details.address || "", postalCode: current.postalCode || details.postal_code || "" }));
  }, [user]);

  const reserveOrder = async () => {
    if (!checkoutOpen) { setCheckoutOpen(true); return; }
    if (!user) {
      setBookingNotice("Чтобы забронировать заказ, войдите в аккаунт.");
      return;
    }
    if (!supabase || !items.length) return;
    if (!checkout.fullName.trim() || !checkout.phone.trim() || !checkout.city.trim() || !checkout.address.trim()) {
      setBookingNotice("Заполните имя, телефон, город и адрес доставки.");
      return;
    }
    setBooking(true);
    setBookingNotice("");
    const { data: order, error } = await supabase
      .from("orders")
      .insert({
        user_id: user.id,
        customer_email: user.email,
        status: "new",
        subtotal: Number(subtotal),
        discount: Number(discountAmount),
        delivery_fee: Number(deliveryFee),
      total: Number(total),
      customer_name: checkout.fullName.trim(),
      customer_phone: checkout.phone.trim(),
      city: checkout.city.trim(),
      shipping_address: checkout.address.trim(),
      postal_code: checkout.postalCode.trim() || null,
      delivery_method: checkout.deliveryMethod,
      payment_method: checkout.paymentMethod,
      payment_status: checkout.paymentMethod === "reservation" ? "not_required" : "test_pending",
      customer_notes: checkout.notes.trim() || null,
      })
      .select()
      .single();
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
    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);
    if (itemsError) {
      await supabase.from("orders").delete().eq("id", order.id);
      setBookingNotice(
        `Не удалось сохранить состав заказа: ${itemsError.message}`,
      );
      setBooking(false);
      return;
    }
    clearCart();
    setCheckoutOpen(false);
    setBookingNotice(
      `Заказ №${order.id} забронирован. Администратор уже увидит его в панели.`,
    );
    setBooking(false);
  };

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Cart", href: "/cart" },
  ];

  return (
    <main className="container-main py-6">
      <div className="mb-6">
        <Breadcrumb items={breadcrumbItems} />
      </div>

      <h1 className="font-integral text-[32px] md:text-[40px] font-bold mb-6 text-primary uppercase">
        Your Cart
      </h1>

      {bookingNotice && (
        <div className="mb-5 rounded-[20px] bg-[#d7ff5f] px-5 py-4 font-medium">
          {bookingNotice}{" "}
          {!user && (
            <Link href="/signup" className="ml-2 underline">
              Войти
            </Link>
          )}
        </div>
      )}

      {!items || items.length === 0 ? (
        <div className="border border-border rounded-[20px] p-6 text-center flex flex-col items-center">
          <p className="text-lg text-gray-600 mb-6">
            Your cart is currently empty.
          </p>
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
                <CartItem
                  key={`${item.id}-${item.size}-${item.color}`}
                  item={item}
                />
              ))}
            </div>
          </div>

          <div className="flex-1">
            <div className="sticky top-24">
              {checkoutOpen && <div className="mb-5 rounded-[20px] border border-border bg-white p-5"><h2 className="text-xl font-bold">Данные для оформления</h2><p className="mt-1 text-sm text-black/50">Оплата работает в безопасном учебном режиме — деньги не списываются.</p><div className="mt-4 grid gap-3 sm:grid-cols-2">{[["fullName","Имя и фамилия"],["phone","Телефон"],["city","Город"],["address","Адрес доставки"],["postalCode","Индекс (необязательно)"]].map(([field,label])=><input key={field} value={checkout[field]} onChange={(e)=>setCheckout((value)=>({...value,[field]:e.target.value}))} placeholder={label} className={`rounded-2xl bg-[#f2f2f2] px-4 py-3 outline-none focus:ring-2 focus:ring-black ${field==="address"?"sm:col-span-2":""}`}/>)}<select value={checkout.deliveryMethod} onChange={(e)=>setCheckout((value)=>({...value,deliveryMethod:e.target.value}))} className="rounded-2xl bg-[#f2f2f2] px-4 py-3"><option value="courier">Курьерская доставка</option><option value="pickup">Пункт выдачи</option></select><select value={checkout.paymentMethod} onChange={(e)=>setCheckout((value)=>({...value,paymentMethod:e.target.value}))} className="rounded-2xl bg-[#f2f2f2] px-4 py-3"><option value="reservation">Бронирование без оплаты</option><option value="card_test">Банковская карта — тест</option><option value="sbp_test">СБП — тест</option></select><textarea value={checkout.notes} onChange={(e)=>setCheckout((value)=>({...value,notes:e.target.value}))} placeholder="Комментарий к заказу" rows="3" className="resize-none rounded-2xl bg-[#f2f2f2] px-4 py-3 sm:col-span-2"/></div></div>}
              <OrderSummary onCheckout={reserveOrder} booking={booking} />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
