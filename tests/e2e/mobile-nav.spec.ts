import { test, expect, type Page } from "@playwright/test";

const BASE = "http://localhost:3000";
const MOBILE = { width: 390, height: 844 };

function hamburger(page: Page) {
  return page.locator('button[aria-label="Open navigation menu"], button[aria-label="Close navigation menu"]');
}

function dialog(page: Page) {
  return page.locator('div[role="dialog"][aria-label="Mobile navigation"]');
}

test.describe("Mobile Navigation", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(MOBILE);
  });

  test("hamburger button is visible on mobile viewport", async ({ page }) => {
    await page.goto(BASE);
    await expect(hamburger(page)).toBeVisible();
  });

  test("desktop navigation links are hidden on mobile", async ({ page }) => {
    await page.goto(BASE);
    const desktopLink = page.locator('a[href="/canvas"]').first();
    await expect(desktopLink).not.toBeVisible();
  });

  test("clicking hamburger opens the slide-out panel", async ({ page }) => {
    await page.goto(BASE);
    await hamburger(page).click();
    await expect(dialog(page)).toHaveAttribute("aria-hidden", "false");
  });

  test("menu links are visible when panel is open", async ({ page }) => {
    await page.goto(BASE);
    await hamburger(page).click();
    await expect(dialog(page).locator("text=Calculators")).toBeVisible();
    await expect(dialog(page).locator("text=Canvas")).toBeVisible();
    await expect(dialog(page).locator("text=Pricing")).toBeVisible();
    await expect(dialog(page).locator("text=Blog")).toBeVisible();
  });

  test("aria-expanded reflects open state", async ({ page }) => {
    await page.goto(BASE);
    await expect(hamburger(page)).toHaveAttribute("aria-expanded", "false");
    await hamburger(page).click();
    await expect(hamburger(page)).toHaveAttribute("aria-expanded", "true");
  });

  test("clicking a nav link navigates and closes the menu", async ({ page }) => {
    await page.goto(BASE);
    await hamburger(page).click();
    await dialog(page).locator("text=Calculators").click();
    await expect(page).toHaveURL(/\/calculators/);
    await expect(dialog(page)).toHaveAttribute("aria-hidden", "true");
  });

  test("Escape key closes the menu", async ({ page }) => {
    await page.goto(BASE);
    await hamburger(page).click();
    await expect(dialog(page)).toHaveAttribute("aria-hidden", "false");
    await page.keyboard.press("Escape");
    await expect(dialog(page)).toHaveAttribute("aria-hidden", "true");
  });

  test("hamburger aria-label toggles between Open and Close", async ({ page }) => {
    await page.goto(BASE);
    await expect(hamburger(page)).toHaveAttribute("aria-label", "Open navigation menu");
    await hamburger(page).click();
    await expect(hamburger(page)).toHaveAttribute("aria-label", "Close navigation menu");
    await hamburger(page).click();
    await expect(hamburger(page)).toHaveAttribute("aria-label", "Open navigation menu");
  });

  test("desktop viewport shows nav links and hides hamburger", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto(BASE, { waitUntil: "networkidle" });
    await expect(hamburger(page)).not.toBeVisible();
    await expect(page.getByTestId("canvas-nav-link")).toBeVisible();
  });
});
