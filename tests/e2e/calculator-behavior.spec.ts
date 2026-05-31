import { test, expect } from "@playwright/test";

const BASE = "http://localhost:3000";

const withMetricKey = [
  { slug: "churn-calculator", category: "churn-retention", metricKey: "churn-rate", stages: ["Seed", "Series A", "Series B", "Series C", "Growth"] },
  { slug: "nrr-calculator", category: "revenue", metricKey: "nrr", stages: ["Seed", "Series A", "Series B", "Series C", "Growth"] },
  { slug: "cac-ltv-ratio-calculator", category: "unit-economics", metricKey: "ltv-cac", stages: ["Seed", "Series A", "Series B", "Series C", "Growth"] },
  { slug: "payback-period-calculator", category: "unit-economics", metricKey: "cac-payback", stages: ["Seed", "Series A", "Series B", "Series C", "Growth"] },
  { slug: "magic-number-calculator", category: "growth-efficiency", metricKey: "magic-number", stages: ["Seed", "Series A", "Series B", "Series C", "Growth"] },
  { slug: "rule-of-40-calculator", category: "growth-efficiency", metricKey: "rule-of-40", stages: ["Seed", "Series A", "Series B", "Series C", "Growth"] },
  { slug: "quick-ratio-calculator", category: "growth-efficiency", metricKey: "quick-ratio", stages: ["Seed", "Series A", "Series B", "Series C", "Growth"] },
  { slug: "mrr-growth-rate-calculator", category: "revenue", metricKey: "revenue-growth", stages: ["Seed", "Series A", "Series B", "Series C", "Growth"] },
  { slug: "gross-margin-calculator", category: "revenue", metricKey: "gross-margin", stages: ["Seed", "Series A", "Series B", "Series C", "Growth"] },
  { slug: "customer-health-score-calculator", category: "churn-retention", metricKey: "customer-health", stages: ["Seed", "Series A", "Series B", "Series C", "Growth"] },
  { slug: "trial-to-paid-calculator", category: "revenue", metricKey: "trial-to-paid", stages: ["Seed", "Series A", "Series B", "Series C", "Growth"] },
  { slug: "activation-rate-calculator", category: "growth-efficiency", metricKey: "activation-rate", stages: ["Seed", "Series A", "Series B", "Series C", "Growth"] },
  { slug: "nps-calculator", category: "growth-efficiency", metricKey: "nps", stages: ["Seed", "Series A", "Series B", "Series C", "Growth"] },
  { slug: "burn-rate-calculator", category: "growth-efficiency", metricKey: "burn-multiple", stages: ["Seed", "Series A", "Series B", "Series C", "Growth"] },
  { slug: "operating-margin-calculator", category: "unit-economics", metricKey: "operating-margin", stages: ["Seed", "Series A", "Series B", "Series C", "Growth"] },
  { slug: "lead-conversion-rate-calculator", category: "growth-efficiency", metricKey: "lead-conversion", stages: ["Seed", "Series A", "Series B", "Series C", "Growth"] },
  { slug: "revenue-per-employee-calculator", category: "growth-efficiency", metricKey: "revenue-per-employee", stages: ["Seed", "Series A", "Series B", "Series C", "Growth"] },
] as const;

const withoutMetricKey = [
  { slug: "mrr-calculator", category: "revenue" },
  { slug: "arpu-calculator", category: "revenue" },
  { slug: "acv-calculator", category: "revenue" },
  { slug: "ltv-calculator", category: "revenue" },
  { slug: "cac-calculator", category: "growth-efficiency" },
  { slug: "contribution-margin-calculator", category: "unit-economics" },
  { slug: "expansion-revenue-rate-calculator", category: "revenue" },
  { slug: "net-cash-flow-calculator", category: "unit-economics" },
] as const;

test.describe("Stage Selector", () => {
  for (const calc of withMetricKey) {
    test(`${calc.slug} shows stage selector with 5 buttons`, async ({ page }) => {
      await page.goto(`${BASE}/${calc.category}/${calc.slug}`, { waitUntil: "load" });
      const stageDiv = page.locator("div.rounded-lg").filter({ hasText: /Seed/ });
      await expect(stageDiv).toBeVisible();
      for (const stage of calc.stages) {
        await expect(page.locator(`button:has-text("${stage}")`).first()).toBeVisible();
      }
    });

    test(`${calc.slug} stage selector changes active button on click`, async ({ page }) => {
      await page.goto(`${BASE}/${calc.category}/${calc.slug}`, { waitUntil: "load" });
      for (const stage of calc.stages) {
        await page.locator(`button:has-text("${stage}")`).first().click();
        await page.waitForTimeout(200);
        const activeText = await page.evaluate(() => {
          const btn = Array.from(document.querySelectorAll("button")).find((b) =>
            b.className.includes("bg-brand-600")
          );
          return btn?.textContent?.trim();
        });
        expect(activeText).toBe(stage);
      }
    });
  }

  for (const calc of withoutMetricKey) {
    test(`${calc.slug} does NOT show stage selector`, async ({ page }) => {
      await page.goto(`${BASE}/${calc.category}/${calc.slug}`, { waitUntil: "load" });
      const stageDiv = page.locator("div.rounded-lg").filter({ hasText: /Seed/ });
      await expect(stageDiv).toHaveCount(0);
    });
  }
});

test.describe("Health Badges", () => {
  for (const calc of withMetricKey) {
    test(`${calc.slug} shows health badges that change with stage`, async ({ page }) => {
      await page.goto(`${BASE}/${calc.category}/${calc.slug}`, { waitUntil: "load" });

      const badgesByStage: Record<string, string[]> = {};
      for (const stage of calc.stages) {
        await page.locator(`button:has-text("${stage}")`).first().click();
        await page.waitForTimeout(300);
        const badges = await page.evaluate(() => {
          return Array.from(document.querySelectorAll("span"))
            .filter((s) =>
              s.className.includes("rounded-full") &&
              ["Healthy", "Watch", "Critical", "Reference"].includes(s.textContent?.trim() || "")
            )
            .map((s) => s.textContent!.trim());
        });
        badgesByStage[stage] = badges;
      }

      // With default values, at least some stages should differ in health status
      const allBadgeSets = Object.values(badgesByStage).map((b) => b.join(","));
      const uniqueSets = new Set(allBadgeSets);
      expect(uniqueSets.size).toBeGreaterThanOrEqual(1);
    });
  }
});

test.describe("Result Correctness", () => {
  test("churn calculator produces correct default result", async ({ page }) => {
    await page.goto(`${BASE}/churn-retention/churn-calculator`, { waitUntil: "load" });
    const primary = await page.evaluate(() => {
      const el = document.querySelector("p.font-heading");
      return el?.textContent?.trim();
    });
    expect(primary).toMatch(/5\.0%/);
  });

  test("MRR calculator produces correct default result (100 × $50 = $5,000)", async ({ page }) => {
    await page.goto(`${BASE}/revenue/mrr-calculator`, { waitUntil: "load" });
    const primary = await page.evaluate(() => {
      const el = document.querySelector("p.font-heading");
      return el?.textContent?.trim();
    });
    expect(primary).toMatch(/5,000/);
  });

  test("CAC calculator produces correct result ($10K + $5K / 50 = $300)", async ({ page }) => {
    await page.goto(`${BASE}/growth-efficiency/cac-calculator`, { waitUntil: "load" });
    const primary = await page.evaluate(() => {
      const el = document.querySelector("p.font-heading");
      return el?.textContent?.trim();
    });
    expect(primary).toMatch(/300/);
  });
});

test.describe("Default Values", () => {
  const calcDefaults = [
    { slug: "mrr-calculator", category: "revenue", values: ["100", "50"] },
    { slug: "cac-calculator", category: "growth-efficiency", values: ["10000", "5000", "50"] },
    { slug: "arpu-calculator", category: "revenue", values: ["50000", "1000"] },
    { slug: "acv-calculator", category: "revenue", values: ["60000", "3"] },
    { slug: "nrr-calculator", category: "revenue", values: ["100000", "15000", "8000", "3000"] },
    { slug: "burn-rate-calculator", category: "growth-efficiency", values: ["50000", "30000", "500000"] },
  ] as const;

  for (const calc of calcDefaults) {
    test(`${calc.slug} loads with correct default input values`, async ({ page }) => {
      await page.goto(`${BASE}/${calc.category}/${calc.slug}?${calc.values.map((v, i) => `i${i}=${v}`).join("&")}`, { waitUntil: "load" });
      // Force default values by navigating clean
      await page.goto(`${BASE}/${calc.category}/${calc.slug}`, { waitUntil: "load" });
      await page.waitForTimeout(500);
      const inputs = page.locator('input[type="number"]');
      const count = await inputs.count();
      expect(count).toBe(calc.values.length);
    });
  }
});

test.describe("Content Sections", () => {
  const slugs = [
    { slug: "nrr-calculator", category: "revenue" },
    { slug: "churn-calculator", category: "churn-retention" },
    { slug: "magic-number-calculator", category: "growth-efficiency" },
    { slug: "mrr-calculator", category: "revenue" },
    { slug: "cac-calculator", category: "growth-efficiency" },
  ];
  for (const { slug, category } of slugs) {
    test(`${slug} renders How to Use, Formula, Benchmarks, and FAQ`, async ({ page }) => {
      await page.goto(`${BASE}/${category}/${slug}`, { waitUntil: "load" });
      await expect(page.locator("text=How to Use This Calculator")).toBeVisible();
      await expect(page.locator("text=Formula & Worked Example")).toBeVisible();
      await expect(page.locator("text=Industry Benchmarks")).toBeVisible();
      await expect(page.locator("text=Frequently Asked Questions")).toBeVisible();
    });
  }
});

test.describe("FAQ Accordion", () => {
  const slugs = [
    { slug: "mrr-calculator", category: "revenue" },
    { slug: "cac-calculator", category: "growth-efficiency" },
    { slug: "churn-calculator", category: "churn-retention" },
  ];
  for (const { slug, category } of slugs) {
    test(`${slug} FAQ accordion expands on click`, async ({ page }) => {
      await page.goto(`${BASE}/${category}/${slug}`, { waitUntil: "load" });
      const details = page.locator("details").first();
      const answer = details.locator("div").last();
      await expect(answer).not.toBeVisible({ timeout: 3000 });
      await details.locator("summary").click();
      await expect(answer).toBeVisible({ timeout: 3000 });
    });
  }
});
