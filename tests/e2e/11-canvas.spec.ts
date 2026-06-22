import { test, expect } from "@playwright/test";
import { BASE, MOBILE, clearCanvasStorage, addCalculatorToCanvas } from "./helpers";

test.describe("Canvas workspace", () => {
  test.beforeEach(async ({ page }) => {
    await clearCanvasStorage(page);
  });

  test("canvas page loads with 200 status", async ({ page }) => {
    const resp = await page.goto(`${BASE}/canvas`, { waitUntil: "load" });
    expect(resp?.status()).toBe(200);
  });

  test("canvas page has a heading or title", async ({ page }) => {
    await page.goto(`${BASE}/canvas`, { waitUntil: "load" });
    const heading = page.getByText("Calculator Catalog").or(page.getByText("Workspace"));
    await expect(heading.first()).toBeVisible();
  });

  test("calculator catalog sidebar is visible", async ({ page }) => {
    await page.goto(`${BASE}/canvas`, { waitUntil: "load" });
    const sidebar = page.getByText("Calculator Catalog");
    await expect(sidebar).toBeVisible();
  });

  test("search input in sidebar filters calculators", async ({ page }) => {
    await page.goto(`${BASE}/canvas`, { waitUntil: "load" });
    const searchInput = page.locator('input[placeholder="Search calculators..."]');
    await expect(searchInput).toBeVisible();
    await searchInput.fill("MRR");
    await page.waitForTimeout(300);
    // After filtering, MRR-related calculators should be visible
    const mrrResult = page.getByRole("button", { name: /MRR/i }).first();
    await expect(mrrResult).toBeVisible();
  });

  test("search input shows no-match state for gibberish", async ({ page }) => {
    await page.goto(`${BASE}/canvas`, { waitUntil: "load" });
    const searchInput = page.locator('input[placeholder="Search calculators..."]');
    await searchInput.fill("xyzzy12345");
    await page.waitForTimeout(300);
    const noMatch = page.getByText("No calculators match your search");
    await expect(noMatch).toBeVisible();
  });

  test("clicking a calculator in sidebar adds it to workspace", async ({ page }) => {
    await page.goto(`${BASE}/canvas`, { waitUntil: "load" });
    await addCalculatorToCanvas(page, "MRR Calculator");
    // Workspace should now show a calculator widget
    const widgetTitle = page.getByText("MRR Calculator").last();
    await expect(widgetTitle).toBeVisible();
  });

  test("added calculator shows inputs and results section", async ({ page }) => {
    await page.goto(`${BASE}/canvas`, { waitUntil: "load" });
    await addCalculatorToCanvas(page, "MRR Calculator");
    // The CalculatorWidget should have input sliders and a Results section
    const resultsLabel = page.getByText("Results").first();
    await expect(resultsLabel).toBeVisible();
  });

  test("template section is visible with expected templates", async ({ page }) => {
    await page.goto(`${BASE}/canvas`, { waitUntil: "load" });
    const templatesHeading = page.getByText("Quick Start Templates");
    await expect(templatesHeading).toBeVisible();
    // Check for specific templates
    await expect(page.getByText("SaaS Starter Pack")).toBeVisible();
    await expect(page.getByText("Blank Canvas")).toBeVisible();
    await expect(page.getByText("AI Cost Analyzer")).toBeVisible();
  });

  test("apply SaaS Starter Pack template adds multiple calculators", async ({ page }) => {
    await page.goto(`${BASE}/canvas`, { waitUntil: "load" });
    const saasStarter = page.getByRole("button", { name: /SaaS Starter Pack/i }).first();
    await saasStarter.click();
    await page.waitForTimeout(500);
    // The workspace should now show multiple calculators
    const activeText = page.getByText(/\d+ calculator\(s\) active/);
    await expect(activeText).toBeVisible();
  });

  test("apply Blank Canvas template clears workspace", async ({ page }) => {
    await page.goto(`${BASE}/canvas`, { waitUntil: "load" });
    // First add a calculator
    await addCalculatorToCanvas(page, "MRR Calculator");
    await page.waitForTimeout(300);
    // Now apply Blank Canvas template
    const blankCanvas = page.getByRole("button", { name: /Blank Canvas/i }).first();
    await blankCanvas.click();
    await page.waitForTimeout(500);
    // Workspace should be empty again
    const emptyState = page.getByText("Your Workspace is Empty");
    await expect(emptyState).toBeVisible();
  });

  test("remove a calculator from workspace", async ({ page }) => {
    await page.goto(`${BASE}/canvas`, { waitUntil: "load" });
    await addCalculatorToCanvas(page, "MRR Calculator");
    await page.waitForTimeout(300);
    // Click the remove button on the widget
    const removeBtn = page.getByRole("button", { name: /Remove MRR/i }).first();
    await expect(removeBtn).toBeVisible();
    await removeBtn.click();
    await page.waitForTimeout(300);
    // Workspace should be empty
    const emptyState = page.getByText("Your Workspace is Empty");
    await expect(emptyState).toBeVisible();
  });

  test("Clear all removes all calculators", async ({ page }) => {
    await page.goto(`${BASE}/canvas`, { waitUntil: "load" });
    // Add multiple calculators
    await addCalculatorToCanvas(page, "MRR Calculator");
    await page.waitForTimeout(300);
    await addCalculatorToCanvas(page, "Churn Rate Calculator");
    await page.waitForTimeout(300);
    // Click Clear all
    const clearAll = page.getByRole("button", { name: /Clear all/i });
    await expect(clearAll).toBeVisible();
    await clearAll.click();
    await page.waitForTimeout(300);
    const emptyState = page.getByText("Your Workspace is Empty");
    await expect(emptyState).toBeVisible();
  });

  test("aggregate metrics (Executive Summary) show when calculators are added", async ({ page }) => {
    await page.goto(`${BASE}/canvas`, { waitUntil: "load" });
    // Before adding, Executive Summary shows empty state
    const noCerts = page.getByText("No calculators yet");
    await expect(noCerts).toBeVisible();
    // Add a calculator
    await addCalculatorToCanvas(page, "MRR Calculator");
    await page.waitForTimeout(500);
    // Executive Summary should now show
    const execSummary = page.getByText("Executive Summary");
    await expect(execSummary).toBeVisible();
  });

  test("canvas persists after reload via localStorage", async ({ page }) => {
    await page.goto(`${BASE}/canvas`, { waitUntil: "load" });
    await addCalculatorToCanvas(page, "MRR Calculator");
    await page.waitForTimeout(500);
    // Reload the page
    await page.reload({ waitUntil: "load" });
    await page.waitForTimeout(500);
    // MRR Calculator should still be in workspace
    const widgetTitle = page.getByText("MRR Calculator").last();
    await expect(widgetTitle).toBeVisible();
  });

  test("nav link to canvas is visible", async ({ page }) => {
    await page.goto(`${BASE}`, { waitUntil: "load" });
    const canvasLink = page.locator('[data-testid="canvas-nav-link"]').or(
      page.getByRole("link", { name: /canvas/i })
    );
    await expect(canvasLink.first()).toBeVisible();
  });

  test("mobile: canvas renders at 390px viewport", async ({ page }) => {
    await page.setViewportSize(MOBILE);
    await page.goto(`${BASE}/canvas`, { waitUntil: "load" });
    // Page should still load and be functional
    const catalog = page.getByText("Calculator Catalog");
    await expect(catalog).toBeVisible();
  });
});
