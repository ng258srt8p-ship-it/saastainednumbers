import { getAllCalculators } from "@/lib/registry";
import { getRelatedCalculators } from "@/lib/related-calculators";
import { generateMetadata as seoMetadata } from "@/lib/seo";
import { CalculatorClient } from "./CalculatorClient";
import { alternateLanguages, localeUrl } from "@/lib/locale-url";
import { getTranslations } from "@/lib/getTranslations";
import { resolveLocaleConfig } from "@/lib/resolve-calculator-locale";
import type { SupportedLocale } from "@/calculators/config/calculator-schema";

import "@/calculators/config/_all";

interface PageProps {
  params: Promise<{ category: string; slug: string }>;
}

export async function generateStaticParams() {
  const calculators = getAllCalculators();
  return calculators.map((calc) => ({
    category: calc.category,
    slug: calc.slug,
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug, category } = await params;
  const calculators = getAllCalculators();
  const config = calculators.find((c) => c.slug === slug);
  if (!config) return {};
  const { locale } = await getTranslations();
  const resolved = resolveLocaleConfig(config, locale as SupportedLocale);
  return {
    ...seoMetadata(resolved),
    alternates: {
      canonical: localeUrl(`/${category}/${slug}`),
      languages: alternateLanguages(`/${category}/${slug}`),
    },
  };
}

export default async function CalculatorPage({ params }: PageProps) {
  const { slug, category } = await params;
  const calculators = getAllCalculators();
  const config = calculators.find((c) => c.slug === slug && c.category === category);
  if (!config) {
    const Link = (await import("next/link")).default;
    return (
      <div className="flex flex-1 items-center justify-center px-4 py-24">
        <div className="text-center">
          <p className="font-heading text-8xl font-bold text-gray-500">404</p>
          <h1 className="mt-4 font-heading text-2xl font-bold text-gray-900">Calculator Not Found</h1>
          <p className="mt-2 text-gray-600">The calculator you&apos;re looking for doesn&apos;t exist.</p>
          <Link href="/" className="mt-8 inline-block rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-700">
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  const { locale, t } = await getTranslations();
  const resolved = resolveLocaleConfig(config, locale as SupportedLocale);
  const related = getRelatedCalculators(slug, 4);

  const strings = {
    locale,
    sectionHowToUse: t("calculator.howToUse"),
    sectionFormula: t("calculator.formulaAndExample"),
    sectionBenchmarks: t("calculator.industryBenchmarks"),
    sectionFaq: t("calculator.frequentlyAskedQuestions"),
    tableMetric: t("calculator.tableMetric"),
    tableValue: t("calculator.tableValue"),
    tableSource: t("calculator.tableSource"),
    resetAll: t("calculator.resetAll"),
    addScenario: t("calculator.addScenarioB"),
    backToSingle: t("calculator.backToSingleView"),
    resetBoth: t("calculator.resetBoth"),
    scenarioA: t("calculator.scenarioA"),
    scenarioB: t("calculator.scenarioB"),
    resultsComparison: t("calculator.resultsComparison"),
    embed: t("calculator.embed"),
    disclaimer: t("calculator.disclaimer"),
    stageSeed: t("calculator.seed"),
    stageSeriesA: t("calculator.seriesA"),
    stageSeriesB: t("calculator.seriesB"),
    stageSeriesC: t("calculator.seriesC"),
    stageGrowth: t("calculator.growth"),
    deltaAbsolute: t("calculator.deltaAbsolute"),
    deltaPercent: t("calculator.deltaPercent"),
    deltaBoth: t("calculator.deltaBoth"),
    feedbackHelpful: t("feedback.wasThisHelpful"),
    feedbackYes: t("feedback.yes"),
    feedbackNo: t("feedback.no"),
    feedbackThanks: t("feedback.thanks"),
  };

  return <CalculatorClient config={resolved} relatedCalculators={related} hideContent strings={strings} />;
}
