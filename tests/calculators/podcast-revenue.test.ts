import { describe, it, expect } from "vitest";
import { calculatePodcastRevenue } from "@/calculators/engine/podcast-revenue";
describe("calculatePodcastRevenue", () => {
  it("computes revenue correctly", () => {
    const r = calculatePodcastRevenue({ downloadsPerEpisode: 5000, episodesPerMonth: 4, cpm: 25, sponsorshipRate: 500, sponsorsPerEpisode: 2 });
    expect(r.monthlyAdRevenue).toBe(500);
    expect(r.monthlySponsorshipRevenue).toBe(4000);
    expect(r.monthlyTotalRevenue).toBe(4500);
    expect(r.annualRevenue).toBe(54000);
  });
  it("handles zero episodes", () => {
    const r = calculatePodcastRevenue({ downloadsPerEpisode: 5000, episodesPerMonth: 0, cpm: 25, sponsorshipRate: 500, sponsorsPerEpisode: 2 });
    expect(r.monthlyTotalRevenue).toBe(0);
  });
  it("throws for negative values", () => {
    expect(() => calculatePodcastRevenue({ downloadsPerEpisode: -1, episodesPerMonth: 4, cpm: 25, sponsorshipRate: 500, sponsorsPerEpisode: 2 })).toThrow();
  });
});
