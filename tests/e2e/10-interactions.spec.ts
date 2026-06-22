import { test, expect } from "@playwright/test";
import { BASE, getInsightsBtn } from "./helpers";

test.describe("Share button", () => {
  test("share button on mrr-calculator: click shows 'Copied!' then reverts", async ({ page }) => {
    await page.goto(`${BASE}/revenue/mrr-calculator`);
    const shareBtn = page.getByRole("button", { name: /share/i }).first();
    await expect(shareBtn).toBeVisible();

    await shareBtn.click();
    // Should show "Copied!" immediately after click
    await expect(shareBtn).toContainText("Copied!");
    // Reverts after timeout (2 seconds)
    await expect(shareBtn).toContainText("Share", { timeout: 5000 });
  });

  test("share button on cac-calculator: click shows 'Copied!' then reverts", async ({ page }) => {
    await page.goto(`${BASE}/unit-economics/cac-calculator`);
    const shareBtn = page.getByRole("button", { name: /share/i }).first();
    await expect(shareBtn).toBeVisible();

    await shareBtn.click();
    await expect(shareBtn).toContainText("Copied!");
    await expect(shareBtn).toContainText("Share", { timeout: 5000 });
  });
});

test.describe("Feedback widget", () => {
  test("'Was this helpful?' visible on mrr-calculator", async ({ page }) => {
    await page.goto(`${BASE}/revenue/mrr-calculator`);
    await expect(page.getByText("Was this helpful?")).toBeVisible();
  });

  test("clicking Yes shows thanks and hides buttons", async ({ page }) => {
    await page.goto(`${BASE}/revenue/mrr-calculator`);
    const helpfulText = page.getByText("Was this helpful?");
    await expect(helpfulText).toBeVisible();

    const yesBtn = page.getByRole("button", { name: /yes/i }).first();
    await yesBtn.click();

    // Thanks message should appear
    await expect(page.getByText(/thanks/i).first()).toBeVisible();
    // "Was this helpful?" and buttons should be gone
    await expect(helpfulText).not.toBeVisible();
  });

  test("clicking No shows thanks and hides buttons", async ({ page }) => {
    await page.goto(`${BASE}/revenue/mrr-calculator`);
    const helpfulText = page.getByText("Was this helpful?");
    await expect(helpfulText).toBeVisible();

    const noBtn = page.getByRole("button", { name: /no/i }).first();
    await noBtn.click();

    await expect(page.getByText(/thanks/i).first()).toBeVisible();
    await expect(helpfulText).not.toBeVisible();
  });
});

test.describe("Get Insights", () => {
  test("Get Insights button visible on mrr-calculator", async ({ page }) => {
    await page.goto(`${BASE}/revenue/mrr-calculator`);
    const btn = getInsightsBtn(page);
    await expect(btn).toBeVisible();
  });

  test("clicking Get Insights triggers loading then content appears", async ({ page }) => {
    await page.goto(`${BASE}/revenue/mrr-calculator`);
    const btn = getInsightsBtn(page);
    await btn.click();

    // Loading state should appear
    const loadingIndicator = page.locator('[role="status"][aria-label="Loading insights"]');
    await expect(loadingIndicator).toBeVisible();

    // Content should eventually appear (loading indicator disappears)
    await expect(loadingIndicator).toBeHidden({ timeout: 10000 });

    // Insights content should be visible
    const insightsContent = page.locator('.prose[role="status"][aria-live="polite"]');
    await expect(insightsContent).toBeVisible({ timeout: 10000 });
  });
});

test.describe("Compare toggle", () => {
  test("clicking compare shows Scenario A/B, toggle back hides Scenario B", async ({ page }) => {
    await page.goto(`${BASE}/revenue/mrr-calculator`);

    // Initially, single view — no "Scenario B" text
    await expect(page.getByText("Scenario B")).not.toBeVisible();

    // Click the "Compare Scenarios" button in the CompareToggle
    const compareBtn = page.getByRole("button", { name: /compare scenarios/i });
    await compareBtn.click();

    // Scenario A and B headers should be visible
    await expect(page.getByText("Scenario A").first()).toBeVisible();
    await expect(page.getByText("Scenario B").first()).toBeVisible();

    // Results comparison section should appear
    await expect(page.getByText("Results Comparison")).toBeVisible();

    // Toggle back to single view
    const singleBtn = page.getByRole("button", { name: /^Single$/ });
    await singleBtn.click();

    // Scenario B should be hidden
    await expect(page.getByText("Scenario B")).not.toBeVisible();
  });
});

test.describe("Search", () => {
  test("search on /calculators page: input visible, type filters results", async ({ page }) => {
    await page.goto(`${BASE}/calculators`);
    const searchInput = page.locator('input[aria-label*="Search"]');
    await expect(searchInput).toBeVisible();

    await searchInput.fill("MRR");
    await page.waitForTimeout(300);

    // Search results should appear
    const results = page.locator('#search-results[role="listbox"]');
    await expect(results).toBeVisible();
    // At least one result should contain "MRR"
    const options = results.locator('a[role="option"]');
    const count = await options.count();
    expect(count).toBeGreaterThan(0);
  });

  test("clearing search restores all results", async ({ page }) => {
    await page.goto(`${BASE}/calculators`);
    const searchInput = page.locator('input[aria-label*="Search"]');
    await searchInput.fill("MRR");
    await page.waitForTimeout(300);

    // Results should be visible
    await expect(page.locator('#search-results')).toBeVisible();

    // Clear the input
    await searchInput.fill("");
    await page.waitForTimeout(300);

    // Results should be hidden when query is empty
    await expect(page.locator('#search-results')).not.toBeVisible();
  });

  test("search on category page filters calculators in category", async ({ page }) => {
    await page.goto(`${BASE}/revenue`);
    const searchInput = page.locator('input[aria-label*="Search"]');
    await expect(searchInput).toBeVisible();

    await searchInput.fill("MRR");
    await page.waitForTimeout(300);

    const results = page.locator('#search-results[role="listbox"]');
    await expect(results).toBeVisible();
    const options = results.locator('a[role="option"]');
    const count = await options.count();
    expect(count).toBeGreaterThan(0);
  });

  test("search with empty string shows no results dropdown", async ({ page }) => {
    await page.goto(`${BASE}/calculators`);
    const searchInput = page.locator('input[aria-label*="Search"]');
    await searchInput.fill("");
    await page.waitForTimeout(300);

    // Empty query should not show dropdown
    await expect(page.locator('#search-results')).not.toBeVisible();
  });

  test("search with non-matching term shows no results", async ({ page }) => {
    await page.goto(`${BASE}/calculators`);
    const searchInput = page.locator('input[aria-label*="Search"]');
    await searchInput.fill("xyznonexistent123");
    await page.waitForTimeout(300);

    // No results dropdown should appear
    await expect(page.locator('#search-results')).not.toBeVisible();
    // The aria-expanded should be false (no popup)
    const combobox = page.locator('[role="combobox"]');
    await expect(combobox).toHaveAttribute("aria-expanded", "false");
  });
});
