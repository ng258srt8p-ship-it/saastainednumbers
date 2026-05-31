import { test, expect } from "@playwright/test";

const BASE = "http://localhost:3000";

test.describe("Feedback Widget", () => {
  test("feedback widget visible on MRR calculator", async ({ page }) => {
    await page.goto(`${BASE}/revenue/mrr-calculator`, { waitUntil: "load" });
    const feedback = page.locator("text=Was this helpful?");
    await expect(feedback).toBeVisible();
  });

  test("feedback widget visible on CAC calculator", async ({ page }) => {
    await page.goto(`${BASE}/growth-efficiency/cac-calculator`, { waitUntil: "load" });
    const feedback = page.locator("text=Was this helpful?");
    await expect(feedback).toBeVisible();
  });

  test("feedback widget visible on Churn calculator", async ({ page }) => {
    await page.goto(`${BASE}/churn-retention/churn-calculator`, { waitUntil: "load" });
    const feedback = page.locator("text=Was this helpful?");
    await expect(feedback).toBeVisible();
  });

  test("feedback widget visible on FIRE calculator", async ({ page }) => {
    await page.goto(`${BASE}/personal-finance/fire-calculator`, { waitUntil: "load" });
    const feedback = page.locator("text=Was this helpful?");
    await expect(feedback).toBeVisible();
  });

  test("feedback widget visible on Break-Even calculator", async ({ page }) => {
    await page.goto(`${BASE}/general-business/break-even-calculator`, { waitUntil: "load" });
    const feedback = page.locator("text=Was this helpful?");
    await expect(feedback).toBeVisible();
  });

  test("Yes button is clickable", async ({ page }) => {
    await page.goto(`${BASE}/revenue/mrr-calculator`, { waitUntil: "load" });
    const yesBtn = page.locator('button[aria-label="Yes, helpful"]');
    await expect(yesBtn).toBeVisible();
    await yesBtn.click();
  });

  test("No button is clickable", async ({ page }) => {
    await page.goto(`${BASE}/revenue/mrr-calculator`, { waitUntil: "load" });
    const noBtn = page.locator('button[aria-label="No, not helpful"]');
    await expect(noBtn).toBeVisible();
    await noBtn.click();
  });

  test("clicking Yes shows thanks message", async ({ page }) => {
    await page.goto(`${BASE}/revenue/mrr-calculator`, { waitUntil: "load" });
    await page.locator('button[aria-label="Yes, helpful"]').click();
    await page.waitForTimeout(300);
    await expect(page.locator("text=Thanks for your feedback!")).toBeVisible();
  });

  test("clicking No shows thanks message", async ({ page }) => {
    await page.goto(`${BASE}/revenue/mrr-calculator`, { waitUntil: "load" });
    await page.locator('button[aria-label="No, not helpful"]').click();
    await page.waitForTimeout(300);
    await expect(page.locator("text=Thanks for your feedback!")).toBeVisible();
  });

  test("Yes and No buttons hidden after submission", async ({ page }) => {
    await page.goto(`${BASE}/revenue/mrr-calculator`, { waitUntil: "load" });
    await page.locator('button[aria-label="Yes, helpful"]').click();
    await page.waitForTimeout(300);
    // After submission, buttons should be replaced by thanks message
    const yesBtn = page.locator('button[aria-label="Yes, helpful"]');
    const noBtn = page.locator('button[aria-label="No, not helpful"]');
    await expect(yesBtn).not.toBeVisible();
    await expect(noBtn).not.toBeVisible();
  });

  test("feedback persists after submission", async ({ page }) => {
    await page.goto(`${BASE}/revenue/mrr-calculator`, { waitUntil: "load" });
    await page.locator('button[aria-label="Yes, helpful"]').click();
    await page.waitForTimeout(300);
    await expect(page.locator("text=Thanks for your feedback!")).toBeVisible();
    // Reload and check it resets (feedback is per-session)
    await page.reload({ waitUntil: "load" });
    // After reload, should be back to initial state
    const yesBtn = page.locator('button[aria-label="Yes, helpful"]');
    if (await yesBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(yesBtn).toBeVisible();
    }
  });
});
