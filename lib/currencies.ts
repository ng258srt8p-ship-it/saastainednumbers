export type CurrencyCode = typeof SUPPORTED_CURRENCIES[number]["code"];

export const SUPPORTED_CURRENCIES = [
  { code: "USD", symbol: "$" },
  { code: "EUR", symbol: "€" },
  { code: "GBP", symbol: "£" },
  { code: "JPY", symbol: "¥" },
  { code: "CAD", symbol: "C$" },
  { code: "AUD", symbol: "A$" },
  { code: "BRL", symbol: "R$" },
  { code: "CHF", symbol: "Fr" },
  { code: "INR", symbol: "₹" },
  { code: "CNY", symbol: "¥" },
  { code: "MXN", symbol: "MX$" },
  { code: "SEK", symbol: "kr" },
  { code: "NOK", symbol: "kr" },
  { code: "NZD", symbol: "NZ$" },
  { code: "KRW", symbol: "₩" },
  { code: "SGD", symbol: "S$" },
  { code: "HKD", symbol: "HK$" },
  { code: "TWD", symbol: "NT$" },
  { code: "ZAR", symbol: "R" },
  { code: "DKK", symbol: "kr" },
] as const;

const DEFAULT_CURRENCY: Record<string, string> = {
  en: "USD",
  es: "EUR",
  de: "EUR",
  pt: "EUR",
  fr: "EUR",
  ja: "JPY",
};

export function getDefaultCurrency(locale: string): string {
  return DEFAULT_CURRENCY[locale] ?? "USD";
}

export function isSupportedCurrency(code: string): boolean {
  return SUPPORTED_CURRENCIES.some((c) => c.code === code);
}

export function getCurrencySymbolStatic(code: string): string {
  return SUPPORTED_CURRENCIES.find((c) => c.code === code)?.symbol ?? "$";
}
