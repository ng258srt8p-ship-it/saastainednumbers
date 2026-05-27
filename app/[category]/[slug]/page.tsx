import { getAllCalculators } from "@/lib/registry";
import { getRelatedCalculators } from "@/lib/related-calculators";
import { generateMetadata as seoMetadata } from "@/lib/seo";
import { CalculatorClient } from "./CalculatorClient";

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
  return {
    ...seoMetadata(config),
    alternates: {
      canonical: `https://saastainednumbers.com/${category}/${slug}`,
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

  const related = getRelatedCalculators(slug, 4);

  return <CalculatorClient config={config} relatedCalculators={related} hideContent />;
}
