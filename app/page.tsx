import Link from "next/link";
import { getAllCalculators, getAllKnownCategories, CATEGORY_META } from "@/lib/registry";
import { CalculatorSearch } from "@/components/CalculatorSearch";
import { CategoryIcon } from "@/components/CategoryIcon";


import "@/calculators/config/_all";

function SectionLabel({ num }: { num: number }) {
  return (
    <span className="font-numbers text-4xl font-bold text-brand-500" aria-hidden>
      {num}
    </span>
  );
}

const popularCalculators = [
  { slug: "mrr-calculator", category: "revenue" },
  { slug: "churn-calculator", category: "churn-retention" },
  { slug: "cac-ltv-ratio-calculator", category: "unit-economics" },
  { slug: "quick-ratio-calculator", category: "growth-efficiency" },
  { slug: "nps-calculator", category: "churn-retention" },
  { slug: "burn-rate-calculator", category: "unit-economics" },
];

export default function Home() {
  const calculators = getAllCalculators();
  const categories = getAllKnownCategories();
  const calcBySlug = Object.fromEntries(calculators.map((c) => [`${c.category}/${c.slug}`, c]));
  const totalCount = calculators.length;
  const countByCategory = (slug: string) => calculators.filter((c) => c.category === slug).length;

  return (
    <div className="flex flex-col flex-1">
      {/* § HERO */}
      <section className="relative overflow-hidden px-4 py-24 sm:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-950 via-brand-900 to-brand-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_#00838720,_transparent_50%)]" />
        <div className="relative mx-auto max-w-5xl text-center">
          <h1 className="font-heading text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
            <span className="font-numbers">Know</span> your numbers.
            <br />
              <span className="bg-gradient-to-r from-brand-300 to-brand-400 bg-clip-text text-transparent">
                Sustain your <span className="font-numbers">growth</span>.
              </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-brand-300">
            <span className="font-numbers">{totalCount}</span> calculators for builders, operators, and creators.
            Enter your numbers  -  get an answer in your browser. All free, all private.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/revenue/mrr-calculator"
              className="rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-500/25 transition-all hover:shadow-xl hover:shadow-brand-500/30 hover:scale-105"
            >
              Start Calculating
            </Link>
            <Link
              href="/calculators"
              className="rounded-xl border border-brand-400/30 bg-white/5 px-8 py-3 text-sm font-medium text-white backdrop-blur-sm transition-all hover:bg-white/10"
            >
              Browse All &rarr;
            </Link>
          </div>
          <div className="mt-8 flex justify-center">
            <CalculatorSearch
              calculators={calculators.map((c) => ({
                slug: c.slug,
                category: c.category,
                title: c.meta.title,
                description: c.meta.description,
              }))}
            />
          </div>
          <div className="mt-16 grid grid-cols-3 gap-8 border-t border-brand-800/50 pt-10">
            <div>
              <p className="font-numbers text-5xl font-extrabold tracking-tight text-white sm:text-6xl ">{totalCount}</p>
              <p className="mt-1 text-sm font-medium uppercase tracking-wider text-brand-300">free calculators</p>
            </div>
            <div>
              <p className="font-numbers text-5xl font-extrabold tracking-tight text-white sm:text-6xl ">{categories.length}</p>
              <p className="mt-1 text-sm font-medium uppercase tracking-wider text-brand-300">categories</p>
            </div>
            <div>
              <p className="font-numbers text-5xl font-extrabold tracking-tight text-white sm:text-6xl ">$0</p>
              <p className="mt-1 text-sm font-medium uppercase tracking-wider text-brand-300">to start</p>
            </div>
          </div>
        </div>
      </section>


      {/* § 01 · POPULAR */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <SectionLabel num={1} />
          <h2 className="font-heading mt-2 text-3xl font-bold text-gray-900">Popular calculators</h2>
          <p className="mt-3 text-gray-500">Top picks to get you started.</p>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {popularCalculators.map(({ slug, category }) => {
              const calc = calcBySlug[`${category}/${slug}`];
              if (!calc) return null;
              return (
                <Link
                  key={slug}
                  href={`/${category}/${slug}`}
                  className="group rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
                >
                  <span className="text-xs font-medium uppercase tracking-wider text-brand-500">
                    {CATEGORY_META[calc.category]?.name ?? calc.category}
                  </span>
                  <h3 className="mt-2 font-heading text-lg font-semibold text-gray-900 group-hover:text-brand-600 transition-colors">
                    {calc.meta.title}
                  </h3>
                  <p className="mt-1.5 text-sm text-gray-600 line-clamp-2">{calc.meta.description}</p>
                  <span className="mt-4 inline-flex items-center text-sm font-medium text-brand-600 opacity-0 transition-opacity group-hover:opacity-100">
                    Open calculator &rarr;
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* § 02 · CATEGORIES */}
      <section className="bg-gray-50 px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <SectionLabel num={2} />
          <h2 className="font-heading mt-2 text-3xl font-bold text-gray-900">Browse by category</h2>
          <p className="mt-3 text-gray-500">
            <span className="font-numbers">{categories.length}</span> categories, <span className="font-numbers">{totalCount}</span> calculators. Pick your path.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat) => {
              const meta = CATEGORY_META[cat];
              const count = countByCategory(cat);
              return (
                <Link
                  key={cat}
                  href={`/${cat}`}
                  className="group relative rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-lg hover:-translate-y-1"
                >
                  <CategoryIcon identifier={meta?.icon} className="w-10 h-10" />
                  <div className="mt-4 flex items-center justify-between">
                    <h3 className="font-heading text-lg font-semibold text-gray-900">{meta?.name ?? cat}</h3>
                    <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-medium text-brand-600">
                      <span className="font-numbers">{count}</span>
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">{meta?.description}</p>
                </Link>
              );
            })}
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/calculators"
              className="inline-flex items-center gap-1 rounded-xl border border-gray-200 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
            >
              See all <span className="font-numbers">{totalCount}</span> calculators &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* § 03 · HOW IT WORKS */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <SectionLabel num={3} />
          <h2 className="font-heading mt-2 text-3xl font-bold text-gray-900">
            Three steps. No friction.
          </h2>
          <div className="mt-14 grid gap-10 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-100 text-xl font-bold text-brand-600">
                <span className="font-numbers">I</span>
              </div>
              <h3 className="mt-6 font-heading text-lg font-semibold text-gray-900">Pick a calculator</h3>
              <p className="mt-2 text-sm text-gray-500 leading-relaxed">
                From AI costs to FIRE plans  -  all <span className="font-numbers">{totalCount}</span> are free, forever. No signup gate.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-100 text-xl font-bold text-brand-600">
                <span className="font-numbers">II</span>
              </div>
              <h3 className="mt-6 font-heading text-lg font-semibold text-gray-900">Type your numbers</h3>
              <p className="mt-2 text-sm text-gray-500 leading-relaxed">
                Results update live in your browser as you type. Nothing leaves your device.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-100 text-xl font-bold text-brand-600">
                <span className="font-numbers">III</span>
              </div>
              <h3 className="mt-6 font-heading text-lg font-semibold text-gray-900">Act on it</h3>
              <p className="mt-2 text-sm text-gray-500 leading-relaxed">
                Save results, embed on your site, or share with your team. No account needed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* § 04 · BY THE NUMBERS */}
      <section className="bg-gray-50 px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <SectionLabel num={4} />
          <h2 className="font-heading mt-2 text-3xl font-bold text-gray-900">
            The ledger
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm text-center">
              <p className="font-numbers text-3xl font-bold text-gray-900">{totalCount}</p>
              <p className="mt-1 text-sm text-gray-500">calculators in catalog</p>
              <p className="text-xs text-gray-500 mt-1">across <span className="font-numbers">{categories.length}</span> categories</p>
            </div>
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm text-center">
              <p className="font-numbers text-3xl font-bold text-gray-900">{totalCount * 4}</p>
              <p className="mt-1 text-sm text-gray-500">calculation benchmarks</p>
              <p className="text-xs text-gray-500 mt-1">industry-standard data</p>
            </div>
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm text-center">
              <p className="font-numbers text-3xl font-bold text-gray-900">$0</p>
              <p className="mt-1 text-sm text-gray-500">always free</p>
              <p className="text-xs text-gray-500 mt-1">no paywalls, no tiers</p>
            </div>
          </div>
        </div>
      </section>


      {/* § 06 · CTA */}
      <section className="bg-gradient-to-r from-brand-900 to-brand-800 px-4 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <SectionLabel num={5} />
          <h2 className="font-heading mt-2 text-3xl font-bold text-white">
            Start building.
          </h2>
          <p className="mt-4 text-brand-300">
            All <span className="font-numbers">{totalCount}</span> calculators are completely free. No subscriptions, no signups.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/calculators"
              className="rounded-xl bg-white px-8 py-3 text-sm font-semibold text-brand-800 shadow-lg transition-all hover:shadow-xl hover:scale-105"
            >
              Browse Calculators
            </Link>

          </div>
        </div>
      </section>
    </div>
  );
}
