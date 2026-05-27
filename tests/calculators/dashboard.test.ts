import { describe, it, expect } from "vitest";
import { calculateMRR } from "@/calculators/engine/mrr";
import { calculateCAC } from "@/calculators/engine/cac";
import { calculateLTVWithCAC } from "@/calculators/engine/ltv";
import { calculateChurn } from "@/calculators/engine/churn";
import { calculateARPU } from "@/calculators/engine/arpu";

const defaults = {
  customers: 1000,
  arpu: 50,
  churnRate: 5,
  grossMargin: 80,
  salesCost: 15000,
  marketingCost: 5000,
  newCustomers: 100,
};

describe("dashboard computation", () => {
  it("computes all metrics from default inputs", () => {
    const mrr = calculateMRR({ customers: defaults.customers, arpu: defaults.arpu });
    expect(mrr.mrr).toBe(50000);
    expect(mrr.arr).toBe(600000);

    const cac = calculateCAC({ salesCost: defaults.salesCost, marketingCost: defaults.marketingCost, newCustomers: defaults.newCustomers });
    expect(cac.cac).toBe(200);

    const ltv = calculateLTVWithCAC({ arpu: defaults.arpu, grossMargin: defaults.grossMargin, churnRate: defaults.churnRate, cac: cac.cac });
    expect(ltv.ltv).toBe(800);
    expect(ltv.ltvCacRatio).toBe(4);

    const lost = Math.round(defaults.customers * defaults.churnRate / 100);
    const churn = calculateChurn({
      customersStart: defaults.customers,
      customersEnd: defaults.customers - lost,
      lostCustomers: lost,
    });
    expect(churn.monthlyChurnPct).toBe(5);
    expect(churn.annualChurnPct).toBeCloseTo(46, 0);

    const arpu = calculateARPU({ mrr: mrr.mrr, totalCustomers: defaults.customers });
    expect(arpu.arpu).toBe(50);
  });

  it("LTV:CAC ratio is zero when CAC is zero", () => {
    const ltv = calculateLTVWithCAC({ arpu: 50, grossMargin: 80, churnRate: 5, cac: 0 });
    expect(ltv.ltvCacRatio).toBe(0);
  });

  it("LTV:CAC ratio scales with CAC changes", () => {
    const lowCac = calculateLTVWithCAC({ arpu: 50, grossMargin: 80, churnRate: 5, cac: 100 });
    const highCac = calculateLTVWithCAC({ arpu: 50, grossMargin: 80, churnRate: 5, cac: 400 });
    expect(lowCac.ltvCacRatio).toBeGreaterThan(highCac.ltvCacRatio);
    expect(highCac.ltvCacRatio).toBe(2);
  });

  it("churn rate affects LTV inversely", () => {
    const lowChurn = calculateLTVWithCAC({ arpu: 50, grossMargin: 80, churnRate: 2, cac: 200 });
    const highChurn = calculateLTVWithCAC({ arpu: 50, grossMargin: 80, churnRate: 10, cac: 200 });
    expect(lowChurn.ltv).toBeGreaterThan(highChurn.ltv);
  });
});
