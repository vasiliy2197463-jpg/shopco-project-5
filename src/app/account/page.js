"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

const statusLabels = { new: "Забронирован", processing: "Принят в работу", completed: "Завершён", cancelled: "Отменён" };

export default function AccountPage() {
  const { user, profile, isOwnerAdmin, loading, configured, signOut } = useAuth();
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const [orders, setOrders] = useState([]);
  const [notifications, setNotifications] = useState([]);

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

  if (loading) return <main className="container-main min-h-[50vh] py-20 text-center">Loading…</main>;
  if (!configured || !user) return <main className="container-main flex min-h-[50vh] flex-col items-center justify-center py-12 text-center"><h1 className="font-integral text-3xl font-bold md:text-5xl">MY ACCOUNT</h1><p className="mt-3 text-black/55">Sign in to view your profile and orders.</p><Link href="/signup" className="mt-7 rounded-full bg-black px-9 py-3.5 font-semibold text-white">Sign in or create account</Link></main>;

  return <main className="container-main py-12 md:py-20"><div className="mx-auto max-w-4xl rounded-[32px] bg-[#f2f2f2] p-7 md:p-10"><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center"><div><div className="text-sm text-black/45">SHOP.CO ACCOUNT</div><h1 className="mt-2 font-integral text-3xl font-bold">{profile?.full_name || user.user_metadata?.full_name || "My Account"}</h1><p className="mt-2 text-black/55">{user.email}</p></div><div className="flex flex-col gap-3 sm:items-end">{isOwnerAdmin && <Link href="/admin" className="rounded-full bg-black px-6 py-3 text-center font-semibold text-white hover:bg-black/80">Admin panel</Link>}<button onClick={signOut} className="rounded-full border border-black/15 bg-white px-6 py-3 font-semibold">Sign out</button></div></div>
    {notifications.length > 0 && <div className="mt-8 rounded-3xl bg-black p-6 text-white"><h2 className="text-xl font-bold">Уведомления</h2><div className="mt-4 space-y-3">{notifications.map((item)=><div key={item.id} className="rounded-2xl bg-white/10 p-4"><p>{item.message}</p><div className="mt-1 text-xs text-white/45">{new Date(item.created_at).toLocaleString("ru-RU")}</div></div>)}</div></div>}
    <div className="mt-8 rounded-3xl bg-white p-6"><h2 className="text-xl font-bold">Your orders</h2>{orders.length ? <div className="mt-4 space-y-4">{orders.map((order)=><div key={order.id} className="rounded-2xl border border-black/10 p-4"><div className="flex flex-wrap items-center justify-between gap-3"><div><div className="font-bold">Заказ #{order.id.slice(0,8)}</div><div className="text-sm text-black/45">{new Date(order.created_at).toLocaleString("ru-RU")}</div></div><div className="text-right"><div className="font-bold">${Number(order.total).toFixed(2)}</div><span className="text-sm text-green-700">{statusLabels[order.status] || order.status}</span></div></div>{order.order_items?.map((item)=><div key={item.id} className="mt-3 flex justify-between gap-3 border-t border-black/5 pt-3 text-sm"><span>{item.product_name} · {item.color || "—"} · {item.size || "—"}</span><span>{item.quantity} шт.</span></div>)}</div>)}</div> : <p className="mt-2 text-black/50">No orders yet.</p>}</div>
  </div></main>;
}
