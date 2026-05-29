import type { Locale } from "./useLocale";
import { getDefaultCurrency } from "./currencies";

function resolveLocale(locale?: Locale): Locale {
  return locale ?? "en";
}

export function getLocaleCurrency(locale?: Locale): string {
  return getDefaultCurrency(resolveLocale(locale));
}

export function formatCurrency(n: number, locale?: Locale, currency?: string): string {
  const cur = currency ?? getLocaleCurrency(locale);
  if (!Number.isFinite(n)) return new Intl.NumberFormat(resolveLocale(locale), { style: "currency", currency: cur, minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(0);
  return new Intl.NumberFormat(resolveLocale(locale), {
    style: "currency",
    currency: cur,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
}

export function formatNumber(n: number, locale?: Locale): string {
  if (!Number.isFinite(n)) return "0";
  return new Intl.NumberFormat(resolveLocale(locale)).format(n);
}

export function formatPercent(n: number, locale?: Locale): string {
  if (!Number.isFinite(n)) return "0%";
  return `${new Intl.NumberFormat(resolveLocale(locale), {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(n)}%`;
}

export function formatRatio(n: number, locale?: Locale): string {
  if (!Number.isFinite(n)) return "0.00";
  return new Intl.NumberFormat(resolveLocale(locale), {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
}

export function getCurrencySymbol(locale?: Locale, currency?: string): string {
  const cur = currency ?? getLocaleCurrency(locale);
  return (
    new Intl.NumberFormat(resolveLocale(locale), {
      style: "currency",
      currency: cur,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
      .formatToParts(0)
      .find((p) => p.type === "currency")?.value ?? "$"
  );
}
