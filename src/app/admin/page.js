"use client";

import { useEffect, useMemo, useState } from "react";
import { products as sourceProducts } from "@/data/products";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { assetPath } from "@/components/common/BaseImage";
import { useAuth } from "@/context/AuthContext";

const promoDefaults = [
  { code: "SALE20", discount_percent: 20, active: true },
  { code: "SALE30", discount_percent: 30, active: true },
  { code: "SALE50", discount_percent: 50, active: true },
];

function normalizeProduct(product) {
  return {
    id: product.id,
    name: product.name,
    category: product.category || "Casual",
    price: product.price,
    old_price: product.originalPrice || null,
    stock: 25,
    active: true,
    image: product.images?.[0] || product.availableColors?.[0]?.image,
    variants: product.availableColors?.length || 0,
  };
}

export default function AdminPage() {
  const { user, isOwnerAdmin, loading: authLoading } = useAuth();
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const [tab, setTab] = useState("overview");
  const [products, setProducts] = useState(sourceProducts.map(normalizeProduct));
  const [promos, setPromos] = useState(promoDefaults);
  const [orders, setOrders] = useState([]);
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(Boolean(supabase));

  useEffect(() => {
    const load = async () => {
      if (!supabase) {
        const savedProducts = localStorage.getItem("shopco_admin_products");
        const savedPromos = localStorage.getItem("shopco_admin_promos");
        if (savedProducts) setProducts(JSON.parse(savedProducts));
        if (savedPromos) setPromos(JSON.parse(savedPromos));
        setLoading(false);
        return;
      }
      const [{ data: dbProducts }, { data: dbPromos }, { data: dbOrders }] = await Promise.all([
        supabase.from("products").select("*").order("id"),
        supabase.from("promo_codes").select("*").order("discount_percent"),
        supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(50),
      ]);
      if (dbProducts?.length) setProducts(dbProducts);
      if (dbPromos?.length) setPromos(dbPromos);
      if (dbOrders) setOrders(dbOrders);
      setLoading(false);
    };
    load();
  }, [supabase]);

  const updateProduct = (id, field, value) => {
    setProducts((current) => current.map((item) => item.id === id ? { ...item, [field]: value } : item));
  };

  const saveProducts = async () => {
    if (supabase) {
      const payload = products.map(({ image, variants, ...product }) => product);
      const { error } = await supabase.from("products").upsert(payload);
      setNotice(error ? `Ошибка: ${error.message}` : "Товары сохранены в Supabase");
    } else {
      localStorage.setItem("shopco_admin_products", JSON.stringify(products));
      setNotice("Изменения сохранены локально. Подключите Supabase для общей базы.");
    }
  };

  const savePromos = async () => {
    if (supabase) {
      const { error } = await supabase.from("promo_codes").upsert(promos, { onConflict: "code" });
      setNotice(error ? `Ошибка: ${error.message}` : "Промокоды сохранены в Supabase");
    } else {
      localStorage.setItem("shopco_admin_promos", JSON.stringify(promos));
      setNotice("Промокоды сохранены локально.");
    }
  };

  const visibleProducts = products.filter((product) => product.name.toLowerCase().includes(query.toLowerCase()));
  const inventoryValue = products.reduce((sum, item) => sum + Number(item.price) * Number(item.stock || 0), 0);

  if (authLoading) return <main className="flex min-h-screen items-center justify-center bg-[#f5f5f5] text-lg font-semibold">Проверка доступа…</main>;
  if (!user || !isOwnerAdmin) return <main className="flex min-h-screen items-center justify-center bg-[#f5f5f5] px-5"><div className="max-w-lg rounded-[32px] bg-white p-8 text-center shadow-sm"><h1 className="font-integral text-3xl font-bold">Доступ закрыт</h1><p className="mt-3 text-black/55">Панель доступна только владельцу магазина.</p><a href={assetPath("/account/")} className="mt-6 inline-block rounded-full bg-black px-7 py-3 font-semibold text-white">Войти в аккаунт</a></div></main>;

  return (
    <main className="min-h-screen bg-[#f5f5f5] text-black">
      <header className="sticky top-0 z-50 border-b border-black/10 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-5 py-4 lg:px-10">
          <div><div className="font-integral text-2xl font-bold">SHOP.CO</div><div className="text-xs text-black/50">Панель управления</div></div>
          <a href={assetPath("/")} className="rounded-full border border-black/15 px-5 py-2 text-sm font-semibold hover:bg-black hover:text-white">Открыть магазин</a>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1440px] gap-6 px-5 py-8 lg:grid-cols-[220px_1fr] lg:px-10">
        <aside className="h-fit rounded-3xl bg-black p-3 text-white lg:sticky lg:top-24">
          {[["overview","Обзор"],["products","Товары"],["promos","Промокоды"],["orders","Заказы"]].map(([id,label]) => (
            <button key={id} onClick={() => setTab(id)} className={`w-full rounded-2xl px-4 py-3 text-left font-semibold ${tab === id ? "bg-white text-black" : "text-white/70 hover:bg-white/10"}`}>{label}</button>
          ))}
          <div className="mt-4 border-t border-white/15 px-4 pt-4 text-xs text-white/50">{supabase ? "Supabase подключён" : "Локальный режим"}</div>
        </aside>

        <section className="min-w-0">
          {notice && <div className="mb-5 rounded-2xl bg-[#d7ff5f] px-5 py-3 font-medium">{notice}</div>}
          {loading ? <div className="rounded-3xl bg-white p-10">Загрузка данных…</div> : null}

          {!loading && tab === "overview" && <>
            <h1 className="mb-6 font-integral text-3xl font-bold md:text-5xl">ОБЗОР МАГАЗИНА</h1>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[["Товаров",products.length],["На складе",products.reduce((s,p)=>s+Number(p.stock||0),0)],["Заказов",orders.length],["Стоимость запасов",`$${inventoryValue.toLocaleString("en-US")}`]].map(([label,value]) => <div key={label} className="rounded-3xl bg-white p-6 shadow-sm"><div className="text-sm text-black/50">{label}</div><div className="mt-3 text-3xl font-bold">{value}</div></div>)}
            </div>
            {!supabase && <div className="mt-6 rounded-3xl border border-amber-300 bg-amber-50 p-6"><h2 className="text-xl font-bold">Нужно подключить Supabase</h2><p className="mt-2 max-w-2xl text-black/65">Интерфейс уже работает в режиме предпросмотра. После добавления URL и публичного ключа товары, пользователи и заказы будут храниться в общей защищённой базе.</p></div>}
          </>}

          {!loading && tab === "products" && <>
            <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><h1 className="font-integral text-3xl font-bold md:text-5xl">ТОВАРЫ</h1><p className="mt-2 text-black/50">Цена, остаток и публикация</p></div><button onClick={saveProducts} className="rounded-full bg-black px-7 py-3 font-semibold text-white">Сохранить изменения</button></div>
            <input value={query} onChange={(event)=>setQuery(event.target.value)} placeholder="Найти товар…" className="mb-5 w-full rounded-full border border-black/10 bg-white px-5 py-3" />
            <div className="overflow-hidden rounded-3xl bg-white shadow-sm"><div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left"><thead className="bg-black text-white"><tr><th className="p-4">Товар</th><th className="p-4">Цена</th><th className="p-4">Остаток</th><th className="p-4">Цветов</th><th className="p-4">Опубликован</th></tr></thead><tbody>{visibleProducts.map((product)=><tr key={product.id} className="border-b border-black/5"><td className="p-4"><div className="flex items-center gap-3">{product.image && <img src={assetPath(product.image)} alt="" className="h-14 w-14 rounded-xl bg-[#eee] object-cover"/>}<div><div className="font-bold">{product.name}</div><div className="text-xs text-black/45">{product.category}</div></div></div></td><td className="p-4"><input type="number" value={product.price} onChange={(e)=>updateProduct(product.id,"price",Number(e.target.value))} className="w-24 rounded-xl bg-[#f2f2f2] px-3 py-2"/></td><td className="p-4"><input type="number" value={product.stock} onChange={(e)=>updateProduct(product.id,"stock",Number(e.target.value))} className="w-24 rounded-xl bg-[#f2f2f2] px-3 py-2"/></td><td className="p-4">{product.variants || "—"}</td><td className="p-4"><button onClick={()=>updateProduct(product.id,"active",!product.active)} className={`rounded-full px-4 py-2 text-sm font-semibold ${product.active ? "bg-[#d7ff5f]" : "bg-black/10"}`}>{product.active ? "Да" : "Нет"}</button></td></tr>)}</tbody></table></div></div>
          </>}

          {!loading && tab === "promos" && <><div className="mb-6 flex items-end justify-between"><div><h1 className="font-integral text-3xl font-bold md:text-5xl">ПРОМОКОДЫ</h1><p className="mt-2 text-black/50">Управление скидками</p></div><button onClick={savePromos} className="rounded-full bg-black px-7 py-3 font-semibold text-white">Сохранить</button></div><div className="grid gap-4 md:grid-cols-3">{promos.map((promo,index)=><div key={promo.code} className="rounded-3xl bg-white p-6 shadow-sm"><input value={promo.code} onChange={(e)=>setPromos(p=>p.map((x,i)=>i===index?{...x,code:e.target.value.toUpperCase()}:x))} className="w-full border-b border-black/10 pb-2 text-2xl font-bold"/><label className="mt-5 block text-sm text-black/50">Размер скидки</label><div className="mt-2 flex items-center gap-2"><input type="number" min="1" max="100" value={promo.discount_percent} onChange={(e)=>setPromos(p=>p.map((x,i)=>i===index?{...x,discount_percent:Number(e.target.value)}:x))} className="w-24 rounded-xl bg-[#f2f2f2] px-3 py-2"/><span>%</span></div><button onClick={()=>setPromos(p=>p.map((x,i)=>i===index?{...x,active:!x.active}:x))} className={`mt-5 rounded-full px-4 py-2 text-sm font-semibold ${promo.active?"bg-[#d7ff5f]":"bg-black/10"}`}>{promo.active?"Активен":"Выключен"}</button></div>)}</div></>}

          {!loading && tab === "orders" && <><h1 className="mb-6 font-integral text-3xl font-bold md:text-5xl">ЗАКАЗЫ</h1>{orders.length ? <div className="rounded-3xl bg-white p-6">Получено заказов: {orders.length}</div> : <div className="rounded-3xl bg-white p-10 text-center"><div className="text-2xl font-bold">Заказов пока нет</div><p className="mt-2 text-black/50">После подключения Supabase новые заказы появятся здесь.</p></div>}</>}
        </section>
      </div>
    </main>
  );
}
