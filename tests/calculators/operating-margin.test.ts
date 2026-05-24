import { describe, it, expect } from "vitest";
import { calculateOperatingMargin } from "@/calculators/engine/operating-margin";

describe("calculateOperatingMargin", () => {
  it("computes operating margin correctly", () => {
    const r = calculateOperatingMargin({ operatingIncome: 20000, revenue: 100000 });
    expect(r.operatingMargin).toBe(20);
  });

  it("handles negative margins", () => {
    const r = calculateOperatingMargin({ operatingIncome: -10000, revenue: 100000 });
    expect(r.operatingMargin).toBe(-10);
  });

  it("throws for zero revenue", () => {
    expect(() => calculateOperatingMargin({ operatingIncome: 0, revenue: 0 })).toThrow();
  });
});
