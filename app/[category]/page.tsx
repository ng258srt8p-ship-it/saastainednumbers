import { getCalculatorsByCategory, getCategories, CATEGORY_META, getAllKnownCategories, getCategoryTranslationKey } from "@/lib/registry";
import { resolveLocaleConfig } from "@/lib/resolve-calculator-locale";
import type { SupportedLocale } from "@/calculators/config/calculator-schema";
import Link from "next/link";
import { CalculatorSearch } from "@/components/CalculatorSearch";
import { CalculatorCard } from "@/components/CalculatorCard";
import { Breadcrumb } from "@/components/Breadcrumb";
import { alternateLanguages, localeUrl } from "@/lib/locale-url";
import { getTranslations } from "@/lib/getTranslations";
import { redirect } from "next/navigation";

import "@/calculators/config/_all";

interface PageProps {
  params: Promise<{ category: string }>;
}

export async function generateStaticParams() {
  const registered = getCategories();
  const known = getAllKnownCategories();
  const all = new Set([...registered, ...known]);
  return Array.from(all).map((cat) => ({ category: cat }));
}

function CATEGORY_ICON(category: string) {
  const icons: Record<string, string> = {
    revenue: "chart",
    "unit-economics": "calculate",
    "churn-retention": "person_off",
    "growth-efficiency": "trending_up",
    "ai-cost": "neurology",
    "side-hustle": "work",
    "personal-finance": "account_balance",
    "general-business": "business",
    "saas-deepen": "insights",
  };
  return icons[category] || "calculator";
}

// ─── Category Page ───
export default async function CategoryPage({ params }: PageProps) {
  const { category } = await params;
  const { t, locale } = await getTranslations();
  if (category === calculatorsLabel) {
    redirect("/calculators");
  }
  const calculators = getCalculatorsByCategory(category);
  const meta = CATEGORY_META[category];
  const categoryName = t("category." + getCategoryTranslationKey(category));
  const allCategories = getAllKnownCategories().filter((c) => getCalculatorsByCategory(c).length > 0);

  if (calculators.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="font-heading text-3xl font-bold mb-2">{categoryName} {calculatorsLabel}</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">{meta?.description}</p>
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 p-12 text-center">
          <p className="text-lg text-gray-600 dark:text-gray-400">{t("category.comingSoon")}</p>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{t("category.buildingNow")}</p>
          <Link href="/" className="mt-6 inline-block text-sm font-medium text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 underline">
            {t("category.browseAll")}
          </Link>
        </div>
      </div>
    );
  }

  // Schema.org structured data
  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: `${categoryName} ${calculatorsLabel}`,
    description: meta?.description ?? `${categoryName} calculators for SaaS and business metrics.`,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD", availability: "https://schema.org/OnlineOnly" },
    url: `https://saastainednumbers.com/${category}`,
  };

  const itemListSchema = {
    "@type": "ItemList",
    name: `${categoryName} ${calculatorsLabel}`,
    description: meta?.description ?? "",
    url: `https://saastainednumbers.com/${category}`,
    numberOfItems: calculators.length,
    itemListElement: calculators.map((calc, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: calc.meta.title,
      url: `https://saastainednumbers.com/${calc.category}/${calc.slug}`,
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@graph": [webAppSchema, itemListSchema].filter(Boolean) }) }} />
      <div className="mx-auto max-w-6xl px-4 py-12">
        <Breadcrumb items={[
          { label: t("common.home"), href: "/" },
          { label: categoryName, href: `/${category}` },
        ]} />

        {/* Layout: sidebar + main content */}
        <div className="flex gap-8 mt-6">
          {/* Sidebar — category navigation */}
          <aside className="hidden lg:block w-56 shrink-0">
            <nav className="sticky top-24 space-y-1">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3">
                {t("footer.categories")}
              </h3>
              {allCategories.map((cat) => {
                const catName = t("category." + getCategoryTranslationKey(cat));
                const count = getCalculatorsByCategory(cat).length;
                const isActive = cat === category;
                return (
                  <Link
                    key={cat}
                    href={`/${cat}`}
                    className={`flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                      isActive
                        ? "bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm leading-none" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 20" }}>
                        {CATEGORY_ICON(cat)}
                      </span>
                      {catName}
                    </span>
                    <span className="text-[10px] text-gray-400 dark:text-gray-500">{count}</span>
                  </Link>
                );
              })}
            </nav>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            <h1 className="font-heading text-3xl font-bold mb-2">{categoryName} {calculatorsLabel}</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-2">{meta?.description}</p>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 dark:bg-brand-950/50 px-3 py-1 text-xs font-medium text-brand-700 dark:text-brand-300 mb-6">
              <span className="material-symbols-outlined text-sm leading-none" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 20" }}>verified</span>
              {t("category.noSignup")}
            </div>

            <div className="mb-8">
              <CalculatorSearch
                calculators={calculators.map((c) => {
                  const resolved = resolveLocaleConfig(c, locale as SupportedLocale);
                  return { slug: c.slug, category: c.category, title: resolved.meta.title, description: resolved.meta.description };
                })}
                placeholder={t("category.searchPlaceholder")}
                ariaLabel={t("search.ariaLabel")}
                resultsLabel={t("search.resultsFound")}
              />
            </div>

            {/* Card grid */}
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {calculators.map((calc) => {
                const resolved = resolveLocaleConfig(calc, locale as SupportedLocale);
                return (
                  <CalculatorCard
                    key={calc.slug}
                    calc={{
                      slug: calc.slug,
                      category: calc.category,
                      isNew: calc.isNew,
                      meta: { title: resolved.meta.title, description: resolved.meta.description },
                    }}
                    categoryLabel={categoryName}
                    newLabel={t("common.new")}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
