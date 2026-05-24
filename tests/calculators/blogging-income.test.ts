import { describe, it, expect } from "vitest";
import { calculateBloggingIncome } from "@/calculators/engine/blogging-income";
describe("calculateBloggingIncome", () => {
  it("computes revenue correctly", () => {
    const r = calculateBloggingIncome({ monthlyPageviews: 50000, adRpm: 12, affiliateRevenuePerMonth: 500, sponsoredPostRevenuePerMonth: 1000, digitalProductRevenue: 300 });
    expect(r.monthlyAdRevenue).toBe(600);
    expect(r.monthlyAffiliateRevenue).toBe(500);
    expect(r.monthlySponsoredRevenue).toBe(1000);
    expect(r.monthlyDigitalProductRevenue).toBe(300);
    expect(r.monthlyTotalRevenue).toBe(2400);
    expect(r.annualRevenue).toBe(28800);
  });
  it("handles zero pageviews", () => {
    const r = calculateBloggingIncome({ monthlyPageviews: 0, adRpm: 12, affiliateRevenuePerMonth: 500, sponsoredPostRevenuePerMonth: 1000, digitalProductRevenue: 300 });
    expect(r.monthlyAdRevenue).toBe(0);
    expect(r.monthlyTotalRevenue).toBe(1800);
  });
  it("throws for negative values", () => {
    expect(() => calculateBloggingIncome({ monthlyPageviews: -1, adRpm: 12, affiliateRevenuePerMonth: 500, sponsoredPostRevenuePerMonth: 1000, digitalProductRevenue: 300 })).toThrow();
  });
});
