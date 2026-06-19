import { test, expect, type Page } from "@playwright/test";

const BASE = "http://localhost:3000";

async function clearCanvasStorage(page: Page) {
  await page.evaluate(() => localStorage.removeItem("canvas-workspace-calculators"));
}

test.describe("Canvas Workspace", () => {
  test("page loads with empty workspace state", async ({ page }) => {
    await page.goto(`${BASE}/canvas`, { waitUntil: "networkidle" });
    await clearCanvasStorage(page);
    await page.reload({ waitUntil: "networkidle" });

    // Should show the empty workspace message
    await expect(page.getByText("Your Workspace is Empty")).toBeVisible();
    await expect(page.getByText("Drag calculators from the catalog")).toBeVisible();
    await expect(page.getByText("No calculators yet")).toBeVisible();
  });

  test("clicking MRR calculator adds it to workspace and shows in master widget", async ({ page }) => {
    await page.goto(`${BASE}/canvas`, { waitUntil: "networkidle" });
    await clearCanvasStorage(page);
    await page.reload({ waitUntil: "networkidle" });

    // Click MRR Calculator button in the catalog sidebar
    const mrrBtn = page.locator("aside").getByRole("button", { name: "MRR Calculator", exact: true });
    await expect(mrrBtn).toBeVisible();
    await mrrBtn.click();

    // The widget should appear (it has "Monthly Recurring Revenue" in the header)
    await expect(page.getByText("Monthly Recurring Revenue")).toBeVisible();

    // Exec summary should now show calculator count
    await expect(page.getByText("1 calculator active")).toBeVisible();
    await expect(page.getByText("Executive Summary")).toBeVisible();
  });

  test("removing a calculator removes it from the workspace", async ({ page }) => {
    await page.goto(`${BASE}/canvas`, { waitUntil: "networkidle" });
    await clearCanvasStorage(page);
    await page.reload({ waitUntil: "networkidle" });

    // Add MRR calculator
    await page.locator("aside").getByRole("button", { name: "MRR Calculator", exact: true }).click();
    await expect(page.getByText("Monthly Recurring Revenue")).toBeVisible();

    // Click the remove button (X icon)
    const removeBtn = page.locator('button[aria-label*="Remove"]');
    await expect(removeBtn).toBeVisible();
    await removeBtn.click();

    // Widget should disappear and workspace should be empty again
    await expect(page.getByText("Monthly Recurring Revenue")).not.toBeVisible();
    await expect(page.getByText("Your Workspace is Empty")).toBeVisible();
  });

  test("clear all button removes all calculators", async ({ page }) => {
    await page.goto(`${BASE}/canvas`, { waitUntil: "networkidle" });
    await clearCanvasStorage(page);
    await page.reload({ waitUntil: "networkidle" });

    // Add two calculators
    await page.locator("aside").getByRole("button", { name: "MRR Calculator", exact: true }).click();
    await page.locator("aside").getByRole("button", { name: "Churn Rate Calculator", exact: true }).click();

    await expect(page.getByText("2 calculators active")).toBeVisible();

    // Click Clear all
    await page.getByText("Clear all").click();
    await expect(page.getByText("Your Workspace is Empty")).toBeVisible();
  });

  test("templates section is visible in the catalog", async ({ page }) => {
    await page.goto(`${BASE}/canvas`, { waitUntil: "networkidle" });

    // Templates section heading
    await expect(page.getByText("Quick Start Templates")).toBeVisible();

    // Should show known templates
    await expect(page.getByText("SaaS Starter Pack")).toBeVisible();
    await expect(page.getByText("AI Cost Analyzer")).toBeVisible();
    await expect(page.getByText("Blank Canvas")).toBeVisible();
  });

  test("applying a template adds all calculators to workspace", async ({ page }) => {
    await page.goto(`${BASE}/canvas`, { waitUntil: "networkidle" });
    await clearCanvasStorage(page);
    await page.reload({ waitUntil: "networkidle" });

    // Click "SaaS Starter Pack" template button
    await page.getByRole("button", { name: /SaaS Starter Pack/ }).first().click();

    // Should show 5 calculators
    await expect(page.getByText("5 calculators active")).toBeVisible();

    // Verify specific calculators are present (use exact titles from configs)
    await expect(page.getByText("Monthly Recurring Revenue")).toBeVisible();
    await expect(page.getByText("Churn Rate Calculator").first()).toBeVisible();
    await expect(page.getByText("CAC Calculator").first()).toBeVisible();
  });

  test("applying a template replaces existing calculators", async ({ page }) => {
    await page.goto(`${BASE}/canvas`, { waitUntil: "networkidle" });
    await clearCanvasStorage(page);
    await page.reload({ waitUntil: "networkidle" });

    // Add one calculator first
    await page.locator("aside").getByRole("button", { name: "MRR Calculator", exact: true }).click();
    await expect(page.getByText("1 calculator active")).toBeVisible();

    // Apply a template (should replace instead of adding)
    await page.getByRole("button", { name: /SaaS Starter Pack/ }).first().click();
    await expect(page.getByText("5 calculators active")).toBeVisible();
    await expect(page.getByText("1 calculator active")).not.toBeVisible();
  });

  test("blank canvas template clears the workspace", async ({ page }) => {
    await page.goto(`${BASE}/canvas`, { waitUntil: "networkidle" });
    await clearCanvasStorage(page);
    await page.reload({ waitUntil: "networkidle" });

    // Add a calculator first
    await page.locator("aside").getByRole("button", { name: "MRR Calculator", exact: true }).click();
    await expect(page.getByText("1 calculator active")).toBeVisible();

    // Apply "Blank Canvas" template
    await page.getByRole("button", { name: /Blank Canvas/ }).first().click();
    await expect(page.getByText("Your Workspace is Empty")).toBeVisible();
  });

  test("search filters the calculator catalog", async ({ page }) => {
    await page.goto(`${BASE}/canvas`, { waitUntil: "networkidle" });

    // Type in search
    const searchInput = page.getByPlaceholder("Search calculators...");
    await expect(searchInput).toBeVisible();
    await searchInput.fill("churn");

    // Churn-related calculators should be visible (title or slug contains "churn")
    await expect(page.getByText("Churn Rate Calculator")).toBeVisible();

    // Customer Health Score does NOT contain "churn" in title/slug — expect hidden
    await expect(page.getByText("Customer Health Score Calculator")).not.toBeVisible();

    // MRR should also be hidden (doesn't match "churn")
    await expect(page.getByText("MRR Calculator")).not.toBeVisible();
  });

  test("persistence: workspace survives page reload", async ({ page }) => {
    await page.goto(`${BASE}/canvas`, { waitUntil: "networkidle" });
    await clearCanvasStorage(page);
    await page.reload({ waitUntil: "networkidle" });

    // Add a calculator
    await page.locator("aside").getByRole("button", { name: "MRR Calculator", exact: true }).click();
    await expect(page.getByText("1 calculator active")).toBeVisible();

    // Reload WITHOUT clearing — localStorage should keep the data
    await page.reload({ waitUntil: "networkidle" });

    // Calculator should still be present
    await expect(page.getByText("1 calculator active")).toBeVisible();
    await expect(page.getByText("Monthly Recurring Revenue")).toBeVisible();
  });

  test("master widget shows aggregate metrics when calculators have outputs", async ({ page }) => {
    await page.goto(`${BASE}/canvas`, { waitUntil: "networkidle" });
    await clearCanvasStorage(page);
    await page.reload({ waitUntil: "networkidle" });

    // Apply Unit Economics template which has LTV/CAC/payback/etc
    await page.getByRole("button", { name: /Unit Economics Deep Dive/ }).first().click();

    // The master widget should display aggregate metrics
    await expect(page.getByText("Executive Summary")).toBeVisible();
    await expect(page.getByText("6 calculators active")).toBeVisible();
  });

  test("catalog shows 'Added' badge for calculators already in workspace", async ({ page }) => {
    await page.goto(`${BASE}/canvas`, { waitUntil: "networkidle" });
    await clearCanvasStorage(page);
    await page.reload({ waitUntil: "networkidle" });

    // Add a calculator
    await page.locator("aside").getByRole("button", { name: "MRR Calculator", exact: true }).click();

    // The MRR button in the catalog should now show "Added"
    await expect(page.locator("aside").locator("text=Added")).toBeVisible();
  });

  test("adding multiple calculators increments count correctly", async ({ page }) => {
    await page.goto(`${BASE}/canvas`, { waitUntil: "networkidle" });
    await clearCanvasStorage(page);
    await page.reload({ waitUntil: "networkidle" });

    await page.locator("aside").getByRole("button", { name: "MRR Calculator", exact: true }).click();
    await expect(page.getByText("1 calculator active")).toBeVisible();

    await page.locator("aside").getByRole("button", { name: "Churn Rate Calculator", exact: true }).click();
    await expect(page.getByText("2 calculators active")).toBeVisible();

    await page.locator("aside").getByRole("button", { name: "LTV Calculator", exact: true }).click();
    await expect(page.getByText("3 calculators active")).toBeVisible();

    // Remove one
    await page.locator('button[aria-label*="Remove"]').first().click();
    await expect(page.getByText("2 calculators active")).toBeVisible();
  });

  test("workspace persists after applying template then reloading", async ({ page }) => {
    await page.goto(`${BASE}/canvas`, { waitUntil: "networkidle" });
    await clearCanvasStorage(page);
    await page.reload({ waitUntil: "networkidle" });

    // Apply a template
    await page.getByRole("button", { name: /SaaS Starter Pack/ }).first().click();
    await expect(page.getByText("5 calculators active")).toBeVisible();

    // Reload
    await page.reload({ waitUntil: "networkidle" });

    // Template should still be applied
    await expect(page.getByText("5 calculators active")).toBeVisible();
    await expect(page.getByText("Monthly Recurring Revenue")).toBeVisible();
  });
});
