import { describe, it, expect } from "vitest";
import { calculateFeatureAdoptionRate } from "@/calculators/engine/feature-adoption-rate";

describe("calculateFeatureAdoptionRate", () => {
  it("computes default values correctly", () => {
    const r = calculateFeatureAdoptionRate({ totalUsers: 1000, usersUsingFeature: 300, targetAdoptionRate: 50 });
    expect(r.adoptionRate).toBe(30);
    expect(r.gapToTarget).toBe(20);
    expect(r.usersNeeded).toBe(200);
    expect(r.status).toBe("Critical");
  });

  it("returns On Track when above target", () => {
    const r = calculateFeatureAdoptionRate({ totalUsers: 1000, usersUsingFeature: 800, targetAdoptionRate: 50 });
    expect(r.adoptionRate).toBe(80);
    expect(r.status).toBe("On Track");
  });

  it("throws when users exceed total", () => {
    expect(() => calculateFeatureAdoptionRate({ totalUsers: 100, usersUsingFeature: 200, targetAdoptionRate: 50 })).toThrow();
  });

  it("throws for negative values", () => {
    expect(() => calculateFeatureAdoptionRate({ totalUsers: -1, usersUsingFeature: 50, targetAdoptionRate: 50 })).toThrow();
  });
});
