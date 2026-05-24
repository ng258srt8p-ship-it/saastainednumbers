import { describe, it, expect } from "vitest";
import { calculateCohortAnalysis } from "@/calculators/engine/cohort-analysis";

describe("calculateCohortAnalysis", () => {
  it("computes standard retention correctly", () => {
    const r = calculateCohortAnalysis({ initialCohortSize: 1000, retentionRates: [80, 70, 60], months: 3 });
    expect(r.retainedUsers).toEqual([800, 560, 336]);
    expect(r.averageRetention).toBe(70);
  });

  it("handles perfect retention", () => {
    const r = calculateCohortAnalysis({ initialCohortSize: 500, retentionRates: [100, 100, 100], months: 3 });
    expect(r.retainedUsers).toEqual([500, 500, 500]);
    expect(r.averageRetention).toBe(100);
  });

  it("throws for insufficient retention rate data", () => {
    expect(() => calculateCohortAnalysis({ initialCohortSize: 1000, retentionRates: [80, 70], months: 3 })).toThrow();
  });
});
