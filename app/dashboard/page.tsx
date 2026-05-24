"use client";

import { useState, useMemo, useCallback } from "react";
import { calculateMRR } from "@/calculators/engine/mrr";
import { calculateCAC } from "@/calculators/engine/cac";
import { calculateLTV } from "@/calculators/engine/ltv";
import { calculateChurn } from "@/calculators/engine/churn";
import { calculateARPU } from "@/calculators/engine/arpu";
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

const defaultInputs: DashboardInputs = {
  customers: 1000,
  arpu: 50,
  churnRate: 5,
  grossMargin: 80,
  salesCost: 15000,
  marketingCost: 5000,
  newCustomers: 100,
};

function formatCurrency(n: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n);
}

function formatPercent(n: number): string {
  return `${n.toFixed(1)}%`;
}

export default function DashboardPage() {
  const [inputs, setInputs] = useState<DashboardInputs>(defaultInputs);

  const update = useCallback((key: keyof DashboardInputs, value: number) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  }, []);

  const results = useMemo(() => {
    const mrr = calculateMRR({ customers: inputs.customers, arpu: inputs.arpu });
    const cac = calculateCAC({ salesCost: inputs.salesCost, marketingCost: inputs.marketingCost, newCustomers: inputs.newCustomers });
    const ltv = calculateLTV({ arpu: inputs.arpu, grossMargin: inputs.grossMargin, churnRate: inputs.churnRate });
    const churn = calculateChurn({ customersStart: inputs.customers, customersEnd: inputs.customers - Math.round(inputs.customers * inputs.churnRate / 100), lostCustomers: Math.round(inputs.customers * inputs.churnRate / 100) });
    const arpu = calculateARPU({ mrr: mrr.mrr, totalCustomers: inputs.customers });
    return { mrr, cac, ltv, churn, arpu };
  }, [inputs]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="font-heading text-3xl font-bold mb-2">SaaS Metrics Dashboard</h1>
      <p className="text-gray-600 mb-8">
        Fill in your business metrics once and see all key SaaS calculations at a glance.
      </p>

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Input Form */}
        <div className="lg:w-96 space-y-5">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Your Metrics</h2>

            <div className="space-y-4">
              <InputField label="Customers" value={inputs.customers} onChange={(v) => update("customers", v)} />
              <InputField label="ARPU ($)" value={inputs.arpu} onChange={(v) => update("arpu", v)} />
              <InputField label="Monthly Churn Rate (%)" value={inputs.churnRate} onChange={(v) => update("churnRate", v)} />
              <InputField label="Gross Margin (%)" value={inputs.grossMargin} onChange={(v) => update("grossMargin", v)} />
              <hr className="border-gray-100" />
              <InputField label="Sales Costs ($)" value={inputs.salesCost} onChange={(v) => update("salesCost", v)} />
              <InputField label="Marketing Costs ($)" value={inputs.marketingCost} onChange={(v) => update("marketingCost", v)} />
              <InputField label="New Customers/Mo" value={inputs.newCustomers} onChange={(v) => update("newCustomers", v)} />
            </div>

            <button
              type="button"
              onClick={() => setInputs(defaultInputs)}
              className="mt-4 text-sm text-brand-600 hover:text-brand-700 underline"
            >
              Reset defaults
            </button>
          </div>
        </div>

        {/* Results Grid */}
        <div className="flex-1 grid gap-4 sm:grid-cols-2">
          <ResultCard
            title="Monthly Recurring Revenue"
            value={formatCurrency(results.mrr.mrr)}
            subtitle={`ARR: ${formatCurrency(results.mrr.arr)}`}
            href="/revenue/mrr-calculator"
            params={`customers=${inputs.customers}&arpu=${inputs.arpu}`}
          />
          <ResultCard
            title="Customer Acquisition Cost"
            value={formatCurrency(results.cac.cac)}
            href="/growth-efficiency/cac-calculator"
            params={`salesCost=${inputs.salesCost}&marketingCost=${inputs.marketingCost}&newCustomers=${inputs.newCustomers}`}
          />
          <ResultCard
            title="Customer Lifetime Value"
            value={formatCurrency(results.ltv.ltv)}
            subtitle={`LTV:CAC Ratio: ${results.ltv.ltvCacRatio.toFixed(1)}`}
            href="/revenue/ltv-calculator"
            params={`arpu=${inputs.arpu}&grossMargin=${inputs.grossMargin}&churnRate=${inputs.churnRate}`}
          />
          <ResultCard
            title="Monthly Churn Rate"
            value={formatPercent(results.churn.monthlyChurnPct)}
            subtitle={`Annual: ${formatPercent(results.churn.annualChurnPct)}`}
            href="/churn-retention/churn-calculator"
            params={`customersStart=${inputs.customers}&customersEnd=${inputs.customers - Math.round(inputs.customers * inputs.churnRate / 100)}&lostCustomers=${Math.round(inputs.customers * inputs.churnRate / 100)}`}
          />
          <ResultCard
            title="Average Revenue Per User"
            value={formatCurrency(results.arpu.arpu)}
            href="/revenue/arpu-calculator"
            params={`mrr=${inputs.arpu * inputs.customers}&totalCustomers=${inputs.customers}`}
          />
        </div>
      </div>
    </div>
  );
}

function InputField({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
      />
    </div>
  );
}

function ResultCard({ title, value, subtitle, href, params }: { title: string; value: string; subtitle?: string; href: string; params: string }) {
  return (
    <Link
      href={`${href}?${params}`}
      className="block rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
    >
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{title}</p>
      <p className="mt-2 font-heading text-2xl font-bold text-gray-900">{value}</p>
      {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
      <p className="mt-3 text-xs text-brand-600 font-medium">Explore in detail &rarr;</p>
    </Link>
  );
}
