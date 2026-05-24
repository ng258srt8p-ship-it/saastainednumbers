import { describe, it, expect } from "vitest";
import { calculateCustomerEngagementScore } from "@/calculators/engine/customer-engagement-score";
describe("calculateCustomerEngagementScore", () => {
  it("computes engagement score correctly", () => {
    const r = calculateCustomerEngagementScore({ dailyActiveUsers: 5000, monthlyActiveUsers: 25000, sessionsPerUserPerMonth: 12, avgSessionDurationMinutes: 15, featureAdoptionRate: 40 });
    expect(r.dauMauRatio).toBe(20);
    expect(r.engagementScore).toBeGreaterThan(0);
    expect(r.engagementScore).toBeLessThanOrEqual(100);
    expect(r.engagementCategory).toBeTruthy();
  });
  it("handles highly engaged users", () => {
    const r = calculateCustomerEngagementScore({ dailyActiveUsers: 8000, monthlyActiveUsers: 10000, sessionsPerUserPerMonth: 30, avgSessionDurationMinutes: 30, featureAdoptionRate: 80 });
    expect(r.dauMauRatio).toBe(80);
    expect(r.engagementCategory).toBe("Highly Engaged");
  });
  it("throws when DAU > MAU", () => {
    expect(() => calculateCustomerEngagementScore({ dailyActiveUsers: 100, monthlyActiveUsers: 50, sessionsPerUserPerMonth: 10, avgSessionDurationMinutes: 15, featureAdoptionRate: 40 })).toThrow();
  });
});
