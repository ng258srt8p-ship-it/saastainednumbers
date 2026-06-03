import type { Metadata } from "next";
import Link from "next/link";
import { getAllCalculators } from "@/lib/registry";
import { alternateLanguages, localeUrl } from "@/lib/locale-url";
import { getTranslations } from "@/lib/getTranslations";

import "@/calculators/config/_all";

const calculatorCount = getAllCalculators().length;

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getTranslations();
  return {
    title: `${t("pricing.everythingFree")} - SaaStainedNumbers`,
    description: t("pricing.allFree"),
    alternates: {
      canonical: localeUrl("/pricing"),
      languages: alternateLanguages("/pricing"),
    },
    openGraph: {
      title: `${t("pricing.everythingFree")} - SaaStainedNumbers`,
      description: t("pricing.allFree"),
      type: "website",
      images: ["/api/og?title=Pricing&category=home"],
    },
  };
}

export default async function PricingPage() {
  const { t } = await getTranslations();

  return (
    <div className="mx-auto max-w-3xl px-4 py-20 text-center">
      <h1 className="font-heading text-4xl font-bold text-gray-900 dark:text-gray-100">
        {t("pricing.everythingFree")}
      </h1>
      <p className="mt-3 text-lg text-gray-500 dark:text-gray-400">
        {t("pricing.subtitle").replace("{n}", String(calculatorCount))}
      </p>

      <div className="mx-auto mt-12 max-w-lg rounded-2xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-8 shadow-sm">
        <p className="text-5xl font-bold text-gray-900 dark:text-gray-100 font-numbers">$0</p>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{t("pricing.forever")}</p>

        <ul className="mt-8 space-y-4 text-left">
          <li className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-400">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-100 dark:bg-brand-900/40 text-xs text-brand-700 dark:text-brand-300">✓</span>
            {t("pricing.feature1").replace("{n}", String(calculatorCount))}
          </li>
          <li className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-400">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-100 dark:bg-brand-900/40 text-xs text-brand-700 dark:text-brand-300">✓</span>
            {t("pricing.feature2")}
          </li>
          <li className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-400">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-100 dark:bg-brand-900/40 text-xs text-brand-700 dark:text-brand-300">✓</span>
            {t("pricing.feature3")}
          </li>
          <li className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-400">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-100 dark:bg-brand-900/40 text-xs text-brand-700 dark:text-brand-300">✓</span>
            {t("pricing.feature4")}
          </li>
          <li className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-400">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-100 dark:bg-brand-900/40 text-xs text-brand-700 dark:text-brand-300">✓</span>
            {t("pricing.feature5")}
          </li>
        </ul>

        <div className="mt-10">
          <Link
            href="/calculators"
            className="inline-block rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-500/25 transition-all hover:shadow-xl hover:shadow-brand-500/30"
          >
            {t("home.browseCalculators")}
          </Link>
        </div>
      </div>
    </div>
  );
}
