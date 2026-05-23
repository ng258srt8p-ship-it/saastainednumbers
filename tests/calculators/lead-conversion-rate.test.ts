import { describe, it, expect } from "vitest";
import { calculateLeadConversionRate } from "@/calculators/engine/lead-conversion-rate";

describe("calculateLeadConversionRate", () => {
  it("computes conversion rate correctly", () => {
    const r = calculateLeadConversionRate({ leads: 2000, customers: 100 });
    expect(r.conversionRate).toBeCloseTo(5, 1);
    expect(r.lostLeads).toBe(1900);
  });

  it("returns 0 for zero leads", () => {
    const r = calculateLeadConversionRate({ leads: 0, customers: 0 });
    expect(r.conversionRate).toBe(0);
  });

  it("throws when customers exceed leads", () => {
    expect(() => calculateLeadConversionRate({ leads: 100, customers: 200 })).toThrow();
  });
});
