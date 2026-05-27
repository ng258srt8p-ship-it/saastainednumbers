import { describe, it, expect } from "vitest";
import "@/calculators/config/_all";
import { checkContentUniqueness } from "@/lib/content-uniqueness";

describe("content uniqueness", () => {
  it("all calculators pass the 40% uniqueness threshold", () => {
    const reports = checkContentUniqueness(0.4);
    const failures = reports.filter((r) => !r.passesThreshold);
    const failureLines = failures.map(
      (f) =>       `${f.slug}: ${(f.uniquenessScore * 100).toFixed(1)}% unique (most similar to ${f.mostSimilarTo?.slug ?? "none"} at ${((f.mostSimilarTo?.similarity ?? 0) * 100).toFixed(1)}% similarity)`
    );
    expect(failures, `Calculators below 40% uniqueness threshold:\n${failureLines.join("\n")}`).toEqual([]);
  });
});
