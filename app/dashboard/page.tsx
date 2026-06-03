import type { Metadata } from "next";
import { Suspense } from "react";
import { DashboardClient } from "./dashboard-client";
import { alternateLanguages, localeUrl } from "@/lib/locale-url";
import { getTranslations } from "@/lib/getTranslations";

function DashboardSkeleton() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:py-12 animate-pulse">
      <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
      <div className="h-4 w-96 bg-gray-200 dark:bg-gray-700 rounded mb-8" />
      <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded-xl mb-6" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
            <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
            <div className="space-y-3">
              <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getTranslations();
  const heading = t("dashboard.heading");
  return {
    title: `${heading} - SaaStainedNumbers`,
    description: "Interconnected SaaS dashboard with calculators, benchmarks, and insights.",
    alternates: {
      canonical: localeUrl("/dashboard"),
      languages: alternateLanguages("/dashboard"),
    },
    openGraph: {
      title: heading,
      description: "Interconnected SaaS dashboard with calculators, benchmarks, and insights.",
      type: "website",
      images: ["/api/og?title=Dashboard&category=sdeepen"],
    },
  };
}

export default async function DashboardPage() {
  const { t, locale } = await getTranslations();
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardClient strings={{
        locale,
        heading: t("dashboard.heading"),
        subtitle: t("dashboard.subtitle"),
        share: t("dashboard.share"),
        copied: t("dashboard.copied"),
        addCalculator: t("dashboard.addCalculators"),
        noCalculatorsSelected: t("dashboard.noCalculatorsSelected"),
        browseCalculators: t("dashboard.browseCalculators"),
        calculatorsActive: t("dashboard.calculatorsActive"),
        remove: t("dashboard.remove"),
      }} />
    </Suspense>
  );
}
