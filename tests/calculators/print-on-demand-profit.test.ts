import { describe, it, expect } from "vitest";
import { calculatePrintOnDemandProfit } from "@/calculators/engine/print-on-demand-profit";

describe("calculatePrintOnDemandProfit", () => {
  it("computes profit correctly with default values", () => {
    const result = calculatePrintOnDemandProfit({ itemPrice: 25, baseProductCost: 8, printCost: 4, platformFee: 5, shippingCost: 3.99, unitsSoldPerMonth: 200 });
    expect(result.monthlyRevenue).toBe(5000);
    expect(result.monthlyCOGS).toBe(2400);
    expect(result.monthlyFees).toBe(1000);
    expect(result.monthlyShipping).toBe(798);
    expect(result.monthlyProfit).toBe(802);
    expect(result.profitMargin).toBeCloseTo(16.04, 1);
    expect(result.profitPerUnit).toBe(4.01);
  });

  it("returns zeros with no units sold", () => {
    const result = calculatePrintOnDemandProfit({ itemPrice: 25, baseProductCost: 8, printCost: 4, platformFee: 5, shippingCost: 3.99, unitsSoldPerMonth: 0 });
    expect(result.monthlyRevenue).toBe(0);
    expect(result.monthlyCOGS).toBe(0);
    expect(result.monthlyFees).toBe(0);
    expect(result.monthlyShipping).toBe(0);
    expect(result.monthlyProfit).toBe(0);
    expect(result.profitMargin).toBe(0);
  });

  it("throws for negative values", () => {
    expect(() => calculatePrintOnDemandProfit({ itemPrice: -1, baseProductCost: 8, printCost: 4, platformFee: 5, shippingCost: 3.99, unitsSoldPerMonth: 200 })).toThrow();
  });
});
