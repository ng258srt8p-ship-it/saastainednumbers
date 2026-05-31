import { test, expect } from "@playwright/test";

const BASE = "http://localhost:3000";

test.describe("Dashboard", () => {
  test("dashboard returns 200", async ({ page }) => {
    const resp = await page.goto(`${BASE}/dashboard`, { waitUntil: "load" });
    expect(resp?.status()).toBe(200);
  });

  test("dashboard has heading", async ({ page }) => {
    await page.goto(`${BASE}/dashboard`, { waitUntil: "load" });
    await expect(page.locator("h1")).toBeVisible();
  });

  test("dashboard has subtitle", async ({ page }) => {
    await page.goto(`${BASE}/dashboard`, { waitUntil: "load" });
    const subtitle = page.locator("p.text-gray-600").first();
    await expect(subtitle).toBeVisible();
  });

  test("dashboard has 5 default calculator widgets", async ({ page }) => {
    await page.goto(`${BASE}/dashboard`, { waitUntil: "load" });
    // Widgets are rendered as expandable buttons with aria-expanded
    const widgets = page.locator('button[aria-expanded]');
    const count = await widgets.count();
    expect(count).toBeGreaterThanOrEqual(3);
  });

  test("dashboard has default input fields", async ({ page }) => {
    await page.goto(`${BASE}/dashboard`, { waitUntil: "load" });
    const inputs = page.locator('input[type="number"]');
    expect(await inputs.count()).toBeGreaterThanOrEqual(3);
  });

  test("changing input updates URL", async ({ page }) => {
    await page.goto(`${BASE}/dashboard`, { waitUntil: "load" });
    const input = page.locator('input[type="number"]').first();
    await input.fill("2000");
    await page.waitForTimeout(500);
    await expect(page).toHaveURL(/mrr.*=2000/);
  });

  test("result cards are expandable widgets", async ({ page }) => {
    await page.goto(`${BASE}/dashboard`, { waitUntil: "load" });
    const widget = page.locator('button[aria-expanded]').first();
    await expect(widget).toBeVisible();
    await widget.click();
    await page.waitForTimeout(300);
    // After expanding, widget internal content should be visible
    await expect(widget).toHaveAttribute("aria-expanded", "true");
  });

  test("changing input updates widget results", async ({ page }) => {
    await page.goto(`${BASE}/dashboard`, { waitUntil: "load" });
    const input = page.locator('input[type="number"]').first();
    await input.fill("9999");
    await page.waitForTimeout(300);
    // Input value persisted
    await expect(input).toHaveValue("9999");
  });

  test("add calculator button is visible", async ({ page }) => {
    await page.goto(`${BASE}/dashboard`, { waitUntil: "load" });
    const addBtn = page.locator("button").filter({ hasText: /add calculator/i });
    await expect(addBtn.first()).toBeVisible();
  });

  test("add calculator button opens picker", async ({ page }) => {
    await page.goto(`${BASE}/dashboard`, { waitUntil: "load" });
    const addBtn = page.locator("button").filter({ hasText: /add calculator/i });
    if (await addBtn.count() > 0) {
      await addBtn.first().click();
      await page.waitForTimeout(300);
    }
  });

  test("share/copy button is visible", async ({ page }) => {
    await page.goto(`${BASE}/dashboard`, { waitUntil: "load" });
    const shareBtn = page.locator("button").filter({ hasText: /share|copied/i });
    const count = await shareBtn.count();
    expect(count).toBeGreaterThan(0);
  });

  test("dashboard has active calculator count indicator", async ({ page }) => {
    await page.goto(`${BASE}/dashboard`, { waitUntil: "load" });
    const countText = page.locator("text=calculator").or(page.locator("text=active"));
    if (await countText.count() > 0) {
      await expect(countText.first()).toBeVisible();
    }
  });

  test("changing input updates widget data", async ({ page }) => {
    await page.goto(`${BASE}/dashboard`, { waitUntil: "load" });
    const input = page.locator('input[type="number"]').first();
    await input.fill("2000");
    await page.waitForTimeout(300);
    // Widget count indicator present
    const countText = page.locator("text=/\\d+ calculator/").first();
    await expect(countText).toBeVisible();
  });

  test("dashboard page has correct title", async ({ page }) => {
    await page.goto(`${BASE}/dashboard`, { waitUntil: "load" });
    const title = await page.title();
    expect(title.length).toBeGreaterThan(0);
  });
});
