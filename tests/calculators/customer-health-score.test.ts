import { describe, it, expect } from "vitest";
import { calculateCustomerHealthScore } from "@/calculators/engine/customer-health-score";

describe("calculateCustomerHealthScore", () => {
  it("returns Champion for high scores", () => {
    const r = calculateCustomerHealthScore({ nps: 80, productUsageScore: 90, supportTickets: 0, daysSinceLastLogin: 1 });
    expect(r.healthScore).toBeGreaterThanOrEqual(80);
    expect(r.healthCategory).toBe("Champion");
  });

  it("returns At Risk for low scores", () => {
    const r = calculateCustomerHealthScore({ nps: -50, productUsageScore: 20, supportTickets: 10, daysSinceLastLogin: 30 });
    expect(r.healthCategory).toBe("At Risk");
  });

  it("throws for out-of-range NPS", () => {
    expect(() => calculateCustomerHealthScore({ nps: 200, productUsageScore: 50, supportTickets: 0, daysSinceLastLogin: 0 })).toThrow();
  });
});
