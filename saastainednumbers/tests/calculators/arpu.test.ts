import { describe, it, expect } from "vitest";
import { calculateARPU } from "@/calculators/engine/arpu";

describe("calculateARPU", () => {
  it("computes ARPU correctly", () => {
    const result = calculateARPU({ mrr: 50000, totalCustomers: 1000 });
    expect(result.arpu).toBe(50);
  });

  it("throws for zero customers", () => {
    expect(() => calculateARPU({ mrr: 1000, totalCustomers: 0 })).toThrow();
  });

  it("throws for negative MRR", () => {
    expect(() => calculateARPU({ mrr: -100, totalCustomers: 10 })).toThrow();
  });
});
