"use client";

import type { HealthStatus } from "@/lib/benchmarks";
import { getHealthLabel, getHealthColor, getHealthStatus, getBarColor, getGradientPercent } from "@/lib/benchmarks";
import { formatCurrency, formatNumber, formatPercent, formatRatio } from "@/lib/formatNumber";

interface ResultCardProps {
  label: string;
  value: string;
  type: "currency" | "percentage" | "number" | "ratio" | "text";
  isPrimary?: boolean;
  prefix?: string;
  suffix?: string;
  metricKey?: string;
  rawValue?: number;
  stage?: "seed" | "series-a" | "series-b" | "series-c" | "growth";
}

function formatResult(value: string, type: string): string {
  const num = parseFloat(value.replace(/[$,%]/g, ""));
  if (isNaN(num)) return value;

  switch (type) {
    case "currency":
      return formatCurrency(num);
    case "percentage":
      return formatPercent(num);
    case "ratio":
      return formatRatio(num);
    case "text":
      return value;
    default:
      return formatNumber(num);
  }
}

export function ResultCard({ label, value, type, isPrimary, prefix, suffix, metricKey, rawValue, stage = "series-a" }: ResultCardProps) {
  const formatted = formatResult(value, type);

  const health: HealthStatus | null = metricKey && rawValue !== undefined ? getHealthStatus(metricKey, rawValue, stage) : null;

  if (isPrimary) {
    return (
      <div className="rounded-2xl bg-gradient-to-br from-brand-50 to-brand-100/50 dark:from-brand-950/40 dark:to-brand-900/30 border border-brand-100 dark:border-brand-800/50 p-6 text-center shadow-sm">
        <p className="text-sm font-medium text-brand-600 dark:text-brand-400">{label}</p>
        <p className="mt-2 font-heading text-4xl font-bold bg-gradient-to-r from-brand-700 to-brand-500 dark:from-brand-400 dark:to-brand-300 bg-clip-text text-transparent">
          {prefix}{formatted}{suffix}
        </p>
        {health && health !== "reference" && (
          <span className={`mt-2 inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium ${getHealthColor(health)}`}>
            {getHealthLabel(health)}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{label}</p>
        {health && (
          <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold leading-tight ${getHealthColor(health)}`}>
            {getHealthLabel(health)}
          </span>
        )}
      </div>
      <p className="mt-1 font-heading text-xl font-semibold text-gray-900 dark:text-gray-100">
        {prefix}{formatted}{suffix}
      </p>
      {metricKey && rawValue !== undefined && (
        <div className="mt-2 h-1.5 w-full rounded-full bg-gray-100">
          <div
            className={`h-full rounded-full transition-all duration-500 ${getBarColor(health ?? "reference")}`}
            style={{ width: `${getGradientPercent(metricKey, rawValue, stage)}%` }}
          />
        </div>
      )}
    </div>
  );
}
