import { describe, it, expect } from "vitest";
import { calculateTikTokCreatorFund } from "@/calculators/engine/tiktok-creator-fund";

describe("calculateTikTokCreatorFund", () => {
  it("computes payout correctly with default US values", () => {
    const result = calculateTikTokCreatorFund({ monthlyViews: 100000, region: "US", engagementRate: 5, avgVideoLengthSec: 30 });
    expect(result.estimatedMonthlyPayout).toBeCloseTo(3.94, 1);
    expect(result.annualPayout).toBeCloseTo(47.25, 1);
    expect(result.rpm).toBeCloseTo(0.0394, 2);
  });

  it("returns zero payout with zero views", () => {
    const result = calculateTikTokCreatorFund({ monthlyViews: 0, region: "US", engagementRate: 5, avgVideoLengthSec: 30 });
    expect(result.estimatedMonthlyPayout).toBe(0);
    expect(result.annualPayout).toBe(0);
  });

  it("throws for negative views", () => {
    expect(() => calculateTikTokCreatorFund({ monthlyViews: -1, region: "US", engagementRate: 5, avgVideoLengthSec: 30 })).toThrow();
  });
});
