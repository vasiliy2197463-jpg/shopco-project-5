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
  const [demoPayment, setDemoPayment] = useState({ cardNumber: "", expiry: "", cvc: "", accepted: false });
  const [completedOrder, setCompletedOrder] = useState(null);

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
    if (checkout.paymentMethod !== "reservation" && !demoPayment.accepted) {
      setBookingNotice(ru ? "Подтвердите, что это демонстрационная оплата без списания денег." : "Confirm that this is a demo payment and no money will be charged.");
      return;
    }
    if (checkout.paymentMethod === "card_test") {
      const digits = demoPayment.cardNumber.replace(/\D/g, "");
      if (digits.length !== 16 || !/^\d{2}\/\d{2}$/.test(demoPayment.expiry) || !/^\d{3}$/.test(demoPayment.cvc)) {
        setBookingNotice(ru ? "Для демонстрации карты заполните номер из 16 цифр, срок ММ/ГГ и трёхзначный CVC." : "For the demo card, enter a 16-digit number, MM/YY expiry, and a three-digit CVC.");
        return;
      }
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
    const resolvedItems = items.map((item) => ({
      item,
      product: liveProducts.find((candidate) => candidate.name.toLowerCase() === String(item.name || "").toLowerCase())
        || liveProducts.find((candidate) => String(candidate.id) === String(item.id)),
    }));
    const unavailableItems = resolvedItems.filter(({ item, product }) => {
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
    const checkoutItems = resolvedItems.map(({ item, product }) => ({ product_id: product.id, color: item.color || null, size: item.size || null, quantity: Number(item.quantity) }));
    const { data: orderId, error } = await supabase.rpc("create_demo_order", {
      p_customer_email: user.email,
      p_customer_name: checkout.fullName.trim(),
      p_customer_phone: checkout.phone.trim(),
      p_city: checkout.city.trim(),
      p_shipping_address: checkout.address.trim(),
      p_postal_code: checkout.postalCode.trim(),
      p_delivery_method: checkout.deliveryMethod,
      p_payment_method: checkout.paymentMethod,
      p_payment_status: checkout.paymentMethod === "reservation" ? "not_required" : "demo_approved",
      p_customer_notes: checkout.notes.trim(),
      p_discount: Number(discountAmount),
      p_delivery_fee: Number(deliveryFee),
      p_items: checkoutItems,
    });
    if (error) {
      setBookingNotice(`${ru ? "Не удалось создать заказ" : "Could not create the order"}: ${error.message}`);
      setBooking(false);
      return;
    }
    setCompletedOrder({ id: orderId, total: Number(total), paymentMethod: checkout.paymentMethod });
    clearCart();
    setCheckoutOpen(false);
    setBookingNotice(
      ru ? `Заказ №${orderId} забронирован. Администратор уже увидит его в панели.` : `Order #${orderId} has been reserved. The administrator can now see it in the dashboard.`,
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

      {completedOrder && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 p-4" role="dialog" aria-modal="true">
          <div className="w-full max-w-lg rounded-[28px] bg-white p-6 text-center shadow-2xl sm:p-9">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#d7ff5f] text-3xl">✓</div>
            <div className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-black/45">{ru ? "Демонстрационный заказ" : "Demo order"}</div>
            <h2 className="mt-2 font-integral text-2xl font-bold sm:text-3xl">{ru ? "ЗАКАЗ ОФОРМЛЕН" : "ORDER PLACED"}</h2>
            <p className="mt-3 text-black/55">{ru ? `Номер заказа: ${completedOrder.id.slice(0, 8)}` : `Order number: ${completedOrder.id.slice(0, 8)}`}</p>
            <p className="mt-1 text-xl font-bold">{ru ? `${completedOrder.total.toLocaleString("ru-RU")} $` : `$${completedOrder.total.toLocaleString("en-US")}`}</p>
            <p className="mt-4 rounded-2xl bg-[#f2f2f2] p-4 text-sm text-black/60">{ru ? "Это безопасная демонстрация: заказ записан в учебную базу, но деньги не списывались." : "This is a safe demo: the order was saved to the training database, but no money was charged."}</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2"><Link href="/account" className="rounded-full bg-black px-6 py-3 font-semibold text-white">{ru ? "Посмотреть заказ" : "View order"}</Link><button onClick={()=>setCompletedOrder(null)} className="rounded-full border border-black/15 px-6 py-3 font-semibold">{ru ? "Продолжить покупки" : "Continue shopping"}</button></div>
          </div>
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
              {checkoutOpen && <div className="mb-5 rounded-[20px] border border-border bg-white p-5"><h2 className="text-xl font-bold">{ru ? "Данные для оформления" : "Checkout details"}</h2><p className="mt-1 text-sm text-black/50">{ru ? "Оплата работает в безопасном учебном режиме — деньги не списываются." : "Payment works in safe demo mode; no money will be charged."}</p><div className="mt-4 grid gap-3 sm:grid-cols-2">{[["fullName",ru?"Имя и фамилия":"Full name"],["phone",ru?"Телефон":"Phone"],["city",ru?"Город":"City"],["address",ru?"Адрес доставки":"Delivery address"],["postalCode",ru?"Индекс (необязательно)":"Postal code (optional)"]].map(([field,label])=><input key={field} value={checkout[field]} onChange={(e)=>setCheckout((value)=>({...value,[field]:e.target.value}))} placeholder={label} className={`rounded-2xl bg-[#f2f2f2] px-4 py-3 outline-none focus:ring-2 focus:ring-black ${field==="address"?"sm:col-span-2":""}`}/>)}<select aria-label={ru?"Способ доставки":"Delivery method"} value={checkout.deliveryMethod} onChange={(e)=>setCheckout((value)=>({...value,deliveryMethod:e.target.value}))} className="rounded-2xl bg-[#f2f2f2] px-4 py-3"><option value="courier">{ru?"Курьерская доставка":"Courier delivery"}</option><option value="pickup">{ru?"Пункт выдачи":"Pickup point"}</option></select><select aria-label={ru?"Способ оплаты":"Payment method"} value={checkout.paymentMethod} onChange={(e)=>setCheckout((value)=>({...value,paymentMethod:e.target.value}))} className="rounded-2xl bg-[#f2f2f2] px-4 py-3"><option value="reservation">{ru?"Бронирование без оплаты":"Reservation without payment"}</option><option value="card_test">{ru?"Банковская карта — тест":"Bank card — demo"}</option><option value="sbp_test">{ru?"СБП — тест":"Fast payment — demo"}</option></select><textarea value={checkout.notes} onChange={(e)=>setCheckout((value)=>({...value,notes:e.target.value}))} placeholder={ru?"Комментарий к заказу":"Order note"} rows="3" className="resize-none rounded-2xl bg-[#f2f2f2] px-4 py-3 sm:col-span-2"/></div>{checkout.paymentMethod==="card_test"&&<div className="mt-4 rounded-2xl border border-dashed border-black/20 p-4"><div className="font-bold">{ru?"Демонстрационная карта":"Demo card"}</div><p className="mt-1 text-xs text-black/45">{ru?"Введите любые тестовые данные. Они не сохраняются и никуда не отправляются.":"Enter any test details. They are not stored or sent anywhere."}</p><div className="mt-3 grid gap-3 sm:grid-cols-2"><input inputMode="numeric" maxLength="19" value={demoPayment.cardNumber} onChange={(e)=>setDemoPayment((value)=>({...value,cardNumber:e.target.value.replace(/[^\d ]/g,"")}))} placeholder={ru?"Номер карты — 16 цифр":"Card number — 16 digits"} className="rounded-2xl bg-[#f2f2f2] px-4 py-3 sm:col-span-2"/><input maxLength="5" value={demoPayment.expiry} onChange={(e)=>setDemoPayment((value)=>({...value,expiry:e.target.value}))} placeholder={ru?"ММ/ГГ":"MM/YY"} className="rounded-2xl bg-[#f2f2f2] px-4 py-3"/><input inputMode="numeric" maxLength="3" value={demoPayment.cvc} onChange={(e)=>setDemoPayment((value)=>({...value,cvc:e.target.value.replace(/\D/g,"")}))} placeholder="CVC" className="rounded-2xl bg-[#f2f2f2] px-4 py-3"/></div></div>}{checkout.paymentMethod!=="reservation"&&<label className="mt-4 flex cursor-pointer items-start gap-3 rounded-2xl bg-amber-50 p-4 text-sm"><input type="checkbox" checked={demoPayment.accepted} onChange={(e)=>setDemoPayment((value)=>({...value,accepted:e.target.checked}))} className="mt-1 h-4 w-4"/><span>{ru?"Я понимаю, что это демонстрационная оплата: реальные деньги не списываются, а платёжные данные не сохраняются.":"I understand this is a demo payment: no real money is charged and payment details are not stored."}</span></label>}</div>}
              <OrderSummary onCheckout={reserveOrder} booking={booking} />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
