import Link from "next/link";
import { getAllCalculators } from "@/lib/registry";
import { CalculatorSearch } from "@/components/CalculatorSearch";

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

const allCategories = [
  { name: "Revenue Metrics", slug: "revenue", description: "MRR, ARR, ARPU, and revenue analysis calculators", icon: "📈" },
  { name: "Unit Economics", slug: "unit-economics", description: "CAC, LTV, payback period, gross margin, and burn rate", icon: "📊" },
  { name: "Churn & Retention", slug: "churn-retention", description: "Monthly churn, annual churn, and customer retention", icon: "🔄" },
  { name: "Growth & Efficiency", slug: "growth-efficiency", description: "CAC, quick ratio, and customer acquisition efficiency", icon: "🚀" },
];

export default function Home() {
  const calculators = getAllCalculators();
  const totalCount = calculators.length;
  const countByCategory = (slug: string) => calculators.filter((c) => c.category === slug).length;

  return (
    <div className="flex flex-col flex-1">
      <section className="relative overflow-hidden px-4 py-24 sm:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-950 via-brand-900 to-brand-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_#00848820,_transparent_50%)]" />
        <div className="relative mx-auto max-w-5xl text-center">
          <h1 className="font-heading text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            SaaS Calculators for{" "}
            <span className="bg-gradient-to-r from-brand-300 to-brand-400 bg-clip-text text-transparent">
              Smart Decisions
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-brand-300">
            Free, instant calculators for MRR, CAC, LTV, churn, and more. No account required.
            Your data never leaves your device.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/revenue/mrr-calculator"
              className="rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-500/25 transition-all hover:shadow-xl hover:shadow-brand-500/30 hover:scale-105"
            >
              Start Calculating
            </Link>
            <Link
              href="/dashboard"
              className="rounded-xl border border-brand-400/30 bg-white/5 px-8 py-3 text-sm font-medium text-white backdrop-blur-sm transition-all hover:bg-white/10"
            >
              Explore Dashboard
            </Link>
          </div>
          <div className="mt-10 flex justify-center">
            <CalculatorSearch
              calculators={calculators.map((c) => ({
                slug: c.slug,
                category: c.category,
                title: c.meta.title,
                description: c.meta.description,
                premium: c.premium,
              }))}
            />
          </div>
          <div className="mt-16 grid grid-cols-3 gap-8 border-t border-brand-800/50 pt-10">
            <div>
              <p className="font-heading text-4xl font-bold text-white">{totalCount}</p>
              <p className="mt-1 text-sm text-brand-300">Calculators</p>
            </div>
            <div>
              <p className="font-heading text-4xl font-bold text-white">4</p>
              <p className="mt-1 text-sm text-brand-300">Categories</p>
            </div>
            <div>
              <p className="font-heading text-4xl font-bold text-white">Free</p>
              <p className="mt-1 text-sm text-brand-300">No Account Needed</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <h2 className="font-heading text-3xl font-bold text-gray-900">
              Browse by Category
            </h2>
            <p className="mt-3 text-gray-500">
              Find the right calculator for your needs across {totalCount} calculators.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {allCategories.map((cat) => {
              const count = countByCategory(cat.slug);
              return (
                <Link
                  key={cat.slug}
                  href={`/${cat.slug}`}
                  className="group relative rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-lg hover:-translate-y-1"
                >
                  <span className="text-2xl">{cat.icon}</span>
                  <div className="mt-4 flex items-center justify-between">
                    <h3 className="font-heading text-lg font-semibold text-gray-900">{cat.name}</h3>
                    <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-medium text-brand-600">
                      {count}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">{cat.description}</p>
                  <div className="mt-4 flex items-center gap-1 text-sm font-medium text-brand-600 opacity-0 transition-opacity group-hover:opacity-100">
                    Browse calculators
                    <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
                  </div>
                </Link>
              );
            })}
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/calculators"
              className="inline-flex items-center gap-1 rounded-xl border border-gray-200 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
            >
              View All {totalCount} Calculators
              <span>&rarr;</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <h2 className="font-heading text-3xl font-bold text-gray-900">
              Why Saasifactory?
            </h2>
            <p className="mt-3 text-gray-500">
              Built for SaaS founders, operators, and finance teams.
            </p>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 text-sm">🔒</span>
              <h3 className="mt-4 font-heading text-base font-semibold text-gray-900">100% Private</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">
                All calculations run in your browser. Nothing leaves your device.
              </p>
            </div>
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-100 text-sm">⚡</span>
              <h3 className="mt-4 font-heading text-base font-semibold text-gray-900">Instant Results</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">
                No page reloads. No waiting. Results update as you type.
              </p>
            </div>
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-sm">📋</span>
              <h3 className="mt-4 font-heading text-base font-semibold text-gray-900">Embed Anywhere</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">
                Embed calculators on your site with a single iframe.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-r from-brand-900 to-brand-800 px-4 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-heading text-3xl font-bold text-white">
            Ready to Calculate Smarter?
          </h2>
          <p className="mt-4 text-brand-300">
            Start with our free calculators. Upgrade to Pro for all 25 calculators, unlimited embeds, and priority support.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/pricing"
              className="rounded-xl bg-white px-8 py-3 text-sm font-semibold text-brand-800 shadow-lg transition-all hover:shadow-xl hover:scale-105"
            >
              View Pricing
            </Link>
            <Link
              href="/request-calculator"
              className="rounded-xl border border-white/30 px-8 py-3 text-sm font-medium text-white backdrop-blur-sm transition-all hover:bg-white/10"
            >
              Request a Calculator
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
