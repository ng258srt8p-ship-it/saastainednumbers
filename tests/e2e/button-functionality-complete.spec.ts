import { test, expect } from "@playwright/test";
import { BASE, MOBILE, themeToggle } from "./helpers";

test.describe("Cross-page button functionality", () => {
  test("skip-to-content link moves the URL to main content", async ({ page }) => {
    await page.goto(BASE, { waitUntil: "load" });
    await page.keyboard.press("Tab");
    const skip = page.getByRole("link", { name: /skip to content/i });
    await expect(skip).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/#main-content$/);
  });

  test("theme button toggles dark mode and updates its accessible label", async ({ page }) => {
    await page.addInitScript(() => localStorage.removeItem("theme"));
    await page.goto(BASE, { waitUntil: "load" });

    const button = themeToggle(page);
    await expect(button).toBeVisible();
    await button.click();
    await expect(page.locator("html")).toHaveClass(/dark/);
    await expect(button).toHaveAttribute("aria-label", "Switch to light mode");
  });

  test("mobile hamburger button opens and closes the navigation menu", async ({ page }) => {
    await page.setViewportSize(MOBILE);
    await page.goto(BASE, { waitUntil: "load" });

    const button = page.locator('button[aria-label="Open navigation menu"], button[aria-label="Close navigation menu"]');
    await expect(button).toHaveAttribute("aria-expanded", "false");
    await button.click();
    await expect(button).toHaveAttribute("aria-expanded", "true");
    await button.click();
    await expect(button).toHaveAttribute("aria-expanded", "false");
  });
});

test.describe("Calculator action buttons", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE}/revenue/mrr-calculator`, { waitUntil: "load" });
  });

  test("reset button restores the first input to its original value", async ({ page }) => {
    const firstInput = page.locator('input[type="number"]').first();
    const original = await firstInput.inputValue();

    await firstInput.fill("999999");
    await expect(firstInput).toHaveValue("999999");
    await page.getByRole("button", { name: /reset all values/i }).click();
    await expect(firstInput).toHaveValue(original);
  });

  test("compare button enters compare mode and back button exits it", async ({ page }) => {
    await page.getByRole("button", { name: /add scenario b to compare|compare scenarios/i }).first().click();
    await expect(page.getByRole("heading", { name: /Scenario A/i }).first()).toBeVisible();
    await expect(page.getByText(/Scenario B/i).first()).toBeVisible();

    await page.getByRole("button", { name: /back to single view/i }).click();
    await expect(page.getByRole("heading", { name: /Scenario A/i })).toHaveCount(0);
  });

  test("stage selector buttons activate the chosen stage", async ({ page }) => {
    const growth = page.getByRole("button", { name: "Growth" });
    await growth.click();
    await expect(growth).toHaveClass(/bg-brand-600/);

    const seed = page.getByRole("button", { name: "Seed" });
    await seed.click();
    await expect(seed).toHaveClass(/bg-brand-600/);
  });
});

test.describe("Search and navigation button-style links", () => {
  test("calculator search result navigates when selected", async ({ page }) => {
    await page.goto(`${BASE}/calculators`, { waitUntil: "load" });
    await page.locator('input[aria-label="Search calculators"]').fill("MRR");
    await page.getByRole("option", { name: /MRR Calculator/i }).first().click();
    await expect(page).toHaveURL(/\/revenue\/mrr-calculator\/?$/);
  });

  test("pricing CTA navigates to calculators", async ({ page }) => {
    await page.goto(`${BASE}/pricing`, { waitUntil: "load" });
    await page.locator('a[href="/calculators/"]').filter({ hasText: /browse/i }).first().click();
    await expect(page).toHaveURL(/\/calculators\/?$/);
  });

  test("404 page buttons navigate to home and calculators", async ({ page }) => {
    await page.goto(`${BASE}/path-that-should-not-exist`, { waitUntil: "load" });
    await page.getByRole("link", { name: /go home|home/i }).first().click();
    await expect(page).toHaveURL(`${BASE}/`);

    await page.goto(`${BASE}/path-that-should-not-exist`, { waitUntil: "load" });
    await page.getByRole("link", { name: /calculators/i }).first().click();
    await expect(page).toHaveURL(/\/calculators\/?$/);
  });

  test("footer privacy and terms links are reachable", async ({ page }) => {
    await page.goto(BASE, { waitUntil: "load" });
    await page.locator("footer").getByRole("link", { name: /privacy/i }).first().click();
    await expect(page).toHaveURL(/\/privacy\/?$/);

    await page.goto(BASE, { waitUntil: "load" });
    await page.locator("footer").getByRole("link", { name: /terms/i }).first().click();
    await expect(page).toHaveURL(/\/terms\/?$/);
  });
});
