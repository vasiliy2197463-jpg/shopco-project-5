"use client";

import Breadcrumb from "@/components/common/Breadcrumb";
import CartItem from "@/components/cart/CartItem";
import OrderSummary from "@/components/cart/OrderSummary";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useCatalog } from "@/context/CatalogContext";
import { useLanguage } from "@/context/LanguageContext";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

export default function CartPage() {
  const { items, clearCart, subtotal, discountAmount, deliveryFee, total } =
    useCart();
  const { user } = useAuth();
  const { language } = useLanguage();
  const ru = language === "ru";
  const { loading: catalogLoading } = useCatalog();
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
      setBookingNotice(ru ? "Чтобы забронировать заказ, войдите в аккаунт." : "Sign in to reserve your order.");
      return;
    }
    if (!supabase || !items.length) return;
    if (catalogLoading) {
      setBookingNotice(ru ? "Проверяем наличие товаров. Попробуйте ещё раз через несколько секунд." : "We are checking product availability. Please try again in a few seconds.");
      return;
    }
    if (!checkout.fullName.trim() || !checkout.phone.trim() || !checkout.city.trim() || !checkout.address.trim()) {
      setBookingNotice(ru ? "Заполните имя, телефон, город и адрес доставки." : "Enter your name, phone number, city, and delivery address.");
      return;
    }
    setBooking(true);
    setBookingNotice("");
    const { data: liveProducts, error: catalogError } = await supabase
      .from("products")
      .select("id,name,stock,active,archived");
    if (catalogError) {
      setBookingNotice(ru ? "Не удалось проверить наличие товаров. Заказ не создан — попробуйте ещё раз." : "We could not check product availability. The order was not created; please try again.");
      setBooking(false);
      return;
    }
    const unavailableItems = items.filter((item) => {
      const product = liveProducts.find((candidate) => candidate.name.toLowerCase() === String(item.name || "").toLowerCase())
        || liveProducts.find((candidate) => String(candidate.id) === String(item.id));
      return !product
        || product.active === false
        || product.archived === true
        || Number(product.stock || 0) < Number(item.quantity || 1);
    });
    if (unavailableItems.length) {
      setBookingNotice(ru ? "Один или несколько товаров уже удалены, скрыты или закончились. Корзина обновлена — проверьте её перед бронированием." : "One or more products were removed, hidden, or sold out. Review your updated cart before reserving.");
      setBooking(false);
      return;
    }
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
      setBookingNotice(`${ru ? "Не удалось создать заказ" : "Could not create the order"}: ${error.message}`);
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
        `${ru ? "Не удалось сохранить состав заказа" : "Could not save the order contents"}: ${itemsError.message}`,
      );
      setBooking(false);
      return;
    }
    clearCart();
    setCheckoutOpen(false);
    setBookingNotice(
      ru ? `Заказ №${order.id} забронирован. Администратор уже увидит его в панели.` : `Order #${order.id} has been reserved. The administrator can now see it in the dashboard.`,
    );
    setBooking(false);
  };

  const breadcrumbItems = [
    { label: ru ? "Главная" : "Home", href: "/" },
    { label: ru ? "Корзина" : "Cart", href: "/cart" },
  ];
  const bookingIsError = /(не удалось|заполните|войдите|недоступ|удалены|законч|ошибка|проверяем|could not|enter your|sign in|removed|sold out|checking)/i.test(bookingNotice);

  return (
    <main className="container-main py-6">
      <div className="mb-6">
        <Breadcrumb items={breadcrumbItems} />
      </div>

      <h1 className="font-integral text-[32px] md:text-[40px] font-bold mb-6 text-primary uppercase">
        {ru ? "Ваша корзина" : "Your Cart"}
      </h1>

      {bookingNotice && (
        <div className={`mb-5 rounded-[20px] px-5 py-4 font-medium ${bookingIsError ? "bg-red-100 text-red-800" : "bg-[#d7ff5f]"}`}>
          {bookingNotice}{" "}
          {!user && (
            <Link href="/signup" className="ml-2 underline">
              {ru ? "Войти" : "Sign in"}
            </Link>
          )}
        </div>
      )}

      {!items || items.length === 0 ? (
        <div className="border border-border rounded-[20px] p-6 text-center flex flex-col items-center">
          <p className="text-lg text-gray-600 mb-6">
            {ru ? "Ваша корзина пока пуста." : "Your cart is currently empty."}
          </p>
          <Link
            href="/"
            className="inline-flex bg-primary text-white font-medium rounded-pill px-8 py-3 hover:opacity-80 transition-opacity"
          >
            {ru ? "Продолжить покупки" : "Continue Shopping"}
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
              {checkoutOpen && <div className="mb-5 rounded-[20px] border border-border bg-white p-5"><h2 className="text-xl font-bold">{ru ? "Данные для оформления" : "Checkout details"}</h2><p className="mt-1 text-sm text-black/50">{ru ? "Оплата работает в безопасном учебном режиме — деньги не списываются." : "Payment works in safe demo mode; no money will be charged."}</p><div className="mt-4 grid gap-3 sm:grid-cols-2">{[["fullName",ru?"Имя и фамилия":"Full name"],["phone",ru?"Телефон":"Phone"],["city",ru?"Город":"City"],["address",ru?"Адрес доставки":"Delivery address"],["postalCode",ru?"Индекс (необязательно)":"Postal code (optional)"]].map(([field,label])=><input key={field} value={checkout[field]} onChange={(e)=>setCheckout((value)=>({...value,[field]:e.target.value}))} placeholder={label} className={`rounded-2xl bg-[#f2f2f2] px-4 py-3 outline-none focus:ring-2 focus:ring-black ${field==="address"?"sm:col-span-2":""}`}/>)}<select aria-label={ru?"Способ доставки":"Delivery method"} value={checkout.deliveryMethod} onChange={(e)=>setCheckout((value)=>({...value,deliveryMethod:e.target.value}))} className="rounded-2xl bg-[#f2f2f2] px-4 py-3"><option value="courier">{ru?"Курьерская доставка":"Courier delivery"}</option><option value="pickup">{ru?"Пункт выдачи":"Pickup point"}</option></select><select aria-label={ru?"Способ оплаты":"Payment method"} value={checkout.paymentMethod} onChange={(e)=>setCheckout((value)=>({...value,paymentMethod:e.target.value}))} className="rounded-2xl bg-[#f2f2f2] px-4 py-3"><option value="reservation">{ru?"Бронирование без оплаты":"Reservation without payment"}</option><option value="card_test">{ru?"Банковская карта — тест":"Bank card — demo"}</option><option value="sbp_test">{ru?"СБП — тест":"Fast payment — demo"}</option></select><textarea value={checkout.notes} onChange={(e)=>setCheckout((value)=>({...value,notes:e.target.value}))} placeholder={ru?"Комментарий к заказу":"Order note"} rows="3" className="resize-none rounded-2xl bg-[#f2f2f2] px-4 py-3 sm:col-span-2"/></div></div>}
              <OrderSummary onCheckout={reserveOrder} booking={booking} />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
