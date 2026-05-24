import { describe, it, expect } from "vitest";
import { calculateSaaSQuickRatio } from "@/calculators/engine/saas-quick-ratio";

describe("calculateSaaSQuickRatio", () => {
  it("returns healthy ratio above 4", () => {
    const r = calculateSaaSQuickRatio({ newMRR: 10000, expansionMRR: 3000, churnedMRR: 2000, contractionMRR: 1000 });
    expect(r.quickRatio).toBeCloseTo(4.33, 1);
    expect(r.isHealthy).toBe(true);
    expect(r.category).toBe("Excellent");
  });

  it("returns Needs Attention for ratio below 1", () => {
    const r = calculateSaaSQuickRatio({ newMRR: 1000, expansionMRR: 500, churnedMRR: 2000, contractionMRR: 1000 });
    expect(r.quickRatio).toBe(0.5);
    expect(r.isHealthy).toBe(false);
    expect(r.category).toBe("Critical");
  });

  it("returns infinite ratio for zero churn and contraction", () => {
    const r = calculateSaaSQuickRatio({ newMRR: 10000, expansionMRR: 3000, churnedMRR: 0, contractionMRR: 0 });
    expect(r.quickRatio).toBe(999);
    expect(r.isHealthy).toBe(true);
    expect(r.category).toBe("Excellent");
  });
});
