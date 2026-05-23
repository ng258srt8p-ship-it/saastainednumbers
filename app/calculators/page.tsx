import { getAllCalculators } from "@/lib/registry";
import { CalculatorSearch } from "@/components/CalculatorSearch";
import Link from "next/link";

import "@/calculators/config/mrr-calculator";
import "@/calculators/config/cac-calculator";
import "@/calculators/config/ltv-calculator";
import "@/calculators/config/churn-calculator";
import "@/calculators/config/arpu-calculator";
import "@/calculators/config/burn-rate-calculator";
import "@/calculators/config/payback-period-calculator";
import "@/calculators/config/nrr-calculator";
import "@/calculators/config/gross-margin-calculator";
import "@/calculators/config/quick-ratio-calculator";
import "@/calculators/config/cac-ltv-ratio-calculator";
import "@/calculators/config/magic-number-calculator";
import "@/calculators/config/rule-of-40-calculator";
import "@/calculators/config/contribution-margin-calculator";
import "@/calculators/config/operating-margin-calculator";
import "@/calculators/config/revenue-per-employee-calculator";
import "@/calculators/config/mrr-growth-rate-calculator";
import "@/calculators/config/acv-calculator";
import "@/calculators/config/customer-health-score-calculator";
import "@/calculators/config/nps-calculator";
import "@/calculators/config/activation-rate-calculator";
import "@/calculators/config/trial-to-paid-calculator";
import "@/calculators/config/expansion-revenue-rate-calculator";
import "@/calculators/config/net-cash-flow-calculator";
import "@/calculators/config/lead-conversion-rate-calculator";

export const metadata = {
  title: "All Calculators — Saasifactory",
  description: "Browse all 25 free SaaS calculators for MRR, CAC, LTV, churn, NRR, and more. No account required.",
};

export default function CalculatorsPage() {
  const calculators = getAllCalculators();

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">All Calculators</h1>
      <p className="text-gray-600 mb-6">
        Browse our complete collection of 25 SaaS calculators.
      </p>
      <div className="mb-8">
        <CalculatorSearch
          calculators={calculators.map((c) => ({
            slug: c.slug,
            category: c.category,
            title: c.meta.title,
            description: c.meta.description,
            premium: c.premium,
          }))}
          placeholder="Search all 25 calculators..."
        />
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        {calculators.map((calc) => (
          <Link
            key={calc.slug}
            href={`/${calc.category}/${calc.slug}`}
            className="group rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 group-hover:text-brand-600 transition-colors">
                {calc.meta.title}
              </h2>
              {calc.premium && (
                <span className="rounded-full bg-brand-100 px-2 py-0.5 text-xs font-medium text-brand-600">
                  Pro
                </span>
              )}
            </div>
            <p className="mt-2 text-sm text-gray-600">{calc.meta.description}</p>
            <span className="mt-3 inline-block text-xs text-gray-500 capitalize">
              {calc.category.replace("-", " & ")}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
