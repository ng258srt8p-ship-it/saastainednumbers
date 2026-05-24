import { describe, it, expect } from "vitest";
import { calculateNewsletterRevenue } from "@/calculators/engine/newsletter-revenue";
describe("calculateNewsletterRevenue", () => {
  it("computes revenue correctly", () => {
    const r = calculateNewsletterRevenue({ subscribers: 10000, freeToPaidConversionRate: 5, monthlyPrice: 8, sponsorshipCpm: 50, sponsorshipEmailsPerMonth: 2, openRate: 45 });
    expect(r.paidSubscribers).toBe(500);
    expect(r.monthlySubscriptionRevenue).toBe(4000);
    expect(r.monthlySponsorshipRevenue).toBeCloseTo(450, 0);
    expect(r.monthlyTotalRevenue).toBeCloseTo(4450, 0);
  });
  it("handles zero subscribers", () => {
    const r = calculateNewsletterRevenue({ subscribers: 0, freeToPaidConversionRate: 5, monthlyPrice: 8, sponsorshipCpm: 50, sponsorshipEmailsPerMonth: 2, openRate: 45 });
    expect(r.monthlyTotalRevenue).toBe(0);
  });
  it("throws for negative values", () => {
    expect(() => calculateNewsletterRevenue({ subscribers: -1, freeToPaidConversionRate: 5, monthlyPrice: 8, sponsorshipCpm: 50, sponsorshipEmailsPerMonth: 2, openRate: 45 })).toThrow();
  });
});
