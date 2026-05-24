import { describe, it, expect } from "vitest";
import { calculateMRR } from "@/calculators/engine/mrr";

describe("calculateMRR", () => {
  it("computes MRR and ARR correctly", () => {
    const result = calculateMRR({ customers: 100, arpu: 50 });
    expect(result.mrr).toBe(5000);
    expect(result.arr).toBe(60000);
  });

  it("returns zero for zero customers", () => {
    const result = calculateMRR({ customers: 0, arpu: 50 });
    expect(result.mrr).toBe(0);
    expect(result.arr).toBe(0);
  });

  it("throws for negative values", () => {
    expect(() => calculateMRR({ customers: -1, arpu: 50 })).toThrow();
    expect(() => calculateMRR({ customers: 100, arpu: -1 })).toThrow();
  });
});
