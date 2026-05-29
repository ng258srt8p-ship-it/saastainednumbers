import type { Metadata } from "next";
import Link from "next/link";
import { getAllCalculators, getAllKnownCategories, CATEGORY_META } from "@/lib/registry";
import { CalculatorSearch } from "@/components/CalculatorSearch";
import { CategoryIcon } from "@/components/CategoryIcon";
import { alternateLanguages, localeUrl } from "@/lib/locale-url";
import { getTranslations } from "@/lib/getTranslations";

const CALC_COUNT = getAllCalculators().length;
const CAT_COUNT = getAllKnownCategories().length;

export const metadata: Metadata = {
  title: "SaaStainedNumbers  -  Free Calculators for Builders & Creators",
  description: `${CALC_COUNT} free, instant calculators for SaaS metrics, AI costs, side hustle income, personal finance, and more. No account or sign-up required.`,
  alternates: {
    canonical: localeUrl("/"),
    languages: alternateLanguages("/"),
  },
  openGraph: {
    title: "SaaStainedNumbers  -  Free Calculators for Builders & Creators",
    description: `${CALC_COUNT} free, instant calculators for SaaS metrics, AI costs, side hustle income, personal finance, and more. No account or sign-up required.`,
    images: ["/api/og?title=SaaStainedNumbers&category=home"],
  },
  twitter: {
    card: "summary_large_image",
    title: "SaaStainedNumbers  -  Free Calculators for Builders & Creators",
    description: `${CALC_COUNT} free, instant calculators for SaaS metrics, AI costs, side hustle income, personal finance, and more. No account or sign-up required.`,
    images: ["/api/og?title=SaaStainedNumbers&category=home"],
  },
};


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

export default async function Home() {
  const { t } = await getTranslations();
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
            <span className="font-numbers">{totalCount}</span> {t("home.heroSubtitle")}
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/revenue/mrr-calculator"
              className="rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-500/25 transition-all hover:shadow-xl hover:shadow-brand-500/30 hover:scale-105"
            >
              {t("home.startCalculating")}
            </Link>
            <Link
              href="/calculators"
              className="rounded-xl border border-brand-400/30 bg-white/5 px-8 py-3 text-sm font-medium text-white backdrop-blur-sm transition-all hover:bg-white/10"
            >
              {t("home.browseAll")}
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
              <p className="mt-1 text-sm font-medium uppercase tracking-wider text-brand-300">{t("home.freeCalculators")}</p>
            </div>
            <div>
              <p className="font-numbers text-5xl font-extrabold tracking-tight text-white sm:text-6xl ">{categories.length}</p>
              <p className="mt-1 text-sm font-medium uppercase tracking-wider text-brand-300">{t("home.categories")}</p>
            </div>
            <div>
              <p className="font-numbers text-5xl font-extrabold tracking-tight text-white sm:text-6xl ">$0</p>
              <p className="mt-1 text-sm font-medium uppercase tracking-wider text-brand-300">{t("home.toStart")}</p>
            </div>
          </div>
        </div>
      </section>


      {/* § 01 · POPULAR */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <SectionLabel num={1} />
          <h2 className="font-heading mt-2 text-3xl font-bold text-gray-900 dark:text-gray-100">{t("home.popularCalculators")}</h2>
          <p className="mt-3 text-gray-500 dark:text-gray-400">{t("home.popularSubtitle")}</p>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {popularCalculators.map(({ slug, category }) => {
              const calc = calcBySlug[`${category}/${slug}`];
              if (!calc) return null;
              return (
                <Link
                  key={slug}
                  href={`/${category}/${slug}`}
                  className="group rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
                >
                  <span className="text-xs font-medium uppercase tracking-wider text-brand-500 dark:text-brand-400">
                    {CATEGORY_META[calc.category]?.name ?? calc.category}
                  </span>
                  <h3 className="mt-2 font-heading text-lg font-semibold text-gray-900 dark:text-gray-100 group-hover:text-brand-600 transition-colors flex items-center gap-2">
                    {calc.meta.title}
                    {calc.isNew && (
                      <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-100 dark:bg-amber-900/40 px-2 py-0.5 text-xs font-medium text-amber-700 dark:text-amber-300 shrink-0">
                        <span className="material-symbols-outlined text-sm leading-none" style={{ fontVariationSettings: "'FILL' 1, 'wght' 500, 'GRAD' 0, 'opsz' 20" }}>star</span>
                        New
                      </span>
                    )}
                  </h3>
                  <p className="mt-1.5 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{calc.meta.description}</p>
                  <span className="mt-4 inline-flex items-center text-sm font-medium text-brand-600 dark:text-brand-400 opacity-0 transition-opacity group-hover:opacity-100">
                    {t("home.openCalculator")}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* § 02 · CATEGORIES */}
      <section className="bg-gray-50 dark:bg-gray-900/50 px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <SectionLabel num={2} />
          <h2 className="font-heading mt-2 text-3xl font-bold text-gray-900 dark:text-gray-100">{t("home.browseByCategory")}</h2>
          <p className="mt-3 text-gray-500 dark:text-gray-400">
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
                  className="group relative rounded-2xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm transition-all hover:shadow-lg hover:-translate-y-1"
                >
                  <CategoryIcon identifier={meta?.icon} className="w-10 h-10" />
                  <div className="mt-4 flex items-center justify-between">
                    <h3 className="font-heading text-lg font-semibold text-gray-900 dark:text-gray-100">{meta?.name ?? cat}</h3>
                    <span className="rounded-full bg-brand-50 dark:bg-brand-900/40 px-2.5 py-0.5 text-xs font-medium text-brand-600 dark:text-brand-300">
                      <span className="font-numbers">{count}</span>
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{meta?.description}</p>
                </Link>
              );
            })}
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/calculators"
              className="inline-flex items-center gap-1 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-6 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
            >
              {t("home.seeAllCalculators").replace("{n}", String(totalCount))}
            </Link>
          </div>
        </div>
      </section>

      {/* § 03 · HOW IT WORKS */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <SectionLabel num={3} />
          <h2 className="font-heading mt-2 text-3xl font-bold text-gray-900 dark:text-gray-100">
            {t("home.threeSteps")}
          </h2>
          <div className="mt-14 grid gap-10 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-100 dark:bg-brand-900/40 text-xl font-bold text-brand-600 dark:text-brand-300">
                <span className="font-numbers">I</span>
              </div>
              <h3 className="mt-6 font-heading text-lg font-semibold text-gray-900 dark:text-gray-100">{t("home.stepPick")}</h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                {t("home.pickDescription").replace("{n}", String(totalCount))}
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-100 dark:bg-brand-900/40 text-xl font-bold text-brand-600 dark:text-brand-300">
                <span className="font-numbers">II</span>
              </div>
              <h3 className="mt-6 font-heading text-lg font-semibold text-gray-900 dark:text-gray-100">{t("home.stepType")}</h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                {t("home.typeDescription")}
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-100 dark:bg-brand-900/40 text-xl font-bold text-brand-600 dark:text-brand-300">
                <span className="font-numbers">III</span>
              </div>
              <h3 className="mt-6 font-heading text-lg font-semibold text-gray-900 dark:text-gray-100">{t("home.stepAct")}</h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                {t("home.actDescription")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* § 04 · BY THE NUMBERS */}
      <section className="bg-gray-50 dark:bg-gray-900/50 px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <SectionLabel num={4} />
          <h2 className="font-heading mt-2 text-3xl font-bold text-gray-900 dark:text-gray-100">
            {t("home.theLedger")}
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm text-center">
              <p className="font-numbers text-3xl font-bold text-gray-900 dark:text-gray-100">{totalCount}</p>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{t("home.calculatorsInCatalog")}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t("home.acrossCategories")} <span className="font-numbers">{categories.length}</span> {t("home.categories").toLowerCase()}</p>
            </div>
            <div className="rounded-2xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm text-center">
              <p className="font-numbers text-3xl font-bold text-gray-900 dark:text-gray-100">{totalCount * 4}</p>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{t("home.calculationBenchmarks")}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t("home.industryStandardData")}</p>
            </div>
            <div className="rounded-2xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm text-center">
              <p className="font-numbers text-3xl font-bold text-gray-900 dark:text-gray-100">$0</p>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{t("home.alwaysFree")}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t("home.noPaywalls")}</p>
            </div>
          </div>
        </div>
      </section>


      {/* § 06 · CTA */}
      <section className="bg-gradient-to-r from-brand-900 to-brand-800 px-4 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <SectionLabel num={5} />
          <h2 className="font-heading mt-2 text-3xl font-bold text-white">
            {t("home.startBuilding")}
          </h2>
          <p className="mt-4 text-brand-300">
            {t("home.allFree").replace("{n}", String(totalCount))}
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/calculators"
              className="rounded-xl bg-white dark:bg-gray-800 px-8 py-3 text-sm font-semibold text-brand-800 dark:text-brand-200 shadow-lg transition-all hover:shadow-xl hover:scale-105"
            >
              {t("home.browseCalculators")}
            </Link>

          </div>
        </div>
      </section>
    </div>
  );
}
