import { getAllCalculators, getAllKnownCategories, CATEGORY_META, getCalculatorsByCategory } from "@/lib/registry";
import { CalculatorSearch } from "@/components/CalculatorSearch";
import { CategoryIcon } from "@/components/CategoryIcon";
import Link from "next/link";
import Script from "next/script";

import "@/calculators/config/_all";

export const metadata = {
  title: "All Calculators  -  SaaStainedNumbers",
  description: "Browse all free calculators for SaaS metrics, AI costs, side hustle income, personal finance, and more. No account required.",
};

export default function CalculatorsPage() {
  const calculators = getAllCalculators();
  const categories = getAllKnownCategories();

  return (
    <>
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4115230840067798"
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="font-heading text-3xl font-bold mb-2">All Calculators</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Browse our complete collection of {calculators.length} calculators across {categories.length} categories.
      </p>
      <div className="mb-10">
        <CalculatorSearch
          calculators={calculators.map((c) => ({
            slug: c.slug,
            category: c.category,
            title: c.meta.title,
            description: c.meta.description,
          }))}
          placeholder="Search all calculators..."
        />
      </div>


      <div className="space-y-12">
        {categories.map((cat) => {
          const catCalcs = getCalculatorsByCategory(cat);
          const meta = CATEGORY_META[cat];
          if (catCalcs.length === 0) return null;
          return (
            <section key={cat}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-heading text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <CategoryIcon identifier={meta?.icon} className="w-6 h-6" />
                  {meta?.name ?? cat}
                </h2>
                <Link href={`/${cat}`} className="text-sm font-medium text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300">
                  View all &rarr;
                </Link>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{meta?.description}</p>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {catCalcs.map((calc) => (
                  <Link
                    key={calc.slug}
                    href={`/${calc.category}/${calc.slug}`}
                    className="group rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
                  >
                    <h3 className="font-heading text-base font-semibold text-gray-900 group-hover:text-brand-600 transition-colors">
                      {calc.meta.title}
                    </h3>
                    <p className="mt-1.5 text-sm text-gray-600 line-clamp-2">{calc.meta.description}</p>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
    </>
  );
}
