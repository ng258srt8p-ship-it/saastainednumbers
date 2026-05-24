import { describe, it, expect } from "vitest";
import { calculateRevenuePerEmployee } from "@/calculators/engine/revenue-per-employee";

describe("calculateRevenuePerEmployee", () => {
  it("computes revenue per employee correctly", () => {
    const r = calculateRevenuePerEmployee({ totalRevenue: 5000000, headcount: 50 });
    expect(r.revenuePerEmployee).toBe(100000);
  });

  it("throws for zero headcount", () => {
    expect(() => calculateRevenuePerEmployee({ totalRevenue: 100000, headcount: 0 })).toThrow();
  });
});
