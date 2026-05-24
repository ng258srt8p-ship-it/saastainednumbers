import { describe, it, expect } from "vitest";
import { calculateTwitchRevenue } from "@/calculators/engine/twitch-revenue";

describe("calculateTwitchRevenue", () => {
  it("computes revenue correctly with default values", () => {
    const result = calculateTwitchRevenue({ avgViewers: 50, streamHoursPerMonth: 80, subCount: 100, subPrice: 4.99, adRevenuePerHour: 2.50, bitsRevenuePerMonth: 100 });
    expect(result.monthlySubRevenue).toBe(499);
    expect(result.monthlyAdRevenue).toBe(200);
    expect(result.monthlyBitsRevenue).toBe(100);
    expect(result.monthlyTotal).toBe(799);
    expect(result.annualRevenue).toBe(9588);
    expect(result.revenuePerStreamHour).toBe(9.9875);
  });

  it("returns zero when all revenue sources are zero", () => {
    const result = calculateTwitchRevenue({ avgViewers: 0, streamHoursPerMonth: 0, subCount: 0, subPrice: 0, adRevenuePerHour: 0, bitsRevenuePerMonth: 0 });
    expect(result.monthlySubRevenue).toBe(0);
    expect(result.monthlyAdRevenue).toBe(0);
    expect(result.monthlyBitsRevenue).toBe(0);
    expect(result.monthlyTotal).toBe(0);
    expect(result.annualRevenue).toBe(0);
    expect(result.revenuePerStreamHour).toBe(0);
  });

  it("throws for negative values", () => {
    expect(() => calculateTwitchRevenue({ avgViewers: -1, streamHoursPerMonth: 80, subCount: 100, subPrice: 4.99, adRevenuePerHour: 2.50, bitsRevenuePerMonth: 100 })).toThrow();
  });
});
