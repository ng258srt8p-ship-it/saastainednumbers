import { describe, it, expect } from "vitest";
import { calculateTrialToPaid } from "@/calculators/engine/trial-to-paid";

describe("calculateTrialToPaid", () => {
  it("computes conversion rate correctly", () => {
    const r = calculateTrialToPaid({ trialSignups: 500, paidConversions: 75 });
    expect(r.conversionRate).toBeCloseTo(15, 1);
    expect(r.notConverted).toBe(425);
  });

  it("returns 0 for zero trial signups", () => {
    const r = calculateTrialToPaid({ trialSignups: 0, paidConversions: 0 });
    expect(r.conversionRate).toBe(0);
  });

  it("throws when conversions exceed signups", () => {
    expect(() => calculateTrialToPaid({ trialSignups: 100, paidConversions: 200 })).toThrow();
  });
});
