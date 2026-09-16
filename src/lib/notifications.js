export function formatNotificationMessage(message, language) {
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
