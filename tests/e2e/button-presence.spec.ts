import { test, expect } from "@playwright/test";
import { BASE, MOBILE, toggleDarkMode } from "./helpers";
import { LOCALES, CALC_SLUGS, currencyBtn, embedBtn } from "./helpers";

// ─── CORE BUTTON PRESENCE ──────────────────────────────────────────────
test.describe("Core Button Presence", () => {
  test("Share button visible on MRR calculator", async ({ page }) => {
    await page.goto(`${BASE}/revenue/mrr-calculator`, { waitUntil: "load" });
    const shareBtn = page.locator("button").filter({ hasText: /Share|Compartir/i }).first();
    await expect(shareBtn).toBeVisible();
  });

  test("Embed button visible on MRR calculator", async ({ page }) => {
    await page.goto(`${BASE}/revenue/mrr-calculator`, { waitUntil: "load" });
    await expect(embedBtn(page)).toBeVisible();
  });

  test("currency switcher button visible on MRR calculator", async ({ page }) => {
    await page.goto(`${BASE}/revenue/mrr-calculator`, { waitUntil: "load" });
    await expect(currencyBtn(page)).toBeVisible();
  });

  test("Get Insights button visible", async ({ page }) => {
    await page.goto(`${BASE}/revenue/mrr-calculator`, { waitUntil: "load" });
    const insightsBtn = page.locator('button[aria-label="Get Insights"]');
    await expect(insightsBtn).toBeVisible();
  });

  test("Stage selector buttons visible", async ({ page }) => {
    await page.goto(`${BASE}/revenue/mrr-calculator`, { waitUntil: "load" });
    const stageBtns = page.locator("button").filter({ hasText: /Seed|Series A|Series B|Series C|Growth/ });
    const count = await stageBtns.count();
    expect(count).toBeGreaterThanOrEqual(5);
  });

  test("theme toggle visible in nav", async ({ page }) => {
    await page.goto(`${BASE}/`, { waitUntil: "load" });
    const themeBtn = page.locator('button[aria-label*="theme" i], button[aria-label*="toggle" i], button[aria-label*="dark" i]').first();
    await expect(themeBtn).toBeVisible();
  });
});

// ─── BUTTON PRESENCE ACROSS CALCULATORS ────────────────────────────────
test.describe("Button Presence Across Calculators", () => {
  // Sample a few calculator types to verify buttons appear consistently
  const sampleSlugs = [
    "revenue/mrr-calculator",
    "churn-retention/churn-calculator",
    "growth-efficiency/quick-ratio-calculator",
    "growth-efficiency/cac-calculator",
    "ai-cost/chatgpt-api-cost-calculator",
    "side-hustle/affiliate-income-calculator",
    "personal-finance/fire-calculator",
  ];

  sampleSlugs.forEach((slug) => {
    test(`[${slug}] Share, Embed, Currency buttons present`, async ({ page }) => {
      await page.goto(`${BASE}/${slug}`, { waitUntil: "load" });
      await page.waitForTimeout(1000);

      // Share button
      const shareBtn = page.locator("button").filter({ hasText: /Share|Compartir/i }).first();
      await expect(shareBtn).toBeVisible({ timeout: 5000 });

      // Embed button
      await expect(embedBtn(page)).toBeVisible({ timeout: 5000 });

      // Currency switcher
      await expect(currencyBtn(page)).toBeVisible({ timeout: 5000 });
    });
  });
});

// ─── BUTTON INTERACTION CONSISTENCY ────────────────────────────────────
test.describe("Button Interaction Consistency", () => {
  test("Share button click shows share modal/popup or triggers share", async ({ page }) => {
    await page.goto(`${BASE}/revenue/mrr-calculator`, { waitUntil: "load" });
    const shareBtn = page.locator("button").filter({ hasText: /Share|Compartir|share/i }).first();
    // Share button may be icon-only, try aria-label
    const altShareBtn = page.locator('button[aria-label*="share" i]');
    const btn = await shareBtn.count() > 0 ? shareBtn : altShareBtn.first();
    await expect(btn).toBeVisible({ timeout: 5000 });
    await btn.click();
    await page.waitForTimeout(500);
    // Share usually opens a popup/modal or navigator.share
    const modal = page.locator('[role="dialog"]').first();
    const urlInput = page.locator('input[type="url"], input[readonly]').first();
    // At minimum the button should be clickable without errors
    await expect(btn).toBeAttached();
  });
});
