import { describe, it, expect } from "vitest";
import { calculateRevenuePerUserTrend } from "@/calculators/engine/revenue-per-user-trend";

describe("calculateRevenuePerUserTrend", () => {
  it("returns Growing for increasing ARPU", () => {
    const r = calculateRevenuePerUserTrend({ monthlyRevenue: [50000, 55000], monthlyUsers: [500, 520] });
    expect(r.currentArpu).toBeCloseTo(105.77, 1);
    expect(r.prevArpu).toBe(100);
    expect(r.arpuGrowth).toBeCloseTo(5.77, 1);
    expect(r.trend).toBe("Growing");
  });

  it("returns Declining for decreasing ARPU", () => {
    const r = calculateRevenuePerUserTrend({ monthlyRevenue: [60000, 50000], monthlyUsers: [500, 600] });
    expect(r.trend).toBe("Declining");
    expect(r.arpuGrowth).toBeLessThan(0);
  });

  it("throws for insufficient data", () => {
    expect(() => calculateRevenuePerUserTrend({ monthlyRevenue: [50000], monthlyUsers: [500] })).toThrow();
  });
});
