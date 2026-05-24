import { describe, it, expect } from "vitest";
import { calculateSubscriptionContentRevenue } from "@/calculators/engine/subscription-content-revenue";

describe("calculateSubscriptionContentRevenue", () => {
  it("computes revenue correctly with default values", () => {
    const result = calculateSubscriptionContentRevenue({ freeFollowers: 10000, conversionRate: 5, monthlyPrice: 9.99, payPerViewRevenue: 200, tipsPerMonth: 150 });
    expect(result.paidSubscribers).toBe(500);
    expect(result.monthlySubRevenue).toBe(4995);
    expect(result.monthlyPPVRevenue).toBe(200);
    expect(result.monthlyTipsRevenue).toBe(150);
    expect(result.monthlyTotal).toBe(5345);
    expect(result.annualRevenue).toBe(64140);
  });

  it("returns zero paid subscribers with zero free followers", () => {
    const result = calculateSubscriptionContentRevenue({ freeFollowers: 0, conversionRate: 5, monthlyPrice: 9.99, payPerViewRevenue: 200, tipsPerMonth: 150 });
    expect(result.paidSubscribers).toBe(0);
    expect(result.monthlySubRevenue).toBe(0);
    expect(result.monthlyTotal).toBe(350);
    expect(result.annualRevenue).toBe(4200);
  });

  it("throws for negative values", () => {
    expect(() => calculateSubscriptionContentRevenue({ freeFollowers: -1, conversionRate: 5, monthlyPrice: 9.99, payPerViewRevenue: 200, tipsPerMonth: 150 })).toThrow();
  });
});
