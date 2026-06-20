import { test, expect, type Page } from "@playwright/test";

const BASE = "http://localhost:3000";

async function clearCanvasStorage(page: Page) {
  await page.evaluate(() => localStorage.removeItem("canvas-workspace-calculators"));
}

test.describe("Canvas — Executive Summary", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE}/canvas`, { waitUntil: "networkidle" });
    await clearCanvasStorage(page);
    await page.reload({ waitUntil: "networkidle" });
  });

  test("shows empty state when no calculators", async ({ page }) => {
    await expect(page.getByText("No calculators yet")).toBeVisible();
  });

  test("shows aggregate metrics immediately after adding MRR calculator (on mount)", async ({ page }) => {
    // Add MRR calculator
    await page.locator("aside").getByRole("button", { name: "MRR Calculator", exact: true }).click();
    await expect(page.getByText("1 calculator active")).toBeVisible();

    // The Executive Summary should show the aggregate metrics immediately — no slider adjustment needed
    await expect(page.getByText("Total MRR")).toBeVisible({ timeout: 5000 });
  });

  test("shows correct MRR value after adding calculator with default inputs", async ({ page }) => {
    // Add MRR calculator (defaults: 100 customers, $50 ARPU = $5,000 MRR)
    await page.locator("aside").getByRole("button", { name: "MRR Calculator", exact: true }).click();
    await expect(page.getByText("1 calculator active")).toBeVisible();

    // Should show $5.0K MRR
    await expect(page.getByText("$5.0K")).toBeVisible({ timeout: 5000 });
    await expect(page.getByText("$60.0K")).toBeVisible(); // ARR = $5,000 * 12 = $60,000
  });

  test("updates metrics in real-time when slider changes", async ({ page }) => {
    // Add MRR calculator
    await page.locator("aside").getByRole("button", { name: "MRR Calculator", exact: true }).click();
    await expect(page.getByText("1 calculator active")).toBeVisible();

    // Change the "Customers" slider to 200
    const customerSlider = page.locator('input[type="range"]').first();
    await customerSlider.fill("200");

    // MRR should now be $10.0K (200 customers x $50 ARPU)
    await expect(page.getByText("$10.0K")).toBeVisible({ timeout: 3000 });
  });

  test("total ARR shows for multiple revenue calculators", async ({ page }) => {
    // Add multiple calculators via a template that includes MRR
    await page.getByRole("button", { name: /SaaS Starter Pack/ }).first().click();
    await expect(page.getByText("5 calculators active")).toBeVisible();

    // Total ARR should appear from MRR calculator defaults ($5,000 MRR = $60,000 ARR)
    await expect(page.getByText("$60.0K")).toBeVisible({ timeout: 5000 });
  });

  test("executive summary shows metrics after page reload (persistence)", async ({ page }) => {
    // Add MRR calculator
    await page.locator("aside").getByRole("button", { name: "MRR Calculator", exact: true }).click();
    await expect(page.getByText("1 calculator active")).toBeVisible();
    await expect(page.getByText("$5.0K")).toBeVisible({ timeout: 3000 });

    // Reload — should persist via localStorage
    await page.reload({ waitUntil: "networkidle" });

    // Metrics should show immediately without any interaction
    await expect(page.getByText("$5.0K")).toBeVisible({ timeout: 5000 });
  });
});
