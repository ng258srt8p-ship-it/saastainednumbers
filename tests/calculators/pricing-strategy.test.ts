import { describe, it, expect } from "vitest";
import { calculatePricingStrategy } from "@/calculators/engine/pricing-strategy";
describe("calculatePricingStrategy", () => {
  it("computes pricing correctly", () => {
    const r = calculatePricingStrategy({ costPerUnit: 20, desiredMarginPercent: 60, competitorPrice: 75, customerPerceivedValue: 100 });
    expect(r.costPlusPrice).toBe(32);
    expect(r.targetMarginPrice).toBe(50);
    expect(r.valueBasedPrice).toBe(87.50);
    expect(r.recommendedPrice).toBe(87.50);
    expect(r.recommendedMargin).toBeCloseTo(77.1, 0);
  });
  it("handles premium product", () => {
    const r = calculatePricingStrategy({ costPerUnit: 10, desiredMarginPercent: 80, competitorPrice: 50, customerPerceivedValue: 100 });
    expect(r.recommendedPrice).toBeGreaterThan(0);
  });
  it("throws for excessive margin", () => {
    expect(() => calculatePricingStrategy({ costPerUnit: 20, desiredMarginPercent: 100, competitorPrice: 75, customerPerceivedValue: 100 })).toThrow();
  });
});
