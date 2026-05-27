import { describe, it, expect } from "vitest";
import { calculateConversionRate } from "@/calculators/engine/conversion-rate";

describe("calculateConversionRate", () => {
  it("calculates standard conversion rate", () => {
    const result = calculateConversionRate({ totalVisitors: 10000, totalConversions: 350 });
    expect(result.conversionRate).toBeCloseTo(3.5, 1);
    expect(result.totalConversions).toBe(350);
    expect(result.visitorsNotConverted).toBe(9650);
  });

  it("handles 100% conversion", () => {
    const result = calculateConversionRate({ totalVisitors: 500, totalConversions: 500 });
    expect(result.conversionRate).toBe(100);
    expect(result.visitorsNotConverted).toBe(0);
  });

  it("handles 0% conversion", () => {
    const result = calculateConversionRate({ totalVisitors: 1000, totalConversions: 0 });
    expect(result.conversionRate).toBe(0);
    expect(result.visitorsNotConverted).toBe(1000);
  });

  it("throws for invalid inputs", () => {
    expect(() => calculateConversionRate({ totalVisitors: 0, totalConversions: 0 })).toThrow();
    expect(() => calculateConversionRate({ totalVisitors: 100, totalConversions: 101 })).toThrow();
    expect(() => calculateConversionRate({ totalVisitors: 100, totalConversions: -1 })).toThrow();
  });
});
