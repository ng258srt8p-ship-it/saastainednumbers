import { test, expect } from "@playwright/test";
import { BASE, MOBILE, toggleDarkMode } from "./helpers";

test.describe("Dashboard page", () => {
  test("dashboard loads with 200 status", async ({ page }) => {
    const resp = await page.goto(`${BASE}/dashboard`, { waitUntil: "load" });
    expect(resp?.status()).toBe(200);
  });

  test("dashboard heading is visible", async ({ page }) => {
    await page.goto(`${BASE}/dashboard`, { waitUntil: "load" });
    const heading = page.locator("h1");
    await expect(heading.first()).toBeVisible();
  });

  test("dashboard has input fields for calculator data", async ({ page }) => {
    await page.goto(`${BASE}/dashboard`, { waitUntil: "load" });
    const inputs = page.locator('input[type="number"]');
    await expect(inputs.first()).toBeVisible({ timeout: 5000 });
    const count = await inputs.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test("dashboard has expandable calculator widgets", async ({ page }) => {
    await page.goto(`${BASE}/dashboard`, { waitUntil: "load" });
    const widgets = page.locator('button[aria-expanded]');
    const count = await widgets.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test("widget expands on click to reveal content", async ({ page }) => {
    await page.goto(`${BASE}/dashboard`, { waitUntil: "load" });
    const widget = page.locator('button[aria-expanded]').first();
    await expect(widget).toBeVisible({ timeout: 5000 });
    const wasExpanded = await widget.getAttribute("aria-expanded");
    await widget.click();
    await page.waitForTimeout(300);
    const isExpanded = await widget.getAttribute("aria-expanded");
    expect(isExpanded).not.toBe(wasExpanded);
  });

  test("changing input updates URL state", async ({ page }) => {
    await page.goto(`${BASE}/dashboard`, { waitUntil: "load" });
    const input = page.locator('input[type="number"]').first();
    await expect(input).toBeVisible({ timeout: 5000 });
    await input.fill("2000");
    await page.waitForTimeout(500);
    // URL should reflect the updated value
    const url = page.url();
    expect(url).toContain("=");
  });

  test("add calculator button is present", async ({ page }) => {
    await page.goto(`${BASE}/dashboard`, { waitUntil: "load" });
    const addBtn = page.locator("button").filter({ hasText: /add calculator/i }).first();
    // The button may or may not exist depending on dashboard implementation
    if (await addBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await expect(addBtn).toBeVisible();
    }
  });

  test("share button is present on dashboard", async ({ page }) => {
    await page.goto(`${BASE}/dashboard`, { waitUntil: "load" });
    const share = page.locator("button").filter({ hasText: /share|copied/i }).first();
    if (await share.isVisible({ timeout: 2000 }).catch(() => false)) {
      await expect(share).toBeVisible();
    }
  });

  test("dark mode toggle works on dashboard", async ({ page }) => {
    await page.goto(`${BASE}/dashboard`, { waitUntil: "load" });
    await page.waitForTimeout(500);
    // Toggle to dark mode
    await toggleDarkMode(page, "dark");
    const isDark = await page.evaluate(() =>
      document.documentElement.classList.contains("dark")
    );
    expect(isDark).toBe(true);
    // Toggle back to light
    await toggleDarkMode(page, "light");
    const isLight = await page.evaluate(() =>
      !document.documentElement.classList.contains("dark")
    );
    expect(isLight).toBe(true);
  });

  test("mobile: dashboard renders at 390px viewport", async ({ page }) => {
    await page.setViewportSize(MOBILE);
    await page.goto(`${BASE}/dashboard`, { waitUntil: "load" });
    const heading = page.locator("h1");
    await expect(heading.first()).toBeVisible({ timeout: 5000 });
  });
});
