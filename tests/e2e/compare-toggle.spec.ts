import { test, expect } from "@playwright/test";
import { BASE, MOBILE, toggleDarkMode } from "./helpers";

test.describe("Compare Toggle - Desktop", () => {
  test("compare toggle visible on MRR calculator", async ({ page }) => {
    await page.goto(`${BASE}/revenue/mrr-calculator`, { waitUntil: "load" });
    const toggle = page.getByRole("switch").or(page.locator("button").filter({ hasText: /compare|comparar/i })).first();
    await expect(toggle).toBeVisible();
  });

  test("toggling compare shows Scenario A and B labels", async ({ page }) => {
    await page.goto(`${BASE}/revenue/mrr-calculator`, { waitUntil: "load" });
    const toggle = page.locator("button").filter({ hasText: /compare|comparar/i }).first();
    // Toggle ON
    await toggle.click();
    await page.waitForTimeout(300);
    const scenarioA = page.locator("text=Scenario A").or(page.locator("text=Escenario A"));
    await expect(scenarioA).toBeVisible();
  });

  test("delta mode buttons visible when compare is ON", async ({ page }) => {
    await page.goto(`${BASE}/revenue/mrr-calculator`, { waitUntil: "load" });
    const toggle = page.locator("button").filter({ hasText: /compare/i }).first();
    await toggle.click();
    await page.waitForTimeout(300);
    // Delta modes: %, $, Both
    const deltaBtns = page.locator("button").filter({ hasText: /%|\$|Both|Ambos/i });
    await expect(deltaBtns.first()).toBeVisible();
  });
});

test.describe("Compare Toggle - Mobile", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(MOBILE);
  });

  test("compare toggle works on mobile viewport", async ({ page }) => {
    await page.goto(`${BASE}/revenue/mrr-calculator`, { waitUntil: "load" });
    const toggle = page.locator("button").filter({ hasText: /compare|comparar/i }).first();
    await expect(toggle).toBeVisible();
    await toggle.click();
    await page.waitForTimeout(300);
  });
});
