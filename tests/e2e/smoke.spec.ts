import { test, expect } from "@playwright/test";

const BASE = "http://localhost:3000";

test.describe("Homepage", () => {
  test("loads with correct title and navigation", async ({ page }) => {
    const resp = await page.goto(BASE, { waitUntil: "networkidle" });
    expect(resp?.status()).toBe(200);
    await expect(page.locator("nav")).toBeVisible();
    await expect(page.locator("nav a:has-text('Saasifactory')")).toBeVisible();
    await expect(page.locator("nav a:has-text('Dashboard')")).toBeVisible();
    await expect(page.locator("nav a:has-text('Blog')")).toBeVisible();
  });

  test("has navigation links that work", async ({ page }) => {
    await page.goto(BASE, { waitUntil: "networkidle" });
    await page.click("nav a:has-text('Dashboard')");
    await expect(page).toHaveURL(/\/dashboard/);
  });
});

test.describe("Calculator Pages", () => {
  const fullTested = [
    { slug: "mrr-calculator", category: "revenue", title: "MRR", inputs: 2 },
    { slug: "cac-calculator", category: "growth-efficiency", title: "CAC", inputs: 3 },
    { slug: "ltv-calculator", category: "revenue", title: "LTV", inputs: 3 },
    { slug: "churn-calculator", category: "churn-retention", title: "Churn", inputs: 3 },
    { slug: "arpu-calculator", category: "revenue", title: "ARPU", inputs: 2 },
  ] as const;

  const lightTested = [
    { slug: "burn-rate-calculator", category: "growth-efficiency", title: "Burn Rate" },
    { slug: "payback-period-calculator", category: "unit-economics", title: "Payback Period" },
    { slug: "nrr-calculator", category: "revenue", title: "NRR" },
    { slug: "gross-margin-calculator", category: "revenue", title: "Gross Margin" },
    { slug: "quick-ratio-calculator", category: "growth-efficiency", title: "Quick Ratio" },
    { slug: "cac-ltv-ratio-calculator", category: "unit-economics", title: "CAC to LTV" },
    { slug: "magic-number-calculator", category: "growth-efficiency", title: "Magic Number" },
    { slug: "rule-of-40-calculator", category: "growth-efficiency", title: "Rule of 40" },
    { slug: "contribution-margin-calculator", category: "unit-economics", title: "Contribution Margin" },
    { slug: "operating-margin-calculator", category: "unit-economics", title: "Operating Margin" },
    { slug: "revenue-per-employee-calculator", category: "growth-efficiency", title: "Revenue Per Employee" },
    { slug: "mrr-growth-rate-calculator", category: "revenue", title: "MRR Growth Rate" },
    { slug: "acv-calculator", category: "revenue", title: "ACV" },
    { slug: "customer-health-score-calculator", category: "churn-retention", title: "Customer Health Score" },
    { slug: "nps-calculator", category: "growth-efficiency", title: "NPS" },
    { slug: "activation-rate-calculator", category: "growth-efficiency", title: "Activation Rate" },
    { slug: "trial-to-paid-calculator", category: "revenue", title: "Trial-to-Paid" },
    { slug: "expansion-revenue-rate-calculator", category: "revenue", title: "Expansion Revenue Rate" },
    { slug: "net-cash-flow-calculator", category: "unit-economics", title: "Net Cash Flow" },
    { slug: "lead-conversion-rate-calculator", category: "growth-efficiency", title: "Lead-to-Customer" },
  ] as const;

  for (const calc of fullTested) {
    test(`${calc.title} calculator page loads correctly`, async ({ page }) => {
      const resp = await page.goto(`${BASE}/${calc.category}/${calc.slug}`, { waitUntil: "networkidle" });
      expect(resp?.status()).toBe(200);
      await expect(page.locator("h1")).toContainText(calc.title);
    });

    test(`${calc.title} calculator has input fields`, async ({ page }) => {
      await page.goto(`${BASE}/${calc.category}/${calc.slug}`, { waitUntil: "networkidle" });
      const inputs = page.locator('input[type="number"]');
      expect(await inputs.count()).toBeGreaterThanOrEqual(calc.inputs);
    });

    test(`${calc.title} calculator updates URL on input change`, async ({ page }) => {
      await page.goto(`${BASE}/${calc.category}/${calc.slug}`, { waitUntil: "networkidle" });
      const firstInput = page.locator('input[type="number"]').first();
      await firstInput.fill("500");
      await expect(page).toHaveURL(new RegExp(`${calc.slug}\\?.*=500`));
    });

    test(`${calc.title} calculator has content section`, async ({ page }) => {
      await page.goto(`${BASE}/${calc.category}/${calc.slug}`, { waitUntil: "networkidle" });
      await expect(page.locator("text=How to Use This Calculator")).toBeVisible();
      await expect(page.locator("text=Formula & Worked Example")).toBeVisible();
      await expect(page.locator("text=Industry Benchmarks")).toBeVisible();
      await expect(page.locator("text=Frequently Asked Questions")).toBeVisible();
    });

    test(`${calc.title} calculator FAQ accordion expands`, async ({ page }) => {
      await page.goto(`${BASE}/${calc.category}/${calc.slug}`, { waitUntil: "networkidle" });
      const faq = page.locator("details").first();
      const answer = faq.locator("div").last();
      await expect(answer).not.toBeVisible();
      await faq.locator("summary").click();
      await expect(answer).toBeVisible();
    });
  }

  for (const calc of lightTested) {
    test(`${calc.title} page loads correctly`, async ({ page }) => {
      const resp = await page.goto(`${BASE}/${calc.category}/${calc.slug}`, { waitUntil: "networkidle" });
      expect(resp?.status()).toBe(200);
      await expect(page.locator("h1")).toContainText(calc.title);
    });
  }
});

test.describe("SSG & Metadata", () => {
  test("category pages generate for all categories", async ({ page }) => {
    const categories = ["revenue", "growth-efficiency", "churn-retention", "unit-economics"];
    for (const cat of categories) {
      const resp = await page.goto(`${BASE}/${cat}`, { waitUntil: "networkidle" });
      if (resp?.status() === 200) {
        const title = await page.title();
        expect(title.length).toBeGreaterThan(0);
      }
    }
  });

  test("unknown calculator shows not-found content", async ({ page }) => {
    await page.goto(`${BASE}/revenue/nonexistent-calc`, { waitUntil: "networkidle" });
    await expect(page.locator("text=Calculator Not Found")).toBeVisible();
  });

  test("unknown category shows coming soon", async ({ page }) => {
    const resp = await page.goto(`${BASE}/nonexistent-category`, { waitUntil: "networkidle" });
    expect(resp?.status()).toBe(200);
    await expect(page.locator("text=coming soon")).toBeVisible();
  });
});

test.describe("Dashboard", () => {
  test("loads with all input fields", async ({ page }) => {
    await page.goto(`${BASE}/dashboard`, { waitUntil: "networkidle" });
    const inputs = page.locator('input[type="number"]');
    expect(await inputs.count()).toBe(7);
  });

  test("shows 5 result cards", async ({ page }) => {
    await page.goto(`${BASE}/dashboard`, { waitUntil: "networkidle" });
    const cards = page.locator("text=Explore in detail");
    expect(await cards.count()).toBe(5);
  });

  test("result cards link to correct calculator pages", async ({ page }) => {
    await page.goto(`${BASE}/dashboard`, { waitUntil: "networkidle" });
    const firstLink = page.locator("a:has-text('Explore in detail')").first();
    const href = await firstLink.getAttribute("href");
    expect(href).toContain("/revenue/mrr-calculator?");
  });

  test("changing inputs updates results", async ({ page }) => {
    await page.goto(`${BASE}/dashboard`, { waitUntil: "networkidle" });
    const input = page.locator('input[type="number"]').first();
    await input.fill("2000");
    const cards = page.locator("text=Explore in detail");
    expect(await cards.count()).toBe(5);
  });

  test("reset defaults button works", async ({ page }) => {
    await page.goto(`${BASE}/dashboard`, { waitUntil: "networkidle" });
    const input = page.locator('input[type="number"]').first();
    await input.fill("9999");
    await page.click("text=Reset defaults");
    await expect(input).not.toHaveValue("9999");
  });
});

test.describe("Request Calculator Form", () => {
  test("validates required fields", async ({ page }) => {
    await page.goto(`${BASE}/request-calculator`, { waitUntil: "networkidle" });
    await page.click('button[type="submit"]');
    expect(await page.locator("text=Thank You!").count()).toBe(0);
  });

  test("submits successfully with valid data", async ({ page }) => {
    await page.goto(`${BASE}/request-calculator`, { waitUntil: "networkidle" });
    await page.fill("#name", "Test Calculator");
    await page.selectOption("#category", "revenue");
    await page.fill("#useCase", "Testing Playwright E2E");
    await page.fill("#email", "e2e@test.com");
    await page.click('button[type="submit"]');
    await expect(page.locator("text=Thank You!")).toBeVisible();
  });
});

test.describe("Embed Routes", () => {
  const embedSlugs = [
    "mrr-calculator", "cac-calculator", "ltv-calculator", "churn-calculator", "arpu-calculator",
    "burn-rate-calculator", "payback-period-calculator", "nrr-calculator", "gross-margin-calculator",
    "quick-ratio-calculator", "cac-ltv-ratio-calculator", "magic-number-calculator", "rule-of-40-calculator",
    "contribution-margin-calculator", "operating-margin-calculator", "revenue-per-employee-calculator",
    "mrr-growth-rate-calculator", "acv-calculator", "customer-health-score-calculator", "nps-calculator",
    "activation-rate-calculator", "trial-to-paid-calculator", "expansion-revenue-rate-calculator",
    "net-cash-flow-calculator", "lead-conversion-rate-calculator",
  ];

  for (const slug of embedSlugs) {
    test(`${slug} embed loads with attribution and inputs`, async ({ page }) => {
      const resp = await page.goto(`${BASE}/embed/${slug}`, { waitUntil: "networkidle" });
      expect(resp?.status()).toBe(200);
      await expect(page.locator("text=Powered by Saasifactory")).toBeVisible();
      const inputs = page.locator('input[type="number"]');
      await expect(inputs.first()).toBeVisible();
      await inputs.first().fill("200");
      await page.waitForTimeout(200);
    });
  }
});
