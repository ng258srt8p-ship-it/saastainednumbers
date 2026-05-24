import { describe, it, expect } from "vitest";
import { calculateAmazonFBA } from "@/calculators/engine/amazon-fba";
describe("calculateAmazonFBA", () => {
  it("computes profit correctly", () => {
    const r = calculateAmazonFBA({ itemPrice: 29.99, costOfGoods: 8, referralFeePercent: 15, fbaFulfillmentFee: 5.50, monthlyStorageFee: 50, advertisingCostPerUnit: 3, unitsSoldPerMonth: 200 });
    expect(r.monthlyRevenue).toBeCloseTo(5998, 0);
    expect(r.monthlyProfit).toBeGreaterThan(0);
    expect(r.profitMargin).toBeGreaterThan(0);
    expect(r.profitPerUnit).toBeGreaterThan(0);
  });
  it("handles single unit", () => {
    const r = calculateAmazonFBA({ itemPrice: 29.99, costOfGoods: 8, referralFeePercent: 15, fbaFulfillmentFee: 5.50, monthlyStorageFee: 50, advertisingCostPerUnit: 3, unitsSoldPerMonth: 1 });
    expect(r.monthlyRevenue).toBe(29.99);
  });
  it("throws for negative values", () => {
    expect(() => calculateAmazonFBA({ itemPrice: -1, costOfGoods: 8, referralFeePercent: 15, fbaFulfillmentFee: 5.50, monthlyStorageFee: 50, advertisingCostPerUnit: 3, unitsSoldPerMonth: 200 })).toThrow();
  });
});
