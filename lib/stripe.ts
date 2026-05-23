import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2026-04-22.dahlia",
});

export const PRO_PRICE_ID = process.env.STRIPE_PRO_PRICE_ID ?? "";

export const PRO_MONTHLY_PRICE = 900;

export function getProTier() {
  return {
    name: "Pro",
    price: PRO_MONTHLY_PRICE,
    priceId: PRO_PRICE_ID,
    features: [
      "All 20 calculators",
      "Unlimited embeds",
      "Save calculations to account",
      "Priority support",
      "No ads",
    ],
  };
}
