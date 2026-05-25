import { describe, it, expect } from "vitest";
import { generateInsights } from "@/lib/insights-engine";

function ctx(overrides: Record<string, unknown> = {}) {
  return {
    title: "Test Calculator",
    description: "A test calculator for unit testing",
    category: "general-business",
    inputs: [{ id: "input1", label: "Test Input", value: 100, type: "currency" }],
    outputs: [{ id: "output1", label: "Test Output", value: 100, type: "currency", isPrimary: true }],
    ...overrides,
  };
}

describe("generateInsights", () => {
  it("returns markdown with ## Insights header", () => {
    const result = generateInsights(ctx());
    expect(result).toContain("## Insights");
  });

  it("returns at least 3 insights", () => {
    const result = generateInsights(ctx());
    const lines = result.split("\n").filter((l) => l.match(/^\d+\./));
    expect(lines.length).toBeGreaterThanOrEqual(3);
  });

  it("returns at most 5 insights", () => {
    const result = generateInsights(ctx());
    const lines = result.split("\n").filter((l) => l.match(/^\d+\./));
    expect(lines.length).toBeLessThanOrEqual(5);
  });

  it("handles zero primary value", () => {
    const result = generateInsights(ctx({ outputs: [{ id: "out", label: "Val", value: 0, type: "currency", isPrimary: true }] }));
    expect(result).toContain("## Insights");
    expect(result.length).toBeGreaterThan(20);
  });

  it("handles negative primary value", () => {
    const result = generateInsights(ctx({ outputs: [{ id: "out", label: "Val", value: -500, type: "currency", isPrimary: true }] }));
    expect(result).toContain("## Insights");
  });

  it("handles number type primary (NPS-like)", () => {
    const result = generateInsights(ctx({
      category: "churn-retention",
      outputs: [{ id: "score", label: "Score", value: 42, type: "number", isPrimary: true }],
    }));
    expect(result).toContain("## Insights");
  });

  it("handles percentage type primary", () => {
    const result = generateInsights(ctx({
      outputs: [{ id: "pct", label: "Rate", value: 75, type: "percentage", isPrimary: true }],
    }));
    expect(result).toContain("## Insights");
  });

  it("handles ratio type primary", () => {
    const result = generateInsights(ctx({
      outputs: [{ id: "ratio", label: "Ratio", value: 3.5, type: "ratio", isPrimary: true }],
      category: "saas-deepen",
    }));
    expect(result).toContain("## Insights");
  });
});

/* ─── Category-specific tests ──────────────────────────────────── */

describe("revenue category", () => {
  it("handles NRR calculator", () => {
    const result = generateInsights(ctx({
      title: "Net Revenue Retention (NRR) Calculator",
      category: "revenue",
      outputs: [{ id: "nrr", label: "NRR", value: 115, type: "percentage", isPrimary: true }],
    }));
    expect(result).toMatch(/11[05].*%/);
  });

  it("handles Gross Margin calculator", () => {
    const result = generateInsights(ctx({
      title: "Gross Margin Calculator",
      category: "revenue",
      outputs: [{ id: "gm", label: "Gross Margin", value: 78, type: "percentage", isPrimary: true }],
    }));
    expect(result).toMatch(/78/);
  });

  it("handles generic revenue calculator (MRR)", () => {
    const result = generateInsights(ctx({
      category: "revenue",
      outputs: [{ id: "mrr", label: "MRR", value: 50000, type: "currency", isPrimary: true }],
    }));
    expect(result).toContain("## Insights");
  });
});

describe("growth-efficiency category", () => {
  it("handles Burn Rate calculator", () => {
    const result = generateInsights(ctx({
      title: "Burn Rate & Burn Multiple Calculator",
      category: "growth-efficiency",
      inputs: [
        { id: "monthlyExpenses", label: "Monthly Expenses", value: 50000, type: "currency" },
        { id: "monthlyRevenue", label: "Monthly Revenue", value: 30000, type: "currency" },
        { id: "netNewARR", label: "Net New ARR", value: 20000, type: "currency" },
        { id: "cashReserves", label: "Cash Reserves", value: 500000, type: "currency" },
      ],
      outputs: [
        { id: "netBurnRate", label: "Net Burn Rate", value: 20000, type: "currency", isPrimary: true },
        { id: "burnMultiple", label: "Burn Multiple", value: 1.0, type: "ratio" },
        { id: "runwayMonths", label: "Runway", value: 25, type: "number" },
      ],
    }));
    expect(result).toMatch(/1\.00x|top-quartile/);
  });

  it("handles CAC calculator", () => {
    const result = generateInsights(ctx({
      title: "CAC Calculator",
      category: "growth-efficiency",
      outputs: [{ id: "cac", label: "CAC", value: 1200, type: "currency", isPrimary: true }],
    }));
    expect(result).toContain("## Insights");
  });

  it("handles Magic Number calculator", () => {
    const result = generateInsights(ctx({
      title: "Magic Number Calculator",
      category: "growth-efficiency",
      outputs: [{ id: "magic", label: "Magic Number", value: 0.85, type: "ratio", isPrimary: true }],
    }));
    expect(result).toMatch(/0\.85/);
  });
});

describe("churn-retention category", () => {
  it("handles Churn calculator", () => {
    const result = generateInsights(ctx({
      title: "Churn Rate Calculator",
      category: "churn-retention",
      outputs: [{ id: "churn", label: "Monthly Churn", value: 3.5, type: "percentage", isPrimary: true }],
    }));
    expect(result).toMatch(/3\.5.*%/);
  });

  it("handles NPS calculator (now in correct category)", () => {
    const result = generateInsights(ctx({
      title: "Net Promoter Score (NPS) Calculator",
      category: "churn-retention",
      outputs: [{ id: "nps", label: "NPS", value: 42, type: "number", isPrimary: true }],
    }));
    expect(result).toContain("NPS");
    // Should get real insights, not just padding
    expect(result.split("\n").filter((l) => l.match(/^\d+\./)).length).toBeGreaterThanOrEqual(2);
  });
});

describe("general-business category", () => {
  it("handles ROI calculator", () => {
    const result = generateInsights(ctx({
      title: "ROI Calculator",
      category: "general-business",
      outputs: [{ id: "roi", label: "ROI", value: 250, type: "percentage", isPrimary: true }],
    }));
    expect(result).toContain("250");
  });

  it("handles Break-Even calculator", () => {
    const result = generateInsights(ctx({
      title: "Break-Even Analysis Calculator",
      category: "general-business",
      outputs: [
        { id: "breakEvenUnits", label: "Break-Even Units", value: 500, type: "number", isPrimary: true },
        { id: "breakEvenRevenue", label: "Break-Even Revenue", value: 50000, type: "currency" },
      ],
    }));
    expect(result).toContain("500");
  });

  it("handles Cash Runway calculator", () => {
    const result = generateInsights(ctx({
      title: "Cash Runway Calculator",
      category: "general-business",
      outputs: [
        { id: "runwayMonths", label: "Runway", value: 10, type: "number", isPrimary: true },
        { id: "grossBurn", label: "Gross Burn", value: 50000, type: "currency" },
      ],
    }));
    expect(result).toMatch(/10|runway/);
  });
});

describe("personal-finance category", () => {
  it("handles FIRE calculator", () => {
    const result = generateInsights(ctx({
      title: "FIRE Calculator",
      category: "personal-finance",
      outputs: [{ id: "fire", label: "FIRE Number", value: 1250000, type: "currency", isPrimary: true }],
    }));
    expect(result).toMatch(/1\.3M|achievable|FIRE/);
  });

  it("handles Emergency Fund calculator", () => {
    const result = generateInsights(ctx({
      title: "Emergency Fund Calculator",
      category: "personal-finance",
      inputs: [{ id: "monthlyExpenses", label: "Monthly Expenses", value: 4000, type: "currency" }],
      outputs: [{ id: "fund", label: "Emergency Fund", value: 24000, type: "currency", isPrimary: true }],
    }));
    expect(result).toMatch(/6|months/);
  });

  it("handles Savings Rate calculator", () => {
    const result = generateInsights(ctx({
      title: "Savings Rate Calculator",
      category: "personal-finance",
      outputs: [{ id: "savings", label: "Savings Rate", value: 25, type: "percentage", isPrimary: true }],
    }));
    expect(result).toMatch(/25.*%/);
  });
});

describe("side-hustle category", () => {
  it("handles generic side hustle with revenue", () => {
    const result = generateInsights(ctx({
      title: "Blogging Income Calculator",
      category: "side-hustle",
      outputs: [
        { id: "monthlyRevenue", label: "Monthly Revenue", value: 3000, type: "currency" },
        { id: "annualRevenue", label: "Annual Revenue", value: 36000, type: "currency", isPrimary: true },
      ],
    }));
    expect(result).toMatch(/starting point|side hustle/);
  });
});

describe("ai-cost category", () => {
  it("handles AI cost calculator", () => {
    const result = generateInsights(ctx({
      title: "ChatGPT API Cost Calculator",
      category: "ai-cost",
      outputs: [
        { id: "costPerMonth", label: "Monthly Cost", value: 2500, type: "currency", isPrimary: true },
        { id: "costPerYear", label: "Annual Cost", value: 30000, type: "currency" },
      ],
    }));
    expect(result).toMatch(/2[.,]500|meaningful/);
  });
});

describe("unit-economics category", () => {
  it("handles CAC Payback Period", () => {
    const result = generateInsights(ctx({
      title: "CAC Payback Period Calculator",
      category: "unit-economics",
      outputs: [{ id: "paybackMonths", label: "Payback Period", value: 14, type: "number", isPrimary: true }],
    }));
    expect(result).toContain("14");
  });
});

describe("saas-deepen category", () => {
  it("handles generic saas deepen", () => {
    const result = generateInsights(ctx({
      title: "SaaS Capital Efficiency Calculator",
      category: "saas-deepen",
      outputs: [{ id: "ratio", label: "Efficiency Ratio", value: 2.5, type: "ratio", isPrimary: true }],
    }));
    expect(result).toContain("## Insights");
  });
});
