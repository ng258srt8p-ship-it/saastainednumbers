import type { Metadata } from "next";
import type { CalculatorConfig, FAQItem } from "@/calculators/config/calculator-schema";
import { alternateLanguages, localeUrl } from "@/lib/locale-url";

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
      title: config.meta.title,
      description: config.meta.description,
      images: [`/api/og?title=${encodeURIComponent(config.meta.title)}&category=${encodeURIComponent(config.category)}&description=${encodeURIComponent(config.meta.description)}`],
    },
  };
}

export function generateWebApplicationSchema(slug: string, config: CalculatorConfig) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: config.meta.title,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    featureList: config.outputs.map((o) => `Calculate ${o.label}`),
  };
}

export function generateBreadcrumbListSchema(category: string, slug: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://saastainednumbers.com" },
      { "@type": "ListItem", position: 2, name: category, item: `https://saastainednumbers.com/${category}` },
      { "@type": "ListItem", position: 3, name: slug, item: `https://saastainednumbers.com/${category}/${slug}` },
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

export function generateJsonLd(slug: string, config: CalculatorConfig, faqItems: FAQItem[]) {
  const schemas = [
    generateWebApplicationSchema(slug, config),
    generateBreadcrumbListSchema(config.category, slug),
    generateFAQPageSchema(faqItems),
  ];
  return schemas.map((s) => JSON.stringify(s)).join("\n");
}
