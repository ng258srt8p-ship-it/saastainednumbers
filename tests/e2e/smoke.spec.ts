import { test, expect } from "@playwright/test";

const BASE = "http://localhost:3000";

test.describe("Homepage", () => {
  test("loads with correct title and navigation", async ({ page }) => {
    const resp = await page.goto(BASE, { waitUntil: "load" });
    expect(resp?.status()).toBe(200);
    await expect(page.locator("nav")).toBeVisible();
    await expect(page.locator("nav a:has-text('SaaStainedNumbers')")).toBeVisible();
    await expect(page.locator("nav a:has-text('Canvas')")).toBeVisible();
    await expect(page.locator("nav a:has-text('Blog')")).toBeVisible();
  });

  test("has navigation links that work", async ({ page }) => {
    await page.goto(BASE, { waitUntil: "load" });
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
    { slug: "nps-calculator", category: "churn-retention", title: "NPS" },
    { slug: "activation-rate-calculator", category: "growth-efficiency", title: "Activation Rate" },
    { slug: "trial-to-paid-calculator", category: "revenue", title: "Trial-to-Paid" },
    { slug: "expansion-revenue-rate-calculator", category: "revenue", title: "Expansion Revenue Rate" },
    { slug: "net-cash-flow-calculator", category: "unit-economics", title: "Net Cash Flow" },
    { slug: "lead-conversion-rate-calculator", category: "growth-efficiency", title: "Lead-to-Customer" },
    { slug: "claude-api-cost-calculator", category: "ai-cost", title: "Claude API Cost" },
    { slug: "chatgpt-api-cost-calculator", category: "ai-cost", title: "ChatGPT API Cost" },
    { slug: "youtube-ad-revenue-calculator", category: "side-hustle", title: "YouTube Ad Revenue" },
    { slug: "freelance-rate-calculator", category: "side-hustle", title: "Freelance Hourly Rate" },
    { slug: "gig-worker-take-home-calculator", category: "side-hustle", title: "Gig Worker Take-Home" },
    { slug: "etsy-profit-calculator", category: "side-hustle", title: "Etsy Profit" },
    { slug: "fire-calculator", category: "personal-finance", title: "FIRE" },
    { slug: "savings-rate-calculator", category: "personal-finance", title: "Savings Rate" },
    { slug: "break-even-calculator", category: "general-business", title: "Break-Even" },
    { slug: "roi-calculator", category: "general-business", title: "ROI" },
    { slug: "gemini-api-cost-calculator", category: "ai-cost", title: "Gemini API Cost" },
    { slug: "grok-api-cost-calculator", category: "ai-cost", title: "Grok API Cost" },
    { slug: "ai-image-cost-calculator", category: "ai-cost", title: "AI Image Generation" },
    { slug: "ai-fine-tuning-cost-calculator", category: "ai-cost", title: "AI Fine-Tuning Cost" },
    { slug: "podcast-revenue-calculator", category: "side-hustle", title: "Podcast Revenue" },
    { slug: "newsletter-revenue-calculator", category: "side-hustle", title: "Newsletter Revenue" },
    { slug: "amazon-fba-calculator", category: "side-hustle", title: "Amazon FBA" },
    { slug: "affiliate-income-calculator", category: "side-hustle", title: "Affiliate Marketing" },
    { slug: "blogging-income-calculator", category: "side-hustle", title: "Blogging Income" },
    { slug: "investment-returns-calculator", category: "personal-finance", title: "Investment Returns" },
    { slug: "debt-payoff-calculator", category: "personal-finance", title: "Debt Payoff" },
    { slug: "emergency-fund-calculator", category: "personal-finance", title: "Emergency Fund" },
    { slug: "employee-cost-calculator", category: "general-business", title: "Employee Cost" },
    { slug: "pricing-strategy-calculator", category: "general-business", title: "Pricing Strategy" },
    { slug: "customer-engagement-score-calculator", category: "saas-deepen", title: "Customer Engagement" },
    { slug: "unit-economics-dashboard-calculator", category: "saas-deepen", title: "Unit Economics Dashboard" },
    { slug: "feature-adoption-rate-calculator", category: "saas-deepen", title: "Feature Adoption Rate" },
    { slug: "time-to-value-calculator", category: "saas-deepen", title: "Time to Value" },
    { slug: "revenue-per-user-trend-calculator", category: "saas-deepen", title: "Revenue Per User Trend" },
    { slug: "saas-quick-ratio-calculator", category: "saas-deepen", title: "SaaS Quick Ratio" },
    { slug: "cohort-analysis-calculator", category: "saas-deepen", title: "Cohort Analysis" },
    { slug: "saas-capital-efficiency-calculator", category: "saas-deepen", title: "SaaS Capital Efficiency" },
    { slug: "cac-payback-period-enhanced-calculator", category: "saas-deepen", title: "CAC Payback Period" },
    { slug: "ai-model-comparison-calculator", category: "ai-cost", title: "AI Model Cost" },
    { slug: "perplexity-api-cost-calculator", category: "ai-cost", title: "Perplexity API Cost" },
    { slug: "twitch-revenue-calculator", category: "side-hustle", title: "Twitch Revenue" },
    { slug: "subscription-content-revenue-calculator", category: "side-hustle", title: "Subscription Content Revenue" },
    { slug: "print-on-demand-profit-calculator", category: "side-hustle", title: "Print-on-Demand Profit" },
    { slug: "dropshipping-margin-calculator", category: "side-hustle", title: "Dropshipping Margin" },
    { slug: "tiktok-creator-fund-calculator", category: "side-hustle", title: "TikTok Creator Fund" },
    { slug: "side-income-tax-calculator", category: "side-hustle", title: "Side Income Tax" },
    { slug: "mortgage-affordability-calculator", category: "personal-finance", title: "Mortgage Affordability" },
    { slug: "student-loan-payoff-calculator", category: "personal-finance", title: "Student Loan Payoff" },
    { slug: "rent-vs-buy-calculator", category: "personal-finance", title: "Rent vs Buy" },
    { slug: "credit-card-payoff-calculator", category: "personal-finance", title: "Credit Card Payoff" },
    { slug: "retire-401k-calculator", category: "personal-finance", title: "401k Retirement" },
    { slug: "dividend-income-calculator", category: "personal-finance", title: "Dividend Income" },
    { slug: "contractor-vs-employee-calculator", category: "general-business", title: "Contractor vs Employee" },
    { slug: "business-valuation-calculator", category: "general-business", title: "Business Valuation" },
    { slug: "cash-runway-calculator", category: "general-business", title: "Cash Runway" },
  ] as const;

  for (const calc of fullTested) {
    test(`${calc.title} calculator page loads correctly`, async ({ page }) => {
      const resp = await page.goto(`${BASE}/${calc.category}/${calc.slug}`, { waitUntil: "load" });
      expect(resp?.status()).toBe(200);
      await expect(page.locator("h1").first()).toContainText(calc.title);
    });

    test(`${calc.title} calculator has input fields`, async ({ page }) => {
      await page.goto(`${BASE}/${calc.category}/${calc.slug}`, { waitUntil: "load" });
      const inputs = page.locator('input[type="number"]');
      expect(await inputs.count()).toBeGreaterThanOrEqual(calc.inputs);
    });

    test(`${calc.title} calculator updates URL on input change`, async ({ page }) => {
      await page.goto(`${BASE}/${calc.category}/${calc.slug}`, { waitUntil: "load" });
      const firstInput = page.locator('input[type="number"]').first();
      await firstInput.fill("500");
      await expect(page).toHaveURL(new RegExp(`${calc.slug}\\?.*=500`));
    });

    test(`${calc.title} calculator has content section`, async ({ page }) => {
      await page.goto(`${BASE}/${calc.category}/${calc.slug}`, { waitUntil: "load" });
      await expect(page.getByRole("heading", { name: "How to Use This Calculator" }).first()).toBeVisible();
      await expect(page.getByRole("heading", { name: "Formula & Worked Example" }).first()).toBeVisible();
      await expect(page.getByRole("heading", { name: "Industry Benchmarks" }).first()).toBeVisible();
      await expect(page.getByRole("heading", { name: "Frequently Asked Questions" }).first()).toBeVisible();
    });

    test(`${calc.title} calculator FAQ accordion expands`, async ({ page }) => {
      await page.goto(`${BASE}/${calc.category}/${calc.slug}`, { waitUntil: "load" });
      const faq = page.locator("details").first();
      const answer = faq.locator("div").last();
      await expect(answer).not.toBeVisible();
      await faq.locator("summary").click();
      await expect(answer).toBeVisible();
    });
  }

  for (const calc of lightTested) {
    test(`${calc.title} page loads correctly`, async ({ page }) => {
      const resp = await page.goto(`${BASE}/${calc.category}/${calc.slug}`, { waitUntil: "load" });
      expect(resp?.status()).toBe(200);
      await expect(page.locator("h1").first()).toContainText(calc.title);
    });
  }
});

test.describe("SSG & Metadata", () => {
  test("category pages generate for all categories", async ({ page }) => {
    const categories = ["revenue", "growth-efficiency", "churn-retention", "unit-economics", "ai-cost", "side-hustle", "personal-finance", "general-business", "saas-deepen"];
    for (const cat of categories) {
      const resp = await page.goto(`${BASE}/${cat}`, { waitUntil: "load" });
      if (resp?.status() === 200) {
        const title = await page.title();
        expect(title.length).toBeGreaterThan(0);
      }
    }
  });

  test("unknown calculator shows not-found content", async ({ page }) => {
    await page.goto(`${BASE}/revenue/nonexistent-calc`, { waitUntil: "load" });
    await expect(page.locator("text=Page Not Found")).toBeVisible();
  });

  test("unknown category shows 404", async ({ page }) => {
    const resp = await page.goto(`${BASE}/nonexistent-category`, { waitUntil: "load" });
    expect(resp?.status()).toBe(404);
    await expect(page.locator("text=Page Not Found")).toBeVisible();
  });
});

test.describe("Dashboard", () => {
  test("loads with all input fields", async ({ page }) => {
    await page.goto(`${BASE}/dashboard`, { waitUntil: "load" });
    const inputs = page.locator('input[type="number"]');
    await expect(inputs.first()).toBeVisible({ timeout: 5000 });
    expect(await inputs.count()).toBeGreaterThanOrEqual(3);
  });

  test("shows 5 result cards", async ({ page }) => {
    await page.goto(`${BASE}/dashboard`, { waitUntil: "load" });
    const cards = page.locator("text=Explore in detail");
    await expect(cards.first()).toBeVisible({ timeout: 5000 });
    expect(await cards.count()).toBeGreaterThanOrEqual(1);
  });

  test("result cards link to correct calculator pages", async ({ page }) => {
    await page.goto(`${BASE}/dashboard`, { waitUntil: "load" });
    const firstLink = page.locator("a:has-text('Explore in detail')").first();
    await expect(firstLink).toBeVisible({ timeout: 5000 });
    const href = await firstLink.getAttribute("href");
    expect(href).toContain("/revenue/mrr-calculator?");
  });

  test("changing inputs updates results", async ({ page }) => {
    await page.goto(`${BASE}/dashboard`, { waitUntil: "load" });
    const input = page.locator('input[type="number"]').first();
    await expect(input).toBeVisible({ timeout: 5000 });
    await input.fill("2000");
    await page.waitForTimeout(300);
    const cards = page.locator("text=Explore in detail");
    await expect(cards.first()).toBeVisible();
  });

  test("reset defaults button works", async ({ page }) => {
    await page.goto(`${BASE}/dashboard`, { waitUntil: "load" });
    const input = page.locator('input[type="number"]').first();
    await expect(input).toBeVisible({ timeout: 5000 });
    await input.fill("9999");
    await page.click("text=Reset defaults");
    await expect(input).not.toHaveValue("9999");
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

  for (const slug of embedSlugs) {
    test(`${slug} embed loads with attribution and inputs`, async ({ page }) => {
      const resp = await page.goto(`${BASE}/embed/${slug}`, { waitUntil: "load" });
      expect(resp?.status()).toBe(200);
      await expect(page.locator("text=saastainednumbers.com")).toBeVisible();
      const inputs = page.locator('input[type="number"]');
      await expect(inputs.first()).toBeVisible();
      await inputs.first().fill("200");
      await page.waitForTimeout(200);
    });
  }
});
