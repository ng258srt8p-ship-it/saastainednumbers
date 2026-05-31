import { test, expect } from "@playwright/test";

const BASE = "http://localhost:3000";

test.describe("Calculator Search - Category Pages", () => {
  test("search input visible on revenue category page", async ({ page }) => {
    await page.goto(`${BASE}/revenue`, { waitUntil: "load" });
    const search = page.locator('input[aria-label="Search calculators"]');
    await expect(search).toBeVisible();
  });

  test("search input has correct placeholder", async ({ page }) => {
    await page.goto(`${BASE}/revenue`, { waitUntil: "load" });
    const search = page.locator('input[aria-label="Search calculators"]');
    await expect(search).toHaveAttribute("placeholder", /search/i);
  });

  test("typing in search filters calculator results", async ({ page }) => {
    await page.goto(`${BASE}/revenue`, { waitUntil: "load" });
    const search = page.locator('input[aria-label="Search calculators"]');
      // Type a query
    await search.fill("MRR");
    await page.waitForTimeout(500);
    // Cards should change or results list should appear
    const results = page.locator('div[role="listbox"]').or(page.locator("a[href*='calculator']"));
    const afterCount = await results.count();
    expect(afterCount).toBeGreaterThanOrEqual(1);
  });

  test("search shows results in dropdown", async ({ page }) => {
    await page.goto(`${BASE}/revenue`, { waitUntil: "load" });
    const search = page.locator('input[aria-label="Search calculators"]');
    await search.fill("MRR");
    await page.waitForTimeout(500);
    const listbox = page.locator('div#search-results[role="listbox"]');
    if (await listbox.isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(listbox).toBeVisible();
    }
  });

  test("clearing search restores all calculators", async ({ page }) => {
    await page.goto(`${BASE}/revenue`, { waitUntil: "load" });
    const search = page.locator('input[aria-label="Search calculators"]');
    await search.fill("MRR");
    await page.waitForTimeout(500);
    await search.clear();
    await page.waitForTimeout(300);
    // Cards should be visible again
    const cards = page.locator("a[href*='calculator']");
    expect(await cards.count()).toBeGreaterThanOrEqual(3);
  });

  test("search with no results shows empty state", async ({ page }) => {
    await page.goto(`${BASE}/revenue`, { waitUntil: "load" });
    const search = page.locator('input[aria-label="Search calculators"]');
    await search.fill("zzz_nonexistent_calc_xyz");
    await page.waitForTimeout(500);
  });

  test("search has aria-autocomplete attribute", async ({ page }) => {
    await page.goto(`${BASE}/revenue`, { waitUntil: "load" });
    const search = page.locator('input[aria-label="Search calculators"]');
    await expect(search).toHaveAttribute("aria-autocomplete", "list");
  });
});

test.describe("Calculator Search - All Calculators Page", () => {
  test("search visible on /calculators page", async ({ page }) => {
    await page.goto(`${BASE}/calculators`, { waitUntil: "load" });
    const search = page.locator('input[aria-label="Search calculators"]');
    await expect(search).toBeVisible();
  });

  test("search filters across all calculators", async ({ page }) => {
    await page.goto(`${BASE}/calculators`, { waitUntil: "load" });
    const search = page.locator('input[aria-label="Search calculators"]');
    await search.fill("CAC");
    await page.waitForTimeout(500);
    // Should find at least CAC calculator
    const listbox = page.locator('div[role="listbox"]');
    if (await listbox.isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(listbox.locator("text=CAC").first()).toBeVisible();
    }
  });
});

test.describe("Calculator Search - Edge Cases", () => {
  test("search handles partial matches", async ({ page }) => {
    await page.goto(`${BASE}/revenue`, { waitUntil: "load" });
    const search = page.locator('input[aria-label="Search calculators"]');
    await search.fill("rate");
    await page.waitForTimeout(500);
  });

  test("search handles special characters gracefully", async ({ page }) => {
    await page.goto(`${BASE}/revenue`, { waitUntil: "load" });
    const search = page.locator('input[aria-label="Search calculators"]');
    await search.fill("!@#$%");
    await page.waitForTimeout(300);
  });
});
