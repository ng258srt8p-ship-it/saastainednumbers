import { describe, it, expect } from "vitest";
import { calculateCTR } from "@/calculators/engine/ctr";

describe("calculateCTR", () => {
  it("calculates standard CTR", () => {
    const result = calculateCTR({ totalImpressions: 10000, totalClicks: 250 });
    expect(result.ctr).toBe(2.5);
    expect(result.totalImpressions).toBe(10000);
    expect(result.totalClicks).toBe(250);
  });

  it("handles 100% CTR", () => {
    const result = calculateCTR({ totalImpressions: 500, totalClicks: 500 });
    expect(result.ctr).toBe(100);
  });

  it("handles 0% CTR", () => {
    const result = calculateCTR({ totalImpressions: 1000, totalClicks: 0 });
    expect(result.ctr).toBe(0);
  });

  it("throws for invalid inputs", () => {
    expect(() => calculateCTR({ totalImpressions: 0, totalClicks: 0 })).toThrow();
    expect(() => calculateCTR({ totalImpressions: 100, totalClicks: 101 })).toThrow();
    expect(() => calculateCTR({ totalImpressions: 100, totalClicks: -1 })).toThrow();
  });
});
