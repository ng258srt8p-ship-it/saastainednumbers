import { describe, it, expect } from "vitest";
import { calculateROAS } from "@/calculators/engine/roas";

describe("calculateROAS", () => {
  it("calculates positive ROAS correctly", () => {
    const result = calculateROAS({ adSpend: 5000, revenueFromAds: 20000 });
    expect(result.roas).toBe(4);
    expect(result.netReturn).toBe(15000);
    expect(result.profitMargin).toBeCloseTo(75, 1);
  });

  it("break-even ROAS (1.0)", () => {
    const result = calculateROAS({ adSpend: 5000, revenueFromAds: 5000 });
    expect(result.roas).toBe(1);
    expect(result.netReturn).toBe(0);
    expect(result.profitMargin).toBe(0);
  });

  it("negative ROAS (below 1.0)", () => {
    const result = calculateROAS({ adSpend: 10000, revenueFromAds: 5000 });
    expect(result.roas).toBe(0.5);
    expect(result.netReturn).toBe(-5000);
    expect(result.profitMargin).toBe(-100);
  });

  it("throws for zero or negative ad spend", () => {
    expect(() => calculateROAS({ adSpend: 0, revenueFromAds: 1000 })).toThrow();
    expect(() => calculateROAS({ adSpend: -100, revenueFromAds: 1000 })).toThrow();
  });

  it("handles zero revenue", () => {
    const result = calculateROAS({ adSpend: 1000, revenueFromAds: 0 });
    expect(result.roas).toBe(0);
    expect(result.netReturn).toBe(-1000);
    expect(result.profitMargin).toBe(0);
  });
});
