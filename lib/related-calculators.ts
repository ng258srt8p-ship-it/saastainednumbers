import { getAllCalculators } from "./registry";

export function getRelatedCalculators(slug: string, count = 4) {
  const calculators = getAllCalculators();
  const current = calculators.find((c) => c.slug === slug);
  if (!current) return [];

  const sameCategory = calculators.filter(
    (c) => c.slug !== slug && c.category === current.category
  );

  const otherCategory = calculators.filter(
    (c) => c.slug !== slug && c.category !== current.category
  );

  const related = [...sameCategory, ...otherCategory].slice(0, count);
  return related;
}
