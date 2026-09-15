"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { useLanguage } from "@/context/LanguageContext";
import { formatNotificationMessage } from "@/lib/notifications";

const statusLabels = {
  ru: { new: "Забронирован", processing: "Принят в работу", completed: "Завершён", cancelled: "Отменён" },
  en: { new: "Reserved", processing: "Processing", completed: "Completed", cancelled: "Cancelled" },
};

export default function AccountPage() {
  const { user, profile, isOwnerAdmin, loading, configured, signOut } = useAuth();
  const { language } = useLanguage();
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const [orders, setOrders] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [replyNotice, setReplyNotice] = useState("");

  useEffect(() => {
    if (!user || !supabase) return;
    const load = async () => {
      const [{ data: orderData }, { data: notificationData }] = await Promise.all([
        supabase.from("orders").select("*,order_items(*)").eq("user_id", user.id).order("created_at", { ascending: false }),
        supabase.from("order_notifications").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
      ]);
      if (orderData) setOrders(orderData);
      if (notificationData) setNotifications(notificationData);
    };
    load();
    const timer = setInterval(load, 15000);
    return () => clearInterval(timer);
  }, [user, supabase]);

  const sendReply = async (item) => {
    if (!replyText.trim() || !item.order_id) return;
    const { error } = await supabase.from("order_notifications").insert({ order_id: item.order_id, user_id: user.id, sender: "customer", message: replyText.trim(), allow_reply: false });
    if (error) return setReplyNotice(`${language === "ru" ? "Ошибка" : "Error"}: ${error.message}`);
    setNotifications((current) => [{ id: `local-${Date.now()}`, order_id: item.order_id, user_id: user.id, sender: "customer", message: replyText.trim(), created_at: new Date().toISOString() }, ...current]);
    setReplyText(""); setReplyingTo(null); setReplyNotice(language === "ru" ? "Ответ отправлен администратору." : "Your reply was sent to the administrator.");
  };

  if (loading) return <main className="container-main min-h-[50vh] py-20 text-center">{language === "ru" ? "Загрузка…" : "Loading…"}</main>;
  if (!configured || !user) return <main className="container-main flex min-h-[50vh] flex-col items-center justify-center py-12 text-center"><h1 className="font-integral text-3xl font-bold md:text-5xl">{language === "ru" ? "МОЙ АККАУНТ" : "MY ACCOUNT"}</h1><p className="mt-3 text-black/55">{language === "ru" ? "Войдите, чтобы посмотреть профиль и заказы." : "Sign in to view your profile and orders."}</p><Link href="/signup" className="mt-7 rounded-full bg-black px-9 py-3.5 font-semibold text-white">{language === "ru" ? "Войти или создать аккаунт" : "Sign in or create account"}</Link></main>;

  return <main className="container-main py-12 md:py-20"><div className="mx-auto max-w-4xl rounded-[32px] bg-[#f2f2f2] p-7 md:p-10"><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center"><div><div className="text-sm text-black/45">{language === "ru" ? "АККАУНТ SHOP.CO" : "SHOP.CO ACCOUNT"}</div><h1 className="mt-2 font-integral text-3xl font-bold">{profile?.full_name || user.user_metadata?.full_name || (language === "ru" ? "Мой аккаунт" : "My Account")}</h1><p className="mt-2 text-black/55">{user.email}</p></div><div className="flex flex-col gap-3 sm:items-end">{isOwnerAdmin && <Link href="/admin" className="rounded-full bg-black px-6 py-3 text-center font-semibold text-white hover:bg-black/80">{language === "ru" ? "Панель администратора" : "Admin panel"}</Link>}<button onClick={signOut} className="rounded-full border border-black/15 bg-white px-6 py-3 font-semibold">{language === "ru" ? "Выйти" : "Sign out"}</button></div></div>
    {notifications.length > 0 && <div className="mt-8 overflow-hidden rounded-3xl bg-black text-white"><button onClick={()=>setNotificationsOpen((value)=>!value)} className="flex w-full items-center justify-between p-6 text-left"><h2 className="text-xl font-bold">{language === "ru" ? "Уведомления" : "Notifications"} ({notifications.length})</h2><span className={`text-2xl transition-transform ${notificationsOpen ? "rotate-180" : ""}`}>⌄</span></button>{notificationsOpen && <div className="max-h-[520px] space-y-3 overflow-y-auto border-t border-white/15 p-6">{replyNotice&&<p className="rounded-xl bg-[#d7ff5f] p-3 text-sm text-black">{replyNotice}</p>}{notifications.map((item)=><div key={item.id} className={`rounded-2xl p-4 ${item.sender==="customer"?"ml-6 bg-[#d7ff5f] text-black":"mr-6 bg-white/10"}`}><div className="mb-1 text-xs font-bold uppercase opacity-50">{item.sender==="customer"?(language==="ru"?"Вы":"You"):(language==="ru"?"Магазин":"Store")}</div><p>{formatNotificationMessage(item.message, language)}</p><div className="mt-1 text-xs opacity-45">{new Date(item.created_at).toLocaleString(language === "ru" ? "ru-RU" : "en-US")}</div>{item.sender==="admin"&&item.allow_reply&&<button onClick={()=>setReplyingTo(replyingTo===item.id?null:item.id)} className="mt-3 rounded-full bg-white px-4 py-2 text-sm font-semibold text-black">{language==="ru"?"Ответить":"Reply"}</button>}{replyingTo===item.id&&<div className="mt-3 flex gap-2"><input value={replyText} onChange={(event)=>setReplyText(event.target.value)} placeholder={language==="ru"?"Напишите ответ…":"Write a reply…"} className="min-w-0 flex-1 rounded-full bg-white px-4 py-2 text-black"/><button onClick={()=>sendReply(item)} className="rounded-full bg-[#d7ff5f] px-4 py-2 font-semibold text-black">{language==="ru"?"Отправить":"Send"}</button></div>}</div>)}</div>}</div>}
    <div className="mt-8 rounded-3xl bg-white p-6"><h2 className="text-xl font-bold">{language === "ru" ? "Ваши заказы" : "Your orders"}</h2>{orders.length ? <div className="mt-4 space-y-4">{orders.map((order)=><div key={order.id} className="rounded-2xl border border-black/10 p-4"><div className="flex flex-wrap items-center justify-between gap-3"><div><div className="font-bold">{language === "ru" ? "Заказ" : "Order"} #{order.id.slice(0,8)}</div><div className="text-sm text-black/45">{new Date(order.created_at).toLocaleString(language === "ru" ? "ru-RU" : "en-US")}</div></div><div className="text-right"><div className="font-bold">${Number(order.total).toFixed(2)}</div><span className="text-sm text-green-700">{statusLabels[language][order.status] || order.status}</span></div></div>{order.order_items?.map((item)=><div key={item.id} className="mt-3 flex justify-between gap-3 border-t border-black/5 pt-3 text-sm"><span>{item.product_name} · {item.color || "—"} · {item.size || "—"}</span><span>{item.quantity} {language === "ru" ? "шт." : "pcs."}</span></div>)}</div>)}</div> : <p className="mt-2 text-black/50">{language === "ru" ? "Заказов пока нет." : "No orders yet."}</p>}</div>
  </div></main>;
}
