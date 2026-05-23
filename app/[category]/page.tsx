import { getCalculatorsByCategory, getCategories } from "@/lib/registry";
import Link from "next/link";
import { CalculatorSearch } from "@/components/CalculatorSearch";

// Import calculator configs to register them in the registry
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

interface PageProps {
  params: Promise<{ category: string }>;
}

export async function generateStaticParams() {
  const categories = getCategories();
  return categories.map((cat) => ({ category: cat }));
}

export async function generateMetadata({ params }: PageProps) {
  const { category } = await params;

  const descriptions: Record<string, string> = {
    revenue: "Track and forecast your SaaS revenue metrics including MRR, ARR, ARPU, LTV, NRR, MRR growth rate, ACV, and trial-to-paid conversion with free instant calculators.",
    "unit-economics": "Calculate customer acquisition cost (CAC), LTV:CAC ratio, contribution margin, payback period, operating margin, and net cash flow to understand your SaaS unit economics.",
    "churn-retention": "Measure customer churn rate, logo churn vs revenue churn, customer health score, and net revenue retention with free interactive calculators benchmarked for B2B SaaS.",
    "growth-efficiency": "Benchmark your SaaS growth efficiency with calculators for quick ratio, magic number, rule of 40, burn rate, NPS, activation rate, revenue per employee, and lead conversion rate.",
  };

  return {
    title: `${category === "unit-economics" ? "Unit Economics" : category === "churn-retention" ? "Churn & Retention" : category === "growth-efficiency" ? "Growth Efficiency" : category.charAt(0).toUpperCase() + category.slice(1)} Calculators`,
    description: descriptions[category] ?? `Browse our collection of ${category} calculators for SaaS metrics.`,
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { category } = await params;
  const calculators = getCalculatorsByCategory(category);
  const categoryName = category.charAt(0).toUpperCase() + category.slice(1);

  if (calculators.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="text-3xl font-bold capitalize mb-2">{categoryName} Calculators</h1>
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-12 text-center">
          <p className="text-lg text-gray-600">Calculators in this category are coming soon.</p>
          <Link href="/" className="mt-4 inline-block text-sm text-brand-600 hover:text-brand-700 underline">
            Browse other categories &rarr;
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-bold capitalize mb-2">{category} Calculators</h1>
      <p className="text-gray-600 mb-6">
        Browse our collection of {category.toLowerCase()} calculators to help analyze your SaaS metrics.
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
          placeholder={`Search ${category} calculators...`}
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
              <h2 className="text-lg font-semibold text-gray-900 group-hover:text-brand-600 transition-colors">{calc.meta.title}</h2>
              {calc.premium && (
                <span className="rounded-full bg-brand-100 px-2 py-0.5 text-xs font-medium text-brand-600">Pro</span>
              )}
            </div>
            <p className="mt-2 text-sm text-gray-600">{calc.meta.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
