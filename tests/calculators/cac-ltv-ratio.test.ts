import { describe, it, expect } from "vitest";
import { calculateCACLTVRatio } from "@/calculators/engine/cac-ltv-ratio";

describe("calculateCACLTVRatio", () => {
  it("computes ratio correctly", () => {
    const r = calculateCACLTVRatio({ ltv: 3000, cac: 1000 });
    expect(r.ratio).toBe(3);
  });

  it("throws for zero CAC", () => {
    expect(() => calculateCACLTVRatio({ ltv: 1000, cac: 0 })).toThrow();
  });
});
