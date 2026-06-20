import { getAllCalculators } from "@/lib/registry";
import { getRelatedCalculators } from "@/lib/related-calculators";
import { renderContent } from "@/lib/renderContent.server";
import { Breadcrumb } from "@/components/Breadcrumb";
import { getTranslations } from "@/lib/getTranslations";
import { resolveLocaleConfig } from "@/lib/resolve-calculator-locale";
import { generateBreadcrumbListSchema } from "@/lib/seo";
import type { SupportedLocale } from "@/calculators/config/calculator-schema";

import "@/calculators/config/_all";

export default async function CalculatorLayout({
  params,
  children,
}: {
  params: Promise<{ category: string; slug: string }>;
  children: React.ReactNode;
}) {
  const { slug, category } = await params;
  const calculators = getAllCalculators();
  const config = calculators.find((c) => c.slug === slug && c.category === category);
  if (!config) return <>{children}</>;
  const { locale, t } = await getTranslations();
  const resolved = resolveLocaleConfig(config, locale as SupportedLocale);

  const webApp = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: resolved.meta.title,
    description: resolved.meta.description,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/OnlineOnly",
    },
    url: `https://saastainednumbers.com/${resolved.category}/${resolved.slug}`,
  };

  const howTo = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: resolved.meta.title,
    description: resolved.meta.description,
    step: resolved.content.howToUse.split(". ").filter(Boolean).map((step: string, i: number) => ({
      "@type": "HowToStep",
      position: i + 1,
      text: step.trim(),
    })),
  };

  const faq = resolved.content.faq.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: resolved.content.faq.map((item: { question: string; answer: string }) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  } : null;

  const breadcrumbSchema = generateBreadcrumbListSchema(resolved.category, resolved.slug);

  const webpageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: resolved.meta.title,
    description: resolved.meta.description,
    url: `https://saastainednumbers.com/${resolved.category}/${resolved.slug}`,
    about: {
      "@type": "Thing",
      name: "Financial Mathematics",
    },
    specialty: "FinancialPlanning",
    isPartOf: {
      "@type": "WebSite",
      name: "SaaStainedNumbers",
      url: "https://saastainednumbers.com",
    },
  };

  const schemas = [webApp, howTo, breadcrumbSchema, webpageSchema, ...(faq ? [faq] : [])].filter(Boolean);

  return (
    <>
      <div className="mx-auto max-w-6xl px-4">
        <Breadcrumb items={[
          { label: t("common.home"), href: "/" },
          { label: resolved.meta.title, href: `/${resolved.category}/${resolved.slug}` },
        ]} />
      </div>

      {schemas.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": schemas,
            }),
          }}
        />
      )}

      <div className="mx-auto max-w-4xl px-4 pb-8">
        <section className="mt-12">
          <h1 className="font-heading text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl">
            {resolved.meta.title}
          </h1>
          <p className="mt-1 sm:mt-2 text-base sm:text-lg text-gray-600 dark:text-gray-400">
            {resolved.meta.description}
          </p>
          <div className="mt-6 text-lg leading-relaxed text-gray-700 dark:text-gray-300">
            {renderContent(resolved.content.intro)}
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{t("calculator.howToUse")}</h2>
          <ol className="mt-4 list-decimal pl-5 space-y-2">
            {resolved.content.howToUse.split(". ").filter(Boolean).map((step, i) => (
              <li key={i} className="text-gray-600 dark:text-gray-400">{step.trim()}.</li>
            ))}
          </ol>
        </section>

        {resolved.content.formulaExplanation && (
          <section className="mt-10 rounded-xl bg-brand-50 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-800/50 p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">{t("calculator.formulaAndExample")}</h2>
            <div className="font-mono text-sm bg-gray-100/50 dark:bg-gray-800/50 rounded-lg p-4 border border-brand-200 dark:border-brand-800/30 mb-4">
              {resolved.content.formulaExplanation.split(". ").map((part, i) => (
                <p key={i} className="mb-1 text-gray-700 dark:text-gray-300">{part}{i === 0 ? ":" : "."}</p>
              ))}
            </div>
          </section>
        )}

        {resolved.content.benchmarks && (
          <section className="mt-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">{t("calculator.industryBenchmarks")}</h2>
            <div className="text-gray-700 dark:text-gray-300 mb-4">{renderContent(resolved.content.benchmarks)}</div>
            {resolved.content.benchmarkData && resolved.content.benchmarkData.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-2 font-medium text-gray-500 dark:text-gray-400">{t("calculator.tableMetric")}</th>
                      <th className="text-left py-2 font-medium text-gray-500 dark:text-gray-400">{t("calculator.tableValue")}</th>
                      <th className="text-left py-2 font-medium text-gray-500 dark:text-gray-400">{t("calculator.tableSource")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resolved.content.benchmarkData.map((row, i) => (
                      <tr key={i} className="border-b border-gray-100 dark:border-gray-800">
                        <td className="py-2 text-gray-800 dark:text-gray-200">{row.metric}</td>
                        <td className="py-2 text-gray-700 dark:text-gray-300">{row.value}</td>
                        <td className="py-2 text-gray-600 dark:text-gray-400">{row.source}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {resolved.content.faq.length > 0 && (
          <section className="mt-12">
            <h2 className="font-heading text-2xl font-bold text-gray-900 dark:text-gray-100">{t("calculator.frequentlyAskedQuestions")}</h2>
            <div className="mt-6 space-y-3">
              {resolved.content.faq.map((item, i) => (
                <details key={i} className="group rounded-lg border border-gray-200 dark:border-gray-700 bg-card-bg">
                  <summary className="flex cursor-pointer items-center justify-between px-4 py-3 text-sm font-medium text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/30">
                    {item.question}
                    <span className="material-symbols-outlined text-gray-600 dark:text-gray-500 group-open:rotate-180 transition-transform text-xl leading-none select-none" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>expand_more</span>
                  </summary>
                  <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                    {renderContent(item.answer)}
                  </div>
                </details>
              ))}
            </div>
          </section>
        )}
      </div>

      {children}
    </>
  );
}
