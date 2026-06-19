import { test, expect } from "@playwright/test";

const BASE = "http://localhost:3000";

test.describe("Canvas Page — HTML5 Drag and Drop", () => {
  test("loads the canvas page", async ({ page }) => {
    const resp = await page.goto(`${BASE}/canvas`, { waitUntil: "load" });
    await expect(page).toHaveURL(/\/canvas/);
    expect(resp?.status()).toBe(200);
  });

  test("shows empty workspace state", async ({ page }) => {
    await page.goto(`${BASE}/canvas`, { waitUntil: "networkidle" });
    await expect(page.getByText("Your Workspace is Empty")).toBeVisible();
    await expect(page.getByText("Drag calculators from the catalog")).toBeVisible();
  });

  test("shows calculator catalog sidebar", async ({ page }) => {
    await page.goto(`${BASE}/canvas`, { waitUntil: "networkidle" });
    await expect(page.getByText("Calculator Catalog")).toBeVisible();
    // Should show category groups (at least revenue)
    await expect(page.getByText("revenue", { exact: false })).toBeVisible();
  });

  test("search filters catalog", async ({ page }) => {
    await page.goto(`${BASE}/canvas`, { waitUntil: "networkidle" });
    const searchInput = page.locator("input[placeholder='Search calculators...']");
    await expect(searchInput).toBeVisible();
    await searchInput.fill("mrr");
    // MRR calculator should be visible
    await expect(page.getByText("MRR Calculator")).toBeVisible();
  });

  test("clicking a calculator adds it to workspace", async ({ page }) => {
    await page.goto(`${BASE}/canvas`, { waitUntil: "networkidle" });
    // Click on MRR Calculator in catalog
    const mrrBtn = page.locator("button:has-text('MRR Calculator')").first();
    await mrrBtn.click();
    // Should now show the widget in workspace
    await expect(page.getByText("MRR Calculator").first()).toBeVisible();
    // Should show calculator count
    await expect(page.getByText("1 calculator active")).toBeVisible();
  });

  test("adding calculator shows inputs and outputs", async ({ page }) => {
    await page.goto(`${BASE}/canvas`, { waitUntil: "networkidle" });
    await page.locator("button:has-text('MRR Calculator')").first().click();
    // Should see input sliders
    await expect(page.getByText("Customers")).toBeVisible();
    // Should see results
    await expect(page.getByText("Results")).toBeVisible();
  });

  test("workspace persists calculators across reload", async ({ page }) => {
    await page.goto(`${BASE}/canvas`, { waitUntil: "networkidle" });
    await page.locator("button:has-text('MRR Calculator')").first().click();
    await expect(page.getByText("1 calculator active")).toBeVisible();
    // Reload
    await page.reload({ waitUntil: "networkidle" });
    // MRR should still be there
    await expect(page.getByText("1 calculator active")).toBeVisible();
    await expect(page.getByText("Customers")).toBeVisible();
  });

  test("remove button removes calculator from workspace", async ({ page }) => {
    await page.goto(`${BASE}/canvas`, { waitUntil: "networkidle" });
    await page.locator("button:has-text('MRR Calculator')").first().click();
    await expect(page.getByText("1 calculator active")).toBeVisible();
    // Click remove (X) button
    const removeBtn = page.locator("button[aria-label*='Remove']").first();
    await removeBtn.click();
    // Should be back to empty
    await expect(page.getByText("Your Workspace is Empty")).toBeVisible();
  });

  test("clear all removes all calculators", async ({ page }) => {
    await page.goto(`${BASE}/canvas`, { waitUntil: "networkidle" });
    await page.locator("button:has-text('MRR Calculator')").first().click();
    await page.locator("button:has-text('CAC Calculator')").first().click();
    await expect(page.getByText("2 calculators active")).toBeVisible();
    // Clear all
    await page.getByText("Clear all").click();
    await expect(page.getByText("Your Workspace is Empty")).toBeVisible();
  });

  test("widget has link to full calculator page", async ({ page }) => {
    await page.goto(`${BASE}/canvas`, { waitUntil: "networkidle" });
    await page.locator("button:has-text('MRR Calculator')").first().click();
    // Should have "Open Full Calculator" link
    const fullPageLink = page.getByText("Open Full Calculator");
    await expect(fullPageLink).toBeVisible();
    await expect(fullPageLink).toHaveAttribute("href", "/revenue/mrr-calculator");
  });

  test("nav Canvas link navigates to canvas page", async ({ page }) => {
    await page.goto(`${BASE}`, { waitUntil: "networkidle" });
    await expect(page.getByTestId("canvas-nav-link")).toBeVisible();
    await page.getByTestId("canvas-nav-link").click();
    await expect(page).toHaveURL(/\/canvas/);
  });

  test("catalog shows 'Added' badge for calculators in workspace", async ({ page }) => {
    await page.goto(`${BASE}/canvas`, { waitUntil: "networkidle" });
    await page.locator("button:has-text('MRR Calculator')").first().click();
    // The catalog item should now show "Added" badge
    await expect(page.getByText("Added").first()).toBeVisible();
  });
});
