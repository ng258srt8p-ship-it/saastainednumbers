import { describe, it, expect } from "vitest";
import { calculateUnitEconomicsDashboard } from "@/calculators/engine/unit-economics-dashboard";

describe("calculateUnitEconomicsDashboard", () => {
  it("computes default values correctly", () => {
    const r = calculateUnitEconomicsDashboard({ cac: 500, ltv: 3000, arpu: 100, grossMargin: 70, churnRate: 5, customerCount: 500 });
    expect(r.ltvCacRatio).toBe(6);
    expect(r.contributionMargin).toBe(70);
    expect(r.paybackPeriodMonths).toBeCloseTo(7.14, 1);
    expect(r.mrr).toBe(50000);
    expect(r.grossProfitPerCustomer).toBe(70);
  });

  it("returns 999 payback for zero churn", () => {
    const r = calculateUnitEconomicsDashboard({ cac: 500, ltv: 3000, arpu: 100, grossMargin: 70, churnRate: 0, customerCount: 500 });
    expect(r.paybackPeriodMonths).toBe(999);
  });

  it("throws for zero CAC", () => {
    expect(() => calculateUnitEconomicsDashboard({ cac: 0, ltv: 3000, arpu: 100, grossMargin: 70, churnRate: 5, customerCount: 500 })).toThrow();
  });
});
