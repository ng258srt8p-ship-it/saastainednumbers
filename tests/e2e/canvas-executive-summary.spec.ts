import { test, expect, type Page } from "@playwright/test";

const BASE = "http://localhost:3000";

async function clearCanvasStorage(page: Page) {
  await page.evaluate(() => localStorage.removeItem("canvas-workspace-calculators"));
}

test.describe("Canvas Executive Summary", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE}/canvas`, { waitUntil: "networkidle" });
    await clearCanvasStorage(page);
    await page.reload({ waitUntil: "networkidle" });
  });

  test("single calculator shows metrics immediately on add (no slider interaction needed)", async ({ page }) => {
    // Click MRR Calculator in the catalog
    await page.getByRole("button", { name: /MRR Calculator$/ }).first().click();
    await expect(page.getByText("Executive Summary")).toBeVisible();

    // Use .first() for text that appears in multiple locations
    // The Executive Summary span uses exact text "1 calculator"
    await expect(page.getByText("1 calculator", { exact: true }).first()).toBeVisible();

    // Should show real metric values, NOT the placeholder text
    await expect(page.getByText("Aggregate metrics will appear here")).not.toBeVisible();

    // Verify specific metric values appear (default MRR: 100 cust × $50 ARPU = $5.0K)
    await expect(page.getByText("Total MRR").first()).toBeVisible();
    await expect(page.getByText("$5.0K").first()).toBeVisible();
    await expect(page.getByText("Total ARR").first()).toBeVisible();
    await expect(page.getByText("$60.0K").first()).toBeVisible();
  });

  test("metrics update in real time when slider is adjusted", async ({ page }) => {
    await page.getByRole("button", { name: /MRR Calculator$/ }).first().click();
    await expect(page.getByText("Executive Summary")).toBeVisible();

    // Verify initial value before slider change
    await expect(page.getByText("$5.0K").first()).toBeVisible();

    // Find and adjust the customers slider (first range input in the widget area)
    const sliders = page.locator('input[type="range"]');

    // Use fill which is the most reliable method for range inputs
    await sliders.first().fill("500");

    // Wait a tick for React to re-render
    await page.waitForTimeout(200);

    // Now verify Executive Summary updated — MRR should be $25.0K (500 × $50)
    await expect(page.getByText("$25.0K").first()).toBeVisible();
    await expect(page.getByText("$300.0K").first()).toBeVisible();
  });

  test("multi-calculator template shows aggregate metrics immediately", async ({ page }) => {
    // Apply SaaS Starter Pack (5 calculators: MRR, churn, LTV, CAC, gross-margin)
    await page.getByRole("button", { name: /SaaS Starter Pack/ }).first().click();
    await page.waitForTimeout(500); // Wait for all 5 calculators to mount

    await expect(page.getByText("Executive Summary")).toBeVisible();
    await expect(page.getByText("5 calculators", { exact: true }).first()).toBeVisible();
    await expect(page.getByText("Aggregate metrics will appear here")).not.toBeVisible();

    // Should show multiple aggregate metrics from different calculators
    await expect(page.getByText("Total MRR").first()).toBeVisible();
    await expect(page.getByText("Total ARR").first()).toBeVisible();
    await expect(page.getByText("Total CAC").first()).toBeVisible();
    await expect(page.getByText("Avg LTV").first()).toBeVisible();
    await expect(page.getByText("Avg Churn").first()).toBeVisible();
  });

  test("metrics persist after page reload", async ({ page }) => {
    // Add a calculator
    await page.getByRole("button", { name: /MRR Calculator$/ }).first().click();
    await expect(page.getByText("$5.0K").first()).toBeVisible();

    // Reload the page — workspace persists from localStorage
    await page.reload({ waitUntil: "networkidle" });

    // Executive Summary should show metrics again without any interaction
    await expect(page.getByText("Executive Summary")).toBeVisible();
    await expect(page.getByText("1 calculator", { exact: true }).first()).toBeVisible();
    await expect(page.getByText("$5.0K").first()).toBeVisible();
    await expect(page.getByText("Aggregate metrics will appear here")).not.toBeVisible();
  });

  test("removing calculator updates Executive Summary metrics", async ({ page }) => {
    // Add MRR + CAC calculators
    await page.getByRole("button", { name: /MRR Calculator$/ }).first().click();
    await page.getByRole("button", { name: "CAC Calculator" }).click();

    await expect(page.getByText("2 calculators", { exact: true }).first()).toBeVisible();

    // Both should contribute metrics (don't assert specific MRR value since CAC doesn't affect it)
    await expect(page.getByText("Total MRR").first()).toBeVisible();
    await expect(page.getByText("Total CAC").first()).toBeVisible();

    // Remove the first calculator (MRR)
    const removeButtons = page.getByTitle("Remove from workspace");
    await removeButtons.first().click();

    // Should now show 1 calculator remaining
    await expect(page.getByText("1 calculator", { exact: true }).first()).toBeVisible();
  });
});
