"use client";

import { formatCurrency, formatNumber, formatPercent, formatRatio } from "@/lib/formatNumber";
import type { Locale } from "@/lib/useLocale";

export type DeltaMode = "absolute" | "percent" | "both";

interface DeltaBadgeProps {
  valueA: number;
  valueB: number;
  type: "currency" | "percentage" | "number" | "ratio" | "text";
  mode: DeltaMode;
  locale?: Locale;
}

function formatValue(val: number, type: string, locale?: Locale): string {
  switch (type) {
    case "currency":
      return formatCurrency(val, locale);
    case "percentage":
      return formatPercent(val, locale);
    case "ratio":
      return formatRatio(val, locale);
    default:
      return formatNumber(val, locale);
  }
}

export function DeltaBadge({ valueA, valueB, type, mode, locale }: DeltaBadgeProps) {
  if (type === "text") return null;

  const diff = valueB - valueA;
  const pct = valueA !== 0 ? (diff / valueA) * 100 : 0;
  const isPositive = diff > 0;
  const isNeutral = diff === 0;

  const arrow = isNeutral ? "" : isPositive ? "▲" : "▼";
  const colorClass = isNeutral
    ? "text-gray-600 dark:text-gray-400 border-gray-300 dark:border-gray-600"
    : isPositive
      ? "text-green-600 border-green-200 bg-green-50"
      : "text-red-600 border-red-200 bg-red-50";

  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold leading-tight ${colorClass}`}>
      {!isNeutral && <span>{arrow}</span>}
      {mode === "absolute" || mode === "both" ? (
        <span>{isPositive ? "+" : ""}{formatValue(Math.abs(diff), type, locale)}</span>
      ) : null}
      {mode === "both" && <span className="opacity-50">|</span>}
      {mode === "percent" || mode === "both" ? (
        <span>{isPositive ? "+" : ""}{pct.toFixed(1)}%</span>
      ) : null}
    </span>
  );
}
