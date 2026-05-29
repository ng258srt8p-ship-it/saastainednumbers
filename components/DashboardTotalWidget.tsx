"use client";

import { formatCurrency } from "@/lib/formatNumber";
import { useCurrency } from "@/components/CurrencyProvider";
import type { Locale } from "@/lib/useLocale";

interface TotalMetric {
  label: string;
  value: string;
  type: "revenue" | "cost" | "ratio" | "metric";
}

export function DashboardTotalWidget({ allOutputs, locale }: { allOutputs: Map<string, Record<string, number>>; locale?: Locale }) {
  const { currency } = useCurrency();
  let totalMRR = 0;
  let totalARR = 0;
  let totalCAC = 0;
  let totalCosts = 0;
  let totalRevenue = 0;
  let ltvSum = 0;
  let ltvCount = 0;
  let bestLtvCac = 0;
  const churnRates: number[] = [];

  for (const outputs of allOutputs.values()) {
    if (outputs.mrr) totalMRR += outputs.mrr;
    if (outputs.arr) totalARR += outputs.arr;
    if (outputs.cac && outputs.cac > 0) {
      totalCAC += outputs.cac;
    }
    if (outputs.ltv) {
      ltvSum += outputs.ltv;
      ltvCount++;
    }
    if (outputs.ltvCacRatio && outputs.ltvCacRatio > bestLtvCac) {
      bestLtvCac = outputs.ltvCacRatio;
    }
    if (outputs.monthlyChurnPct && outputs.monthlyChurnPct > 0) {
      churnRates.push(outputs.monthlyChurnPct);
    }
    if (outputs.monthlyTotalRevenue) totalRevenue += outputs.monthlyTotalRevenue;
    if (outputs.monthlyRevenue) totalRevenue += outputs.monthlyRevenue;
    if (outputs.annualRevenue) totalRevenue += outputs.annualRevenue;
    if (outputs.totalMonthlyCost || outputs.monthlyTotalCosts) {
      totalCosts += outputs.totalMonthlyCost ?? outputs.monthlyTotalCosts ?? 0;
    }
    if (outputs.monthlyExpenses || outputs.monthlyTotalFees) {
      totalCosts += outputs.monthlyExpenses ?? outputs.monthlyTotalFees ?? 0;
    }
    if (outputs.totalCostPerEmployee) totalCosts += outputs.totalCostPerEmployee;
    if (outputs.annualCost) totalCosts += outputs.annualCost;
  }

  const metrics: TotalMetric[] = [];

  if (totalMRR > 0) {
    metrics.push({ label: "Total MRR", value: formatCurrency(totalMRR, locale, currency), type: "revenue" });
  }
  if (totalARR > 0) {
    metrics.push({ label: "Total ARR", value: formatCurrency(totalARR, locale, currency), type: "revenue" });
  }
  if (totalRevenue > 0) {
    metrics.push({ label: "Total Revenue", value: formatCurrency(totalRevenue, locale, currency), type: "revenue" });
  }
  if (totalCAC > 0) {
    metrics.push({ label: "Total CAC", value: formatCurrency(totalCAC, locale, currency), type: "cost" });
  }
  if (totalCosts > 0) {
    metrics.push({ label: "Total Costs", value: formatCurrency(totalCosts, locale, currency), type: "cost" });
  }
  if (ltvCount > 0) {
    metrics.push({ label: "Avg LTV", value: formatCurrency(ltvSum / ltvCount, locale, currency), type: "revenue" });
  }
  if (bestLtvCac > 0) {
    metrics.push({ label: "LTV:CAC", value: bestLtvCac.toFixed(1) + "x", type: "ratio" });
  }
  if (churnRates.length > 0) {
    const avgChurn = churnRates.reduce((a, b) => a + b, 0) / churnRates.length;
    metrics.push({ label: "Avg Churn", value: avgChurn.toFixed(1) + "%", type: "metric" });
  }

  if (metrics.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm p-5">
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
          Add calculators above to see aggregate metrics
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-brand-200 dark:border-brand-800 bg-gradient-to-r from-brand-50 to-brand-100/50 dark:from-brand-950/30 dark:to-brand-900/20 shadow-sm">
      <div className="px-5 py-3 border-b border-brand-200 dark:border-brand-800">
        <h2 className="font-heading text-base font-bold text-brand-800 dark:text-brand-200 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Executive Summary
        </h2>
      </div>
      <div className="flex flex-wrap gap-4 px-5 py-4">
        {metrics.map((m) => (
          <div key={m.label} className="flex flex-col">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              {m.label}
            </span>
            <span
              className={`font-heading text-xl font-bold mt-0.5 ${
                m.type === "revenue"
                  ? "text-green-700 dark:text-green-400"
                  : m.type === "cost"
                    ? "text-red-700 dark:text-red-400"
                    : m.type === "ratio"
                      ? "text-brand-700 dark:text-brand-400"
                      : "text-gray-800 dark:text-gray-200"
              }`}
            >
              {m.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
