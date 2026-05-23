import { describe, it, expect } from "vitest";
import { calculateNetPromoterScore } from "@/calculators/engine/nps";

describe("calculateNetPromoterScore", () => {
  it("computes NPS correctly", () => {
    const r = calculateNetPromoterScore({ promoters: 200, passives: 150, detractors: 50 });
    expect(r.nps).toBeCloseTo(37.5, 0);
    expect(r.totalResponses).toBe(400);
  });

  it("throws for zero total responses", () => {
    expect(() => calculateNetPromoterScore({ promoters: 0, passives: 0, detractors: 0 })).toThrow();
  });

  it("handles all promoters", () => {
    const r = calculateNetPromoterScore({ promoters: 100, passives: 0, detractors: 0 });
    expect(r.nps).toBe(100);
  });
});
