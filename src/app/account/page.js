"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { useLanguage } from "@/context/LanguageContext";
import { formatNotificationMessage } from "@/lib/notifications";
import AccountOrderCard from "@/components/account/AccountOrderCard";

export default function AccountPage() {
  const { user, profile, isOwnerAdmin, loading, configured, signOut, updateCustomerDetails } = useAuth();
  const { language } = useLanguage();
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const [orders, setOrders] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [replyNotice, setReplyNotice] = useState("");
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsNotice, setDetailsNotice] = useState("");
  const [details, setDetails] = useState({ full_name: "", phone: "", city: "", address: "", postal_code: "" });
  const [orderFilter, setOrderFilter] = useState("active");

  useEffect(() => {
    if (!user) return;
    const saved = user.user_metadata || {};
    setDetails({ full_name: saved.full_name || "", phone: saved.phone || "", city: saved.city || "", address: saved.address || "", postal_code: saved.postal_code || "" });
  }, [user]);

  const saveDetails = async () => {
    const { error } = await updateCustomerDetails(details);
    setDetailsNotice(error ? `${language === "ru" ? "Ошибка" : "Error"}: ${error.message}` : language === "ru" ? "Данные сохранены." : "Details saved.");
    if (!error) setDetailsOpen(false);
  };

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

  const unreadNotifications = notifications.filter((item) => item.sender !== "customer" && !item.is_read);
  const readNotifications = notifications.filter((item) => item.sender === "customer" || item.is_read);

  const toggleNotifications = async () => {
    const nextOpen = !notificationsOpen;
    setNotificationsOpen(nextOpen);
    if (!nextOpen && unreadNotifications.length && user && supabase) {
      const { error } = await supabase
        .from("order_notifications")
        .update({ is_read: true })
        .eq("user_id", user.id)
        .eq("is_read", false);
      if (!error) {
        setNotifications((current) => current.map((item) => ({ ...item, is_read: true })));
      }
    }
  };

  const sendReply = async (item) => {
    if (!replyText.trim() || !item.order_id) return;
    const { error } = await supabase.from("order_notifications").insert({ order_id: item.order_id, user_id: user.id, sender: "customer", message: replyText.trim(), allow_reply: false, is_read: true });
    if (error) return setReplyNotice(`${language === "ru" ? "Ошибка" : "Error"}: ${error.message}`);
    setNotifications((current) => [{ id: `local-${Date.now()}`, order_id: item.order_id, user_id: user.id, sender: "customer", message: replyText.trim(), created_at: new Date().toISOString(), is_read: true }, ...current]);
    setReplyText(""); setReplyingTo(null); setReplyNotice(language === "ru" ? "Ответ отправлен администратору." : "Your reply was sent to the administrator.");
  };

  const cancelOrder = async (order) => {
    if (!supabase || !user || !["new", "pending"].includes(order.status)) return { message: language === "ru" ? "Заказ уже принят в работу." : "The order is already being processed." };
    const { error } = await supabase.from("orders").update({ status: "cancelled" }).eq("id", order.id).eq("user_id", user.id).in("status", ["new", "pending"]);
    if (error) return error;
    await supabase.from("order_notifications").insert({ order_id: order.id, user_id: user.id, sender: "customer", message: `Customer cancelled order #${order.id.slice(0, 8)}.`, allow_reply: false, is_read: false });
    setOrders((current) => current.map((item) => item.id === order.id ? { ...item, status: "cancelled" } : item));
    return null;
  };

  const orderGroups = {
    active: orders.filter((order) => ["new", "pending", "processing"].includes(order.status)),
    completed: orders.filter((order) => order.status === "completed"),
    cancelled: orders.filter((order) => order.status === "cancelled"),
  };
  const visibleOrders = orderGroups[orderFilter] || [];
  const orderTabs = language === "ru"
    ? [["active", "Активные"], ["completed", "Завершённые"], ["cancelled", "Отменённые"]]
    : [["active", "Active"], ["completed", "Completed"], ["cancelled", "Cancelled"]];

  if (loading) return <main className="container-main min-h-[50vh] py-20 text-center">{language === "ru" ? "Загрузка…" : "Loading…"}</main>;
  if (!configured || !user) return <main className="container-main flex min-h-[50vh] flex-col items-center justify-center py-12 text-center"><h1 className="font-integral text-3xl font-bold md:text-5xl">{language === "ru" ? "МОЙ АККАУНТ" : "MY ACCOUNT"}</h1><p className="mt-3 text-black/55">{language === "ru" ? "Войдите, чтобы посмотреть профиль и заказы." : "Sign in to view your profile and orders."}</p><Link href="/signup" className="mt-7 rounded-full bg-black px-9 py-3.5 font-semibold text-white">{language === "ru" ? "Войти или создать аккаунт" : "Sign in or create account"}</Link></main>;

  return <main className="container-main py-6 md:py-20"><div className="mx-auto max-w-4xl rounded-[24px] bg-[#f2f2f2] p-3 sm:p-7 md:rounded-[32px] md:p-10"><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center"><div><div className="text-xs text-black/45 sm:text-sm">{language === "ru" ? "АККАУНТ SHOP.CO" : "SHOP.CO ACCOUNT"}</div><h1 className="mt-2 break-words font-integral text-2xl font-bold sm:text-3xl">{profile?.full_name || user.user_metadata?.full_name || (language === "ru" ? "Мой аккаунт" : "My Account")}</h1><p className="mt-2 break-all text-sm text-black/55 sm:text-base">{user.email}</p></div><div className="flex flex-col gap-3 sm:items-end">{isOwnerAdmin && <Link href="/admin" className="rounded-full bg-black px-6 py-3 text-center font-semibold text-white hover:bg-black/80">{language === "ru" ? "Панель администратора" : "Admin panel"}</Link>}<button onClick={signOut} className="rounded-full border border-black/15 bg-white px-6 py-3 font-semibold">{language === "ru" ? "Выйти" : "Sign out"}</button></div></div>
    <div className="mt-8 rounded-3xl bg-white p-6"><div className="flex items-center justify-between gap-4"><h2 className="text-xl font-bold">{language === "ru" ? "Контактные данные" : "Contact details"}</h2><button onClick={()=>setDetailsOpen((value)=>!value)} className="rounded-full border border-black/15 px-4 py-2 font-semibold">{detailsOpen ? (language === "ru" ? "Отмена" : "Cancel") : (language === "ru" ? "Изменить" : "Edit")}</button></div>{detailsNotice&&<p className="mt-3 rounded-xl bg-[#d7ff5f] p-3 text-sm">{detailsNotice}</p>}{detailsOpen?<div className="mt-4 grid gap-3 sm:grid-cols-2">{[["full_name",language==="ru"?"Имя":"Name"],["phone",language==="ru"?"Телефон":"Phone"],["city",language==="ru"?"Город":"City"],["postal_code",language==="ru"?"Индекс":"Postal code"],["address",language==="ru"?"Адрес":"Address"]].map(([key,label])=><label key={key} className={key==="address"?"sm:col-span-2":""}><span className="mb-1 block text-sm text-black/50">{label}</span><input value={details[key]} onChange={(event)=>setDetails((current)=>({...current,[key]:event.target.value}))} className="w-full rounded-full bg-[#f2f2f2] px-5 py-3 outline-none focus:ring-2 focus:ring-black"/></label>)}<button onClick={saveDetails} className="rounded-full bg-black px-6 py-3 font-semibold text-white sm:col-span-2">{language==="ru"?"Сохранить":"Save"}</button></div>:<div className="mt-3 grid gap-2 text-black/60 sm:grid-cols-2"><p>{details.phone || "—"}</p><p>{details.city || "—"}</p><p className="sm:col-span-2">{[details.address,details.postal_code].filter(Boolean).join(", ") || "—"}</p></div>}</div>
    {notifications.length > 0 && <div className="mt-6 overflow-hidden rounded-3xl bg-black text-white sm:mt-8"><button onClick={toggleNotifications} className="flex w-full items-center justify-between p-4 text-left sm:p-6"><h2 className="text-base font-bold sm:text-xl">{language === "ru" ? "Уведомления" : "Notifications"}{unreadNotifications.length > 0 && <span className="ml-2 rounded-full bg-[#ff3333] px-2 py-0.5 text-xs text-white">{unreadNotifications.length} {language === "ru" ? "новых" : "new"}</span>}</h2><span className={`text-xl transition-transform sm:text-2xl ${notificationsOpen ? "rotate-180" : ""}`}>⌄</span></button>{notificationsOpen && <div className="max-h-[520px] space-y-5 overflow-y-auto border-t border-white/15 p-4 sm:p-6">{replyNotice&&<p className="rounded-xl bg-[#d7ff5f] p-3 text-sm text-black">{replyNotice}</p>}{[[language==="ru"?"Новые":"New",unreadNotifications],[language==="ru"?"Прочитанные":"Read",readNotifications]].map(([title,list])=>list.length>0&&<section key={title}><h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-white/50">{title} ({list.length})</h3><div className="space-y-3">{list.map((item)=><div key={item.id} className={`rounded-2xl p-4 ${!item.is_read?"ring-2 ring-[#ff3333]": "opacity-75"} ${item.sender==="customer"?"bg-[#d7ff5f] text-black":"bg-white/10"}`}><div className="mb-1 text-xs font-bold uppercase opacity-50">{item.sender==="customer"?(language==="ru"?"Вы":"You"):(language==="ru"?"Магазин":"Store")}</div><p>{formatNotificationMessage(item.message, language)}</p><div className="mt-1 text-xs opacity-45">{new Date(item.created_at).toLocaleString(language === "ru" ? "ru-RU" : "en-US")}</div>{item.sender==="admin"&&item.allow_reply&&<button onClick={()=>setReplyingTo(replyingTo===item.id?null:item.id)} className="mt-3 rounded-full bg-white px-4 py-2 text-sm font-semibold text-black">{language==="ru"?"Ответить":"Reply"}</button>}{replyingTo===item.id&&<div className="mt-3 grid gap-2 sm:flex"><input value={replyText} onChange={(event)=>setReplyText(event.target.value)} placeholder={language==="ru"?"Напишите ответ…":"Write a reply…"} className="min-w-0 flex-1 rounded-full bg-white px-4 py-2 text-black"/><button onClick={()=>sendReply(item)} className="rounded-full bg-[#d7ff5f] px-4 py-2 font-semibold text-black">{language==="ru"?"Отправить":"Send"}</button></div>}</div>)}</div></section>)}</div>}</div>}
    <div className="mt-6 rounded-3xl bg-white p-3 sm:mt-8 sm:p-6"><h2 className="text-lg font-bold sm:text-xl">{language === "ru" ? "Ваши заказы" : "Your orders"}</h2>{orders.length ? <><div className="mt-4 grid grid-cols-3 gap-1 rounded-2xl bg-[#f2f2f2] p-1 sm:gap-2">{orderTabs.map(([id,label])=><button key={id} onClick={()=>setOrderFilter(id)} className={`min-w-0 rounded-xl px-1 py-2.5 text-[10px] font-semibold transition-colors sm:px-4 sm:text-sm ${orderFilter===id?"bg-black text-white shadow-sm":"text-black/55 hover:text-black"}`}><span className="block truncate">{label}</span><span className={`mt-0.5 block text-[10px] ${orderFilter===id?"text-white/65":"text-black/35"}`}>{orderGroups[id].length}</span></button>)}</div>{visibleOrders.length?<div className="mt-4 space-y-4">{visibleOrders.map((order)=><AccountOrderCard key={order.id} order={order} language={language} onCancel={cancelOrder} />)}</div>:<div className="mt-4 rounded-2xl bg-[#f7f7f7] p-8 text-center text-sm text-black/45">{language==="ru"?"В этом разделе заказов пока нет.":"There are no orders in this section yet."}</div>}</> : <p className="mt-2 text-black/50">{language === "ru" ? "Заказов пока нет." : "No orders yet."}</p>}</div>
  </div></main>;
}
