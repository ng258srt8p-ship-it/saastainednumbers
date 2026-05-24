import { getAllCalculators } from "./registry";

function extractContentBlocks(config: {
  slug: string;
  content: { intro: string; howToUse: string; formulaExplanation: string; benchmarks?: string };
}): string[] {
  const blocks = [config.content.intro, config.content.howToUse, config.content.formulaExplanation];
  if (config.content.benchmarks) blocks.push(config.content.benchmarks);
  return blocks.filter(Boolean);
}

function wordCount(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}

function shingleSet(text: string, size = 3): Set<string> {
  const words = text.toLowerCase().replace(/[^a-z0-9\s]/g, "").split(/\s+/).filter(Boolean);
  const shingles = new Set<string>();
  for (let i = 0; i <= words.length - size; i++) {
    shingles.add(words.slice(i, i + size).join(" "));
  }
  return shingles;
}

function jaccardSimilarity(a: Set<string>, b: Set<string>): number {
  const intersection = new Set([...a].filter((x) => b.has(x)));
  const union = new Set([...a, ...b]);
  return union.size === 0 ? 0 : intersection.size / union.size;
}

export interface UniquenessReport {
  slug: string;
  wordCount: number;
  uniquenessScore: number;
  mostSimilarTo: { slug: string; similarity: number } | null;
  passesThreshold: boolean;
}

export function checkContentUniqueness(threshold = 0.4): UniquenessReport[] {
  const calculators = getAllCalculators();
  const reports: UniquenessReport[] = [];

  for (const calc of calculators) {
    const blocks = extractContentBlocks(calc);
    const text = blocks.join(" ");
    const wc = wordCount(text);
    const shingles = shingleSet(text);
    let maxSimilarity = 0;
    let mostSimilar: string | null = null;

    for (const other of calculators) {
      if (other.slug === calc.slug) continue;
      const otherBlocks = extractContentBlocks(other);
      const otherText = otherBlocks.join(" ");
      const otherShingles = shingleSet(otherText);
      const sim = jaccardSimilarity(shingles, otherShingles);
      if (sim > maxSimilarity) {
        maxSimilarity = sim;
        mostSimilar = other.slug;
      }
    }

    const uniquenessScore = 1 - maxSimilarity;
    reports.push({
      slug: calc.slug,
      wordCount: wc,
      uniquenessScore,
      mostSimilarTo: mostSimilar ? { slug: mostSimilar, similarity: maxSimilarity } : null,
      passesThreshold: uniquenessScore >= threshold,
    });
  }

  return reports;
}

export function verifyCalculatorContent(slug: string, contentBlocks: string[], threshold = 0.4): {
  passes: boolean;
  totalWords: number;
  uniqueWords: number;
} {
  const allCalculators = getAllCalculators();
  const text = contentBlocks.join(" ");
  const wc = wordCount(text);
  const shingles = shingleSet(text);

  let maxOverlap = 0;
  for (const calc of allCalculators) {
    if (calc.slug === slug) continue;
    const otherBlocks = extractContentBlocks(calc);
    const otherText = otherBlocks.join(" ");
    const otherShingles = shingleSet(otherText);
    const intersection = new Set([...shingles].filter((x) => otherShingles.has(x)));
    if (intersection.size > maxOverlap) maxOverlap = intersection.size;
  }

  const uniqueShingles = shingles.size - maxOverlap;
  const uniquenessRatio = shingles.size > 0 ? uniqueShingles / shingles.size : 1;

  return {
    passes: uniquenessRatio >= threshold,
    totalWords: wc,
    uniqueWords: Math.round(wc * uniquenessRatio),
  };
}
