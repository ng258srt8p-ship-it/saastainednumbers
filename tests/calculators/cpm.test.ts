import { describe, it, expect } from "vitest";
import { calculateCPM } from "@/calculators/engine/cpm";

describe("calculateCPM", () => {
  it("calculates standard CPM", () => {
    const result = calculateCPM({ totalCost: 500, totalImpressions: 100000 });
    expect(result.cpm).toBe(5);
    expect(result.totalCost).toBe(500);
    expect(result.totalImpressions).toBe(100000);
  });

  it("handles zero cost", () => {
    const result = calculateCPM({ totalCost: 0, totalImpressions: 50000 });
    expect(result.cpm).toBe(0);
  });

  it("calculates high CPM", () => {
    const result = calculateCPM({ totalCost: 5000, totalImpressions: 25000 });
    expect(result.cpm).toBe(200);
  });

  it("throws for invalid inputs", () => {
    expect(() => calculateCPM({ totalCost: 100, totalImpressions: 0 })).toThrow();
    expect(() => calculateCPM({ totalCost: -100, totalImpressions: 1000 })).toThrow();
  });
});
