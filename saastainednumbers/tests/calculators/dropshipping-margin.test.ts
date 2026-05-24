import { describe, it, expect } from "vitest";
import { calculateDropshippingMargin } from "@/calculators/engine/dropshipping-margin";

describe("calculateDropshippingMargin", () => {
  it("computes profit correctly with default values", () => {
    const result = calculateDropshippingMargin({ productPrice: 49.99, supplierCost: 20, shippingCost: 5, platformFeePercent: 15, advertisingCostPerUnit: 10, unitsSoldPerMonth: 100, returnRate: 3 });
    expect(result.monthlyRevenue).toBe(4999);
    expect(result.monthlyCOGS).toBe(2000);
    expect(result.monthlyShipping).toBe(500);
    expect(result.monthlyPlatformFees).toBeCloseTo(749.85, 1);
    expect(result.monthlyAdCost).toBe(1000);
    expect(result.monthlyReturnCost).toBeCloseTo(149.97, 1);
    expect(result.monthlyTotalCosts).toBeCloseTo(4399.82, 1);
    expect(result.monthlyProfit).toBeCloseTo(599.18, 1);
    expect(result.profitMargin).toBeCloseTo(11.99, 1);
    expect(result.profitPerUnit).toBeCloseTo(5.99, 1);
  });

  it("returns break-even profit with matching price and costs", () => {
    const breakEvenPrice = 35 / 0.82;
    const result = calculateDropshippingMargin({ productPrice: breakEvenPrice, supplierCost: 20, shippingCost: 5, platformFeePercent: 15, advertisingCostPerUnit: 10, unitsSoldPerMonth: 100, returnRate: 3 });
    expect(result.monthlyProfit).toBeCloseTo(0, 0);
  });

  it("throws for negative values", () => {
    expect(() => calculateDropshippingMargin({ productPrice: -1, supplierCost: 20, shippingCost: 5, platformFeePercent: 15, advertisingCostPerUnit: 10, unitsSoldPerMonth: 100, returnRate: 3 })).toThrow();
  });
});
