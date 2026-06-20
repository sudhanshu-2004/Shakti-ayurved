import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function getPriceInfo(product) {
  const rawOffer = product?.offer_price;
  const rawPrice = product?.price;
  const rawOriginal = product?.original_price;

  const discounted = Number(rawOffer ?? rawPrice ?? 0) || 0;
  let original = Number(rawOriginal ?? 0) || 0;

  // If original_price is missing but both price and offer_price exist,
  // assume `price` was the MRP and `offer_price` the discounted value.
  if (!original && rawPrice != null && rawOffer != null) {
    original = Number(rawPrice) || 0;
  }

  const showOriginal = original > discounted && original > 0;
  const discountPct = showOriginal ? Math.round(((original - discounted) / original) * 100) : 0;
  const savings = showOriginal ? Math.round(original - discounted) : 0;

  return {
    price: discounted,
    original_price: original,
    showOriginal,
    discountPct,
    savings,
  };
}
