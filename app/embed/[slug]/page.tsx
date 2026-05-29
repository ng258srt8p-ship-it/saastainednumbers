import type { Metadata } from "next";
import { getAllCalculators } from "@/lib/registry";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { EmbedClient } from "./EmbedClient";
import { getTranslations } from "@/lib/getTranslations";
import { resolveLocaleConfig } from "@/lib/resolve-calculator-locale";
import type { SupportedLocale } from "@/calculators/config/calculator-schema";
import type { Locale } from "@/lib/useLocale";

// Import all calculator configs to register them in the registry
import "@/calculators/config/_all";

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const calculators = getAllCalculators();
  const config = calculators.find((c) => c.slug === slug);
  if (!config) return {};
  return {
    title: `${config.meta.title} (Embed)`,
    description: config.meta.description,
    robots: { index: false, follow: false },
  };
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const calculators = getAllCalculators();
  return calculators.map((calc) => ({ slug: calc.slug }));
}

export default async function EmbedPage({ params }: PageProps) {
  const { slug } = await params;
  const calculators = getAllCalculators();
  const config = calculators.find((c) => c.slug === slug);
  if (!config) notFound();

  const { t, locale } = await getTranslations();
  const resolved = resolveLocaleConfig(config, locale as SupportedLocale);

  return (
    <Suspense fallback={<div>{t("common.loading")}</div>}>
      <EmbedClient
        slug={slug}
        config={resolved}
        locale={locale as Locale}
        strings={{
          disclaimer: t("calculator.disclaimer"),
        }}
      />
    </Suspense>
  );
}
