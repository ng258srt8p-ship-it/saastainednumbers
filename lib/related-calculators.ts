import { getAllCalculators, getCalculator } from "./registry";

export function getRelatedCalculators(slug: string, count = 4) {
  const current = getCalculator(slug);
  if (!current) return [];

  const calculators = getAllCalculators();
  const curated = current.content.relatedCalculators
    .map((s) => calculators.find((c) => c.slug === s))
    .filter((c): c is NonNullable<typeof c> => c != null);

  const result = [...curated];

  if (result.length < count) {
    const extra = calculators.filter(
      (c) => c.slug !== slug && c.category === current.category && !result.some((r) => r.slug === c.slug)
    );
    result.push(...extra);
  }

  return result.slice(0, count);
}
