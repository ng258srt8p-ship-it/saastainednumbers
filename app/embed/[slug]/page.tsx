import { getAllCalculators } from "@/lib/registry";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { EmbedClient } from "./EmbedClient";

// Import all calculator configs to register them in the registry
import "@/calculators/config/_all";

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
