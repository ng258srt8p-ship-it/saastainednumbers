import { describe, it, expect } from "vitest";
import { calculateROI } from "@/calculators/engine/roi";

describe("calculateROI", () => {
  it("computes ROI correctly", () => {
    const result = calculateROI({ initialInvestment: 10000, finalValue: 15000, years: 3 });
    expect(result.totalGain).toBe(5000);
    expect(result.roiPercent).toBe(50);
    expect(result.annualizedROI).toBeCloseTo(14.5, 0);
  });

  it("handles loss scenario", () => {
    const result = calculateROI({ initialInvestment: 10000, finalValue: 8000, years: 2 });
    expect(result.totalGain).toBe(-2000);
    expect(result.roiPercent).toBe(-20);
    expect(result.annualizedROI).toBeCloseTo(-10.6, 0);
  });

  it("throws for zero initial investment", () => {
    expect(() => calculateROI({ initialInvestment: 0, finalValue: 10000, years: 3 })).toThrow();
  });

  it("throws for negative years", () => {
    expect(() => calculateROI({ initialInvestment: 10000, finalValue: 15000, years: 0 })).toThrow();
  });
});
