export function formatNotificationMessage(message, language) {
  const systemMessages = {
    ACCOUNT_WELCOME: {
      en: "Welcome to LUCHIK.CO! Your account has been created successfully.",
      ru: "Добро пожаловать в LUCHIK.CO! Ваш аккаунт успешно создан.",
    },
    ACCOUNT_PASSWORD_CHANGED: {
      en: "Your LUCHIK.CO account password was changed. If this wasn't you, reset it immediately.",
      ru: "Пароль вашего аккаунта LUCHIK.CO изменён. Если это были не вы, немедленно восстановите пароль.",
    },
  };
  if (systemMessages[message]) return systemMessages[message][language === "ru" ? "ru" : "en"];
  if (message?.startsWith("QUESTION_ANSWER:")) {
    const [, product, ...answerParts] = message.split(":");
    const answer = answerParts.join(":");
    return language === "ru" ? `Магазин ответил на ваш вопрос о товаре «${product}»: ${answer}` : `The store answered your question about “${product}”: ${answer}`;
  }
  if (language !== "ru") return message;
  return message
    .replace(/^Your order #(\w+) has been reserved\.$/, "Ваш заказ #$1 забронирован.")
    .replace(/^Your order #(\w+) is accepted and is being processed\.$/, "Ваш заказ #$1 принят и находится в обработке.")
    .replace(/^Your order #(\w+) is completed\.$/, "Ваш заказ #$1 завершён.")
    .replace(/^Your order #(\w+) is cancelled\.$/, "Ваш заказ #$1 отменён.");
}
