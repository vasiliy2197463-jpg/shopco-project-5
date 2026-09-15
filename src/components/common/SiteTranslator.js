"use client";

import { useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";

const RU = {
  "Shop": "Магазин", "On Sale": "Распродажа", "New Arrivals": "Новинки", "Brands": "Бренды",
  "T-shirts": "Футболки", "Jeans": "Джинсы", "Shirts": "Рубашки", "Shorts": "Шорты",
  "Home": "Главная", "Cart": "Корзина", "Account": "Аккаунт", "Product": "Товар",
  "Filters": "Фильтры", "Price": "Цена", "Colors": "Цвета", "Size": "Размер", "Dress Style": "Стиль одежды",
  "Casual": "Повседневный", "Formal": "Деловой", "Party": "Для вечеринки", "Gym": "Спортивный",
  "Apply Filter": "Применить фильтр", "Showing": "Показано", "Products": "товаров", "Sort by:": "Сортировать:",
  "Most Popular": "По популярности", "Newest": "Сначала новые", "Price: Low to High": "Цена: по возрастанию",
  "Price: High to Low": "Цена: по убыванию", "Rating": "По рейтингу", "Popular": "Популярные",
  "Low-High": "Сначала дешевле", "High-Low": "Сначала дороже", "Previous": "Назад", "Next": "Далее",
  "Your Cart": "Ваша корзина", "Order Summary": "Итог заказа", "Subtotal": "Стоимость товаров",
  "Discount": "Скидка", "Delivery Fee": "Доставка", "Total": "Итого", "Apply": "Применить",
  "Go to Checkout": "Перейти к оформлению", "Reserve Order": "Забронировать заказ", "Booking...": "Бронируем...", "Continue Shopping": "Продолжить покупки",
  "Your cart is currently empty.": "Ваша корзина пока пуста.", "Add to Cart": "Добавить в корзину",
  "Added to Cart! ✓": "Добавлено в корзину! ✓", "Select Colors": "Выберите цвет", "Choose Size": "Выберите размер",
  "Product Details": "О товаре", "Rating & Reviews": "Рейтинг и отзывы", "FAQs": "Вопросы и ответы",
  "You Might Also Like": "Вам также может понравиться", "All Reviews": "Все отзывы", "Write a Review": "Оставить отзыв", "Rate this product": "Оцените товар", "Publish review": "Опубликовать отзыв", "Publishing...": "Публикуем...",
  "Small": "Маленький", "Medium": "Средний", "Large": "Большой", "X-Large": "Очень большой",
  "Company": "Компания", "About": "О нас", "Features": "Возможности", "Works": "Как это работает", "Career": "Вакансии",
  "Help": "Помощь", "Customer Support": "Поддержка покупателей", "Delivery Details": "Условия доставки",
  "Terms & Conditions": "Условия использования", "Privacy Policy": "Политика конфиденциальности",
  "Manage Deliveries": "Управление доставками", "Orders": "Заказы", "Payments": "Оплата", "Resources": "Материалы",
  "Free eBooks": "Бесплатные книги", "Development Tutorial": "Руководство пользователя", "How to - Blog": "Полезные статьи",
  "Youtube Playlist": "Видеоинструкции", "Subscribe to Newsletter": "Подписаться на новости", "Admin panel": "Панель администратора",
  "My Account": "Мой аккаунт", "Account functionality is coming soon!": "Функции аккаунта скоро появятся!",
  "Sign Up": "Регистрация", "Signup functionality is coming soon!": "Регистрация скоро станет доступна!", "Back to Home": "Вернуться на главную",
  "No products found": "Товары не найдены", "No products found matching your filters.": "По выбранным фильтрам товары не найдены.",
  "Search results": "Результаты поиска", "STAY UPTO DATE ABOUT OUR LATEST OFFERS": "БУДЬТЕ В КУРСЕ НАШИХ ЛУЧШИХ ПРЕДЛОЖЕНИЙ",
  "FIND CLOTHES THAT MATCHES YOUR STYLE": "НАЙДИТЕ ОДЕЖДУ, КОТОРАЯ ПОДЧЕРКНЁТ ВАШ СТИЛЬ",
  "Browse through our diverse range of meticulously crafted garments, designed to bring out your individuality and cater to your sense of style.": "Откройте разнообразную коллекцию тщательно подобранной одежды, которая подчеркнёт вашу индивидуальность и дополнит личный стиль.",
  "Shop Now": "Перейти к покупкам", "View All": "Смотреть всё", "International Brands": "Международных брендов",
  "High-Quality Products": "Качественных товаров", "Happy Customers": "Довольных покупателей",
  "NEW ARRIVALS": "НОВИНКИ", "TOP SELLING": "ЛИДЕРЫ ПРОДАЖ", "BROWSE BY DRESS STYLE": "ВЫБЕРИТЕ СВОЙ СТИЛЬ",
  "OUR HAPPY CUSTOMERS": "ОТЗЫВЫ НАШИХ ПОКУПАТЕЛЕЙ", "Available colors": "Доступные цвета", "Product quantity": "Количество товара",
  "Posted on": "Опубликовано", "Size:": "Размер:", "Color:": "Цвет:",
  "We have clothes that suits your style and which you're proud to wear. From women to men.": "Мы собрали одежду, которая подходит вашему стилю и которую приятно носить — для женщин и мужчин.",
  "Shop.co © 2000-2023, All Rights Reserved": "Shop.co © 2000–2026. Все права защищены",
  "Gradient Graphic T-shirt": "Футболка с градиентным принтом", "Polo with Tipping Details": "Поло с контрастной отделкой",
  "T-shirt with Tape Details": "Футболка с декоративными лентами", "Skinny Fit Jeans": "Зауженные джинсы",
  "Checkered Shirt": "Рубашка в клетку", "Sleeve Striped T-shirt": "Футболка с полосатыми рукавами",
  "Vertical Striped Shirt": "Рубашка в вертикальную полоску", "Courage Graphic T-shirt": "Футболка с принтом Courage",
  "Loose Fit Bermuda Shorts": "Свободные шорты-бермуды", "One Life Graphic T-shirt": "Футболка с принтом One Life",
  "Polo with Contrast Trims": "Поло с контрастными краями", "Faded Skinny Jeans": "Зауженные джинсы с эффектом выцветания",
  "This gradient graphic t-shirt is perfect for any occasion. Crafted from a soft and breathable fabric, it offers superior comfort and style.": "Футболка с градиентным принтом подходит для любого случая. Мягкая дышащая ткань обеспечивает комфорт и свободу движений.",
  "A classic polo shirt with tipped collar and cuffs. Comfortable and stylish for casual wear.": "Классическое поло с контрастным воротником и манжетами — удобный вариант для повседневного образа.",
  "Stay comfortable with this black striped t-shirt with tape details. A great addition to your everyday wardrobe.": "Удобная футболка с контрастными полосами и декоративными лентами станет выразительной частью повседневного гардероба.",
  "Classic skinny fit jeans perfect for everyday styling. Made with premium stretch denim.": "Классические зауженные джинсы из эластичного денима подходят для комфортных повседневных образов.",
  "A bold checkered shirt that brings a pop of pattern to your outfit. Tailored fit.": "Выразительная приталенная рубашка в клетку добавит образу характер и заметный графичный акцент.",
  "Simple yet stylish sleeve striped t-shirt. Breathable cotton for maximum comfort.": "Лаконичная футболка с полосатыми рукавами выполнена из дышащего хлопка для максимального комфорта.",
  "Elevate your look with this vertical striped shirt. Perfect for formal and casual settings.": "Рубашка в вертикальную полоску дополнит как деловой, так и повседневный образ.",
  "Show your brave side with this courage graphic t-shirt. Soft cotton feel.": "Футболка с выразительным принтом Courage изготовлена из приятного к телу мягкого хлопка.",
  "Relaxed loose fit bermuda shorts for those warm days. Comfortable and airy.": "Свободные и лёгкие шорты-бермуды созданы для комфортных образов в тёплую погоду.",
  "A trendy 'One Life' graphic t-shirt that brings a cool vibe to your everyday wear.": "Футболка с принтом One Life добавит современный акцент вашему повседневному образу.",
  "Upgrade your polo game with contrast trims. Perfect for a smart-casual appearance.": "Поло с контрастными краями подойдёт для аккуратного образа в стиле smart casual.",
  "Rock the worn-in look with these faded skinny jeans. Made for durability and flex.": "Зауженные джинсы с эффектом выцветания сочетают прочность, эластичность и естественный винтажный вид.",
  "White": "Белый", "Black": "Чёрный", "Gray": "Серый", "Purple": "Фиолетовый", "Red": "Красный",
  "Green": "Зелёный", "Blue": "Синий", "Yellow": "Жёлтый", "Orange": "Оранжевый", "Pink": "Розовый", "Navy": "Тёмно-синий",
  "Casual Style": "Повседневный стиль", "Formal Style": "Деловой стиль", "Party Style": "Стиль для вечеринки", "Gym Style": "Спортивный стиль",
  "Featured brands": "Популярные бренды", "August 14, 2023": "14 августа 2023", "August 15, 2023": "15 августа 2023",
  "August 16, 2023": "16 августа 2023", "August 17, 2023": "17 августа 2023", "August 18, 2023": "18 августа 2023",
  "I'm blown away by the quality and style of the clothes I received from Shop.co. From casual wear to elegant dresses, every piece I've bought has exceeded my expectations.": "Я в восторге от качества и стиля одежды Shop.co. Каждая покупка — от повседневных вещей до элегантных платьев — превзошла мои ожидания.",
  "Finding clothes that align with my personal style used to be a challenge until I discovered Shop.co. The range of options they offer is truly remarkable, catering to a variety of tastes and occasions.": "Раньше мне было трудно находить одежду под свой стиль, пока я не открыл Shop.co. Здесь действительно впечатляющий выбор для разных вкусов и случаев.",
  "As someone who's always on the lookout for unique fashion pieces, I'm thrilled to have stumbled upon Shop.co. The selection of clothes is not only diverse but also on-point with the latest trends.": "Я всегда ищу необычные модные вещи и рад, что нашёл Shop.co. Ассортимент здесь разнообразный и точно соответствует современным трендам.",
  "As a frequent online shopper, I've seen it all. But Shop.co manages to surprise me every time. The website navigation is seamless, and their delivery is incredibly fast. Plus, the fits are always perfect!": "Я часто покупаю в интернете, но Shop.co каждый раз приятно удивляет. Сайт удобный, доставка быстрая, а вещи всегда отлично сидят.",
  "I've been shopping at Shop.co for months, and they never disappoint. The quality of fabric is top-notch, and they keep adding trendy pieces. Highly recommend!": "Я покупаю в Shop.co уже несколько месяцев и ни разу не разочаровался. Ткани отличного качества, а модные новинки появляются регулярно. Рекомендую!"
};

const PHRASES = [
  ["Search for products...", "Поиск товаров..."], ["Add promo code", "Введите промокод"],
  ["Enter your email address", "Введите электронную почту"], ["Open Menu", "Открыть меню"],
  ["Close Menu", "Закрыть меню"], ["Clear search", "Очистить поиск"], ["Close search results", "Закрыть результаты поиска"],
  ["Open Filters", "Открыть фильтры"], ["Remove item", "Удалить товар"], ["Decrease quantity", "Уменьшить количество"],
  ["Increase quantity", "Увеличить количество"], ["Remove one", "Убрать одну единицу"],
  ["Add one more", "Добавить ещё одну единицу"], ["to cart", "в корзину"],
  ["Fashion models", "Модели в одежде"], ["Previous reviews", "Предыдущие отзывы"],
  ["Next reviews", "Следующие отзывы"], ["Black/White", "Чёрно-белый"],
  ["Red/White", "Красно-белый"], ["Blue/White", "Сине-белый"],
  ["Yellow/White", "Жёлто-белый"], ["Red/Blue", "Красно-синий"],
  ["Green/Blue", "Зелёно-синий"], ["Yellow/Black", "Жёлто-чёрный"],
  ["August", "августа"], ["Add ", "Добавить "], ["Choose ", "Выбрать "], ["Select ", "Выбрать "]
];

function translateValue(value) {
  const trimmed = value.trim();
  if (!trimmed) return value;
  if (RU[trimmed]) return value.replace(trimmed, RU[trimmed]);
  const brandUpper = "\uE000";
  const brandTitle = "\uE001";
  let result = value.replaceAll("SHOP.CO", brandUpper).replaceAll("Shop.co", brandTitle);
  for (const [from, to] of PHRASES) result = result.replaceAll(from, to);
  for (const [from, to] of Object.entries(RU)) {
    result = result.replaceAll(from, to);
    result = result.replaceAll(from.toUpperCase(), to.toUpperCase());
  }
  return result.replaceAll(brandUpper, "SHOP.CO").replaceAll(brandTitle, "Shop.co");
}

function translateTree(root) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach((node) => { node.nodeValue = translateValue(node.nodeValue); });
  root.querySelectorAll?.("[placeholder], [aria-label], [title], [alt]").forEach((element) => {
    ["placeholder", "aria-label", "title", "alt"].forEach((attribute) => {
      const value = element.getAttribute(attribute);
      if (value) element.setAttribute(attribute, translateValue(value));
    });
  });
}

export default function SiteTranslator() {
  const { language } = useLanguage();

  useEffect(() => {
    document.documentElement.lang = language;
    if (language !== "ru") return;
    translateTree(document.body);
    const observer = new MutationObserver((mutations) => mutations.forEach((mutation) => mutation.addedNodes.forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE) translateTree(node);
      if (node.nodeType === Node.TEXT_NODE) node.nodeValue = translateValue(node.nodeValue);
    })));
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [language]);

  return null;
}
