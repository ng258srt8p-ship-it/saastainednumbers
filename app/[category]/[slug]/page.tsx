import { getAllCalculators } from "@/lib/registry";
import { getRelatedCalculators } from "@/lib/related-calculators";
import { generateMetadata as seoMetadata } from "@/lib/seo";
import { CalculatorClient } from "./CalculatorClient";
import Link from "next/link";

// Import calculator configs to register them in the registry
import "@/calculators/config/mrr-calculator";
import "@/calculators/config/cac-calculator";
import "@/calculators/config/ltv-calculator";
import "@/calculators/config/churn-calculator";
import "@/calculators/config/arpu-calculator";
import "@/calculators/config/burn-rate-calculator";
import "@/calculators/config/payback-period-calculator";
import "@/calculators/config/nrr-calculator";
import "@/calculators/config/gross-margin-calculator";
import "@/calculators/config/quick-ratio-calculator";
import "@/calculators/config/cac-ltv-ratio-calculator";
import "@/calculators/config/magic-number-calculator";
import "@/calculators/config/rule-of-40-calculator";
import "@/calculators/config/contribution-margin-calculator";
import "@/calculators/config/operating-margin-calculator";
import "@/calculators/config/revenue-per-employee-calculator";
import "@/calculators/config/mrr-growth-rate-calculator";
import "@/calculators/config/acv-calculator";
import "@/calculators/config/customer-health-score-calculator";
import "@/calculators/config/nps-calculator";
import "@/calculators/config/activation-rate-calculator";
import "@/calculators/config/trial-to-paid-calculator";
import "@/calculators/config/expansion-revenue-rate-calculator";
import "@/calculators/config/net-cash-flow-calculator";
import "@/calculators/config/lead-conversion-rate-calculator";

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
  const { slug } = await params;
  const calculators = getAllCalculators();
  const config = calculators.find((c) => c.slug === slug);
  if (!config) return {};
  return seoMetadata(config);
}

export default async function CalculatorPage({ params }: PageProps) {
  const { slug, category } = await params;
  const calculators = getAllCalculators();
  const config = calculators.find((c) => c.slug === slug && c.category === category);
  if (!config) {
    return (
      <div className="flex flex-1 items-center justify-center px-4 py-24">
        <div className="text-center">
          <p className="font-heading text-8xl font-bold text-gray-200">404</p>
          <h1 className="mt-4 font-heading text-2xl font-bold text-gray-900">Calculator Not Found</h1>
          <p className="mt-2 text-gray-600">The calculator you&apos;re looking for doesn&apos;t exist.</p>
          <Link href="/" className="mt-8 inline-block rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-700">
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  const related = getRelatedCalculators(slug, 4);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: config.meta.title,
    description: config.meta.description,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: config.premium ? "9.00" : "0",
      priceCurrency: "USD",
      availability: "https://schema.org/OnlineOnly",
    },
    url: `https://saasifactory.io/${config.category}/${config.slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CalculatorClient config={config} relatedCalculators={related} />
    </>
  );
}
