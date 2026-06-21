import { test, expect } from "@playwright/test";
import { BASE, MOBILE, toggleDarkMode } from "./helpers";

test.describe("Related Calculators", () => {
  test("MRR calculator shows related calculators section", async ({ page }) => {
    await page.goto(`${BASE}/revenue/mrr-calculator`, { waitUntil: "load" });
    const section = page.locator("section").filter({ hasText: /Related Calculators|Calculadoras relacionadas|Ähnliche Rechner/i }).first();
    await expect(section).toBeVisible({ timeout: 10000 });
  });

  test("related calculators contain at least 2 links", async ({ page }) => {
    await page.goto(`${BASE}/revenue/mrr-calculator`, { waitUntil: "load" });
    const section = page.locator("section").filter({ hasText: /Related Calculators|Calculadoras relacionadas/i }).first();
    const links = section.locator("a");
    const count = await links.count();
    expect(count).toBeGreaterThanOrEqual(2);
  });

  test("related calculators link to valid calculator paths", async ({ page }) => {
    await page.goto(`${BASE}/revenue/mrr-calculator`, { waitUntil: "load" });
    const section = page.locator("section").filter({ hasText: /Related Calculators/i }).first();
    const links = section.locator("a");
    const hrefs = await links.evaluateAll((els: HTMLAnchorElement[]) => els.map(el => el.getAttribute("href") || ""));

    for (const href of hrefs) {
      expect(href).toMatch(/^\/([^/]+\/[^/]+)$/);
    }
  });

  test("LTV calculator shows related calculators", async ({ page }) => {
    await page.goto(`${BASE}/revenue/ltv-calculator`, { waitUntil: "load" });
    const section = page.locator("section").filter({ hasText: /Related Calculators/i }).first();
    await expect(section).toBeVisible({ timeout: 10000 });
  });

  test("CAC calculator shows related calculators", async ({ page }) => {
    await page.goto(`${BASE}/unit-economics/cac-calculator`, { waitUntil: "load" });
    const section = page.locator("section").filter({ hasText: /Related Calculators/i }).first();
    await expect(section).toBeVisible({ timeout: 10000 });
  });

  test("churn rate calculator shows related calculators", async ({ page }) => {
    await page.goto(`${BASE}/churn/churn-rate-calculator`, { waitUntil: "load" });
    const section = page.locator("section").filter({ hasText: /Related Calculators/i }).first();
    await expect(section).toBeVisible({ timeout: 10000 });
  });
});

test.describe("Related Calculators - Mobile", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(MOBILE);
  });

  test("related calculators section appears on mobile", async ({ page }) => {
    await page.goto(`${BASE}/revenue/mrr-calculator`, { waitUntil: "load" });
    const section = page.locator("section").filter({ hasText: /Related Calculators/i }).first();
    await expect(section).toBeVisible({ timeout: 10000 });
  });
});

test.describe("Related Calculators - Cross-Locale", () => {
  test("related calculators visible in Spanish", async ({ page }) => {
    await page.goto(`${BASE}/es/revenue/mrr-calculator`, { waitUntil: "load" });
    const section = page.locator("section").filter({ hasText: /Calculadoras relacionadas/i }).first();
    await expect(section).toBeVisible({ timeout: 10000 });
  });
});
