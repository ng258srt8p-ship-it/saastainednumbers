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

  const features = [
    t("pricing.feature1").replace("{n}", String(calculatorCount)),
    t("pricing.feature2"),
    t("pricing.feature3"),
    t("pricing.feature4"),
    t("pricing.feature5"),
  ];

  return (
    <div className="mobbin-section">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <span className="mobbin-label">{t("pricing.pricing")}</span>
        <h1 className="font-heading text-4xl font-bold text-gray-900 dark:text-gray-100 mt-3">
          {t("pricing.everythingFree")}
        </h1>
        <p className="mt-3 text-gray-500 dark:text-gray-400">
          {t("pricing.subtitle").replace("{n}", String(calculatorCount))}
        </p>
      </div>

      {/* Single Free Plan Card */}
      <div className="mt-12 max-w-md mx-auto">
        <div className="relative rounded-2xl border border-brand-500 shadow-lg shadow-brand-500/10 bg-white dark:bg-gray-800 p-8 text-center">
          <p className="font-heading text-lg font-bold text-gray-900 dark:text-gray-100">
            {t("pricing.everythingFree")}
          </p>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {t("pricing.allFree")}
          </p>
          <p className="mt-4">
            <span className="font-heading text-5xl font-bold text-gray-900 dark:text-gray-100">$0</span>
            <span className="ml-1 text-sm text-gray-500 dark:text-gray-400">
              / {t("pricing.forever").replace(".", "")}
            </span>
          </p>
          <ul className="mt-6 space-y-3 text-left max-w-xs mx-auto" role="list">
            {features.map((feat) => (
              <li key={feat} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                <svg className="w-4 h-4 mt-0.5 shrink-0 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {feat}
              </li>
            ))}
          </ul>
          <Link
            href="/calculators"
            className="mt-8 block w-full rounded-xl bg-brand-600 py-3 text-sm font-semibold text-white text-center shadow-sm hover:bg-brand-700 transition-all"
          >
            {t("home.browseCalculators")}
          </Link>
        </div>
      </div>

      {/* FAQ */}
      <div className="mt-20 max-w-2xl mx-auto">
        <h2 className="font-heading text-2xl font-bold text-gray-900 dark:text-gray-100 text-center mb-8">
          Frequently Asked Questions
        </h2>
        <div className="space-y-3">
          {[
            { q: "Is it really free?", a: "Yes. All calculators are completely free with no usage limits, no paywalls, and no sign-up required." },
            { q: "How do you make money?", a: "We display non-intrusive ads within calculator pages. Embeds are ad-free." },
            { q: "Can I embed calculators on my site?", a: "Absolutely. Use the embed button on any calculator to get a copy-paste iframe snippet. Embed is free and ad-free." },
            { q: "Do you offer an API?", a: "Not yet, but it's on our roadmap. Contact us if you need programmatic access." },
          ].map((faq) => (
            <details key={faq.q} className="group mobbin-card">
              <summary className="flex cursor-pointer items-center justify-between text-sm font-medium text-gray-800 dark:text-gray-200">
                {faq.q}
                <svg className="w-4 h-4 text-gray-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">{faq.a}</p>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}
