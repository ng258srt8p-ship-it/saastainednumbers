import { getAllCalculators } from "@/lib/registry";
import { Breadcrumb } from "@/components/Breadcrumb";
import { getTranslations } from "@/lib/getTranslations";
import { resolveLocaleConfig } from "@/lib/resolve-calculator-locale";
import { generateWebApplicationSchema, generateFAQPageSchema } from "@/lib/seo";
import { getCategoryTranslationKey } from "@/lib/registry";
import type { SupportedLocale } from "@/calculators/config/calculator-schema";

import "@/calculators/config/_all";

function splitHowToSteps(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

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

  const categoryDisplayName = t(`category.${getCategoryTranslationKey(category)}`);

  const webApp = generateWebApplicationSchema(slug, resolved, categoryDisplayName, locale);

  const howTo = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: resolved.meta.title,
    description: resolved.meta.description,
    step: splitHowToSteps(resolved.content.howToUse).map((step: string, i: number) => ({
      "@type": "HowToStep",
      position: i + 1,
      text: step,
    })),
  };

  const faq = resolved.content.faq.length > 0 ? generateFAQPageSchema(resolved.content.faq) : null;

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

  const schemas = [webApp, howTo, webpageSchema, ...(faq ? [faq] : [])].filter(Boolean);

  return (
    <>
      <div className="mx-auto max-w-6xl px-4">
        <Breadcrumb items={[
          { label: t("common.home"), href: "/" },
          { label: categoryDisplayName, href: `/${category}` },
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
        </section>
      </div>

      {children}
    </>
  );
}
