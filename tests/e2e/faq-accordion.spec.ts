import { test, expect } from "@playwright/test";
import { BASE, MOBILE, CALC_SLUGS, toggleDarkMode } from "./helpers";

test.describe("FAQ Accordion - Desktop", () => {
  test("FAQ section has heading 'Frequently Asked Questions' on MRR calculator", async ({ page }) => {
    await page.goto(`${BASE}/revenue/mrr-calculator`, { waitUntil: "load" });
    await page.waitForTimeout(1000);
    const faqHeading = page.locator("h2, h3", { hasText: /Frequently Asked Questions|Preguntas Frecuentes|Häufig gestellte Fragen/i }).first();
    await expect(faqHeading).toBeVisible();
  });

  test("FAQ contains at least 2 details elements", async ({ page }) => {
    await page.goto(`${BASE}/revenue/mrr-calculator`, { waitUntil: "load" });
    const details = page.locator("details");
    const count = await details.count();
    expect(count).toBeGreaterThanOrEqual(2);
  });

  test("FAQ items are collapsed by default", async ({ page }) => {
    await page.goto(`${BASE}/revenue/mrr-calculator`, { waitUntil: "load" });
    const details = page.locator("details");
    for (let i = 0; i < 3; i++) {
      const d = details.nth(i);
      if (await d.isVisible()) {
        await expect(d).not.toHaveAttribute("open");
      }
    }
  });

  test("clicking summary opens the details item", async ({ page }) => {
    await page.goto(`${BASE}/revenue/mrr-calculator`, { waitUntil: "load" });
    const firstSummary = page.locator("details summary").first();
    await firstSummary.click();
    await page.waitForTimeout(300);
    const details = page.locator("details").first();
    await expect(details).toHaveAttribute("open");
  });

  test("clicking the same summary closes it again", async ({ page }) => {
    await page.goto(`${BASE}/revenue/mrr-calculator`, { waitUntil: "load" });
    const firstSummary = page.locator("details summary").first();
    await firstSummary.click();
    await page.waitForTimeout(300);
    await firstSummary.click();
    await page.waitForTimeout(300);
    const details = page.locator("details").first();
    await expect(details).not.toHaveAttribute("open");
  });
});

test.describe("FAQ Accordion - Mobile", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(MOBILE);
  });

  test("FAQ accordion works on mobile", async ({ page }) => {
    await page.goto(`${BASE}/revenue/mrr-calculator`, { waitUntil: "load" });
    const firstSummary = page.locator("details summary").first();
    await expect(firstSummary).toBeVisible();
    await firstSummary.click();
    await page.waitForTimeout(300);
    await expect(page.locator("details").first()).toHaveAttribute("open");
  });
});

test.describe("FAQ - Cross-Calculator", () => {
  test("FAQ present on CAC calculator", async ({ page }) => {
    await page.goto(`${BASE}/unit-economics/cac-calculator`, { waitUntil: "load" });
    const details = page.locator("details");
    const count = await details.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test("FAQ present on FIRE calculator", async ({ page }) => {
    await page.goto(`${BASE}/personal-finance/fire-calculator`, { waitUntil: "load" });
    const details = page.locator("details");
    const count = await details.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });
});

test.describe("FAQ - Dark Mode", () => {
  test("FAQ items visible in dark mode", async ({ page }) => {
    await page.goto(`${BASE}/revenue/mrr-calculator`, { waitUntil: "load" });
    await toggleDarkMode(page, "dark");
    const summary = page.locator("details summary").first();
    await expect(summary).toBeVisible();
    await summary.click();
    await page.waitForTimeout(300);
    await expect(page.locator("details").first()).toHaveAttribute("open");
    await toggleDarkMode(page, "light");
  });
});
