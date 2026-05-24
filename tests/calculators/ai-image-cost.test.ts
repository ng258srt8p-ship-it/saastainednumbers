import { describe, it, expect } from "vitest";
import { calculateAIImageCost } from "@/calculators/engine/ai-image-cost";
describe("calculateAIImageCost", () => {
  it("computes costs correctly for DALL-E", () => {
    const r = calculateAIImageCost({ imagesPerMonth: 100, costPerImage: 0.04 });
    expect(r.monthlyCost).toBe(4);
    expect(r.annualCost).toBe(48);
    expect(r.costPerImage).toBe(0.04);
  });
  it("handles high volume", () => {
    const r = calculateAIImageCost({ imagesPerMonth: 10000, costPerImage: 0.01 });
    expect(r.monthlyCost).toBe(100);
  });
  it("throws for negative values", () => {
    expect(() => calculateAIImageCost({ imagesPerMonth: -1, costPerImage: 0.04 })).toThrow();
  });
});
