import type { Metadata } from "next";
import type { CalculatorConfig, FAQItem } from "@/calculators/config/calculator-schema";
import { alternateLanguages, localeUrl } from "@/lib/locale-url";
import { getDefaultCurrency } from "@/lib/currencies";

export function generateMetadata(config: CalculatorConfig): Metadata {
  const path = `/${config.category}/${config.slug}`;
  return {
    title: config.meta.title,
    description: config.meta.description,
    keywords: config.meta.keywords,
    alternates: {
      canonical: localeUrl(path),
      languages: alternateLanguages(path),
    },
    openGraph: {
      type: "website",
      title: config.meta.title,
      description: config.meta.description,
      images: [`/api/og?title=${encodeURIComponent(config.meta.title)}&category=${encodeURIComponent(config.category)}&description=${encodeURIComponent(config.meta.description)}`],
    },
  };
}

export function generateWebApplicationSchema(
  slug: string,
  config: CalculatorConfig,
  categoryDisplayName: string,
  locale?: string,
) {
  const path = `/${config.category}/${slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: config.meta.title,
    description: config.meta.description,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    browserRequirements: "Requires JavaScript",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: getDefaultCurrency(locale ?? "en"),
      availability: "https://schema.org/OnlineOnly",
    },
    featureList: config.outputs.map((o) => `Calculate ${o.label}`),
    url: `https://saastainednumbers.com${path}`,
  };
}

export function generateBreadcrumbListSchema(
  categorySlug: string,
  categoryDisplayName: string,
  slug: string,
  calculatorTitle: string,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://saastainednumbers.com" },
      { "@type": "ListItem", position: 2, name: categoryDisplayName, item: `https://saastainednumbers.com/${categorySlug}` },
      { "@type": "ListItem", position: 3, name: calculatorTitle, item: `https://saastainednumbers.com/${categorySlug}/${slug}` },
    ],
  };
}

export function generateFAQPageSchema(faqItems: FAQItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}
