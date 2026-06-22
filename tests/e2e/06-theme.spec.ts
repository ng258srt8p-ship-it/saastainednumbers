import { test, expect } from "@playwright/test";
import { BASE, MOBILE, themeToggle, toggleDarkMode } from "./helpers";

test.describe("Theme toggle", () => {
  test("theme toggle is visible on homepage", async ({ page }) => {
    await page.goto(BASE);
    await expect(themeToggle(page)).toBeVisible();
  });

  test("theme toggle is visible on calculator page", async ({ page }) => {
    await page.goto(`${BASE}/revenue/mrr-calculator`);
    await expect(themeToggle(page)).toBeVisible();
  });

  test("theme toggle is visible on blog page", async ({ page }) => {
    await page.goto(`${BASE}/blog`);
    await expect(themeToggle(page)).toBeVisible();
  });

  test("theme toggle is visible on pricing page", async ({ page }) => {
    await page.goto(`${BASE}/pricing`);
    await expect(themeToggle(page)).toBeVisible();
  });

  test("theme toggle is visible on canvas page", async ({ page }) => {
    await page.goto(`${BASE}/canvas`);
    await expect(themeToggle(page)).toBeVisible();
  });

  test("toggling dark mode adds 'dark' class to html", async ({ page }) => {
    await page.goto(BASE);
    await toggleDarkMode(page, "dark");
    const hasDark = await page.evaluate(() =>
      document.documentElement.classList.contains("dark")
    );
    expect(hasDark).toBe(true);
  });

  test("toggling light mode removes 'dark' class from html", async ({ page }) => {
    await page.goto(BASE);
    await toggleDarkMode(page, "light");
    const hasDark = await page.evaluate(() =>
      document.documentElement.classList.contains("dark")
    );
    expect(hasDark).toBe(false);
  });

  test("theme persists after page reload", async ({ page }) => {
    await page.goto(BASE);
    await toggleDarkMode(page, "dark");
    await page.reload({ waitUntil: "load" });
    const hasDark = await page.evaluate(() =>
      document.documentElement.classList.contains("dark")
    );
    expect(hasDark).toBe(true);
  });

  test("theme persists across navigation", async ({ page }) => {
    await page.goto(BASE);
    await toggleDarkMode(page, "dark");
    await page.click('a[href="/revenue/mrr-calculator"]');
    await page.waitForLoadState("load");
    const hasDark = await page.evaluate(() =>
      document.documentElement.classList.contains("dark")
    );
    expect(hasDark).toBe(true);
  });

  test("calculator page inputs and results visible in dark mode", async ({ page }) => {
    await page.goto(`${BASE}/revenue/mrr-calculator`);
    await toggleDarkMode(page, "dark");
    // Verify calculator content is visible
    await expect(page.locator("h1")).toBeVisible();
    // Check that input sliders are present
    const inputs = page.locator('input[type="range"]');
    await expect(inputs.first()).toBeVisible();
  });

  test("mobile: theme toggle works at 390px viewport", async ({ page }) => {
    await page.setViewportSize(MOBILE);
    await page.goto(BASE);
    const btn = themeToggle(page);
    await expect(btn).toBeVisible();
    await btn.click();
    await page.waitForTimeout(300);
    const hasDark = await page.evaluate(() =>
      document.documentElement.classList.contains("dark")
    );
    expect(hasDark).toBe(true);
  });

  test("embed page: ?theme=dark adds dark class", async ({ page }) => {
    await page.goto(`${BASE}/embed/mrr-calculator?theme=dark`);
    // The EmbedClient applies the theme via useEffect
    await page.waitForTimeout(500);
    const hasDark = await page.evaluate(() =>
      document.documentElement.classList.contains("dark")
    );
    expect(hasDark).toBe(true);
  });

  test("embed page: ?theme=light does not add dark class", async ({ page }) => {
    await page.goto(`${BASE}/embed/mrr-calculator?theme=light`);
    await page.waitForTimeout(500);
    const hasDark = await page.evaluate(() =>
      document.documentElement.classList.contains("dark")
    );
    expect(hasDark).toBe(false);
  });
});
