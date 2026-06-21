import { test, expect } from "@playwright/test";
import { BASE, MOBILE, CALC_SLUGS, toggleDarkMode } from "./helpers";

test.describe("Stage Selector - Desktop", () => {
  const stagePattern = /Seed|Series A|Series B|Series C|Growth/;

  test("stage selector visible on MRR calculator with 5 stage buttons", async ({ page }) => {
    await page.goto(`${BASE}/revenue/mrr-calculator`, { waitUntil: "load" });
    const stages = page.locator("button").filter({ hasText: stagePattern });
    await expect(stages).toHaveCount(5);
  });

  test("default stage is Series A (bg-brand-600)", async ({ page }) => {
    await page.goto(`${BASE}/revenue/mrr-calculator`, { waitUntil: "load" });
    const seriesA = page.locator("button").filter({ hasText: "Series A" });
    await expect(seriesA).toHaveClass(/bg-brand-600/);
  });

  test("clicking Growth activates Growth and deactivates Series A", async ({ page }) => {
    await page.goto(`${BASE}/revenue/mrr-calculator`, { waitUntil: "load" });
    const growthBtn = page.locator("button").filter({ hasText: "Growth" });
    await growthBtn.click();
    await expect(growthBtn).toHaveClass(/bg-brand-600/);
    const seriesA = page.locator("button").filter({ hasText: "Series A" });
    await expect(seriesA).not.toHaveClass(/bg-brand-600/);
  });

  test("clicking Seed activates Seed button", async ({ page }) => {
    await page.goto(`${BASE}/revenue/mrr-calculator`, { waitUntil: "load" });
    const seedBtn = page.locator("button").filter({ hasText: "Seed" });
    await seedBtn.click();
    await expect(seedBtn).toHaveClass(/bg-brand-600/);
  });

  test("stage selector visible on CAC calculator", async ({ page }) => {
    await page.goto(`${BASE}/unit-economics/cac-calculator`, { waitUntil: "load" });
    const stages = page.locator("button").filter({ hasText: stagePattern });
    await expect(stages).toHaveCount(5);
  });

  test("stage selector visible on FIRE calculator", async ({ page }) => {
    await page.goto(`${BASE}/personal-finance/fire-calculator`, { waitUntil: "load" });
    const stages = page.locator("button").filter({ hasText: stagePattern });
    await expect(stages).toHaveCount(5);
  });
});

test.describe("Stage Selector - Mobile", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(MOBILE);
  });

  test("stage buttons wrap correctly at 375px", async ({ page }) => {
    await page.goto(`${BASE}/revenue/mrr-calculator`, { waitUntil: "load" });
    const stages = page.locator("button").filter({ hasText: /Seed|Series A|Series B|Series C|Growth/ });
    await expect(stages).toHaveCount(5);
    // All buttons visible in viewport at mobile width
    for (let i = 0; i < 5; i++) {
      await expect(stages.nth(i)).toBeVisible();
    }
  });

  test("clicking stage works on mobile", async ({ page }) => {
    await page.goto(`${BASE}/revenue/mrr-calculator`, { waitUntil: "load" });
    const growthBtn = page.locator("button").filter({ hasText: "Growth" });
    await growthBtn.click();
    await expect(growthBtn).toHaveClass(/bg-brand-600/);
  });
});

test.describe("Stage Selector - Dark Mode", () => {
  test("stage selector buttons visible in dark mode", async ({ page }) => {
    await page.goto(`${BASE}/revenue/mrr-calculator`, { waitUntil: "load" });
    await toggleDarkMode(page, "dark");
    const stages = page.locator("button").filter({ hasText: /Seed|Series A|Series B|Series C|Growth/ });
    await expect(stages.first()).toBeVisible();
    await toggleDarkMode(page, "light");
  });
});
