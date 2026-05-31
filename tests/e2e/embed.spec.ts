import { test, expect } from "@playwright/test";

const BASE = "http://localhost:3000";

const EMBED_SLUGS = [
  { slug: "mrr-calculator", category: "revenue" },
  { slug: "cac-calculator", category: "growth-efficiency" },
  { slug: "ltv-calculator", category: "revenue" },
  { slug: "churn-calculator", category: "churn-retention" },
  { slug: "fire-calculator", category: "personal-finance" },
  { slug: "break-even-calculator", category: "general-business" },
];

test.describe("Embed Page - Basic", () => {
  for (const { slug } of EMBED_SLUGS) {
    test(`${slug} embed returns 200`, async ({ page }) => {
      const resp = await page.goto(`${BASE}/embed/${slug}`, { waitUntil: "load" });
      expect(resp?.status()).toBe(200);
    });

    test(`${slug} embed has no nav/header/footer`, async ({ page }) => {
      await page.goto(`${BASE}/embed/${slug}`, { waitUntil: "load" });
      await expect(page.locator("nav")).toHaveCount(0);
      await expect(page.locator("footer")).toHaveCount(0);
    });

    test(`${slug} embed has attribution link`, async ({ page }) => {
      await page.goto(`${BASE}/embed/${slug}`, { waitUntil: "load" });
      await expect(page.locator("text=saastainednumbers.com")).toBeVisible();
    });

    test(`${slug} embed has input fields`, async ({ page }) => {
      await page.goto(`${BASE}/embed/${slug}`, { waitUntil: "load" });
      await expect(page.locator('input[type="number"]').first()).toBeVisible();
    });
  }

  test("embed page does not show on regular calculator page", async ({ page }) => {
    await page.goto(`${BASE}/revenue/mrr-calculator`, { waitUntil: "load" });
    await expect(page.locator("text=saastainednumbers.com")).toHaveCount(0);
  });
});

test.describe("Embed Page - URL Parameters", () => {
  test("?theme=dark applies dark mode", async ({ page }) => {
    await page.goto(`${BASE}/embed/mrr-calculator?theme=dark`, { waitUntil: "load" });
    await expect(page.locator("html")).toHaveClass(/dark/);
  });

  test("?theme=light applies light mode", async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem("theme", "dark"));
    await page.goto(`${BASE}/embed/mrr-calculator?theme=light`, { waitUntil: "load" });
    await expect(page.locator("html")).not.toHaveClass(/dark/);
  });

  test("?hideHeader=true hides header", async ({ page }) => {
    await page.goto(`${BASE}/embed/mrr-calculator?hideHeader=true`, { waitUntil: "load" });
    const heading = page.locator("h2").filter({ hasText: /MRR/i });
    await expect(heading).toHaveCount(0);
  });

  test("?height=600 sets min-height", async ({ page }) => {
    await page.goto(`${BASE}/embed/mrr-calculator?height=600`, { waitUntil: "load" });
    const container = page.locator("div.min-h-0").first();
    await expect(container).toHaveCSS("min-height", /600/);
  });

  test("embed with no params renders header by default", async ({ page }) => {
    await page.goto(`${BASE}/embed/mrr-calculator`, { waitUntil: "load" });
    await expect(page.locator("h2").first()).toBeVisible();
  });
});

test.describe("Embed Page - postMessage", () => {
  test("sends postMessage on input change", async ({ page }) => {
    const messages: unknown[] = [];
    await page.exposeFunction("captureMessage", (msg: unknown) => {
      messages.push(msg);
    });
    await page.addInitScript(() => {
      window.addEventListener("message", (event) => {
        (window as unknown as Record<string, (msg: unknown) => void>).captureMessage(event.data as unknown);
      });
    });

    await page.goto(`${BASE}/embed/mrr-calculator`, { waitUntil: "load" });
    await page.locator('input[type="number"]').first().fill("200");
    await page.waitForTimeout(500);

    const lastMsg = messages[messages.length - 1] as Record<string, unknown> | undefined;
    expect(lastMsg).toBeDefined();
    expect(lastMsg!.source).toBe("saastainednumbers-embed");
    expect(lastMsg!.slug).toBe("mrr-calculator");
  });

  test("postMessage contains inputs and results", async ({ page }) => {
    const messages: unknown[] = [];
    await page.exposeFunction("captureMessage", (msg: unknown) => {
      messages.push(msg);
    });
    await page.addInitScript(() => {
      window.addEventListener("message", (event) => {
        (window as unknown as Record<string, (msg: unknown) => void>).captureMessage(event.data as unknown);
      });
    });

    await page.goto(`${BASE}/embed/mrr-calculator`, { waitUntil: "load" });
    await page.locator('input[type="number"]').first().fill("200");
    await page.waitForTimeout(500);

    const lastMsg = messages[messages.length - 1] as Record<string, unknown> | undefined;
    expect(lastMsg).toBeDefined();
    expect(lastMsg!.inputs).toBeDefined();
    expect(lastMsg!.results).toBeDefined();
  });

  test("receives parent message and updates inputs", async ({ page }) => {
    await page.goto(`${BASE}/embed/mrr-calculator`, { waitUntil: "load" });
    const input = page.locator('input[type="number"]').first();

    await page.evaluate((slug) => {
      window.postMessage(
        { source: "webcalc-parent", slug, inputs: { customers: 999 } },
        "*"
      );
    }, "mrr-calculator");
    await page.waitForTimeout(500);

    const newVal = await input.inputValue();
    expect(newVal).toBe("999");
  });
});

test.describe("Embed Page - All 75 slugs return 200", () => {
  const ALL_SLUGS = [
    "mrr-calculator", "cac-calculator", "ltv-calculator", "churn-calculator", "arpu-calculator",
    "burn-rate-calculator", "payback-period-calculator", "nrr-calculator", "gross-margin-calculator",
    "quick-ratio-calculator", "cac-ltv-ratio-calculator", "magic-number-calculator", "rule-of-40-calculator",
    "contribution-margin-calculator", "operating-margin-calculator", "revenue-per-employee-calculator",
    "mrr-growth-rate-calculator", "acv-calculator", "customer-health-score-calculator", "nps-calculator",
    "activation-rate-calculator", "trial-to-paid-calculator", "expansion-revenue-rate-calculator",
    "net-cash-flow-calculator", "lead-conversion-rate-calculator",
    "claude-api-cost-calculator", "chatgpt-api-cost-calculator",
    "youtube-ad-revenue-calculator", "freelance-rate-calculator", "gig-worker-take-home-calculator",
    "etsy-profit-calculator", "fire-calculator", "savings-rate-calculator",
    "break-even-calculator", "roi-calculator",
    "gemini-api-cost-calculator", "grok-api-cost-calculator", "ai-image-cost-calculator",
    "ai-fine-tuning-cost-calculator", "podcast-revenue-calculator", "newsletter-revenue-calculator",
    "amazon-fba-calculator", "affiliate-income-calculator", "blogging-income-calculator",
    "investment-returns-calculator", "debt-payoff-calculator", "emergency-fund-calculator",
    "employee-cost-calculator", "pricing-strategy-calculator", "customer-engagement-score-calculator",
    "unit-economics-dashboard-calculator", "feature-adoption-rate-calculator", "time-to-value-calculator",
    "revenue-per-user-trend-calculator", "saas-quick-ratio-calculator", "cohort-analysis-calculator",
    "saas-capital-efficiency-calculator", "cac-payback-period-enhanced-calculator",
    "ai-model-comparison-calculator", "perplexity-api-cost-calculator",
    "twitch-revenue-calculator", "subscription-content-revenue-calculator", "print-on-demand-profit-calculator",
    "dropshipping-margin-calculator", "tiktok-creator-fund-calculator", "side-income-tax-calculator",
    "mortgage-affordability-calculator", "student-loan-payoff-calculator", "rent-vs-buy-calculator",
    "credit-card-payoff-calculator", "retire-401k-calculator", "dividend-income-calculator",
    "contractor-vs-employee-calculator", "business-valuation-calculator", "cash-runway-calculator",
  ];

  for (const slug of ALL_SLUGS) {
    test(`${slug} embed returns 200`, async ({ page }) => {
      const resp = await page.goto(`${BASE}/embed/${slug}`, { waitUntil: "load" });
      expect(resp?.status()).toBe(200);
    });
  }
});
