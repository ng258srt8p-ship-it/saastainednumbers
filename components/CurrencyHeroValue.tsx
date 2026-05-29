"use client";

import { useCurrency } from "@/components/CurrencyProvider";
import { getCurrencySymbol } from "@/lib/formatNumber";
import type { Locale } from "@/lib/useLocale";

export function CurrencyHeroValue({ locale }: { locale: Locale }) {
  const { currency } = useCurrency();
  const symbol = getCurrencySymbol(locale, currency);
  return <>{symbol}0</>;
}
