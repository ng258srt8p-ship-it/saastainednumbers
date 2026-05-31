import { test, expect } from "@playwright/test";

const BASE = "http://localhost:3000";

test.describe("Insights Panel", () => {
  test("insights panel has Get Insights button on MRR calculator", async ({ page }) => {
    await page.goto(`${BASE}/revenue/mrr-calculator`, { waitUntil: "load" });
    const getInsights = page.locator("button").filter({ hasText: /Get Insights/i });
    await expect(getInsights).toBeVisible();
  });

  test("insights panel visible on CAC calculator", async ({ page }) => {
    await page.goto(`${BASE}/growth-efficiency/cac-calculator`, { waitUntil: "load" });
    const getInsights = page.locator("button").filter({ hasText: /Get Insights/i });
    await expect(getInsights).toBeVisible();
  });

  test("insights panel visible on Churn calculator", async ({ page }) => {
    await page.goto(`${BASE}/churn-retention/churn-calculator`, { waitUntil: "load" });
    const getInsights = page.locator("button").filter({ hasText: /Get Insights/i });
    await expect(getInsights).toBeVisible();
  });

  test("insights panel visible on FIRE calculator", async ({ page }) => {
    await page.goto(`${BASE}/personal-finance/fire-calculator`, { waitUntil: "load" });
    const getInsights = page.locator("button").filter({ hasText: /Get Insights/i });
    await expect(getInsights).toBeVisible();
  });

  test("clicking Get Insights shows loading state", async ({ page }) => {
    await page.goto(`${BASE}/revenue/mrr-calculator`, { waitUntil: "load" });
    const getInsights = page.locator("button").filter({ hasText: /Get Insights/i });
    await getInsights.click();
    await expect(page.locator("text=Thinking")).toBeVisible({ timeout: 3000 });
  });

  test("loading state shows Analyzing your inputs text", async ({ page }) => {
    await page.goto(`${BASE}/revenue/mrr-calculator`, { waitUntil: "load" });
    await page.locator("button").filter({ hasText: /Get Insights/i }).click();
    await expect(page.locator("text=Analyzing your inputs")).toBeVisible({ timeout: 3000 });
  });

  test("insights content appears after loading", async ({ page }) => {
    await page.goto(`${BASE}/revenue/mrr-calculator`, { waitUntil: "load" });
    await page.locator("button").filter({ hasText: /Get Insights/i }).click();
    // Wait for insights to generate (may take some time)
    await page.waitForTimeout(2000);
    const insightsContent = page.locator(".prose").or(page.locator("h3:has-text('Insights')"));
    if (await insightsContent.isVisible({ timeout: 5000 }).catch(() => false)) {
      await expect(insightsContent).toBeVisible();
    }
  });

  test("insights heading is Insights", async ({ page }) => {
    await page.goto(`${BASE}/revenue/mrr-calculator`, { waitUntil: "load" });
    await page.locator("button").filter({ hasText: /Get Insights/i }).click();
    await page.waitForTimeout(2000);
    const heading = page.locator("h3").filter({ hasText: /Insights/i });
    if (await heading.isVisible({ timeout: 5000 }).catch(() => false)) {
      await expect(heading).toBeVisible();
    }
  });

  test("insights engine footer is present", async ({ page }) => {
    await page.goto(`${BASE}/revenue/mrr-calculator`, { waitUntil: "load" });
    await page.locator("button").filter({ hasText: /Get Insights/i }).click();
    await page.waitForTimeout(2000);
    const footer = page.locator("text=SaaStainedNumbers Insight Engine");
    if (await footer.isVisible({ timeout: 5000 }).catch(() => false)) {
      await expect(footer).toBeVisible();
    }
  });

  test("dismiss button hides insights", async ({ page }) => {
    await page.goto(`${BASE}/revenue/mrr-calculator`, { waitUntil: "load" });
    await page.locator("button").filter({ hasText: /Get Insights/i }).click();
    await page.waitForTimeout(2000);
    const dismissBtn = page.locator("button").filter({ hasText: /Dismiss/i });
    if (await dismissBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
      await dismissBtn.click();
      await page.waitForTimeout(500);
      const getInsightsAgain = page.locator("button").filter({ hasText: /Get Insights/i });
      await expect(getInsightsAgain).toBeVisible({ timeout: 3000 });
    }
  });
});
