const pages = {
  about:{title:"О магазине SHOP.CO",text:"Учебный интернет-магазин одежды. Здесь можно выбирать варианты товара, оформлять бронирование и общаться с магазином через личный кабинет."},
  delivery:{title:"Доставка",text:"При оформлении выберите курьера или пункт выдачи. Срок и стоимость подтверждает администратор в сообщении по заказу."},
  returns:{title:"Возврат товара",text:"Неношеный товар можно вернуть в течение 30 дней. Сохраните упаковку и напишите администратору через уведомления заказа."},
  terms:{title:"Условия использования",text:"Оформление в текущей учебной версии является бронированием. Настоящее списание денежных средств не производится."},
  privacy:{title:"Политика конфиденциальности",text:"Данные аккаунта и заказа используются только для работы магазина. Пароли обрабатывает защищённая система Supabase Auth и магазин их не видит."},
  support:{title:"Поддержка покупателей",text:"Задайте вопрос на странице товара или ответьте администратору в уведомлениях личного кабинета."},
  payments:{title:"Оплата",text:"Доступны бронирование без оплаты, демонстрационная карта и демонстрационный СБП. Реальная оплата пока не подключена."},
  sizes:{title:"Таблица размеров",text:"Small — небольшой, Medium — средний, Large — большой, X-Large — очень большой. Перед заказом сверяйтесь с описанием конкретного товара."},
};
export function generateStaticParams(){return Object.keys(pages).map((slug)=>({slug}));}
export default async function InfoPage({params}){const {slug}=await params;const page=pages[slug]||pages.support;return <main className="container-main py-12 md:py-20"><div className="mx-auto max-w-3xl rounded-[32px] bg-[#f2f2f2] p-7 md:p-12"><h1 className="font-integral text-3xl font-bold md:text-5xl">{page.title}</h1><p className="mt-6 text-lg leading-8 text-black/65">{page.text}</p></div></main>}
