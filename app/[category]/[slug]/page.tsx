import { getAllCalculators } from "@/lib/registry";
import { getRelatedCalculators } from "@/lib/related-calculators";
import { generateMetadata as seoMetadata } from "@/lib/seo";
import { CalculatorClient } from "./CalculatorClient";
import { Breadcrumb } from "@/components/Breadcrumb";
import Link from "next/link";
import Script from "next/script";

// Import all calculator configs to register them in the registry
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

  const webApp = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: config.meta.title,
    description: config.meta.description,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/OnlineOnly",
    },
    url: `https://saastainednumbers.com/${config.category}/${config.slug}`,
  };

  const howTo = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: config.meta.title,
    description: config.meta.description,
    step: config.content.howToUse.split(".").filter(Boolean).map((step: string, i: number) => ({
      "@type": "HowToStep",
      position: i + 1,
      text: step.trim(),
    })),
  };

  const faq = config.content.faq.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: config.content.faq.map((item: { question: string; answer: string }) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  } : null;

  const categoryName = config.category.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <>
      <div className="mx-auto max-w-6xl px-4">
        <Breadcrumb items={[
          { label: "Home", href: "/" },
          { label: categoryName, href: `/${config.category}` },
          { label: config.meta.title, href: `/${config.category}/${config.slug}` },
        ]} />
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([webApp, howTo, ...(faq ? [faq] : [])]) }}
      />
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4115230840067798"
        crossOrigin="anonymous"
        strategy="beforeInteractive"
      />
      <CalculatorClient config={config} relatedCalculators={related} />
    </>
  );
}
