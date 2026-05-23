import type { Metadata } from "next";
import type { CalculatorConfig, FAQItem } from "@/calculators/config/calculator-schema";

export function generateMetadata(config: CalculatorConfig): Metadata {
  return {
    title: config.meta.title,
    description: config.meta.description,
    keywords: config.meta.keywords,
    openGraph: {
      title: config.meta.title,
      description: config.meta.description,
      images: [`/api/og?title=${encodeURIComponent(config.meta.title)}`],
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
      { "@type": "ListItem", position: 1, name: "Home", item: "https://webcalc.io" },
      { "@type": "ListItem", position: 2, name: category, item: `https://webcalc.io/${category}` },
      { "@type": "ListItem", position: 3, name: slug, item: `https://webcalc.io/${category}/${slug}` },
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
