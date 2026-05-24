import { describe, it, expect } from "vitest";
import { calculateEtsyProfit } from "@/calculators/engine/etsy-profit";

describe("calculateEtsyProfit", () => {
  it("computes profit correctly for standard Etsy fees", () => {
    const result = calculateEtsyProfit({ itemPrice: 25, costOfGoods: 8, shippingCost: 5, listingFee: 0.20, transactionFeePercent: 6.5, paymentFeePercent: 3, paymentFixedFee: 0.25, quantitySold: 100 });
    expect(result.revenue).toBe(2500);
    expect(result.totalCostOfGoods).toBe(800);
    expect(result.totalShipping).toBe(500);
    expect(result.totalListingFees).toBe(20);
    expect(result.totalTransactionFees).toBe(162.50);
    expect(result.totalPaymentFees).toBe(100);
    expect(result.totalFees).toBe(282.50);
    expect(result.totalCosts).toBe(1582.50);
    expect(result.profit).toBe(917.50);
    expect(result.profitMargin).toBeCloseTo(36.7, 0);
    expect(result.profitPerItem).toBeCloseTo(9.18, 0);
  });

  it("handles single item", () => {
    const result = calculateEtsyProfit({ itemPrice: 25, costOfGoods: 8, shippingCost: 5, listingFee: 0.20, transactionFeePercent: 6.5, paymentFeePercent: 3, paymentFixedFee: 0.25, quantitySold: 1 });
    expect(result.revenue).toBe(25);
    expect(result.profitPerItem).toBeCloseTo(9.18, 0);
  });

  it("throws for negative values", () => {
    expect(() => calculateEtsyProfit({ itemPrice: -1, costOfGoods: 8, shippingCost: 5, listingFee: 0.20, transactionFeePercent: 6.5, paymentFeePercent: 3, paymentFixedFee: 0.25, quantitySold: 1 })).toThrow();
  });
});
