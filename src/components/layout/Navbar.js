"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useCatalog } from "@/context/CatalogContext";
import {
  IoSearchOutline,
  IoCartOutline,
  IoPersonOutline,
  IoMenuOutline,
  IoClose,
  IoChevronDown,
  IoNotificationsOutline,
  IoHeartOutline,
} from "react-icons/io5";
import { assetPath } from "@/components/common/BaseImage";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { formatNotificationMessage } from "@/lib/notifications";

const SEARCH_ALIASES = {
  джинсы: ["jeans"],
  джинсовые: ["jeans", "denim"],
  джинсовый: ["jeans", "denim"],
  футболка: ["t-shirt"],
  футболки: ["t-shirt"],
  майка: ["t-shirt"],
  майки: ["t-shirt"],
  рубашка: ["shirt"],
  рубашки: ["shirt"],
  поло: ["polo"],
  шорты: ["shorts"],
  бермуды: ["shorts", "bermuda"],
  одежда: ["t-shirt", "shirt", "jeans", "shorts", "polo"],
  клетчатая: ["checkered"],
  клетчатый: ["checkered"],
  клетка: ["checkered"],
  полосатая: ["striped"],
  полосатый: ["striped"],
  полоска: ["striped"],
  графическая: ["graphic"],
  графический: ["graphic"],
  принт: ["graphic"],
  градиент: ["gradient"],
  градиентная: ["gradient"],
  свободные: ["loose"],
  свободный: ["loose"],
  узкие: ["skinny"],
  зауженные: ["skinny"],
  повседневные: ["casual"],
  повседневная: ["casual"],
  классическая: ["formal"],
  классические: ["formal"],
  черный: ["black"],
  черная: ["black"],
  черные: ["black"],
  черного: ["black"],
  белый: ["white"],
  белая: ["white"],
  белые: ["white"],
  белого: ["white"],
  красный: ["red"],
  красная: ["red"],
  красные: ["red"],
  красного: ["red"],
  зеленый: ["green"],
  зеленая: ["green"],
  зеленые: ["green"],
  зеленого: ["green"],
  синий: ["blue", "navy"],
  синяя: ["blue", "navy"],
  синие: ["blue", "navy"],
  синего: ["blue", "navy"],
  желтый: ["yellow"],
  желтая: ["yellow"],
  желтые: ["yellow"],
  желтого: ["yellow"],
  оранжевый: ["orange"],
  оранжевая: ["orange"],
  оранжевые: ["orange"],
  розовый: ["pink"],
  розовая: ["pink"],
  розовые: ["pink"],
  фиолетовый: ["purple"],
  фиолетовая: ["purple"],
  фиолетовые: ["purple"],
  голубой: ["cyan", "light blue"],
  голубая: ["cyan", "light blue"],
  голубые: ["cyan", "light blue"],
};

const normalizeSearch = (value) =>
  value.toLowerCase().replace(/ё/g, "е").trim();

const matchesSearch = (product, query) => {
  const haystack = normalizeSearch(
    [
      product.name,
      product.category,
      product.description,
      product.dressStyle,
      ...(product.availableColors || []).map((color) => color.name),
    ].join(" "),
  );
  const tokens = normalizeSearch(query).split(/\s+/).filter(Boolean);
  return tokens.every((token) =>
    (SEARCH_ALIASES[token] || [token]).some((term) => haystack.includes(term)),
  );
};

export default function Navbar() {
  const { products } = useCatalog();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isShopDropdownOpen, setIsShopDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchResultsOpen, setIsSearchResultsOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const router = useRouter();
  const { language, changeLanguage } = useLanguage();
  const { user } = useAuth();
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const [notifications, setNotifications] = useState([]);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const { items } = useCart();
  const cartCount =
    items?.reduce((total, item) => total + (item.quantity || 1), 0) || 0;
  const searchResults =
    searchQuery.trim().length < 2
      ? []
      : products
          .filter((product) => matchesSearch(product, searchQuery))
          .slice(0, 6);

  const submitSearch = (event) => {
    event.preventDefault();
    if (searchResults[0]) {
      router.push(`/item/?id=${searchResults[0].id}`);
      setSearchQuery("");
      setIsSearchResultsOpen(false);
      setIsMobileSearchOpen(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setIsSearchResultsOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!user || !supabase) {
      setNotifications([]);
      return;
    }
    const loadNotifications = async () => {
      const { data } = await supabase
        .from("order_notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(20);
      if (data) setNotifications(data);
    };
    loadNotifications();
    const timer = setInterval(loadNotifications, 15000);
    return () => clearInterval(timer);
  }, [user, supabase]);

  const openNotifications = async () => {
    const nextOpen = !notificationsOpen;
    setNotificationsOpen(nextOpen);
    if (
      !nextOpen &&
      user &&
      supabase &&
      notifications.some((item) => !item.is_read)
    ) {
      await supabase
        .from("order_notifications")
        .update({ is_read: true })
        .eq("user_id", user.id)
        .eq("is_read", false);
      setNotifications((current) =>
        current.map((item) => ({ ...item, is_read: true })),
      );
    }
  };

  const unreadCount = notifications.filter((item) => item.sender !== "customer" && !item.is_read).length;

  return (
    <nav
      className={`sticky top-0 z-40 bg-white transition-all ${isScrolled ? "border-b border-[rgba(0,0,0,0.1)] shadow-sm" : ""}`}
    >
      <div className="max-w-[1240px] w-full mx-auto px-4 md:px-6 lg:px-4 xl:px-6 h-16 md:h-24 flex items-center justify-between">
        {/* Mobile Left: Hamburger */}
        <button
          className="lg:hidden text-black hover:text-gray-600 transition-colors"
          onClick={() => setIsMenuOpen(true)}
          aria-label="Open Menu"
        >
          <IoMenuOutline size={28} />
        </button>

        {/* Logo */}
        <Link
          href="/"
          className="font-integral text-[24px] md:text-[32px] font-bold text-black tracking-tight ml-3 lg:ml-0 lg:mr-2 xl:mr-6 flex-shrink-0 flex items-center justify-center"
        >
          SHOP.CO
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden lg:flex items-center lg:space-x-2 xl:space-x-5 font-satoshi lg:text-sm xl:text-base flex-shrink-0">
          <div
            className="relative group"
            onMouseEnter={() => setIsShopDropdownOpen(true)}
            onMouseLeave={() => setIsShopDropdownOpen(false)}
          >
            <button className="flex items-center space-x-1 hover:text-gray-600 transition-colors py-2">
              <span>Shop</span>
              <IoChevronDown size={16} />
            </button>
            {isShopDropdownOpen && (
              <div className="absolute top-full left-0 bg-white shadow-md border border-[rgba(0,0,0,0.1)] rounded-lg py-2 min-w-[160px] z-50">
                <Link
                  href="/category/t-shirts"
                  className="block px-4 py-2 hover:bg-[#F0F0F0] transition-colors"
                >
                  T-shirts
                </Link>
                <Link
                  href="/category/jeans"
                  className="block px-4 py-2 hover:bg-[#F0F0F0] transition-colors"
                >
                  Jeans
                </Link>
                <Link
                  href="/category/shirts"
                  className="block px-4 py-2 hover:bg-[#F0F0F0] transition-colors"
                >
                  Shirts
                </Link>
                <Link
                  href="/category/shorts"
                  className="block px-4 py-2 hover:bg-[#F0F0F0] transition-colors"
                >
                  Shorts
                </Link>
              </div>
            )}
          </div>
          <Link
            href="/category/casual"
            className="hover:text-gray-600 transition-colors"
          >
            On Sale
          </Link>
          <Link
            href="/category/casual"
            className="hover:text-gray-600 transition-colors"
          >
            New Arrivals
          </Link>
          <Link
            href="/category/casual"
            className="hover:text-gray-600 transition-colors"
          >
            Brands
          </Link>
        </div>

        {/* Search Bar (Desktop) */}
        <form
          onSubmit={submitSearch}
          className="hidden lg:flex flex-1 max-w-[480px] lg:max-w-[260px] xl:max-w-[480px] lg:mx-2 xl:mx-5 relative min-w-[100px]"
        >
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
            <IoSearchOutline size={22} />
          </div>
          <input
            type="text"
            placeholder="Search for products..."
            value={searchQuery}
            onChange={(event) => {
              setSearchQuery(event.target.value);
              setIsSearchResultsOpen(true);
            }}
            onFocus={() =>
              searchQuery.trim().length >= 2 && setIsSearchResultsOpen(true)
            }
            className="w-full bg-[#F0F0F0] rounded-full py-3 pl-12 pr-11 text-sm font-satoshi focus:outline-none focus:ring-1 focus:ring-gray-300"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-black text-white flex items-center justify-center hover:bg-gray-700 transition-colors"
              aria-label="Clear search"
            >
              <IoClose size={17} />
            </button>
          )}
          {searchQuery.trim().length >= 2 && isSearchResultsOpen && (
            <div className="absolute left-0 right-0 top-[54px] rounded-2xl bg-white border border-black/10 shadow-xl overflow-hidden z-[70]">
              <div className="flex items-center justify-between px-4 py-2 border-b border-black/10 bg-white">
                <span className="text-xs font-medium text-gray-500">
                  Search results
                </span>
                <button
                  type="button"
                  onClick={() => setIsSearchResultsOpen(false)}
                  className="w-7 h-7 shrink-0 rounded-full bg-black text-white flex items-center justify-center hover:bg-gray-700 transition-colors"
                  aria-label="Close search results"
                >
                  <IoClose size={18} />
                </button>
              </div>
              {searchResults.length ? (
                searchResults.map((product) => (
                  <Link
                    key={product.id}
                    href={`/item/?id=${product.id}`}
                    onClick={() => {
                      setSearchQuery("");
                      setIsSearchResultsOpen(false);
                    }}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-[#F0F0F0] border-b border-black/5 last:border-0"
                  >
                    <img
                      src={assetPath(product.images[0])}
                      alt=""
                      className="w-11 h-11 object-cover rounded-lg bg-[#F0F0F0]"
                    />
                    <span className="font-satoshi font-medium text-sm">
                      {product.name}
                    </span>
                    <b className="ml-auto text-sm">${product.price}</b>
                  </Link>
                ))
              ) : (
                <p className="px-4 py-4 text-sm text-gray-500">
                  No products found
                </p>
              )}
            </div>
          )}
        </form>

        <div
          className="flex rounded-full border border-black/20 overflow-hidden bg-white shrink-0 mr-2"
          aria-label="Language switcher"
        >
          {["en", "ru"].map((code) => (
            <button
              key={code}
              type="button"
              onClick={() => changeLanguage(code)}
              className={`px-2.5 py-1.5 text-[11px] sm:text-xs font-bold uppercase transition-colors ${language === code ? "bg-black text-white" : "text-black hover:bg-black/10"}`}
              aria-pressed={language === code}
            >
              {code}
            </button>
          ))}
        </div>

        {/* Right Icons */}
        <div className="flex h-10 items-center gap-2 md:gap-4 flex-shrink-0 ml-auto lg:ml-0">
          <button
            onClick={() => setIsMobileSearchOpen((value) => !value)}
            className="inline-flex h-10 w-10 items-center justify-center text-black hover:text-gray-600 transition-colors lg:hidden"
            aria-label="Search"
          >
            <IoSearchOutline size={24} className="md:w-7 md:h-7" />
          </button>

          <Link
            href="/wishlist"
            className="relative inline-flex h-10 w-10 items-center justify-center text-black hover:text-gray-600 transition-colors"
            aria-label={language === "ru" ? "Избранное" : "Wishlist"}
          >
            <IoHeartOutline size={24} className="md:h-7 md:w-7" />
          </Link>

          <Link
            href="/cart"
            className="relative inline-flex h-10 w-10 items-center justify-center text-black hover:text-gray-600 transition-colors"
            aria-label="Cart"
          >
            <IoCartOutline size={24} className="md:w-7 md:h-7" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#FF3333] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </Link>

          {user && (
            <div className="relative hidden h-10 w-10 items-center justify-center lg:flex">
              <button
                onClick={openNotifications}
                className="relative inline-flex h-10 w-10 items-center justify-center text-black hover:text-gray-600"
                aria-label={language === "ru" ? "Уведомления" : "Notifications"}
              >
                <IoNotificationsOutline size={24} className="md:h-7 md:w-7" />
                {unreadCount > 0 && (
                  <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#FF3333] px-1 text-[10px] font-bold text-white">
                    {unreadCount}
                  </span>
                )}
              </button>
              {notificationsOpen && (
                <div className="absolute right-0 top-10 z-[80] w-[min(340px,calc(100vw-32px))] overflow-hidden rounded-2xl border border-black/10 bg-white shadow-2xl">
                  <div className="border-b border-black/10 px-4 py-3 font-bold">
                    {language === "ru" ? "Уведомления" : "Notifications"}
                  </div>
                  {notifications.length ? (
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.map((item) => (
                        <Link
                          key={item.id}
                          href="/account"
                          onClick={() => setNotificationsOpen(false)}
                          className="block border-b border-black/5 px-4 py-3 last:border-0 hover:bg-[#f2f2f2]"
                        >
                          <p className="text-sm">
                            {formatNotificationMessage(item.message, language)}
                          </p>
                          <span className="mt-1 block text-xs text-black/40">
                            {new Date(item.created_at).toLocaleString(
                              language === "ru" ? "ru-RU" : "en-US",
                            )}
                          </span>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="px-4 py-5 text-sm text-black/50">
                      {language === "ru"
                        ? "Уведомлений пока нет."
                        : "No notifications yet."}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
          <Link
            href="/account"
            className="inline-flex h-10 w-10 items-center justify-center text-black hover:text-gray-600 transition-colors"
            aria-label="Account"
          >
            <IoPersonOutline size={24} className="md:w-7 md:h-7" />
          </Link>
        </div>
      </div>

      {isMobileSearchOpen && (
        <form
          onSubmit={submitSearch}
          className="lg:hidden px-4 pb-4 relative bg-white"
        >
          <div className="relative">
            <IoSearchOutline
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
              size={21}
            />
            <input
              autoFocus
              value={searchQuery}
              onChange={(event) => {
                setSearchQuery(event.target.value);
                setIsSearchResultsOpen(true);
              }}
              onFocus={() =>
                searchQuery.trim().length >= 2 && setIsSearchResultsOpen(true)
              }
              placeholder="Search for products..."
              className="w-full bg-[#F0F0F0] rounded-full py-3 pl-12 pr-12 outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-black text-white flex items-center justify-center hover:bg-gray-700 transition-colors"
                aria-label="Clear search"
              >
                <IoClose size={17} />
              </button>
            )}
          </div>
          {searchQuery.trim().length >= 2 && isSearchResultsOpen && (
            <div className="absolute left-4 right-4 top-[56px] rounded-2xl bg-white border border-black/10 shadow-xl overflow-hidden z-[70]">
              <div className="flex items-center justify-between px-4 py-2 border-b border-black/10">
                <span className="text-xs font-medium text-gray-500">
                  Search results
                </span>
                <button
                  type="button"
                  onClick={() => setIsSearchResultsOpen(false)}
                  className="w-7 h-7 shrink-0 rounded-full bg-black text-white flex items-center justify-center hover:bg-gray-700 transition-colors"
                  aria-label="Close search results"
                >
                  <IoClose size={18} />
                </button>
              </div>
              {searchResults.length ? (
                searchResults.map((product) => (
                  <Link
                    key={product.id}
                    href={`/item/?id=${product.id}`}
                    onClick={() => {
                      setSearchQuery("");
                      setIsSearchResultsOpen(false);
                      setIsMobileSearchOpen(false);
                    }}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-[#F0F0F0] border-b border-black/5"
                  >
                    <img
                      src={assetPath(product.images[0])}
                      alt=""
                      className="w-11 h-11 object-cover rounded-lg"
                    />
                    <span className="text-sm font-medium">{product.name}</span>
                    <b className="ml-auto text-sm">${product.price}</b>
                  </Link>
                ))
              ) : (
                <p className="px-4 py-4 text-sm text-gray-500">
                  No products found
                </p>
              )}
            </div>
          )}
        </form>
      )}

      {/* Mobile Menu Backdrop */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 lg:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Mobile Menu Slide-in */}
      <div
        className={`fixed top-0 left-0 h-full w-[280px] bg-white z-50 transform transition-transform duration-300 ease-in-out lg:hidden shadow-xl flex flex-col ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="p-4 flex items-center justify-between border-b border-[rgba(0,0,0,0.1)]">
          <span className="font-integral text-[24px] font-bold text-black tracking-tight">
            SHOP.CO
          </span>
          <button
            onClick={() => setIsMenuOpen(false)}
            aria-label="Close Menu"
            className="text-black hover:text-gray-600 transition-colors"
          >
            <IoClose size={28} />
          </button>
        </div>
        <div className="p-4 flex flex-col space-y-6 font-satoshi text-lg mt-4">
          <Link
            href="/"
            className="font-medium hover:text-gray-600 transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            {language === "ru" ? "Главная" : "Home"}
          </Link>
          {user && (
            <Link
              href="/account"
              className="flex items-center justify-between font-medium hover:text-gray-600 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <span>{language === "ru" ? "Уведомления" : "Notifications"}</span>
              {unreadCount > 0 && <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-[#FF3333] px-1.5 text-xs font-bold text-white">{unreadCount}</span>}
            </Link>
          )}
          <Link href="/compare" className="font-medium hover:text-gray-600 transition-colors" onClick={() => setIsMenuOpen(false)}>{language === "ru" ? "Сравнение товаров" : "Compare products"}</Link>
          <Link
            href="/category/casual"
            className="font-medium hover:text-gray-600 transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            Shop
          </Link>
          <Link
            href="/category/casual"
            className="font-medium hover:text-gray-600 transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            On Sale
          </Link>
          <Link
            href="/category/casual"
            className="font-medium hover:text-gray-600 transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            New Arrivals
          </Link>
          <Link
            href="/category/casual"
            className="font-medium hover:text-gray-600 transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            Brands
          </Link>
        </div>
      </div>
    </nav>
  );
}
