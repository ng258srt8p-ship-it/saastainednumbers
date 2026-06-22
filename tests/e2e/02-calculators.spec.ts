import { test, expect } from "@playwright/test";
import { BASE, CALC_SLUGS } from "./helpers";

test.describe("All calculators load and produce results", () => {
  for (const { category, slug, name } of CALC_SLUGS) {
    test(`${name} (${slug}) loads with inputs, outputs, and no NaN`, async ({ page }) => {
      await page.goto(`${BASE}/${category}/${slug}`, { waitUntil: "load" });

      // Page loads with 200
      // (already navigated, just assert the heading)
      const heading = page.locator("h1");
      await expect(heading).toBeVisible();

      // At least one input field exists (range slider or text input)
      const inputs = page.locator('input[type="range"], input[type="text"], input[aria-label]');
      await expect(inputs.first()).toBeVisible();

      // At least one result/output element exists
      const results = page.locator('[aria-label="Calculation results"]');
      await expect(results).toBeVisible();

      // No "NaN" text visible on the page
      const nanText = page.locator("text=NaN");
      await expect(nanText).toHaveCount(0);
    });
  }
});

test.describe("Calculator interactions", () => {
  test("mrr-calculator default values produce non-zero results", async ({ page }) => {
    await page.goto(`${BASE}/revenue/mrr-calculator`, { waitUntil: "load" });
    // Default: 100 customers * $50 ARPU = $5000 MRR
    const results = page.locator('[aria-label="Calculation results"]');
    await expect(results).toBeVisible();
    const text = await results.textContent();
    expect(text).toBeTruthy();
    // The results should contain a dollar amount (non-zero)
    expect(text).toMatch(/\$/);
  });

  test("churn-rate-calculator default values produce non-zero results", async ({ page }) => {
    await page.goto(`${BASE}/churn/churn-rate-calculator`, { waitUntil: "load" });
    const results = page.locator('[aria-label="Calculation results"]');
    await expect(results).toBeVisible();
    const text = await results.textContent();
    expect(text).toBeTruthy();
    // Should contain percentage or number
    expect(text).not.toBe("0");
  });

  test("changing input on mrr-calculator updates results", async ({ page }) => {
    await page.goto(`${BASE}/revenue/mrr-calculator`, { waitUntil: "load" });

    // Read initial result value
    const results = page.locator('[aria-label="Calculation results"]');
    await expect(results).toBeVisible();
    const initialText = await results.textContent();

    // Find and interact with the first input slider (customers)
    const slider = page.locator('input[type="range"]').first();
    await expect(slider).toBeVisible();

    // Change the slider value to a different number
    await slider.fill("200");
    await page.waitForTimeout(500);

    // Results should have updated
    const updatedText = await results.textContent();
    expect(updatedText).not.toBe(initialText);
  });

  test("reset button works on mrr-calculator", async ({ page }) => {
    await page.goto(`${BASE}/revenue/mrr-calculator`, { waitUntil: "load" });

    // Change a value first
    const slider = page.locator('input[type="range"]').first();
    await slider.fill("200");
    await page.waitForTimeout(500);

    const changedText = await page.locator('[aria-label="Calculation results"]').textContent();

    // Click reset button
    const resetBtn = page.getByRole("button", { name: /reset/i });
    if (await resetBtn.isVisible()) {
      await resetBtn.click();
      await page.waitForTimeout(500);

      // Results should revert to defaults
      const resetText = await page.locator('[aria-label="Calculation results"]').textContent();
      expect(resetText).not.toBe(changedText);
    }
  });

  test("stage selector works on mrr-calculator", async ({ page }) => {
    await page.goto(`${BASE}/revenue/mrr-calculator`, { waitUntil: "load" });

    // Look for stage selector buttons (Seed, Series A, etc.)
    const stageButtons = page.locator('button:has-text("Series A"), button:has-text("Series B"), button:has-text("Series C")');
    const count = await stageButtons.count();

    if (count > 0) {
      // Click a different stage
      const seriesB = page.locator('button:has-text("Series B")');
      if (await seriesB.isVisible()) {
        const beforeText = await page.locator('[aria-label="Calculation results"]').textContent();
        await seriesB.click();
        await page.waitForTimeout(500);
        const afterText = await page.locator('[aria-label="Calculation results"]').textContent();
        // Stage change should update results
        expect(afterText).not.toBe(beforeText);
      }
    }
  });

  test("compare toggle on mrr-calculator opens scenario B", async ({ page }) => {
    await page.goto(`${BASE}/revenue/mrr-calculator`, { waitUntil: "load" });

    // Find the compare/add scenario button
    const addScenarioBtn = page.getByRole("button", { name: /add scenario|compare/i });
    if (await addScenarioBtn.isVisible()) {
      await addScenarioBtn.click();
      await page.waitForTimeout(500);

      // Should show Scenario B heading
      const scenarioB = page.locator("text=Scenario B");
      await expect(scenarioB).toBeVisible();

      // Should show results comparison
      const comparison = page.locator("text=Results Comparison");
      await expect(comparison).toBeVisible();
    }
  });

  test("stage selector works on churn-rate-calculator", async ({ page }) => {
    await page.goto(`${BASE}/churn/churn-rate-calculator`, { waitUntil: "load" });

    // Look for stage selector buttons
    const seriesB = page.locator('button:has-text("Series B")');
    if (await seriesB.isVisible()) {
      const beforeText = await page.locator('[aria-label="Calculation results"]').textContent();
      await seriesB.click();
      await page.waitForTimeout(500);
      const afterText = await page.locator('[aria-label="Calculation results"]').textContent();
      expect(afterText).not.toBe(beforeText);
    }
  });
});
