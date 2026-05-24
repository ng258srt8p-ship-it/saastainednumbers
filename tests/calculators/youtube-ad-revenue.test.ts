import { describe, it, expect } from "vitest";
import { calculateYouTubeAdRevenue } from "@/calculators/engine/youtube-ad-revenue";

describe("calculateYouTubeAdRevenue", () => {
  it("computes revenue correctly", () => {
    const result = calculateYouTubeAdRevenue({ viewsPerMonth: 50000, rpm: 3.50 });
    expect(result.monthlyRevenue).toBe(175);
    expect(result.annualRevenue).toBe(2100);
    expect(result.revenuePerThousandViews).toBe(3.50);
  });

  it("returns zero for zero views", () => {
    const result = calculateYouTubeAdRevenue({ viewsPerMonth: 0, rpm: 3.50 });
    expect(result.monthlyRevenue).toBe(0);
    expect(result.annualRevenue).toBe(0);
  });

  it("throws for negative views", () => {
    expect(() => calculateYouTubeAdRevenue({ viewsPerMonth: -1, rpm: 3.50 })).toThrow();
  });

  it("handles high-RPM finance niche", () => {
    const result = calculateYouTubeAdRevenue({ viewsPerMonth: 100000, rpm: 12.00 });
    expect(result.monthlyRevenue).toBe(1200);
    expect(result.annualRevenue).toBe(14400);
  });
});
