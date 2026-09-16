"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useCatalog } from "@/context/CatalogContext";

const labels = {
  ru: { new: "Забронирован", processing: "Принят в работу", completed: "Завершён", cancelled: "Отменён" },
  en: { new: "Reserved", processing: "Processing", completed: "Completed", cancelled: "Cancelled" },
};

export default function AccountOrderCard({ order, language }) {
  const { addToCart } = useCart();
  const { products } = useCatalog();
  const [notice, setNotice] = useState("");
  const steps = language === "ru"
    ? [{ short: "Бронь", full: "Забронирован" }, { short: "В работе", full: "В работе" }, { short: "Готов", full: "Завершён" }]
    : [{ short: "Reserved", full: "Reserved" }, { short: "In progress", full: "Processing" }, { short: "Done", full: "Completed" }];
  const activeStep = order.status === "completed" ? 3 : order.status === "processing" ? 2 : order.status === "cancelled" ? 0 : 1;

  const repeatOrder = () => {
    order.order_items?.forEach((item) => {
      const product = products.find((candidate) => candidate.name.toLowerCase() === String(item.product_name || "").toLowerCase()) || products.find((candidate) => String(candidate.id) === String(item.product_id));
      const colorName = String(item.color || "").toLowerCase();
      const variant = product?.availableColors?.find((candidate) => candidate.name.toLowerCase() === colorName || colorName.startsWith(candidate.name.toLowerCase()) || candidate.name.toLowerCase().startsWith(colorName));
      addToCart({ id: item.product_id, name: item.product_name, price: Number(item.unit_price), color: item.color, size: item.size, quantity: Number(item.quantity), image: variant?.image || product?.images?.[0] });
    });
    setNotice(language === "ru" ? "Товары добавлены в корзину." : "Items added to cart.");
  };

  return <article className="min-w-0 rounded-2xl border border-black/10 p-3 sm:p-4 print:border-0">
    {order.status !== "cancelled" ? <div className="mb-5 grid grid-cols-3 gap-1.5 sm:gap-2">{steps.map((step,index)=><div key={step.full} className="min-w-0 text-center"><div className={`h-1.5 rounded-full ${index < activeStep ? "bg-black" : "bg-black/10"}`} /><div className={`mt-2 truncate text-[10px] leading-tight sm:text-left sm:text-xs ${index < activeStep ? "font-semibold text-black" : "text-black/35"}`}><span className="sm:hidden">{step.short}</span><span className="hidden sm:inline">{step.full}</span></div></div>)}</div> : <div className="mb-4 rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700">{language === "ru" ? "Заказ отменён" : "Order cancelled"}</div>}
    <div className="grid gap-1.5 sm:flex sm:items-start sm:justify-between sm:gap-3"><div className="min-w-0"><div className="truncate text-sm font-bold sm:text-base">{language === "ru" ? "Заказ" : "Order"} #{order.id.slice(0,8)}</div><div className="text-xs text-black/45 sm:text-sm">{new Date(order.created_at).toLocaleString(language === "ru" ? "ru-RU" : "en-US")}</div></div><div className="flex items-center justify-between gap-3 sm:block sm:text-right"><div className="text-sm font-bold sm:text-base">${Number(order.total).toFixed(2)}</div><span className="text-xs text-green-700 sm:text-sm">{labels[language][order.status] || order.status}</span></div></div>
    <div className="mt-4 grid gap-2 print:hidden sm:flex sm:flex-wrap"><button onClick={repeatOrder} className="w-full rounded-full bg-black px-4 py-2.5 text-xs font-semibold text-white sm:w-auto sm:px-5 sm:text-sm">{language === "ru" ? "Повторить заказ" : "Order again"}</button><button onClick={()=>window.print()} className="w-full rounded-full border border-black/15 px-4 py-2.5 text-xs font-semibold sm:w-auto sm:px-5 sm:text-sm">{language === "ru" ? "Печать квитанции" : "Print receipt"}</button></div>
    {notice&&<p className="mt-3 rounded-xl bg-[#d7ff5f] p-3 text-sm">{notice}</p>}
    {(order.delivery_method || order.shipping_address) && <div className="mt-4 min-w-0 rounded-xl bg-[#f2f2f2] p-3 text-xs sm:text-sm"><div className="font-semibold">{language === "ru" ? "Доставка" : "Delivery"}</div><p className="mt-1 break-words text-black/55">{order.delivery_method === "pickup" ? (language === "ru" ? "Самовывоз" : "Pickup") : (language === "ru" ? "Курьер" : "Courier")}{order.shipping_address ? ` · ${order.city || ""}, ${order.shipping_address}` : ""}</p></div>}
    <h3 className="mt-5 text-sm font-bold sm:text-base">{language === "ru" ? "Состав заказа" : "Order contents"}</h3>
    {order.order_items?.map((item)=><div key={item.id} className="mt-3 flex justify-between gap-3 border-t border-black/5 pt-3 text-sm"><span>{item.product_name} · {item.color || "—"} · {item.size || "—"}</span><span>{item.quantity} {language === "ru" ? "шт." : "pcs."}</span></div>)}
  </article>;
}
