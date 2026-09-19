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
    slug: product.slug,
    name: product.name,
    description: product.description || "",
    category: product.category || "Casual",
    dress_style: product.dressStyle || "Casual",
    price: product.price,
    old_price: product.originalPrice || null,
    rating: product.rating || 0,
    stock: product.stock ?? 25,
    active: product.active !== false,
    archived: product.archived === true,
    image: product.images?.[0] || product.availableColors?.[0]?.image,
    variants: product.availableColors?.length || 0,
  };
}

const slugify = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9а-яё]+/gi, "-")
    .replace(/(^-|-$)/g, "");

export default function AdminPage() {
  const { user, isOwnerAdmin, loading: authLoading } = useAuth();
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const [tab, setTab] = useState("overview");
  const [products, setProducts] = useState(
    sourceProducts.map(normalizeProduct),
  );
  const [promos, setPromos] = useState(promoDefaults);
  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [visitors, setVisitors] = useState([]);
  const [analyticsNow, setAnalyticsNow] = useState(0);
  const [visitorPeriod, setVisitorPeriod] = useState("today");
  const [visitorDevice, setVisitorDevice] = useState("all");
  const [ownerVisitorId, setOwnerVisitorId] = useState("");
  const [subscriberQuery, setSubscriberQuery] = useState("");
  const [questionReplies, setQuestionReplies] = useState({});
  const [orderFilter, setOrderFilter] = useState("new");
  const [orderReplies, setOrderReplies] = useState({});
  const [orderAllowReply, setOrderAllowReply] = useState({});
  const [customerMessages, setCustomerMessages] = useState([]);
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    category: "t-shirts",
    price: "",
    stock: "",
    active: true,
    image: null,
  });
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
      const [
        { data: dbProducts },
        { data: dbPromos },
        { data: dbOrders },
        { data: dbReviews },
        { data: dbQuestions },
        { data: dbMessages },
        { data: dbSubscribers },
      ] = await Promise.all([
        supabase
          .from("products")
          .select("*,product_variants(image_url)")
          .order("id"),
        supabase.from("promo_codes").select("*").order("discount_percent"),
        supabase
          .from("orders")
          .select("*,order_items(*)")
          .order("created_at", { ascending: false })
          .limit(50),
        supabase
          .from("product_reviews")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(100),
        supabase
          .from("product_questions")
          .select("*,products(name)")
          .order("created_at", { ascending: false })
          .limit(100),
        supabase
          .from("order_notifications")
          .select("*")
          .eq("sender", "customer")
          .order("created_at", { ascending: false })
          .limit(100),
        supabase
          .from("newsletter_subscribers")
          .select("*")
          .order("created_at", { ascending: false }),
      ]);
      if (dbProducts?.length) {
        const sourceById = new Map(
          sourceProducts.map((product) => [
            product.id,
            normalizeProduct(product),
          ]),
        );
        setProducts(
          dbProducts.map((product) => ({
            ...sourceById.get(Number(product.id)),
            ...product,
            image:
              sourceById.get(Number(product.id))?.image ||
              product.product_variants?.find((variant) => variant.image_url)
                ?.image_url,
            variants:
              sourceById.get(Number(product.id))?.variants ||
              product.product_variants?.length ||
              0,
          })),
        );
      }
      if (dbPromos?.length) setPromos(dbPromos);
      if (dbOrders) setOrders(dbOrders);
      if (dbReviews) setReviews(dbReviews);
      if (dbQuestions) setQuestions(dbQuestions);
      if (dbMessages) setCustomerMessages(dbMessages);
      if (dbSubscribers) setSubscribers(dbSubscribers);
      setLoading(false);
    };
    load();
  }, [supabase]);

  useEffect(() => {
    if (!supabase || !isOwnerAdmin) return;
    const refreshOrders = async () => {
      const [{ data: orderData }, { data: messageData }] = await Promise.all([
        supabase.from("orders").select("*,order_items(*)").order("created_at", { ascending: false }).limit(50),
        supabase.from("order_notifications").select("*").eq("sender", "customer").order("created_at", { ascending: false }).limit(100),
      ]);
      if (orderData) setOrders(orderData);
      if (messageData) setCustomerMessages(messageData);
    };
    const timer = setInterval(refreshOrders, 15000);
    return () => clearInterval(timer);
  }, [supabase, isOwnerAdmin]);

  useEffect(() => {
    if (!supabase || !isOwnerAdmin) return;
    setOwnerVisitorId(localStorage.getItem("luchik_visitor_id") || "");
    const loadVisitors = async () => {
      const { data } = await supabase
        .from("visitor_events")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(500);
      if (data) setVisitors(data);
      setAnalyticsNow(Date.now());
    };
    loadVisitors();
    const timer = setInterval(loadVisitors, 15000);
    return () => clearInterval(timer);
  }, [supabase, isOwnerAdmin]);

  const openMessages = async () => {
    setTab("messages");
    const unreadIds = customerMessages.filter((item) => !item.is_read).map((item) => item.id);
    if (!unreadIds.length || !supabase) return;
    await supabase.from("order_notifications").update({ is_read: true }).in("id", unreadIds);
    setCustomerMessages((current) => current.map((item) => ({ ...item, is_read: true })));
  };

  const updateProduct = (id, field, value) => {
    setProducts((current) =>
      current.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    );
  };

  const toggleSubscriber = async (subscriber) => {
    if (!supabase) return;
    const nextActive = subscriber.active === false;
    const { error } = await supabase
      .from("newsletter_subscribers")
      .update({ active: nextActive })
      .eq("id", subscriber.id);
    if (error) {
      setNotice(`Ошибка: ${error.message}`);
      return;
    }
    setSubscribers((current) => current.map((item) => item.id === subscriber.id ? { ...item, active: nextActive } : item));
    setNotice(nextActive ? "Подписка восстановлена." : "Подписка отключена.");
  };

  const exportSubscribers = () => {
    const rows = [["email", "language", "active", "created_at"], ...subscribers.map((item) => [item.email, item.language || "en", item.active !== false ? "yes" : "no", item.created_at])];
    const csv = rows.map((row) => row.map((value) => `"${String(value ?? "").replaceAll('"', '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `shopco-subscribers-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const saveProducts = async () => {
    if (supabase) {
      const payload = products.map(
        ({ image, variants, product_variants, ...product }) => ({
          ...product,
          slug: product.slug || `${slugify(product.name)}-${product.id}`,
        }),
      );
      const { error } = await supabase.from("products").upsert(payload);
      setNotice(
        error ? `Ошибка: ${error.message}` : "Товары сохранены в Supabase",
      );
    } else {
      localStorage.setItem("shopco_admin_products", JSON.stringify(products));
      setNotice(
        "Изменения сохранены локально. Подключите Supabase для общей базы.",
      );
    }
  };

  const createProduct = async (event) => {
    event.preventDefault();
    if (!supabase || !newProduct.image) {
      setNotice("Заполните поля и добавьте фотографию");
      return;
    }
    setCreating(true);
    const safeName = newProduct.image.name.replace(/[^a-z0-9._-]/gi, "-");
    const filePath = `${Date.now()}-${safeName}`;
    const { error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(filePath, newProduct.image);
    if (uploadError) {
      setNotice(`Ошибка загрузки: ${uploadError.message}`);
      setCreating(false);
      return;
    }
    const { data: publicImage } = supabase.storage
      .from("product-images")
      .getPublicUrl(filePath);
    const slug = `${slugify(newProduct.name)}-${Date.now()}`;
    const { data: created, error } = await supabase
      .from("products")
      .insert({
        slug,
        name: newProduct.name,
        description: newProduct.description,
        category: newProduct.category,
        dress_style: "Casual",
        price: Number(newProduct.price),
        stock: Number(newProduct.stock),
        active: newProduct.active,
      })
      .select()
      .single();
    if (error) {
      setNotice(`Ошибка: ${error.message}`);
      setCreating(false);
      return;
    }
    await supabase
      .from("product_variants")
      .insert({
        product_id: created.id,
        color_name: "Default",
        color_hex: "#000000",
        size: "One Size",
        image_url: publicImage.publicUrl,
        stock: Number(newProduct.stock),
      });
    setProducts((current) => [
      ...current,
      { ...created, image: publicImage.publicUrl, variants: 1 },
    ]);
    setNewProduct({
      name: "",
      description: "",
      category: "t-shirts",
      price: "",
      stock: "",
      active: true,
      image: null,
    });
    setShowCreate(false);
    setCreating(false);
    setNotice("Товар создан и сохранён в Supabase");
  };

  const savePromos = async () => {
    if (supabase) {
      const { error } = await supabase
        .from("promo_codes")
        .upsert(promos, { onConflict: "code" });
      setNotice(
        error ? `Ошибка: ${error.message}` : "Промокоды сохранены в Supabase",
      );
    } else {
      localStorage.setItem("shopco_admin_promos", JSON.stringify(promos));
      setNotice("Промокоды сохранены локально.");
    }
  };

  const moveToTrash = async (product) => {
    if (
      !window.confirm(
        `Переместить «${product.name}» в корзину? Товар исчезнет из магазина.`,
      )
    )
      return;
    const { error } = await supabase
      .from("products")
      .update({ archived: true, active: false })
      .eq("id", product.id);
    if (error) return setNotice(`Ошибка: ${error.message}`);
    setProducts((current) =>
      current.map((item) =>
        item.id === product.id
          ? { ...item, archived: true, active: false }
          : item,
      ),
    );
    setNotice("Товар перемещён в корзину и снят с публикации");
  };

  const restoreProduct = async (product) => {
    const { error } = await supabase
      .from("products")
      .update({ archived: false, active: true })
      .eq("id", product.id);
    if (error) return setNotice(`Ошибка: ${error.message}`);
    setProducts((current) =>
      current.map((item) =>
        item.id === product.id
          ? { ...item, archived: false, active: true }
          : item,
      ),
    );
    setNotice("Товар восстановлен и опубликован");
  };

  const deleteProductForever = async (product) => {
    if (
      !window.confirm(
        `Удалить «${product.name}» навсегда? Это действие нельзя отменить.`,
      )
    )
      return;
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", product.id);
    if (error) return setNotice(`Ошибка: ${error.message}`);
    setProducts((current) => current.filter((item) => item.id !== product.id));
    setNotice("Товар окончательно удалён");
  };

  const deleteReview = async (review) => {
    if (!window.confirm("Удалить этот отзыв?")) return;
    const { error } = await supabase
      .from("product_reviews")
      .delete()
      .eq("id", review.id);
    if (error) return setNotice(`Ошибка: ${error.message}`);
    setReviews((current) => current.filter((item) => item.id !== review.id));
    setNotice("Отзыв удалён");
  };

  const approveReview = async (review) => {
    const { error } = await supabase
      .from("product_reviews")
      .update({ approved: true })
      .eq("id", review.id);
    if (error) return setNotice(`Ошибка: ${error.message}`);
    setReviews((current) =>
      current.map((item) =>
        item.id === review.id ? { ...item, approved: true } : item,
      ),
    );
    setNotice("Отзыв одобрен и опубликован");
  };

  const replyToQuestion = async (item) => {
    const answer = questionReplies[item.id]?.trim();
    if (!answer) return;
    const { error } = await supabase
      .from("product_questions")
      .update({ answer, answered_at: new Date().toISOString() })
      .eq("id", item.id);
    if (error) return setNotice(`Ошибка: ${error.message}`);
    const product = products.find((candidate) => Number(candidate.id) === Number(item.product_id));
    await supabase.from("order_notifications").insert({
      user_id: item.user_id,
      sender: "admin",
      message: `QUESTION_ANSWER:${product?.name || "LUCHIK.CO"}:${answer}`,
      allow_reply: false,
    });
    setQuestions((current) =>
      current.map((question) =>
        question.id === item.id ? { ...question, answer } : question,
      ),
    );
    setQuestionReplies((current) => ({ ...current, [item.id]: "" }));
    setNotice("Ответ опубликован, покупателю отправлено уведомление");
  };

  const deleteQuestion = async (item) => {
    if (!window.confirm("Удалить вопрос и ответ?")) return;
    const { error } = await supabase
      .from("product_questions")
      .delete()
      .eq("id", item.id);
    if (error) return setNotice(`Ошибка: ${error.message}`);
    setQuestions((current) =>
      current.filter((question) => question.id !== item.id),
    );
    setNotice("Вопрос удалён");
  };

  const replyToOrder = async (order) => {
    const message = orderReplies[order.id]?.trim();
    if (!message) return;
    const { error } = await supabase
      .from("order_notifications")
      .insert({
        order_id: order.id,
        user_id: order.user_id,
        message,
        sender: "admin",
        allow_reply: orderAllowReply[order.id] !== false,
      });
    if (error) return setNotice(`Ошибка: ${error.message}`);
    setOrderReplies((current) => ({ ...current, [order.id]: "" }));
    setNotice("Ответ отправлен покупателю в уведомления");
  };

  const setOrderStatus = async (order, status) => {
    const { error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", order.id);
    if (error) return setNotice(`Ошибка: ${error.message}`);
    const statusText =
      {
        processing: "accepted and is being processed",
        completed: "completed",
        cancelled: "cancelled",
      }[status] || status;
    await supabase
      .from("order_notifications")
      .insert({
        order_id: order.id,
        user_id: order.user_id,
        sender: "system",
        message: `Your order #${order.id.slice(0, 8)} is ${statusText}.`,
      });
    setOrders((current) =>
      current.map((item) =>
        item.id === order.id ? { ...item, status } : item,
      ),
    );
    setNotice("Статус заказа обновлён");
  };

  const deleteOrder = async (order) => {
    if (!window.confirm(`Удалить заказ #${order.id.slice(0, 8)} навсегда?`))
      return;
    const { error } = await supabase.from("orders").delete().eq("id", order.id);
    if (error) return setNotice(`Ошибка: ${error.message}`);
    setOrders((current) => current.filter((item) => item.id !== order.id));
    setNotice("Заказ удалён");
  };

  const visibleProducts = products.filter(
    (product) =>
      !product.archived &&
      product.name.toLowerCase().includes(query.toLowerCase()),
  );
  const trashedProducts = products.filter((product) => product.archived);
  const lowStockProducts = products.filter((product) => !product.archived && Number(product.stock || 0) <= 5);
  const inventoryValue = products
    .filter((product) => !product.archived)
    .reduce(
      (sum, item) => sum + Number(item.price) * Number(item.stock || 0),
      0,
    );
  const newOrders = orders.filter(
    (order) => order.status === "new" || order.status === "pending",
  ).length;
  const nonCancelledOrders = orders.filter((order) => order.status !== "cancelled");
  const demoTurnover = nonCancelledOrders.reduce((sum, order) => sum + Number(order.total || 0), 0);
  const completedTurnover = orders.filter((order) => order.status === "completed").reduce((sum, order) => sum + Number(order.total || 0), 0);
  const averageOrder = nonCancelledOrders.length ? demoTurnover / nonCancelledOrders.length : 0;
  const orderStatusSummary = [
    ["Новые", orders.filter((order) => ["new", "pending"].includes(order.status)).length, "bg-[#d7ff5f]"],
    ["В работе", orders.filter((order) => order.status === "processing").length, "bg-blue-100"],
    ["Завершённые", orders.filter((order) => order.status === "completed").length, "bg-green-100"],
    ["Отменённые", orders.filter((order) => order.status === "cancelled").length, "bg-red-100"],
  ];
  const filteredOrders = orders.filter((order) =>
    orderFilter === "new"
      ? ["new", "pending"].includes(order.status)
      : order.status === orderFilter,
  );
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const yesterdayStart = new Date(todayStart);
  yesterdayStart.setDate(yesterdayStart.getDate() - 1);
  const ownerIds = new Set(
    visitors
      .filter((item) => item.visitor_id === ownerVisitorId || (user?.email && item.visitor_email === user.email))
      .map((item) => item.visitor_id),
  );
  const ownerIps = new Set(
    visitors
      .filter((item) => ownerIds.has(item.visitor_id) && item.ip_address)
      .map((item) => item.ip_address),
  );
  const isOwnerVisit = (item) => ownerIds.has(item.visitor_id) || Boolean(item.ip_address && ownerIps.has(item.ip_address));
  const ownerVisitors = visitors.filter(isOwnerVisit);
  const externalVisitors = visitors.filter((item) => !isOwnerVisit(item));
  const todayVisitors = externalVisitors.filter((item) => new Date(item.created_at) >= todayStart);
  const yesterdayVisitors = externalVisitors.filter((item) => {
    const date = new Date(item.created_at);
    return date >= yesterdayStart && date < todayStart;
  });
  const earlierVisitors = externalVisitors.filter((item) => new Date(item.created_at) < yesterdayStart);
  const uniqueTodayVisitors = new Set(todayVisitors.map((item) => item.visitor_id)).size;
  const visitorGroups = { today: todayVisitors, yesterday: yesterdayVisitors, earlier: earlierVisitors, mine: ownerVisitors };
  const periodVisitors = visitorGroups[visitorPeriod] || todayVisitors;
  const displayedVisitors = visitorDevice === "all" || visitorDevice === "mine"
    ? (visitorDevice === "mine" ? ownerVisitors : periodVisitors)
    : periodVisitors.filter((item) => visitorDevice === "phone" ? item.device === "Телефон" : item.device !== "Телефон");
  const visitorNumbers = new Map(
    [...new Set([...visitors].reverse().map((item) => item.visitor_id))]
      .map((id, index) => [id, String(index + 1).padStart(3, "0")]),
  );
  const onlineVisitors = new Set(
    externalVisitors
      .filter((item) => analyticsNow - new Date(item.created_at).getTime() < 5 * 60 * 1000)
      .map((item) => item.visitor_id),
  ).size;

  if (authLoading)
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f5f5f5] text-lg font-semibold">
        Проверка доступа…
      </main>
    );
  if (!user || !isOwnerAdmin)
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f5f5f5] px-5">
        <div className="max-w-lg rounded-[32px] bg-white p-8 text-center shadow-sm">
          <h1 className="font-integral text-3xl font-bold">Доступ закрыт</h1>
          <p className="mt-3 text-black/55">
            Панель доступна только владельцу магазина.
          </p>
          <a
            href={assetPath("/account/")}
            className="mt-6 inline-block rounded-full bg-black px-7 py-3 font-semibold text-white"
          >
            Войти в аккаунт
          </a>
        </div>
      </main>
    );

  return (
    <main className="min-h-screen bg-[#f5f5f5] text-black">
      <header className="sticky top-0 z-50 border-b border-black/10 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-5 py-4 lg:px-10">
          <div>
            <div className="font-integral text-2xl font-bold">LUCHIK.CO</div>
            <div className="text-xs text-black/50">Панель управления</div>
          </div>
          <a
            href={assetPath("/")}
            className="rounded-full border border-black/15 px-5 py-2 text-sm font-semibold hover:bg-black hover:text-white"
          >
            Открыть магазин
          </a>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1440px] gap-6 px-5 py-8 lg:grid-cols-[220px_1fr] lg:px-10">
        <aside className="h-fit rounded-3xl bg-black p-3 text-white lg:sticky lg:top-24">
          {[
            ["overview", "Обзор"],
            ["products", "Товары"],
            ["stock", `Остатки (${lowStockProducts.length})`],
            ["trash", `Корзина (${trashedProducts.length})`],
            ["promos", "Промокоды"],
            ["subscribers", `Подписчики (${subscribers.length})`],
            ["visitors", `Посетители (${uniqueTodayVisitors})`],
            ["reviews", `Отзывы (${reviews.filter((item) => !item.approved).length} на проверке)`],
            ["messages", `Сообщения (${customerMessages.filter((item) => !item.is_read).length})`],
            [
              "questions",
              `Вопросы (${questions.filter((item) => !item.answer).length})`,
            ],
            ["orders", `Заказы${newOrders ? ` (${newOrders})` : ""}`],
          ].map(([id, label]) => (
            <button
              key={id}
              onClick={() => id === "messages" ? openMessages() : setTab(id)}
              className={`w-full rounded-2xl px-4 py-3 text-left font-semibold ${tab === id ? "bg-white text-black" : "text-white/70 hover:bg-white/10"}`}
            >
              {label}
            </button>
          ))}
          <div className="mt-4 border-t border-white/15 px-4 pt-4 text-xs text-white/50">
            {supabase ? "Supabase подключён" : "Локальный режим"}
          </div>
        </aside>

        <section className="min-w-0">
          {notice && (
            <div className={`mb-5 rounded-2xl px-5 py-3 font-medium ${/(ошибка|заполните|не удалось|недоступ|обязательн)/i.test(notice) ? "bg-red-100 text-red-800 ring-1 ring-red-300" : "bg-[#d7ff5f] text-black"}`}>
              {notice}
            </div>
          )}
          {loading ? (
            <div className="rounded-3xl bg-white p-10">Загрузка данных…</div>
          ) : null}

          {!loading && tab === "overview" && (
            <>
              <h1 className="mb-6 font-integral text-3xl font-bold md:text-5xl">
                ОБЗОР МАГАЗИНА
              </h1>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {[
                  ["Товаров", products.length],
                  [
                    "На складе",
                    products.reduce((s, p) => s + Number(p.stock || 0), 0),
                  ],
                  ["Заказов", orders.length],
                  ["Новых заказов", newOrders],
                  ["Демо-оборот", `$${demoTurnover.toLocaleString("en-US")}`],
                  ["Средний чек", `$${Math.round(averageOrder).toLocaleString("en-US")}`],
                  ["Завершённый оборот", `$${completedTurnover.toLocaleString("en-US")}`],
                  ["Подписчиков", subscribers.filter((item) => item.active !== false).length],
                  [
                    "Стоимость запасов",
                    `$${inventoryValue.toLocaleString("en-US")}`,
                  ],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-3xl bg-white p-6 shadow-sm"
                  >
                    <div className="text-sm text-black/50">{label}</div>
                    <div className="mt-3 text-3xl font-bold">{value}</div>
                  </div>
                ))}
              </div>
              <div className="mt-6 rounded-3xl bg-white p-5 shadow-sm sm:p-6"><div className="flex flex-wrap items-end justify-between gap-2"><div><h2 className="text-xl font-bold">Состояние заказов</h2><p className="mt-1 text-sm text-black/45">Актуальная сводка по демонстрационной базе</p></div><button onClick={()=>setTab("orders")} className="rounded-full border border-black/15 px-5 py-2 text-sm font-semibold">Открыть заказы</button></div><div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{orderStatusSummary.map(([label,value,color])=><div key={label} className={`rounded-2xl p-4 ${color}`}><div className="text-sm text-black/55">{label}</div><div className="mt-2 text-3xl font-bold">{value}</div></div>)}</div></div>
              {lowStockProducts.length > 0 && <div className="mt-6 rounded-3xl border border-red-200 bg-red-50 p-6"><div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-xl font-bold text-red-800">Товары заканчиваются</h2><p className="mt-1 text-sm text-red-700">У {lowStockProducts.length} позиций осталось не больше пяти единиц.</p></div><button onClick={()=>setTab("stock")} className="rounded-full bg-red-700 px-5 py-2.5 font-semibold text-white">Проверить остатки</button></div></div>}
              {!supabase && (
                <div className="mt-6 rounded-3xl border border-amber-300 bg-amber-50 p-6">
                  <h2 className="text-xl font-bold">
                    Нужно подключить Supabase
                  </h2>
                  <p className="mt-2 max-w-2xl text-black/65">
                    Интерфейс уже работает в режиме предпросмотра. После
                    добавления URL и публичного ключа товары, пользователи и
                    заказы будут храниться в общей защищённой базе.
                  </p>
                </div>
              )}
            </>
          )}

          {!loading && tab === "stock" && <><h1 className="mb-2 font-integral text-3xl font-bold md:text-5xl">ОСТАТКИ</h1><p className="mb-6 text-black/50">Товары, которые закончились или скоро закончатся</p>{lowStockProducts.length?<div className="space-y-3">{lowStockProducts.sort((a,b)=>Number(a.stock)-Number(b.stock)).map((product)=><div key={product.id} className="flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-white p-5 shadow-sm"><div><div className="font-bold">{product.name}</div><div className="text-sm text-black/45">{product.category}</div></div><div className={`rounded-full px-4 py-2 font-bold ${Number(product.stock)===0?"bg-red-100 text-red-800":"bg-amber-100 text-amber-800"}`}>{Number(product.stock)===0?"Нет в наличии":`Осталось: ${product.stock}`}</div><button onClick={()=>{setQuery(product.name);setTab("products")}} className="rounded-full border border-black/15 px-5 py-2.5 font-semibold">Редактировать</button></div>)}</div>:<div className="rounded-3xl bg-white p-10 text-center text-black/50">Все товары есть в достаточном количестве</div>}</>}

          {!loading && tab === "products" && (
            <>
              <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                  <h1 className="font-integral text-3xl font-bold md:text-5xl">
                    ТОВАРЫ
                  </h1>
                  <p className="mt-2 text-black/50">
                    Цена, остаток и публикация
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => setShowCreate((value) => !value)}
                    className="rounded-full border border-black px-7 py-3 font-semibold"
                  >
                    {showCreate ? "Закрыть" : "+ Создать товар"}
                  </button>
                  <button
                    onClick={saveProducts}
                    className="rounded-full bg-black px-7 py-3 font-semibold text-white"
                  >
                    Сохранить изменения
                  </button>
                </div>
              </div>
              {showCreate && (
                <form
                  onSubmit={createProduct}
                  className="mb-6 grid gap-4 rounded-3xl bg-white p-5 shadow-sm md:grid-cols-2"
                >
                  <div className="space-y-4">
                    <input
                      required
                      value={newProduct.name}
                      onChange={(event) =>
                        setNewProduct((value) => ({
                          ...value,
                          name: event.target.value,
                        }))
                      }
                      placeholder="Название товара"
                      className="w-full rounded-2xl bg-[#f2f2f2] px-4 py-3"
                    />
                    <textarea
                      required
                      value={newProduct.description}
                      onChange={(event) =>
                        setNewProduct((value) => ({
                          ...value,
                          description: event.target.value,
                        }))
                      }
                      placeholder="Небольшое описание"
                      rows="4"
                      className="w-full resize-none rounded-2xl bg-[#f2f2f2] px-4 py-3 outline-none"
                    />
                    <select
                      value={newProduct.category}
                      onChange={(event) =>
                        setNewProduct((value) => ({
                          ...value,
                          category: event.target.value,
                        }))
                      }
                      className="w-full rounded-2xl bg-[#f2f2f2] px-4 py-3"
                    >
                      <option value="t-shirts">Футболки</option>
                      <option value="shirts">Рубашки</option>
                      <option value="jeans">Джинсы</option>
                      <option value="shorts">Шорты</option>
                      <option value="hoodie">Худи</option>
                    </select>
                  </div>
                  <div className="space-y-4">
                    <label
                      onDragOver={(event) => event.preventDefault()}
                      onDrop={(event) => {
                        event.preventDefault();
                        const file = event.dataTransfer.files?.[0];
                        if (file?.type.startsWith("image/"))
                          setNewProduct((value) => ({ ...value, image: file }));
                      }}
                      className="flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-black/20 bg-[#fafafa] p-5 text-center hover:border-black"
                    >
                      <span className="font-bold">
                        {newProduct.image
                          ? newProduct.image.name
                          : "Перетащите фотографию сюда"}
                      </span>
                      <span className="mt-1 text-sm text-black/45">
                        или нажмите, чтобы выбрать файл
                      </span>
                      <input
                        required
                        type="file"
                        accept="image/*"
                        onChange={(event) =>
                          setNewProduct((value) => ({
                            ...value,
                            image: event.target.files?.[0] || null,
                          }))
                        }
                        className="sr-only"
                      />
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        required
                        min="0"
                        type="number"
                        value={newProduct.price}
                        onChange={(event) =>
                          setNewProduct((value) => ({
                            ...value,
                            price: event.target.value,
                          }))
                        }
                        placeholder="Цена"
                        className="rounded-2xl bg-[#f2f2f2] px-4 py-3"
                      />
                      <input
                        required
                        min="0"
                        type="number"
                        value={newProduct.stock}
                        onChange={(event) =>
                          setNewProduct((value) => ({
                            ...value,
                            stock: event.target.value,
                          }))
                        }
                        placeholder="Остаток"
                        className="rounded-2xl bg-[#f2f2f2] px-4 py-3"
                      />
                    </div>
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={newProduct.active}
                        onChange={(event) =>
                          setNewProduct((value) => ({
                            ...value,
                            active: event.target.checked,
                          }))
                        }
                        className="h-5 w-5"
                      />
                      <span>Сразу опубликовать</span>
                    </label>
                    <button
                      disabled={creating}
                      className="w-full rounded-full bg-black px-7 py-3 font-semibold text-white disabled:opacity-50"
                    >
                      {creating ? "Загрузка…" : "Создать товар"}
                    </button>
                  </div>
                </form>
              )}
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Найти товар…"
                className="mb-5 w-full rounded-full border border-black/10 bg-white px-5 py-3"
              />
              <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[760px] text-left">
                    <thead className="bg-black text-white">
                      <tr>
                        <th className="p-4">Товар и действие</th>
                        <th className="p-4">Цена</th>
                        <th className="p-4">Остаток</th>
                        <th className="p-4">Цветов</th>
                        <th className="p-4">Опубликован</th>
                      </tr>
                    </thead>
                    <tbody>
                      {visibleProducts.map((product) => (
                        <tr
                          key={product.id}
                          className="border-b border-black/5"
                        >
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              {product.image && (
                                <img
                                  src={assetPath(product.image)}
                                  alt=""
                                  className="h-14 w-14 rounded-xl bg-[#eee] object-cover"
                                />
                              )}
                              <div className="min-w-0">
                                <div className="font-bold">{product.name}</div>
                                <div className="text-xs text-black/45">
                                  {product.category}
                                </div>
                                <button
                                  onClick={() => moveToTrash(product)}
                                  className="mt-2 rounded-full border border-red-500 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-500 hover:text-white"
                                >
                                  🗑 В корзину
                                </button>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <input
                              type="number"
                              value={product.price}
                              onChange={(e) =>
                                updateProduct(
                                  product.id,
                                  "price",
                                  Number(e.target.value),
                                )
                              }
                              className="w-24 rounded-xl bg-[#f2f2f2] px-3 py-2"
                            />
                          </td>
                          <td className="p-4">
                            <input
                              type="number"
                              value={product.stock}
                              onChange={(e) =>
                                updateProduct(
                                  product.id,
                                  "stock",
                                  Number(e.target.value),
                                )
                              }
                              className="w-24 rounded-xl bg-[#f2f2f2] px-3 py-2"
                            />
                          </td>
                          <td className="p-4">{product.variants || "—"}</td>
                          <td className="p-4">
                            <button
                              onClick={() =>
                                updateProduct(
                                  product.id,
                                  "active",
                                  !product.active,
                                )
                              }
                              className={`rounded-full px-4 py-2 text-sm font-semibold ${product.active ? "bg-[#d7ff5f]" : "bg-black/10"}`}
                            >
                              {product.active ? "Да" : "Нет"}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {!loading && tab === "trash" && (
            <>
              <h1 className="mb-2 font-integral text-3xl font-bold md:text-5xl">
                КОРЗИНА ТОВАРОВ
              </h1>
              <p className="mb-6 text-black/50">
                Эти товары скрыты из магазина. Их можно восстановить или удалить
                навсегда.
              </p>
              {trashedProducts.length ? (
                <div className="space-y-3">
                  {trashedProducts.map((product) => (
                    <div
                      key={product.id}
                      className="flex flex-col gap-4 rounded-3xl bg-white p-5 shadow-sm sm:flex-row sm:items-center"
                    >
                      <div className="flex flex-1 items-center gap-4">
                        {product.image && (
                          <img
                            src={assetPath(product.image)}
                            alt=""
                            className="h-16 w-16 rounded-xl bg-[#eee] object-cover"
                          />
                        )}
                        <div>
                          <div className="font-bold">{product.name}</div>
                          <div className="text-sm text-black/45">
                            ${product.price} · {product.stock} шт.
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => restoreProduct(product)}
                          className="rounded-full bg-[#d7ff5f] px-5 py-2 font-semibold"
                        >
                          Восстановить
                        </button>
                        <button
                          onClick={() => deleteProductForever(product)}
                          className="rounded-full bg-red-600 px-5 py-2 font-semibold text-white"
                        >
                          Удалить навсегда
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-3xl bg-white p-10 text-center text-black/50">
                  Корзина пуста
                </div>
              )}
            </>
          )}

          {!loading && tab === "subscribers" && (
            <>
              <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
                <div><h1 className="font-integral text-3xl font-bold md:text-5xl">ПОДПИСЧИКИ</h1><p className="mt-2 text-black/50">Пользователи, которые подписались на новости и специальные предложения.</p></div>
                <button onClick={exportSubscribers} disabled={!subscribers.length} className="rounded-full bg-black px-6 py-3 font-semibold text-white disabled:opacity-40">Скачать CSV</button>
              </div>
              <input value={subscriberQuery} onChange={(event)=>setSubscriberQuery(event.target.value)} placeholder="Найти email…" className="mb-4 w-full rounded-full bg-white px-5 py-3 outline-none ring-1 ring-black/5 focus:ring-2 focus:ring-black" />
              {subscribers.length ? (
                <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
                  <div className="hidden grid-cols-[1fr_90px_160px_140px] gap-4 border-b border-black/10 bg-black px-6 py-4 text-sm font-bold text-white sm:grid">
                    <span>Email</span><span>Язык</span><span>Дата</span><span>Статус</span>
                  </div>
                  {subscribers.filter((item)=>item.email.toLowerCase().includes(subscriberQuery.trim().toLowerCase())).map((subscriber) => (
                    <div key={subscriber.id} className={`grid gap-2 border-b border-black/5 px-5 py-4 last:border-0 sm:grid-cols-[1fr_90px_160px_140px] sm:items-center sm:gap-4 sm:px-6 ${subscriber.active === false ? "bg-black/[0.03] opacity-60" : ""}`}>
                      <a href={`mailto:${subscriber.email}`} className="min-w-0 break-all font-semibold hover:underline">{subscriber.email}</a>
                      <span className="w-fit rounded-full bg-[#f2f2f2] px-3 py-1 text-sm font-bold uppercase">{subscriber.language || "en"}</span>
                      <span className="text-sm text-black/50">{new Date(subscriber.created_at).toLocaleString("ru-RU")}</span>
                      <button onClick={()=>toggleSubscriber(subscriber)} className={`w-fit rounded-full px-4 py-2 text-xs font-bold ${subscriber.active === false ? "bg-black text-white" : "bg-[#d7ff5f]"}`}>{subscriber.active === false ? "Включить" : "Активна"}</button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-3xl bg-white p-10 text-center text-black/50">
                  Подписчиков пока нет
                </div>
              )}
            </>
          )}

          {!loading && tab === "visitors" && (
            <>
              <div className="mb-6">
                <h1 className="font-integral text-3xl font-bold md:text-5xl">ПОСЕТИТЕЛИ</h1>
                <p className="mt-2 text-black/50">Посещения, рекламные источники, ссылки перехода и UTM-метки.</p>
              </div>
              <div className="mb-6 grid gap-4 sm:grid-cols-3">
                {[["Сейчас на сайте", onlineVisitors], ["Уникальных сегодня", uniqueTodayVisitors], ["Просмотров сегодня", todayVisitors.length]].map(([label, value]) => (
                  <div key={label} className="rounded-3xl bg-white p-6 shadow-sm">
                    <div className="text-sm text-black/50">{label}</div>
                    <div className="mt-3 text-3xl font-bold">{value}</div>
                  </div>
                ))}
              </div>
              <div className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {[
                  ["today", "Сегодня", todayVisitors],
                  ["yesterday", "Вчера", yesterdayVisitors],
                  ["earlier", "Ранее", earlierVisitors],
                  ["mine", "Мои посещения", ownerVisitors],
                ].map(([id, label, items]) => {
                  const unique = new Set(items.map((item) => item.visitor_id)).size;
                  return <button key={id} onClick={() => setVisitorPeriod(id)} className={`rounded-3xl border p-5 text-left transition ${visitorPeriod === id ? "border-black bg-black text-white" : "border-black/10 bg-white hover:border-black/30"}`}>
                    <div className={`text-sm ${visitorPeriod === id ? "text-white/60" : "text-black/50"}`}>{label}</div>
                    <div className="mt-2 text-2xl font-bold">{unique} посетителей</div>
                    <div className={`mt-1 text-xs ${visitorPeriod === id ? "text-white/50" : "text-black/40"}`}>{items.length} просмотров</div>
                  </button>;
                })}
              </div>
              <div className="mb-6 flex flex-col gap-3 rounded-3xl bg-white p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <div className="text-sm font-bold">Показать устройство</div>
                  <div className="text-xs text-black/45">Ваши визиты не входят в общую статистику.</div>
                </div>
                <select value={visitorDevice} onChange={(event) => setVisitorDevice(event.target.value)} className="rounded-full border border-black/15 bg-white px-5 py-3 font-semibold outline-none focus:border-black">
                  <option value="all">Все посетители</option>
                  <option value="mine">Моё устройство</option>
                  <option value="desktop">Компьютер</option>
                  <option value="phone">Телефон</option>
                </select>
              </div>
              <div className="mb-6 rounded-3xl bg-white p-5 shadow-sm">
                <div className="font-bold">Ссылки для рекламы</div>
                <p className="mt-1 text-sm text-black/50">Используйте соответствующую ссылку в каждой соцсети — тогда источник определится точно, даже если приложение скрывает переход.</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {[["Telegram", "telegram"], ["Instagram", "instagram"], ["VK", "vk"]].map(([label, source]) => {
                    const campaignPath = assetPath(`/?utm_source=${source}&utm_medium=social`);
                    return <button key={source} onClick={() => { navigator.clipboard.writeText(`${window.location.origin}${campaignPath}`); setNotice(`Ссылка для ${label} скопирована`); }} className="rounded-full bg-black px-5 py-2.5 text-sm font-semibold text-white hover:bg-black/75">Скопировать для {label}</button>;
                  })}
                </div>
              </div>
              {displayedVisitors.length ? (
                <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
                  <div className="hidden grid-cols-[1.05fr_1fr_100px_1.15fr_130px_160px] gap-4 bg-black px-6 py-4 text-sm font-bold text-white xl:grid">
                    <span>Посетитель</span><span>Страница</span><span>Устройство</span><span>Источник</span><span>IP</span><span>Время</span>
                  </div>
                  {displayedVisitors.map((visit) => (
                    <div key={visit.id} className="grid gap-2 border-b border-black/5 px-5 py-4 last:border-0 xl:grid-cols-[1.05fr_1fr_100px_1.15fr_130px_160px] xl:items-center xl:gap-4 xl:px-6">
                      <div className="min-w-0"><div className="truncate font-semibold">{isOwnerVisit(visit) ? "Моё устройство" : (visit.visitor_email || `Посетитель №${visitorNumbers.get(visit.visitor_id)}`)}</div><div className="truncate text-xs text-black/40">{isOwnerVisit(visit) ? (visit.ip_address || "Этот браузер") : (visit.user_id ? "Авторизован" : `ID ${visit.visitor_id.slice(0, 8)}`)}</div></div>
                      <div className="truncate text-sm font-medium">{visit.path}</div>
                      <div className="text-sm">{visit.device}</div>
                      <div className="min-w-0 text-sm"><div className="font-semibold">{visit.source || (visit.referrer ? (() => { try { return new URL(visit.referrer).hostname; } catch { return "Другая ссылка"; } })() : "Прямой вход")}</div>{visit.referrer && <a href={visit.referrer} target="_blank" rel="noreferrer" className="block truncate text-xs text-blue-600 hover:underline" title={visit.referrer}>{visit.referrer}</a>}{visit.utm_campaign && <div className="truncate text-xs text-black/45">Кампания: {visit.utm_campaign}{visit.utm_medium ? ` · ${visit.utm_medium}` : ""}</div>}</div>
                      <div className="text-sm text-black/50">{visit.ip_address || "Не определён"}</div>
                      <div className="text-sm text-black/50">{new Date(visit.created_at).toLocaleString("ru-RU")}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-3xl bg-white p-10 text-center text-black/50">В этом периоде посещений пока нет.</div>
              )}
            </>
          )}

          {!loading && tab === "promos" && (
            <>
              <div className="mb-6 flex items-end justify-between">
                <div>
                  <h1 className="font-integral text-3xl font-bold md:text-5xl">
                    ПРОМОКОДЫ
                  </h1>
                  <p className="mt-2 text-black/50">Управление скидками</p>
                </div>
                <button
                  onClick={savePromos}
                  className="rounded-full bg-black px-7 py-3 font-semibold text-white"
                >
                  Сохранить
                </button>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                {promos.map((promo, index) => (
                  <div
                    key={promo.code}
                    className="rounded-3xl bg-white p-6 shadow-sm"
                  >
                    <input
                      value={promo.code}
                      onChange={(e) =>
                        setPromos((p) =>
                          p.map((x, i) =>
                            i === index
                              ? { ...x, code: e.target.value.toUpperCase() }
                              : x,
                          ),
                        )
                      }
                      className="w-full border-b border-black/10 pb-2 text-2xl font-bold"
                    />
                    <label className="mt-5 block text-sm text-black/50">
                      Размер скидки
                    </label>
                    <div className="mt-2 flex items-center gap-2">
                      <input
                        type="number"
                        min="1"
                        max="100"
                        value={promo.discount_percent}
                        onChange={(e) =>
                          setPromos((p) =>
                            p.map((x, i) =>
                              i === index
                                ? {
                                    ...x,
                                    discount_percent: Number(e.target.value),
                                  }
                                : x,
                            ),
                          )
                        }
                        className="w-24 rounded-xl bg-[#f2f2f2] px-3 py-2"
                      />
                      <span>%</span>
                    </div>
                    <button
                      onClick={() =>
                        setPromos((p) =>
                          p.map((x, i) =>
                            i === index ? { ...x, active: !x.active } : x,
                          ),
                        )
                      }
                      className={`mt-5 rounded-full px-4 py-2 text-sm font-semibold ${promo.active ? "bg-[#d7ff5f]" : "bg-black/10"}`}
                    >
                      {promo.active ? "Активен" : "Выключен"}
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}

          {!loading && tab === "reviews" && (
            <>
              <h1 className="mb-6 font-integral text-3xl font-bold md:text-5xl">
                ОТЗЫВЫ
              </h1>
              {reviews.length ? (
                <div className="space-y-3">
                  {reviews.map((review) => (
                    <div
                      key={review.id}
                      className="rounded-3xl bg-white p-5 shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="font-bold">
                            {review.author_name} · {review.rating}/5
                          </div>
                          <span className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-bold ${review.approved ? "bg-[#d7ff5f]" : "bg-amber-100 text-amber-800"}`}>
                            {review.approved ? "Опубликован" : "На проверке"}
                          </span>
                          <p className="mt-2 text-black/65">{review.comment}</p>
                        </div>
                        <div className="flex shrink-0 flex-wrap gap-2">
                          {!review.approved && <button onClick={() => approveReview(review)} className="rounded-full bg-[#d7ff5f] px-4 py-2 text-sm font-semibold">Одобрить</button>}
                          <button onClick={() => deleteReview(review)} className="rounded-full border border-red-500 px-4 py-2 text-sm font-semibold text-red-600">Удалить</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-3xl bg-white p-10 text-center text-black/50">
                  Отзывов пока нет
                </div>
              )}
            </>
          )}

          {!loading && tab === "questions" && (
            <>
              <h1 className="mb-2 font-integral text-3xl font-bold md:text-5xl">
                ВОПРОСЫ
              </h1>
              <p className="mb-6 text-black/50">
                Ответ сразу появится на странице соответствующего товара.
              </p>
              {questions.length ? (
                <div className="space-y-4">
                  {questions.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-3xl bg-white p-5 shadow-sm"
                    >
                      <div className="flex justify-between gap-4">
                        <div>
                          <div className="text-sm text-black/45">
                            {item.products?.name || `Товар #${item.product_id}`}{" "}
                            · {item.author_name}
                          </div>
                          <div className="mt-2 text-lg font-bold">
                            {item.question}
                          </div>
                          {item.answer && (
                            <div className="mt-3 rounded-2xl bg-[#f2f2f2] p-4">
                              <b>Ваш ответ:</b> {item.answer}
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => deleteQuestion(item)}
                          className="h-fit shrink-0 rounded-full border border-red-500 px-4 py-2 text-sm font-semibold text-red-600"
                        >
                          Удалить
                        </button>
                      </div>
                      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                        <input
                          value={questionReplies[item.id] || ""}
                          onChange={(event) =>
                            setQuestionReplies((current) => ({
                              ...current,
                              [item.id]: event.target.value,
                            }))
                          }
                          placeholder={
                            item.answer
                              ? "Изменить ответ…"
                              : "Напишите ответ покупателю…"
                          }
                          className="min-w-0 flex-1 rounded-full bg-[#f2f2f2] px-5 py-3 outline-none"
                        />
                        <button
                          onClick={() => replyToQuestion(item)}
                          className="rounded-full bg-black px-6 py-3 font-semibold text-white"
                        >
                          {item.answer ? "Обновить" : "Ответить"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-3xl bg-white p-10 text-center text-black/50">
                  Вопросов пока нет
                </div>
              )}
            </>
          )}

          {!loading && tab === "messages" && (
            <>
              <h1 className="mb-2 font-integral text-3xl font-bold md:text-5xl">СООБЩЕНИЯ</h1>
              <p className="mb-6 text-black/50">Ответы покупателей по забронированным заказам.</p>
              {customerMessages.length ? <div className="space-y-4">{customerMessages.map((message) => {
                const order = orders.find((item) => item.id === message.order_id);
                return <div key={message.id} className={`rounded-3xl bg-white p-5 shadow-sm ${!message.is_read ? "ring-2 ring-[#d7ff5f]" : ""}`}>
                  <div className="flex flex-wrap items-center justify-between gap-3"><div><div className="font-bold">Покупатель · заказ #{message.order_id?.slice(0,8) || "—"}</div><div className="mt-1 text-sm text-black/45">{new Date(message.created_at).toLocaleString("ru-RU")}</div></div>{!message.is_read && <span className="rounded-full bg-[#d7ff5f] px-3 py-1 text-xs font-bold">Новое</span>}</div>
                  <p className="mt-4 rounded-2xl bg-[#f2f2f2] p-4">{message.message}</p>
                  {order ? <div className="mt-4 flex flex-col gap-2 sm:flex-row"><input value={orderReplies[order.id] || ""} onChange={(event)=>setOrderReplies((current)=>({...current,[order.id]:event.target.value}))} placeholder="Ответить покупателю…" className="min-w-0 flex-1 rounded-full bg-[#f2f2f2] px-5 py-3 outline-none"/><button onClick={()=>replyToOrder(order)} className="rounded-full bg-black px-6 py-3 font-semibold text-white">Отправить ответ</button><button onClick={()=>{setOrderFilter(["new","pending"].includes(order.status)?"new":order.status);setTab("orders")}} className="rounded-full border border-black/15 px-5 py-3 font-semibold">Открыть заказ</button></div> : <p className="mt-3 text-sm text-black/45">Заказ был удалён.</p>}
                </div>})}</div> : <div className="rounded-3xl bg-white p-10 text-center text-black/50">Сообщений от покупателей пока нет</div>}
            </>
          )}

          {!loading && tab === "orders" && (
            <>
              <h1 className="mb-4 font-integral text-3xl font-bold md:text-5xl">
                ЗАКАЗЫ
              </h1>
              <div className="mb-6 flex flex-wrap gap-2">
                {[["new", "Новые"], ["processing", "В работе"], ["completed", "Завершённые"], ["cancelled", "Отменённые"]].map(([id, label]) => (
                  <button key={id} onClick={() => setOrderFilter(id)} className={`rounded-full px-5 py-2 font-semibold ${orderFilter === id ? "bg-black text-white" : "bg-white"}`}>{label} ({orders.filter((order) => id === "new" ? ["new", "pending"].includes(order.status) : order.status === id).length})</button>
                ))}
              </div>
              {filteredOrders.length ? (
                <div className="space-y-4">
                  {filteredOrders.map((order) => (
                    <div
                      key={order.id}
                      className="rounded-3xl bg-white p-5 shadow-sm"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <div className="font-bold">
                            Заказ #{order.id.slice(0, 8)}
                          </div>
                          <div className="text-sm text-black/50">
                            {order.customer_email || "Без email"} ·{" "}
                            {order.created_at
                              ? new Date(order.created_at).toLocaleString(
                                  "ru-RU",
                                )
                              : ""}
                          </div>
                          {(order.customer_name || order.shipping_address) && <div className="mt-3 rounded-2xl bg-[#f2f2f2] p-3 text-sm"><b>{order.customer_name || "Покупатель"}</b>{order.customer_phone && <> · {order.customer_phone}</>}<br/>{[order.city, order.shipping_address, order.postal_code].filter(Boolean).join(", ")}<br/><span className="text-black/50">{order.delivery_method || "courier"} · {order.payment_method || "reservation"} · {order.payment_status || "not_required"}</span>{order.customer_notes && <><br/>Комментарий: {order.customer_notes}</>}</div>}
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold">
                            ${Number(order.total || 0).toFixed(2)}
                          </div>
                          <span className="rounded-full bg-[#d7ff5f] px-3 py-1 text-sm font-semibold">
                            {order.status || "new"}
                          </span>
                        </div>
                      </div>
                      {order.order_items?.length ? (
                        <div className="mt-4 border-t border-black/10 pt-4">
                          <div className="text-sm font-bold">Состав заказа</div>
                          {order.order_items.map((item) => (
                            <div
                              key={item.id}
                              className="mt-2 flex justify-between gap-4 text-sm text-black/65"
                            >
                              <span>
                                {item.product_name} · {item.color || "—"} ·{" "}
                                {item.size || "—"}
                              </span>
                              <span>
                                {item.quantity} × ${item.unit_price}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : null}
                      <div className="mt-5 flex flex-wrap gap-2">
                        <button
                          onClick={() => setOrderStatus(order, "processing")}
                          className="rounded-full bg-black px-4 py-2 text-sm font-semibold text-white"
                        >
                          Принять
                        </button>
                        <button
                          onClick={() => setOrderStatus(order, "completed")}
                          className="rounded-full bg-[#d7ff5f] px-4 py-2 text-sm font-semibold"
                        >
                          Завершить
                        </button>
                        <button
                          onClick={() => setOrderStatus(order, "cancelled")}
                          className="rounded-full border border-black/20 px-4 py-2 text-sm font-semibold"
                        >
                          Отменить
                        </button>
                        <button
                          onClick={() => deleteOrder(order)}
                          className="rounded-full border border-red-500 px-4 py-2 text-sm font-semibold text-red-600"
                        >
                          Удалить
                        </button>
                      </div>
                      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                        <input
                          value={orderReplies[order.id] || ""}
                          onChange={(event) =>
                            setOrderReplies((current) => ({
                              ...current,
                              [order.id]: event.target.value,
                            }))
                          }
                          placeholder="Напишите сообщение покупателю…"
                          className="min-w-0 flex-1 rounded-full bg-[#f2f2f2] px-5 py-3 outline-none"
                        />
                        <button
                          onClick={() => replyToOrder(order)}
                          className="rounded-full bg-black px-6 py-3 font-semibold text-white"
                        >
                          Ответить
                        </button>
                      </div>
                      <label className="mt-3 flex w-fit cursor-pointer items-center gap-3 text-sm font-medium">
                        <input type="checkbox" checked={orderAllowReply[order.id] !== false} onChange={(event)=>setOrderAllowReply((current)=>({...current,[order.id]:event.target.checked}))} className="h-5 w-5 accent-black" />
                        Покупатель может ответить на это сообщение
                      </label>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-3xl bg-white p-10 text-center">
                  <div className="text-2xl font-bold">Заказов пока нет</div>
                  <p className="mt-2 text-black/50">
                    После бронирования новые заказы появятся здесь.
                  </p>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </main>
  );
}
