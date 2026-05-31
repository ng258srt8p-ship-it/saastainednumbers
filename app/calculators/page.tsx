import type { Metadata } from "next";
import { getAllCalculators, getAllKnownCategories, CATEGORY_META, getCalculatorsByCategory, getCategoryTranslationKey } from "@/lib/registry";
import { resolveLocaleConfig } from "@/lib/resolve-calculator-locale";
import type { SupportedLocale } from "@/calculators/config/calculator-schema";
import { CalculatorSearch } from "@/components/CalculatorSearch";
import { CategoryIcon } from "@/components/CategoryIcon";
import Link from "next/link";
import { alternateLanguages, localeUrl } from "@/lib/locale-url";
import { getTranslations } from "@/lib/getTranslations";

import "@/calculators/config/_all";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getTranslations();
  const calculators = getAllCalculators();
  const categories = getAllKnownCategories();
  const title = `${t("category.all")} — SaaStainedNumbers`;
  const description = t("calculators.browseCollection")
    .replace("{n}", String(calculators.length))
    .replace("{m}", String(categories.length));
  return {
    title,
    description,
    alternates: {
      canonical: localeUrl("/calculators"),
      languages: alternateLanguages("/calculators"),
    },
    openGraph: {
      title,
      description,
      type: "website",
      images: ["/api/og?title=All+Calculators&category=home"],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/api/og?title=All+Calculators&category=home"],
    },
  };
}

export default async function CalculatorsPage() {
  const { t, locale } = await getTranslations();
  const calculators = getAllCalculators();
  const categories = getAllKnownCategories();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "WebApplication",
                name: "SaaStainedNumbers - All Calculators",
                description: "Free, instant calculators for SaaS metrics, AI costs, side hustle income, personal finance, and more. No account required.",
                applicationCategory: "BusinessApplication",
                operatingSystem: "Web",
                offers: { "@type": "Offer", price: "0", priceCurrency: "USD", availability: "https://schema.org/OnlineOnly" },
                url: "https://saastainednumbers.com/calculators",
              },
              {
                "@type": "ItemList",
                name: "All SaaStainedNumbers Calculators",
                numberOfItems: calculators.length,
                itemListElement: calculators.map((calc, i) => ({
                  "@type": "ListItem",
                  position: i + 1,
                  name: calc.meta.title,
                  url: `https://saastainednumbers.com/${calc.category}/${calc.slug}`,
                })),
              },
            ],
          }),
        }}
      />
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="font-heading text-3xl font-bold mb-2 text-gray-900 dark:text-gray-100">{t("category.all")}</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-2">
        {t("calculators.browseCollection").replace("{n}", String(calculators.length)).replace("{m}", String(categories.length))}
      </p>
      <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 dark:bg-brand-950/50 px-3 py-1 text-xs font-medium text-brand-700 dark:text-brand-300 mb-6">
        <span className="material-symbols-outlined text-sm leading-none" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 20" }}>verified</span>
        {t("category.noSignup")}
      </div>
      <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed max-w-3xl">
        {t("calculators.editorial")}
      </p>
      <div className="mb-10">
        <CalculatorSearch
          calculators={calculators.map((c) => {
            const resolved = resolveLocaleConfig(c, locale as SupportedLocale);
            return {
              slug: c.slug,
              category: c.category,
              title: resolved.meta.title,
              description: resolved.meta.description,
            };
          })}
          placeholder={t("calculators.searchPlaceholder")}
          ariaLabel={t("search.ariaLabel")}
          resultsLabel={t("search.resultsFound")}
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
                  {t("category." + getCategoryTranslationKey(cat))}
                </h2>
                <Link href={`/${cat}`} className="text-sm font-medium text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300">
                  {t("calculators.viewAll")}
                </Link>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{meta?.description}</p>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {catCalcs.map((calc) => {
                  const resolved = resolveLocaleConfig(calc, locale as SupportedLocale);
                  return (
                  <Link
                    key={calc.slug}
                    href={`/${calc.category}/${calc.slug}`}
                    className="group rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
                  >
                    <h3 className="font-heading text-base font-semibold text-gray-900 dark:text-gray-100 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors flex items-center gap-2">
                      {resolved.meta.title}
                      {calc.isNew && (
                        <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-100 dark:bg-amber-900/40 px-2 py-0.5 text-xs font-medium text-amber-700 dark:text-amber-300 shrink-0">
                          <span className="material-symbols-outlined text-sm leading-none" style={{ fontVariationSettings: "'FILL' 1, 'wght' 500, 'GRAD' 0, 'opsz' 20" }}>star</span>
                          {t("common.new")}
                        </span>
                      )}
                    </h3>
                    <p className="mt-1.5 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{resolved.meta.description}</p>
                  </Link>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
    </>
  );
}
