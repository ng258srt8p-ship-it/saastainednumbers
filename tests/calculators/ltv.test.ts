import { describe, it, expect } from "vitest";
import { calculateLTV } from "@/calculators/engine/ltv";

describe("calculateLTV", () => {
  it("computes LTV correctly", () => {
    const result = calculateLTV({ arpu: 50, grossMargin: 80, churnRate: 5 });
    expect(result.ltv).toBeCloseTo(800, 0);
  });

  it("throws for invalid churn rate", () => {
    expect(() => calculateLTV({ arpu: 50, grossMargin: 80, churnRate: 0 })).toThrow();
    expect(() => calculateLTV({ arpu: 50, grossMargin: 80, churnRate: 101 })).toThrow();
  });

  it("throws for negative arpu", () => {
    expect(() => calculateLTV({ arpu: -10, grossMargin: 50, churnRate: 5 })).toThrow();
  });
});
