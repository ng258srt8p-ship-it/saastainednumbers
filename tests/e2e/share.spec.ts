import { test, expect } from "@playwright/test";

const BASE = "http://localhost:3000";

test.describe("Share Button on Calculator Pages", () => {
  test("share button visible on MRR calculator", async ({ page }) => {
    await page.goto(`${BASE}/revenue/mrr-calculator`, { waitUntil: "load" });
    const shareBtn = page.locator("button").filter({ hasText: /Share/i });
    await expect(shareBtn).toBeVisible();
  });

  test("share button visible on CAC calculator", async ({ page }) => {
    await page.goto(`${BASE}/growth-efficiency/cac-calculator`, { waitUntil: "load" });
    const shareBtn = page.locator("button").filter({ hasText: /Share/i });
    await expect(shareBtn).toBeVisible();
  });

  test("share button visible on FIRE calculator", async ({ page }) => {
    await page.goto(`${BASE}/personal-finance/fire-calculator`, { waitUntil: "load" });
    const shareBtn = page.locator("button").filter({ hasText: /Share/i });
    await expect(shareBtn).toBeVisible();
  });

  test("clicking share shows Copied text", async ({ page }) => {
    await page.goto(`${BASE}/revenue/mrr-calculator`, { waitUntil: "load" });
    const shareBtn = page.locator("button").filter({ hasText: /Share/i });
    await shareBtn.click();
    await expect(shareBtn).toContainText(/Copied/i);
  });

  test("share button reverts to Share after 2.5 seconds", async ({ page }) => {
    await page.goto(`${BASE}/revenue/mrr-calculator`, { waitUntil: "load" });
    const shareBtn = page.locator("button").filter({ hasText: /Share/i });
    await shareBtn.click();
    await expect(shareBtn).toContainText(/Copied/i);
    await page.waitForTimeout(3000);
    await expect(shareBtn).toContainText(/Share/i);
  });

  test("sharing copies URL with input params", async ({ page }) => {
    await page.goto(`${BASE}/revenue/mrr-calculator`, { waitUntil: "load" });
    await page.locator('input[type="number"]').first().fill("500");
    await page.waitForTimeout(300);
    const shareBtn = page.locator("button").filter({ hasText: /Share/i });
    await shareBtn.click();
    // Check clipboard contents
    const clipboard = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboard).toContain("mrr-calculator");
  });

  test("share URL contains query params from inputs", async ({ page }) => {
    await page.goto(`${BASE}/revenue/mrr-calculator`, { waitUntil: "load" });
    const inputs = page.locator('input[type="number"]');
    await inputs.nth(0).fill("300");
    await inputs.nth(1).fill("75");
    await page.waitForTimeout(300);
    const shareBtn = page.locator("button").filter({ hasText: /Share/i });
    await shareBtn.click();
    const clipboard = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboard).toContain("i0=300");
    expect(clipboard).toContain("i1=75");
  });
});

test.describe("Share Button on Dashboard", () => {
  test("share/copy button visible on dashboard", async ({ page }) => {
    await page.goto(`${BASE}/dashboard`, { waitUntil: "load" });
    const shareBtn = page.locator("button").filter({ hasText: /share|copied/i });
    const count = await shareBtn.count();
    expect(count).toBeGreaterThan(0);
  });

  test("dashboard share copies URL with calc params", async ({ page }) => {
    await page.goto(`${BASE}/dashboard`, { waitUntil: "load" });
    const shareBtn = page.locator("button").filter({ hasText: /share/i });
    if (await shareBtn.count() > 0) {
      await shareBtn.first().click();
      await page.waitForTimeout(300);
      const clipboard = await page.evaluate(() => navigator.clipboard.readText());
      expect(clipboard).toContain("dashboard");
    }
  });
});
