import { getAllCalculators } from "@/lib/registry";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { EmbedClient } from "./EmbedClient";

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

export const dynamicParams = false;

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

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EmbedClient slug={slug} config={config} />
    </Suspense>
  );
}
