import { describe, it, expect } from "vitest";
import { calculateAffiliateIncome } from "@/calculators/engine/affiliate-income";
describe("calculateAffiliateIncome", () => {
  it("computes income correctly", () => {
    const r = calculateAffiliateIncome({ monthlyVisitors: 50000, clickThroughRate: 3, conversionRate: 5, averageCommission: 25, cookieDurationDays: 30 });
    expect(r.monthlyClicks).toBe(1500);
    expect(r.monthlyConversions).toBe(75);
    expect(r.monthlyRevenue).toBe(1875);
    expect(r.annualRevenue).toBe(22500);
  });
  it("handles zero traffic", () => {
    const r = calculateAffiliateIncome({ monthlyVisitors: 0, clickThroughRate: 3, conversionRate: 5, averageCommission: 25, cookieDurationDays: 30 });
    expect(r.monthlyRevenue).toBe(0);
  });
  it("throws for negative values", () => {
    expect(() => calculateAffiliateIncome({ monthlyVisitors: -1, clickThroughRate: 3, conversionRate: 5, averageCommission: 25, cookieDurationDays: 30 })).toThrow();
  });
});
