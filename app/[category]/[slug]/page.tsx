import { getAllCalculators } from "@/lib/registry";
import { getRelatedCalculators } from "@/lib/related-calculators";
import { generateMetadata as seoMetadata } from "@/lib/seo";
import { CalculatorClient } from "./CalculatorClient";
import { alternateLanguages, localeUrl } from "@/lib/locale-url";
import { getTranslations } from "@/lib/getTranslations";
import { resolveLocaleConfig } from "@/lib/resolve-calculator-locale";
import { notFound } from "next/navigation";
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
  if (!config) notFound();

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
    shellFaqTitle: t("calculator.frequentlyAskedQuestions"),
    shellRelatedCalculatorsTitle: t("calculator.relatedCalculators"),
   };

  return <CalculatorClient config={resolved} relatedCalculators={related} strings={strings} />;
}
