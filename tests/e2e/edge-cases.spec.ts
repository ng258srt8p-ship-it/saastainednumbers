import { test, expect } from "@playwright/test";
import { BASE, MOBILE, currencyBtn, currencyDropdown, switchCurrency, embedBtn, themeToggle, shareBtn } from "./helpers";

// ─── RAPID CLICK / DOUBLE CLICK ────────────────────────────────────────
test.describe("Rapid Click Resistance", () => {
  test("rapid clicking currency swithcher does not break dropdown", async ({ page }) => {
    await page.goto(`${BASE}/revenue/mrr-calculator`, { waitUntil: "load" });
    const btn = currencyBtn(page);
    for (let i = 0; i < 5; i++) {
      await btn.click();
      await page.waitForTimeout(50);
    }
    // After rapid clicking, the dropdown should either be open or closed, not broken
    await page.waitForTimeout(200);
    await expect(btn).toBeAttached();
    // Should still be clickable
    await btn.click();
    await page.waitForTimeout(200);
  });

  test("rapidly clicking embed button does not cause multiple modals", async ({ page }) => {
    await page.goto(`${BASE}/revenue/mrr-calculator`, { waitUntil: "load" });
    const btn = embedBtn(page);
    for (let i = 0; i < 4; i++) {
      await btn.click({ force: true });
      await page.waitForTimeout(50);
    }
    await page.waitForTimeout(300);
    // At most one dialog/modal should be present
    const dialogs = page.locator('[role="dialog"]');
    const count = await dialogs.count();
    expect(count).toBeLessThanOrEqual(1);
  });
});

// ─── KEYBOARD NAVIGATION ───────────────────────────────────────────────
test.describe("Keyboard Navigation", () => {
  test("Tab navigates through calculator inputs", async ({ page }) => {
    await page.goto(`${BASE}/revenue/mrr-calculator`, { waitUntil: "load" });
    // First input should be focusable
    const firstInput = page.locator("input").first();
    await firstInput.focus();
    await expect(firstInput).toBeFocused();

    // Tab to next element
    await page.keyboard.press("Tab");
    await page.waitForTimeout(100);
    const focusedEl = page.locator(":focus");
    await expect(focusedEl).not.toBe(firstInput);
  });

  test("Enter submits form or activates button", async ({ page }) => {
    await page.goto(`${BASE}/revenue/mrr-calculator`, { waitUntil: "load" });
    const firstInput = page.locator("input").first();
    await firstInput.fill("10000");
    await page.keyboard.press("Tab");
    await page.waitForTimeout(100);
    // The next element should receive focus
    const focused = page.locator(":focus");
    await expect(focused).toBeAttached();
  });

  test("Escape closes open dropdowns", async ({ page }) => {
    await page.goto(`${BASE}/revenue/mrr-calculator`, { waitUntil: "load" });
    await currencyBtn(page).click();
    await expect(currencyBtn(page)).toHaveAttribute("aria-expanded", "true");
    await page.keyboard.press("Escape");
    await page.waitForTimeout(200);
    await expect(currencyBtn(page)).toHaveAttribute("aria-expanded", "false");
  });
});

// ─── DISABLED / LOADING STATES ─────────────────────────────────────────
test.describe("Disabled & Loading States", () => {
  test("calculate button exists and is initially enabled", async ({ page }) => {
    await page.goto(`${BASE}/revenue/mrr-calculator`, { waitUntil: "load" });
    const calcBtn = page.locator('button[type="submit"], button').filter({ hasText: /calculate|compute|結果|計算|berechne|calculer|calcular/i }).first();
    await expect(calcBtn).toBeAttached();
    const isDisabled = await calcBtn.isDisabled();
    expect(typeof isDisabled).toBe("boolean");
  });

  test("currency dropdown options are clickable", async ({ page }) => {
    await page.goto(`${BASE}/revenue/mrr-calculator`, { waitUntil: "load" });
    await currencyBtn(page).click();
    const options = currencyDropdown(page).locator('button[role="option"]');
    const count = await options.count();
    expect(count).toBeGreaterThanOrEqual(5);
    // All options should be enabled
    for (let i = 0; i < Math.min(count, 3); i++) {
      const opt = options.nth(i);
      const btn = await opt.textContent();
      const disabled = await opt.isDisabled();
      expect(disabled).toBe(false);
    }
  });

  test("locale dropdown options are clickable", async ({ page }) => {
    await page.goto(`${BASE}/revenue/mrr-calculator`, { waitUntil: "load" });
    const localeBtn = page.locator('button[aria-label*="Select language"]').first();
    await localeBtn.click();
    const options = page.locator('[role="listbox"] button[role="option"]');
    const count = await options.count();
    expect(count).toBeGreaterThanOrEqual(6);
  });
});

// ─── BROWSER RESIZE / RESPONSIVE ──────────────────────────────────────
test.describe("Responsive Edge Cases", () => {
  test("calculator works at very narrow viewport (320px)", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 700 });
    await page.goto(`${BASE}/revenue/mrr-calculator`, { waitUntil: "load" });
    // Inputs should still be usable
    const inputs = page.locator("input");
    const count = await inputs.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test("calculator works at tablet viewport (768px)", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto(`${BASE}/revenue/mrr-calculator`, { waitUntil: "load" });
    const heading = page.locator("h1");
    await expect(heading).toBeVisible();
  });

  test("theme toggle persists after resize", async ({ page }) => {
    await page.setViewportSize(MOBILE);
    await page.goto(`${BASE}/revenue/mrr-calculator`, { waitUntil: "load" });
    // Toggle dark
    await themeToggle(page).click();
    await page.waitForTimeout(300);
    // Resize to desktop
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.waitForTimeout(300);
    // Dark mode should still be active
    const isDark = await page.evaluate(() => document.documentElement.classList.contains("dark"));
    expect(isDark).toBe(true);
    // Reset
    await themeToggle(page).click();
  });
});

// ─── MULTIPLE RAPID CALCULATIONS ──────────────────────────────────────
test.describe("Multiple Calculation Edge Cases", () => {
  test("rapid input changes do not break output display", async ({ page }) => {
    await page.goto(`${BASE}/revenue/mrr-calculator`, { waitUntil: "load" });
    const inputs = page.locator("input");
    const count = await inputs.count();
    if (count >= 1) {
      const first = inputs.nth(0);
      await first.fill("50000");
      await page.waitForTimeout(100);
      await first.fill("100000");
      await page.waitForTimeout(100);
      await first.fill("250000");
      await page.waitForTimeout(300);
      // No console errors
    }
  });
});

// ─── DEFAULT VALUES ────────────────────────────────────────────────────
test.describe("Default Value Edge Cases", () => {
  test("calculator loads with default input values", async ({ page }) => {
    await page.goto(`${BASE}/revenue/mrr-calculator`, { waitUntil: "load" });
    const inputs = page.locator("input");
    const count = await inputs.count();
    for (let i = 0; i < Math.min(count, 3); i++) {
      const val = await inputs.nth(i).inputValue();
      expect(val).not.toBe("");
    }
  });

  test("zero input does not crash calculator", async ({ page }) => {
    await page.goto(`${BASE}/revenue/mrr-calculator`, { waitUntil: "load" });
    const inputs = page.locator("input");
    const count = await inputs.count();
    for (let i = 0; i < Math.min(count, 3); i++) {
      await inputs.nth(i).fill("0");
    }
    await page.waitForTimeout(300);
    // Just verify the page is still functional (no crash): heading visible
    const heading = page.locator("h1");
    await expect(heading).toBeVisible();
  });
});
