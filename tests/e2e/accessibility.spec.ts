import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const PAGE_TYPES = [
  { path: "/", label: "Homepage" },
  { path: "/calculators", label: "All Calculators" },
  { path: "/revenue", label: "Category: Revenue" },
  { path: "/churn-retention", label: "Category: Churn" },
  { path: "/ai-cost", label: "Category: AI Cost" },
  { path: "/side-hustle", label: "Category: Side Hustle" },
  { path: "/personal-finance", label: "Category: Personal Finance" },
  { path: "/general-business", label: "Category: General Business" },
  { path: "/saas-deepen", label: "Category: SaaS Deepen" },
  { path: "/revenue/mrr-calculator", label: "Calc: MRR" },
  { path: "/churn-retention/churn-calculator", label: "Calc: Churn" },
  { path: "/growth-efficiency/cac-calculator", label: "Calc: CAC" },
  { path: "/revenue/ltv-calculator", label: "Calc: LTV" },
  { path: "/unit-economics/cac-ltv-ratio-calculator", label: "Calc: LTV:CAC" },
  { path: "/churn-retention/nps-calculator", label: "Calc: NPS" },
  { path: "/growth-efficiency/quick-ratio-calculator", label: "Calc: Quick Ratio" },
  { path: "/unit-economics/burn-rate-calculator", label: "Calc: Burn Rate" },
  { path: "/growth-efficiency/rule-of-40-calculator", label: "Calc: Rule of 40" },
  { path: "/growth-efficiency/magic-number-calculator", label: "Calc: Magic Number" },
  { path: "/personal-finance/fire-calculator", label: "Calc: FIRE" },
  { path: "/side-hustle/youtube-ad-revenue-calculator", label: "Calc: YouTube" },
  { path: "/ai-cost/claude-api-cost-calculator", label: "Calc: Claude API" },
  { path: "/ai-cost/chatgpt-api-cost-calculator", label: "Calc: ChatGPT API" },
  { path: "/general-business/break-even-calculator", label: "Calc: Break-Even" },
  { path: "/general-business/roi-calculator", label: "Calc: ROI" },
  { path: "/side-hustle/freelance-rate-calculator", label: "Calc: Freelance" },
  { path: "/personal-finance/savings-rate-calculator", label: "Calc: Savings" },
  { path: "/blog", label: "Blog listing" },
  { path: "/blog/saas-metrics-guide-2026", label: "Blog post" },
  { path: "/dashboard", label: "Dashboard" },
  { path: "/pricing", label: "Pricing" },
];

test.describe("Accessibility audit (Section 508 / WCAG 2.1 AA)", () => {
  for (const { path, label } of PAGE_TYPES) {
    test(`${label} (${path})`, async ({ page }) => {
      const resp = await page.goto(path, { waitUntil: "load" });
      expect(resp?.status()).toBe(200);

      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "section508"])
        .analyze();

      const violations = results.violations.filter(
        (v) => v.impact === "critical" || v.impact === "serious"
      );

      if (violations.length > 0) {
        console.log(`\n=== ${label} (${path})  -  ${violations.length} critical/serious violations ===`);
        for (const v of violations) {
          console.log(`  [${v.impact}] ${v.id}: ${v.help}`);
          console.log(`    URL: ${v.helpUrl}`);
          for (const node of v.nodes) {
            console.log(`    → ${node.html}`);
          }
        }
      }

      expect(violations).toEqual([]);
    });
  }
});
