import { test, expect, type Page } from "@playwright/test";

const BASE = "http://localhost:3000";

async function clearCanvasStorage(page: Page) {
  await page.evaluate(() => localStorage.removeItem("canvas-workspace-calculators"));
}

test.describe("Canvas — Add Template Calculators (+ button)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE}/canvas`, { waitUntil: "networkidle" });
    await clearCanvasStorage(page);
    await page.reload({ waitUntil: "networkidle" });
  });

  test("+ button appears on template buttons (except Blank Canvas)", async ({ page }) => {
    // Multiple templates have exactly 5 calculators — verify at least one exists
    const plusButtons = page.locator("[title^='Add ']");
    await expect(plusButtons.first()).toBeAttached();

    // Blank Canvas should NOT have a + button (0 calculators)
    const blankCanvasBtn = page.locator("aside").getByRole("button", { name: /Blank Canvas/ }).first();
    await expect(blankCanvasBtn).toBeVisible();
    const blankPlus = blankCanvasBtn.locator("[title*='Add']");
    await expect(blankPlus).toHaveCount(0);
  });

  test("clicking + on SaaS Starter Pack adds its 5 calculators additively", async ({ page }) => {
    // First add one calculator manually
    await page.locator("aside").getByRole("button", { name: "MRR Calculator", exact: true }).click();
    await expect(page.getByText("1 calculator active")).toBeVisible();

    // SaaS Starter Pack slugs: mrr, churn, ltv, cac, gross-margin
    // mrr already active, so 4 new → 5 total
    const saasTemplate = page.locator("aside").getByRole("button", { name: /SaaS Starter Pack/ }).first();
    await saasTemplate.hover();
    const saasPlus = saasTemplate.locator("[title='Add 5 calculators to workspace']");
    await saasPlus.click();

    await expect(page.getByText("5 calculators active")).toBeVisible();
    await expect(page.getByText("Executive Summary")).toBeVisible();
  });

  test("clicking + does NOT replace existing calculators (unlike clicking the template)", async ({ page }) => {
    // Add two calculators manually: mrr + cac
    await page.locator("aside").getByRole("button", { name: "MRR Calculator", exact: true }).click();
    await expect(page.getByText("1 calculator active")).toBeVisible();
    await page.locator("aside").getByRole("button", { name: "CAC Calculator", exact: true }).click();
    await expect(page.getByText("2 calculators active")).toBeVisible();

    // Unit Economics slugs: ltv, cac, payback, gross-margin, contribution-margin, cac-ltv-ratio
    // cac already active, so 5 new → 7 total
    const unitEconTemplate = page.locator("aside").getByRole("button", { name: /Unit Economics Deep Dive/ }).first();
    await unitEconTemplate.hover();
    const unitEconPlus = unitEconTemplate.locator("[title='Add 6 calculators to workspace']");
    await unitEconPlus.click();

    await expect(page.getByText("7 calculators active")).toBeVisible();

    // Now verify that clicking the template itself (not the +) still replaces
    await page.locator("aside").getByRole("button", { name: /SaaS Starter Pack/ }).first().click();
    await expect(page.getByText("5 calculators active")).toBeVisible();
    await expect(page.getByText("7 calculators active")).not.toBeVisible();
  });

  test("+ button adds calculators and they render with inputs and outputs", async ({ page }) => {
    // Click + on SaaS Starter Pack from empty workspace → should get all 5
    const saasTemplate = page.locator("aside").getByRole("button", { name: /SaaS Starter Pack/ }).first();
    await saasTemplate.hover();
    const saasPlus = saasTemplate.locator("[title='Add 5 calculators to workspace']");
    await saasPlus.click();

    await expect(page.getByText("5 calculators active")).toBeVisible();
    await expect(page.getByText("Monthly Recurring Revenue")).toBeVisible();
    await expect(page.getByText("Churn Rate Calculator").first()).toBeVisible();
    await expect(page.getByText("CAC Calculator").first()).toBeVisible();
  });

  test("Blank Canvas template has no + button", async ({ page }) => {
    const blankCanvasBtn = page.locator("aside").getByRole("button", { name: /Blank Canvas/ }).first();
    await expect(blankCanvasBtn).toBeVisible();

    // Hover on it — verify no "Add..." title elements inside
    await blankCanvasBtn.hover();
    const blankPlus = blankCanvasBtn.locator("[title^='Add ']");
    await expect(blankPlus).toHaveCount(0);
  });

  test("adding same calculators via + does not create duplicates", async ({ page }) => {
    await expect(page.getByText("Your Workspace is Empty")).toBeVisible();

    // Click + on SaaS Starter Pack first time
    const saasTemplate = page.locator("aside").getByRole("button", { name: /SaaS Starter Pack/ }).first();
    await saasTemplate.hover();
    const saasPlus = saasTemplate.locator("[title='Add 5 calculators to workspace']");
    await saasPlus.click();
    await expect(page.getByText("5 calculators active")).toBeVisible();

    // Click + again — should not duplicate
    await saasTemplate.hover();
    await saasPlus.click();
    await expect(page.getByText("5 calculators active")).toBeVisible();
  });
});
