"use client";

import { useMemo } from "react";

interface CanvasTotalWidgetProps {
  allOutputs: Record<string, Record<string, number | string>>;
  calculatorCount: number;
}

interface AggregateMetric {
  label: string;
  value: string;
  type: "revenue" | "cost" | "ratio" | "metric";
}

export function CanvasTotalWidget({ allOutputs, calculatorCount }: CanvasTotalWidgetProps) {
  const metrics = useMemo(() => {
    const result: AggregateMetric[] = [];

    let totalMRR = 0;
    let totalARR = 0;
    let totalRevenue = 0;
    let totalCosts = 0;
    let totalCAC = 0;
    let ltvSum = 0;
    let ltvCount = 0;
    let bestLtvCac = 0;
    const churnRates: number[] = [];
    const expansionRates: number[] = [];

    for (const outputs of Object.values(allOutputs)) {
      const mrr = Number(outputs.mrr) || 0;
      if (mrr > 0) totalMRR += mrr;

      const arr = Number(outputs.arr) || 0;
      if (arr > 0) totalARR += arr;

      const cac = Number(outputs.cac) || 0;
      if (cac > 0) totalCAC += cac;

      const ltv = Number(outputs.ltv) || 0;
      if (ltv > 0) { ltvSum += ltv; ltvCount++; }

      const ltvCac = Number(outputs.ltvCacRatio) || 0;
      if (ltvCac > bestLtvCac) bestLtvCac = ltvCac;

      const churn = Number(outputs.monthlyChurnPct) || 0;
      if (churn > 0) churnRates.push(churn);

      // Track expansion rates for later aggregation
      const expansionRate = Number(outputs.expansionRevenueRate) || 0;
      if (expansionRate > 0) expansionRates.push(expansionRate);

      // Revenue — check multiple possible output IDs
      const revSources = [
        "monthlyTotalRevenue", "monthlyRevenue", "annualRevenue",
        "totalRevenue", "monthlyTotal",
      ];
      for (const key of revSources) {
        const v = Number(outputs[key]) || 0;
        if (v > totalRevenue) totalRevenue = v;
      }

      // Costs
      const costSources = [
        "totalMonthlyCost", "monthlyTotalCosts", "monthlyExpenses",
        "monthlyTotalFees", "totalCostPerEmployee", "annualCost",
      ];
      for (const key of costSources) {
        const v = Number(outputs[key]) || 0;
        if (v > totalCosts) totalCosts = v;
      }
    }

    const fmt = (n: number): string => {
      if (!Number.isFinite(n) || n === 0) return "";
      if (Math.abs(n) >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
      if (Math.abs(n) >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
      return `$${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
    };

    if (totalMRR > 0) result.push({ label: "Total MRR", value: fmt(totalMRR), type: "revenue" });
    if (totalARR > 0) result.push({ label: "Total ARR", value: fmt(totalARR), type: "revenue" });
    if (totalRevenue > 0) result.push({ label: "Total Revenue", value: fmt(totalRevenue), type: "revenue" });
    if (totalCAC > 0) result.push({ label: "Total CAC", value: fmt(totalCAC), type: "cost" });
    if (totalCosts > 0) result.push({ label: "Total Costs", value: fmt(totalCosts), type: "cost" });
    if (ltvCount > 0) {
      result.push({ label: "Avg LTV", value: fmt(ltvSum / ltvCount), type: "revenue" });
    }
    if (bestLtvCac > 0) {
      result.push({ label: "Best LTV:CAC", value: bestLtvCac.toFixed(1) + "x", type: "ratio" });
    }
    if (churnRates.length > 0) {
      const avg = churnRates.reduce((a, b) => a + b, 0) / churnRates.length;
      result.push({ label: "Avg Churn", value: avg.toFixed(1) + "%", type: "metric" });
    }

    if (expansionRates.length > 0) {
      const avgExpansion = expansionRates.reduce((a, b) => a + b, 0) / expansionRates.length;
      result.push({ label: "Avg Expansion Rate", value: avgExpansion.toFixed(1) + "%", type: "ratio" });
    }

    return result;
  }, [allOutputs]);

  if (calculatorCount === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 p-6 text-center">
        <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center mx-auto mb-3">
          <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
          No calculators yet
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
          Add calculators from the catalog to see aggregate metrics
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-brand-200 dark:border-brand-800 bg-gradient-to-r from-brand-50 to-brand-100/50 dark:from-brand-950/30 dark:to-brand-900/20 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 border-b border-brand-200 dark:border-brand-800">
        <h2 className="font-heading text-base font-bold text-brand-800 dark:text-brand-200 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Executive Summary
        </h2>
        <span className="text-[11px] font-medium text-brand-600 dark:text-brand-400 tabular-nums">
          {calculatorCount} calculator{calculatorCount !== 1 ? "s" : ""}
        </span>
      </div>
      <div className="flex flex-wrap gap-x-6 gap-y-3 px-5 py-4">
        {metrics.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400 w-full text-center py-2">
            Aggregate metrics will appear here as you adjust calculator inputs
          </p>
        ) : (
          metrics.map((m) => (
            <div key={m.label} className="flex flex-col min-w-[120px]">
              <span className="text-[10px] font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                {m.label}
              </span>
              <span
                className={`font-heading text-lg font-bold mt-0.5 ${
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
          ))
        )}
      </div>
    </div>
  );
}
