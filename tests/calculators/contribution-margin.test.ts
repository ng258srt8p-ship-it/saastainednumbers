import { describe, it, expect } from "vitest";
import { calculateContributionMargin } from "@/calculators/engine/contribution-margin";

describe("calculateContributionMargin", () => {
  it("computes contribution margin correctly", () => {
    const r = calculateContributionMargin({ revenue: 100000, variableCosts: 30000 });
    expect(r.contributionMargin).toBe(70000);
    expect(r.contributionMarginPct).toBe(70);
  });

  it("throws for zero revenue", () => {
    expect(() => calculateContributionMargin({ revenue: 0, variableCosts: 0 })).toThrow();
  });
});
