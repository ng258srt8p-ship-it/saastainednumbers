"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import type { HealthStatus } from "@/lib/benchmarks";
import { getHealthLabel, getHealthColor, getHealthStatus, getBarColor, getGradientPercent } from "@/lib/benchmarks";
import { formatCurrency, formatNumber, formatPercent, formatRatio } from "@/lib/formatNumber";
import { useCurrency } from "@/components/CurrencyProvider";
import type { Locale } from "@/lib/useLocale";

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
  locale?: Locale;
  index?: number;
}

function formatResult(value: string, type: string, locale?: Locale, currency?: string): string {
  const num = parseFloat(value.replace(/[$,%]/g, ""));
  if (isNaN(num)) return value;

  switch (type) {
    case "currency": return formatCurrency(num, locale, currency);
    case "percentage": return formatPercent(num, locale);
    case "ratio": return formatRatio(num, locale);
    case "text": return value;
    default: return formatNumber(num, locale);
  }
}

/** Animated number display — counts up/down smoothly on value change */
function AnimatedNumber({ value, prefix, suffix }: { value: string; prefix?: string; suffix?: string }) {
  const [display, setDisplay] = useState(value);
  
  useEffect(() => {
    const num = parseFloat(value.replace(/[$,%]/g, ""));
    if (isNaN(num)) { setDisplay(value); return; }

    const prev = parseFloat(display.replace(/[$,%]/g, "")) || 0;
    const diff = num - prev;
    const steps = 12;
    let step = 0;

    const interval = setInterval(() => {
      step++;
      const current = prev + (diff * step) / steps;
      if (step >= steps) {
        setDisplay(value);
        clearInterval(interval);
      } else {
        setDisplay(current.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 0 }));
      }
    }, 30);

    return () => clearInterval(interval);
  }, [value]);

  return <>{prefix}{display}{suffix}</>;
}

export function ResultCard({ label, value, type, isPrimary, prefix, suffix, metricKey, rawValue, stage = "series-a", locale, index = 0 }: ResultCardProps) {
  const { currency } = useCurrency();
  const formatted = formatResult(value, type, locale, currency);
  const [highlight, setHighlight] = useState(false);

  // Flash highlight on value change
  useEffect(() => {
    if (value !== "0" && parseFloat(value) !== 0) {
      setHighlight(true);
      const timer = setTimeout(() => setHighlight(false), 600);
      return () => clearTimeout(timer);
    }
  }, [value]);

  const health: HealthStatus | null = metricKey && rawValue !== undefined ? getHealthStatus(metricKey, rawValue, stage) : null;

  if (isPrimary) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        className={`rounded-2xl bg-gradient-to-br from-brand-50 to-brand-100/50 dark:from-brand-950/40 dark:to-brand-900/30 border border-brand-100 dark:border-brand-800/50 p-6 text-center shadow-sm transition-shadow duration-300 ${
          highlight ? "shadow-lg shadow-brand-500/20" : ""
        }`}
      >
        <p className="text-sm font-medium text-brand-600 dark:text-brand-400">{label}</p>
        <motion.p
          key={formatted}
          initial={{ y: -8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="mt-2 font-heading text-4xl font-bold bg-gradient-to-r from-brand-700 to-brand-500 dark:from-brand-400 dark:to-brand-300 bg-clip-text text-transparent"
        >
          <AnimatedNumber value={formatted} prefix={prefix} suffix={suffix} />
        </motion.p>
        {health && health !== "reference" && (
          <motion.span
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className={`mt-2 inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium ${getHealthColor(health)}`}
            role="status"
            aria-label={`${label} health status: ${getHealthLabel(health)}`}
          >
            {getHealthLabel(health)}
          </motion.span>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25, delay: index * 0.05 }}
      className={`rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm transition-shadow duration-300 ${
        highlight ? "shadow-md border-brand-200 dark:border-brand-700" : ""
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{label}</p>
        {health && (
          <span
            className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold leading-tight ${getHealthColor(health)}`}
            role="status"
            aria-label={`${label} health status: ${getHealthLabel(health)}`}
          >
            {getHealthLabel(health)}
          </span>
        )}
      </div>
      <motion.p
        key={formatted}
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="mt-1 font-heading text-xl font-semibold text-gray-900 dark:text-gray-100"
      >
        <AnimatedNumber value={formatted} prefix={prefix} suffix={suffix} />
      </motion.p>
      {metricKey && rawValue !== undefined && (
        <div
          className="mt-2 h-1.5 w-full rounded-full bg-gray-100"
          role="progressbar"
          aria-label={`${label} progress`}
          aria-valuenow={getGradientPercent(metricKey, rawValue, stage)}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className={`h-full rounded-full transition-all duration-500 ${getBarColor(health ?? "reference")}`}
            style={{ width: `${getGradientPercent(metricKey, rawValue, stage)}%` }}
          />
        </div>
      )}
    </motion.div>
  );
}
