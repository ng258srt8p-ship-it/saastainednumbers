import { describe, it, expect } from "vitest";
import { calculateRuleOf40 } from "@/calculators/engine/rule-of-40";

describe("calculateRuleOf40", () => {
  it("meets threshold when combined score is 40+", () => {
    const r = calculateRuleOf40({ revenueGrowthRate: 30, profitMargin: 10 });
    expect(r.ruleOf40Score).toBe(40);
    expect(r.meetsThreshold).toBe(true);
  });

  it("fails threshold when score is below 40", () => {
    const r = calculateRuleOf40({ revenueGrowthRate: 20, profitMargin: 5 });
    expect(r.ruleOf40Score).toBe(25);
    expect(r.meetsThreshold).toBe(false);
  });
});
