import { getCalculatorsByCategory, getCategories, CATEGORY_META, getAllKnownCategories, getCategoryTranslationKey } from "@/lib/registry";
import { resolveLocaleConfig } from "@/lib/resolve-calculator-locale";
import type { SupportedLocale } from "@/calculators/config/calculator-schema";
import Link from "next/link";
import { CalculatorSearch } from "@/components/CalculatorSearch";
import { Breadcrumb } from "@/components/Breadcrumb";
import { alternateLanguages, localeUrl } from "@/lib/locale-url";
import { getTranslations } from "@/lib/getTranslations";

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

export async function generateMetadata({ params }: PageProps) {
  const { category } = await params;
  const { t } = await getTranslations();
  const meta = CATEGORY_META[category];
  const name = t("category." + getCategoryTranslationKey(category));
  const calculatorsLabel = t("category.calculatorsLabel");

  const desc = meta?.description ?? `Browse our collection of ${category} calculators.`;
  return {
    title: `${name} ${calculatorsLabel}`,
    description: desc,
    alternates: {
      canonical: localeUrl(`/${category}`),
      languages: alternateLanguages(`/${category}`),
    },
    openGraph: {
      title: `${name} Calculators`,
      description: desc,
      type: "website",
      images: [`/api/og?title=${encodeURIComponent(name)}&category=${category}&description=${encodeURIComponent(desc)}`],
    },
    twitter: {
      card: "summary_large_image",
      title: `${name} Calculators`,
      description: desc,
      images: [`/api/og?title=${encodeURIComponent(name)}&category=${category}&description=${encodeURIComponent(desc)}`],
    },
  };
}

const CATEGORY_EDITORIAL: Record<string, string> = {
  revenue: `Understanding your revenue metrics is the foundation of SaaS financial management. 
MRR (Monthly Recurring Revenue), ARR (Annual Recurring Revenue), ARPU, and NRR tell you whether your business is growing sustainably. 
These metrics are what investors evaluate first — they reveal your pricing power, customer value, and revenue predictability. 
Use these calculators to track your revenue health, benchmark against industry standards, and identify opportunities for growth through pricing optimization and expansion revenue.`,
  "unit-economics": `Unit economics determine whether each customer relationship is profitable. 
CAC (Customer Acquisition Cost), LTV (Customer Lifetime Value), payback period, and gross margin tell you if your business model works at scale. 
Healthy unit economics mean you're spending efficiently to acquire customers and earning more from them over time. 
These calculators help you measure your per-customer profitability, benchmark against SaaS standards, and identify where to focus improvement efforts.`,
  "churn-retention": `Churn is the silent killer of SaaS businesses. Even a 1% improvement in monthly churn can double your customer lifetime value. 
Understanding your churn rate, retention rate, and customer health score is essential for predicting revenue and planning growth. 
These calculators help you measure customer attrition, identify at-risk accounts, and track the effectiveness of your retention strategies against industry benchmarks.`,
  "growth-efficiency": `Growth efficiency measures how effectively you convert investment into revenue. 
Your Quick Ratio, Magic Number, Rule of 40, and CAC efficiency tell investors whether your growth is sustainable or burning cash. 
The most valuable SaaS companies grow efficiently — they acquire customers at reasonable cost and retain them profitably. 
Use these calculators to measure your growth efficiency, benchmark against top-quartile companies, and optimize your sales and marketing spend.`,
  "ai-cost": `AI costs can quickly spiral without careful tracking. Whether you're using Claude, ChatGPT, Gemini, or Grok APIs, 
understanding your per-token costs, monthly API spend, and model comparison economics is critical for managing AI infrastructure budgets. 
These calculators help you estimate API costs by model, compare providers, and project monthly spending so you can optimize your AI stack without surprises.`,
  "side-hustle": `Side hustle income is becoming a primary revenue stream for millions of creators, freelancers, and entrepreneurs. 
Whether you're monetizing YouTube, Twitch, podcasting, newsletter subscriptions, Etsy, Amazon FBA, or freelance work, 
understanding your true earnings after fees, taxes, and expenses is essential. 
These calculators help you project income, estimate taxes, and optimize pricing across dozens of side hustle categories.`,
  "personal-finance": `Personal financial planning requires accurate projections and realistic assumptions. 
Whether you're pursuing FIRE (Financial Independence, Retire Early), saving for a down payment, paying off debt, 
or planning for retirement, these calculators give you data-driven answers to your biggest money questions. 
Use them to model different scenarios, understand trade-offs, and build a financial plan that works for your goals.`,
  "general-business": `Every business decision should be backed by numbers. Whether you're calculating break-even, 
evaluating ROI, pricing a product, comparing contractor vs employee costs, valuing your company, or 
managing cash runway, having accurate calculations makes the difference between guessing and knowing. 
These calculators cover the essential business math that founders and operators need to make confident decisions.`,
  "saas-deepen": `Beyond the basics — advanced SaaS metrics reveal the operational drivers of your business. 
Customer engagement scoring, feature adoption rates, time-to-value analysis, cohort retention, ARPU trends, 
and capital efficiency ratios help you understand not just what's happening, but why. 
These calculators are designed for operators who want to dig deeper into their metrics and find 
specific, actionable levers to improve their business performance.`,
};

export default async function CategoryPage({ params }: PageProps) {
  const { category } = await params;
  const { t, locale } = await getTranslations();
  const calculators = getCalculatorsByCategory(category);
  const meta = CATEGORY_META[category];
  const categoryName = t("category." + getCategoryTranslationKey(category));
  const calculatorsLabel = t("category.calculatorsLabel");
  const editorial = CATEGORY_EDITORIAL[category];

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

  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: `${categoryName} {calculatorsLabel}`,
    description: meta?.description ?? `${categoryName} calculators for SaaS and business metrics.`,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/OnlineOnly",
    },
    url: `https://saastainednumbers.com/${category}`,
  };

  const itemListSchema = {
    "@type": "ItemList",
    name: `${categoryName} {calculatorsLabel}`,
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [webAppSchema, itemListSchema].filter(Boolean),
          }),
        }}
      />
      <div className="mx-auto max-w-6xl px-4 py-12">
        <Breadcrumb items={[
          { label: t("common.home"), href: "/" },
          { label: categoryName, href: `/${category}` },
        ]} />
        <h1 className="font-heading text-3xl font-bold mb-2">{categoryName} {calculatorsLabel}</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-2">{meta?.description}</p>
        <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 dark:bg-brand-950/50 px-3 py-1 text-xs font-medium text-brand-700 dark:text-brand-300 mb-6">
          <span className="material-symbols-outlined text-sm leading-none" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 20" }}>verified</span>
          {t("category.noSignup")}
        </div>
        {editorial && (
          <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed max-w-3xl">
            {editorial.split("\n").map((line, i) => (
              <span key={i}>{line}{i < editorial.split("\n").length - 1 ? " " : ""}</span>
            ))}
          </p>
        )}
        <div className="mb-8">
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
            placeholder={t("category.searchPlaceholder")}
            ariaLabel={t("search.ariaLabel")}
            resultsLabel={t("search.resultsFound")}
          />
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          {calculators.map((calc) => {
            const resolved = resolveLocaleConfig(calc, locale as SupportedLocale);
            return (
            <Link
              key={calc.slug}
              href={`/${calc.category}/${calc.slug}`}
              className="group rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between">
                <h2 className="font-heading text-lg font-semibold text-gray-900 dark:text-gray-100 group-hover:text-brand-600 transition-colors">{resolved.meta.title}</h2>
                {calc.isNew && (
                  <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-100 dark:bg-amber-900/40 px-2 py-0.5 text-xs font-medium text-amber-700 dark:text-amber-300 shrink-0">
                    <span className="material-symbols-outlined text-sm leading-none" style={{ fontVariationSettings: "'FILL' 1, 'wght' 500, 'GRAD' 0, 'opsz' 20" }}>star</span>
                    {t("common.new")}
                  </span>
                )}
              </div>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{resolved.meta.description}</p>
            </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
