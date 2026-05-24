import { describe, it, expect } from "vitest";
import { calculateActivationRate } from "@/calculators/engine/activation-rate";

describe("calculateActivationRate", () => {
  it("computes activation rate correctly", () => {
    const r = calculateActivationRate({ signups: 1000, activated: 400 });
    expect(r.activationRate).toBeCloseTo(40, 1);
    expect(r.notActivated).toBe(600);
  });

  it("returns 0 for zero signups", () => {
    const r = calculateActivationRate({ signups: 0, activated: 0 });
    expect(r.activationRate).toBe(0);
  });

  it("throws when activated exceeds signups", () => {
    expect(() => calculateActivationRate({ signups: 100, activated: 200 })).toThrow();
  });
});
