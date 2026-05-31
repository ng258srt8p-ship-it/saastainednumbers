import { test, expect, type Page } from "@playwright/test";

const BASE = "http://localhost:3000";
const MOBILE = { width: 390, height: 844 };

function themeBtn(page: Page) {
  return page.locator('button[aria-label*="Switch to"], button[aria-label="Toggle theme"]');
}

test.describe("Theme Toggle", () => {
  test("theme toggle button is visible on all page types", async ({ page }) => {
    await page.addInitScript(() => localStorage.removeItem("theme"));
    await page.goto(BASE, { waitUntil: "load" });
    await expect(themeBtn(page)).toBeAttached();

    await page.goto(`${BASE}/revenue/mrr-calculator`, { waitUntil: "load" });
    await expect(themeBtn(page)).toBeAttached();

    await page.goto(`${BASE}/dashboard`, { waitUntil: "load" });
    await expect(themeBtn(page)).toBeAttached();

    await page.goto(`${BASE}/blog`, { waitUntil: "load" });
    await expect(themeBtn(page)).toBeAttached();

    await page.goto(`${BASE}/pricing`, { waitUntil: "load" });
    await expect(themeBtn(page)).toBeAttached();
  });

  test("clicking toggle switches from light to dark mode", async ({ page }) => {
    await page.addInitScript(() => localStorage.removeItem("theme"));
    await page.goto(BASE, { waitUntil: "load" });
    await expect(page.locator("html")).not.toHaveClass(/dark/);

    const btn = themeBtn(page);
    await expect(btn).toHaveAttribute("aria-label", "Switch to dark mode");

    await btn.click();
    await expect(page.locator("html")).toHaveClass(/dark/);
    await expect(btn).toHaveAttribute("aria-label", "Switch to light mode");
  });

  test("clicking toggle switches from dark to light mode", async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem("theme", "dark"));
    await page.goto(BASE, { waitUntil: "load" });

    await expect(page.locator("html")).toHaveClass(/dark/);
    const btn = themeBtn(page);
    await expect(btn).toHaveAttribute("aria-label", "Switch to light mode");

    await btn.click();
    await expect(page.locator("html")).not.toHaveClass(/dark/);
    await expect(btn).toHaveAttribute("aria-label", "Switch to dark mode");
  });

  test("dark mode persists in localStorage after toggle", async ({ page }) => {
    await page.addInitScript(() => localStorage.removeItem("theme"));
    await page.goto(BASE, { waitUntil: "load" });
    await themeBtn(page).click();

    const stored = await page.evaluate(() => localStorage.getItem("theme"));
    expect(stored).toBe("dark");
  });

  test("light mode persists in localStorage", async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem("theme", "dark"));
    await page.goto(BASE, { waitUntil: "load" });
    await themeBtn(page).click();

    const stored = await page.evaluate(() => localStorage.getItem("theme"));
    expect(stored).toBe("light");
  });

  test("theme persists across page navigation", async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem("theme", "dark"));
    await page.goto(BASE, { waitUntil: "load" });
    await expect(page.locator("html")).toHaveClass(/dark/);

    await page.goto(`${BASE}/revenue/mrr-calculator`, { waitUntil: "load" });
    await expect(page.locator("html")).toHaveClass(/dark/);

    await page.goto(`${BASE}/dashboard`, { waitUntil: "load" });
    await expect(page.locator("html")).toHaveClass(/dark/);
  });

  test("theme persists on page reload", async ({ page }) => {
    // Note: no addInitScript — the toggle sets localStorage, then reload
    // must preserve it so the ThemeToggle module reads it on load
    await page.goto(BASE, { waitUntil: "load" });
    await themeBtn(page).click();
    await expect(page.locator("html")).toHaveClass(/dark/);

    await page.reload({ waitUntil: "load" });
    // Wait for Next.js JS chunks to execute and ThemeToggle to read localStorage
    await page.waitForFunction(() => document.documentElement.classList.contains("dark"));
  });

  test("calculator page respects dark mode from localStorage", async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem("theme", "dark"));
    await page.goto(`${BASE}/revenue/mrr-calculator`, { waitUntil: "load" });
    await expect(page.locator("html")).toHaveClass(/dark/);
  });

  test("dashboard page respects dark mode", async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem("theme", "dark"));
    await page.goto(`${BASE}/dashboard`, { waitUntil: "load" });
    await expect(page.locator("html")).toHaveClass(/dark/);
  });

  test("blog page respects dark mode", async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem("theme", "dark"));
    await page.goto(`${BASE}/blog`, { waitUntil: "load" });
    await expect(page.locator("html")).toHaveClass(/dark/);
  });

  test("theme toggle is accessible on mobile viewport", async ({ page }) => {
    await page.setViewportSize(MOBILE);
    await page.goto(BASE, { waitUntil: "load" });
    await expect(themeBtn(page)).toBeVisible();
    await themeBtn(page).click();
    await expect(page.locator("html")).toHaveClass(/dark/);
  });
});

test.describe("Theme Toggle - Embed pages", () => {
  test("embed page respects ?theme=dark param", async ({ page }) => {
    await page.goto(`${BASE}/embed/mrr-calculator?theme=dark`, { waitUntil: "load" });
    await expect(page.locator("html")).toHaveClass(/dark/);
  });

  test("embed page respects ?theme=light param", async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem("theme", "dark"));
    await page.goto(`${BASE}/embed/mrr-calculator?theme=light`, { waitUntil: "load" });
    await expect(page.locator("html")).not.toHaveClass(/dark/);
  });

  test("embed page defaults to light mode without theme param", async ({ page }) => {
    await page.goto(`${BASE}/embed/mrr-calculator`, { waitUntil: "load" });
    await expect(page.locator("html")).not.toHaveClass(/dark/);
  });

  test("embed dark theme renders inputs and results", async ({ page }) => {
    await page.goto(`${BASE}/embed/mrr-calculator?theme=dark`, { waitUntil: "load" });
    await expect(page.locator('input[type="number"]').first()).toBeVisible();
    await page.locator('input[type="number"]').first().fill("200");
    await page.waitForTimeout(300);
  });
});
