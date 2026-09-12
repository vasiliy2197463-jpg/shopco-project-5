export const formatPrice = (price) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0
  }).format(price);
};

export const calculateDiscount = (originalPrice, discountPercentage) => {
  if (!originalPrice || !discountPercentage) return originalPrice;
  return originalPrice - (originalPrice * (discountPercentage / 100));
};
