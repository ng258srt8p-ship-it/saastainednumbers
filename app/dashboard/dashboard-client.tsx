"use client";

import { useMemo, useEffect, useRef, useState, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { calculateMRR } from "@/calculators/engine/mrr";
import { calculateCAC } from "@/calculators/engine/cac";
import { calculateLTVWithCAC } from "@/calculators/engine/ltv";
import { calculateChurn } from "@/calculators/engine/churn";
import { calculateARPU } from "@/calculators/engine/arpu";
import { InputSlider } from "@/calculators/ui/InputSlider";
import { Insights } from "@/components/Insights";
import { analytics } from "@/lib/analytics";
import { getHealthStatus, type Stage } from "@/lib/benchmarks";
import Link from "next/link";

interface DashboardInputs {
  customers: number;
  arpu: number;
  churnRate: number;
  grossMargin: number;
  salesCost: number;
  marketingCost: number;
  newCustomers: number;
}

const DEFAULTS: DashboardInputs = {
  customers: 1000,
  arpu: 50,
  churnRate: 5,
  grossMargin: 80,
  salesCost: 15000,
  marketingCost: 5000,
  newCustomers: 100,
};

const INPUT_IDS = ["customers", "arpu", "churnRate", "grossMargin", "salesCost", "marketingCost", "newCustomers"] as const;

function formatCurrency(n: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n);
}

function formatPercent(n: number): string {
  return `${n.toFixed(1)}%`;
}

export function DashboardClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [stage, setStage] = useState<Stage>("series-a");
  const tracked = useRef(false);

  const inputs = useMemo(() => {
    const result: DashboardInputs = { ...DEFAULTS };
    for (const id of INPUT_IDS) {
      const raw = searchParams.get(id);
      const parsed = raw !== null ? Number.parseFloat(raw) : NaN;
      if (Number.isFinite(parsed)) {
        (result as Record<string, number>)[id] = parsed;
      }
    }
    return result;
  }, [searchParams]);

  const setInput = useCallback((id: string, value: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (Number.isFinite(value)) {
      params.set(id, value.toString());
    } else {
      params.delete(id);
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [searchParams, router, pathname]);

  const reset = useCallback(() => {
    router.replace(pathname, { scroll: false });
  }, [router, pathname]);

  const results = useMemo(() => {
    const mrr = calculateMRR({ customers: inputs.customers, arpu: inputs.arpu });
    const cac = calculateCAC({ salesCost: inputs.salesCost, marketingCost: inputs.marketingCost, newCustomers: inputs.newCustomers });
    const ltvWithCac = calculateLTVWithCAC({ arpu: inputs.arpu, grossMargin: inputs.grossMargin, churnRate: inputs.churnRate, cac: cac.cac });
    const churn = calculateChurn({
      customersStart: inputs.customers,
      customersEnd: inputs.customers - Math.round(inputs.customers * inputs.churnRate / 100),
      lostCustomers: Math.round(inputs.customers * inputs.churnRate / 100),
    });
    const arpu = calculateARPU({ mrr: mrr.mrr, totalCustomers: inputs.customers });
    return { mrr, cac, ltv: ltvWithCac, churn, arpu };
  }, [inputs]);

  const primaryValue = Number(results.mrr.mrr);
  useEffect(() => {
    if (primaryValue <= 0) return;
    const timer = setTimeout(() => {
      analytics.calculate("dashboard", { ...inputs }, { value: primaryValue, label: "MRR", type: "currency" });
    }, 500);
    return () => clearTimeout(timer);
  }, [primaryValue, inputs]);

  useEffect(() => {
    if (!tracked.current) {
      tracked.current = true;
    }
  }, []);

  const insightsInputs = [
    { id: "customers", label: "Customers", value: inputs.customers, type: "number" },
    { id: "arpu", label: "ARPU", value: inputs.arpu, type: "currency" },
    { id: "churnRate", label: "Monthly Churn Rate", value: inputs.churnRate, type: "percentage" },
    { id: "grossMargin", label: "Gross Margin", value: inputs.grossMargin, type: "percentage" },
    { id: "salesCost", label: "Sales Costs", value: inputs.salesCost, type: "currency" },
    { id: "marketingCost", label: "Marketing Costs", value: inputs.marketingCost, type: "currency" },
    { id: "newCustomers", label: "New Customers/Mo", value: inputs.newCustomers, type: "number" },
  ];

  const insightsOutputs = [
    { id: "mrr", label: "Monthly Recurring Revenue", value: results.mrr.mrr, type: "currency", isPrimary: true },
    { id: "cac", label: "Customer Acquisition Cost", value: results.cac.cac, type: "currency" },
    { id: "ltv", label: "Customer Lifetime Value", value: results.ltv.ltv, type: "currency" },
    { id: "churn", label: "Monthly Churn Rate", value: results.churn.monthlyChurnPct, type: "percentage" },
    { id: "arpu", label: "Average Revenue Per User", value: results.arpu.arpu, type: "currency" },
  ];

  const ltvCacHealth: string | null = results.ltv.ltvCacRatio > 0 ? getHealthStatus("ltv-cac", results.ltv.ltvCacRatio, stage) : null;
  const churnHealth: string | null = getHealthStatus("churn-rate", results.churn.monthlyChurnPct, stage);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-heading text-3xl font-bold mb-2">SaaS Metrics Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Fill in your business metrics once and see all key SaaS calculations at a glance.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 p-0.5 text-xs">
            {(["seed", "series-a", "series-b", "series-c", "growth"] as Stage[]).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStage(s)}
                className={`rounded-md px-2.5 py-1.5 font-medium transition-colors ${
                  stage === s
                    ? "bg-brand-600 text-white shadow-sm"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                }`}
              >
                {s === "series-a" ? "Series A" : s === "series-b" ? "Series B" : s === "series-c" ? "Series C" : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="lg:w-96 space-y-5">
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Your Metrics</h2>

            <div className="space-y-4">
              <InputSlider id="customers" label="Customers" type="number" value={inputs.customers} onChange={(v) => setInput("customers", v)} min={0} max={100000} />
              <InputSlider id="arpu" label="ARPU" type="currency" value={inputs.arpu} onChange={(v) => setInput("arpu", v)} min={0} max={1000} />
              <InputSlider id="churnRate" label="Monthly Churn Rate" type="percentage" value={inputs.churnRate} onChange={(v) => setInput("churnRate", v)} min={0} max={50} />
              <InputSlider id="grossMargin" label="Gross Margin" type="percentage" value={inputs.grossMargin} onChange={(v) => setInput("grossMargin", v)} min={0} max={100} />
              <hr className="border-gray-100 dark:border-gray-700" />
              <InputSlider id="salesCost" label="Sales Costs" type="currency" value={inputs.salesCost} onChange={(v) => setInput("salesCost", v)} min={0} max={500000} />
              <InputSlider id="marketingCost" label="Marketing Costs" type="currency" value={inputs.marketingCost} onChange={(v) => setInput("marketingCost", v)} min={0} max={500000} />
              <InputSlider id="newCustomers" label="New Customers/Mo" type="number" value={inputs.newCustomers} onChange={(v) => setInput("newCustomers", v)} min={0} max={10000} />
            </div>

            <button
              type="button"
              onClick={reset}
              className="mt-4 text-sm text-brand-700 dark:text-brand-400 hover:text-brand-800 dark:hover:text-brand-300 underline"
            >
              Reset defaults
            </button>
          </div>
        </div>

        <div className="flex-1 space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <MetricCard
              title="Monthly Recurring Revenue"
              value={formatCurrency(results.mrr.mrr)}
              subtitle={`ARR: ${formatCurrency(results.mrr.arr)}`}
              href="/revenue/mrr-calculator"
              params={`customers=${inputs.customers}&arpu=${inputs.arpu}`}
            />
            <MetricCard
              title="Customer Acquisition Cost"
              value={formatCurrency(results.cac.cac)}
              href="/growth-efficiency/cac-calculator"
              params={`salesCost=${inputs.salesCost}&marketingCost=${inputs.marketingCost}&newCustomers=${inputs.newCustomers}`}
            />
            <MetricCard
              title="Customer Lifetime Value"
              value={formatCurrency(results.ltv.ltv)}
              subtitle={`LTV:CAC Ratio: ${results.ltv.ltvCacRatio.toFixed(1)}`}
              href="/revenue/ltv-calculator"
              params={`arpu=${inputs.arpu}&grossMargin=${inputs.grossMargin}&churnRate=${inputs.churnRate}`}
              health={ltvCacHealth}
            />
            <MetricCard
              title="Monthly Churn Rate"
              value={formatPercent(results.churn.monthlyChurnPct)}
              subtitle={`Annual: ${formatPercent(results.churn.annualChurnPct)}`}
              href="/churn-retention/churn-calculator"
              params={`customersStart=${inputs.customers}&customersEnd=${inputs.customers - Math.round(inputs.customers * inputs.churnRate / 100)}&lostCustomers=${Math.round(inputs.customers * inputs.churnRate / 100)}`}
              health={churnHealth}
            />
            <MetricCard
              title="Average Revenue Per User"
              value={formatCurrency(results.arpu.arpu)}
              href="/revenue/arpu-calculator"
              params={`mrr=${inputs.arpu * inputs.customers}&totalCustomers=${inputs.customers}`}
            />
          </div>

          <Insights
            title="SaaS Metrics Dashboard"
            description="Fill in your business metrics once and see all key SaaS calculations at a glance."
            category="saas-deepen"
            inputs={insightsInputs}
            outputs={insightsOutputs}
          />
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, subtitle, href, params, health }: {
  title: string; value: string; subtitle?: string; href: string; params: string; health?: string | null;
}) {
  return (
    <Link
      href={`${href}?${params}`}
      className="block rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">{title}</p>
        {health && <HealthBadge status={health} />}
      </div>
      <p className="mt-2 font-heading text-2xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
      {subtitle && <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>}
      <p className="mt-3 text-xs text-brand-700 dark:text-brand-400 font-medium">Explore in detail &rarr;</p>
    </Link>
  );
}

function HealthBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    healthy: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800/50",
    watch: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/50",
    critical: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800/50",
    reference: "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700",
  };
  return (
    <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${colors[status] || colors.reference}`}>
      {status}
    </span>
  );
}
