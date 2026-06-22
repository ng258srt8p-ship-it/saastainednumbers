import { test, expect } from "@playwright/test";
import {
  BASE,
  MOBILE,
  hamburgerBtn,
  mobileMenu,
} from "./helpers";

test.describe("Desktop navigation", () => {
  test("logo links to homepage", async ({ page }) => {
    await page.goto(BASE, { waitUntil: "load" });
    const logo = page.locator("nav a").filter({ hasText: "SaaStainedNumbers" });
    await expect(logo).toBeVisible();
    // Click logo to navigate to home
    await logo.click();
    await page.waitForLoadState("load");
    expect(page.url()).toBe(`${BASE}/`);
  });

  test("Calculators, Canvas, Pricing, Blog links are visible", async ({ page }) => {
    await page.goto(BASE, { waitUntil: "load" });
    const nav = page.locator("nav");
    await expect(nav.getByRole("link", { name: /Calculators/i })).toBeVisible();
    await expect(nav.getByRole("link", { name: /Canvas/i })).toBeVisible();
    await expect(nav.getByRole("link", { name: /Pricing/i })).toBeVisible();
    await expect(nav.getByRole("link", { name: /Blog/i })).toBeVisible();
  });

  test("no About Us or Contact Us links in desktop nav", async ({ page }) => {
    await page.goto(BASE, { waitUntil: "load" });
    const nav = page.locator("nav");
    await expect(nav.getByRole("link", { name: /About/i })).toHaveCount(0);
    await expect(nav.getByRole("link", { name: /Contact/i })).toHaveCount(0);
  });
});

test.describe("Breadcrumbs", () => {
  test("calculator page shows breadcrumb with Home and category", async ({ page }) => {
    await page.goto(`${BASE}/revenue/mrr-calculator`, { waitUntil: "load" });

    // The Breadcrumb component renders a nav with aria-label="Breadcrumb"
    const breadcrumbNav = page.locator('nav[aria-label="Breadcrumb"]');
    await expect(breadcrumbNav).toBeVisible();

    // Should contain "Home" link
    const homeLink = breadcrumbNav.getByRole("link", { name: /Home/i });
    await expect(homeLink).toBeVisible();
    await expect(homeLink).toHaveAttribute("href", "/");

    // Should contain the calculator name as non-link (last item)
    const calcName = breadcrumbNav.locator("span").filter({ hasText: /MRR Calculator/i });
    await expect(calcName).toBeVisible();
  });

  test("clicking Home breadcrumb navigates to homepage", async ({ page }) => {
    await page.goto(`${BASE}/revenue/mrr-calculator`, { waitUntil: "load" });

    const breadcrumbNav = page.locator('nav[aria-label="Breadcrumb"]');
    const homeLink = breadcrumbNav.getByRole("link", { name: /Home/i });
    await homeLink.click();
    await page.waitForLoadState("load");
    expect(page.url()).toBe(`${BASE}/`);
  });
});

test.describe("Footer", () => {
  test("footer is visible on homepage", async ({ page }) => {
    await page.goto(BASE, { waitUntil: "load" });
    const footer = page.locator("footer");
    await expect(footer).toBeVisible();
  });

  test("footer has copyright text", async ({ page }) => {
    await page.goto(BASE, { waitUntil: "load" });
    const footer = page.locator("footer");
    // Footer contains a copyright line with the year
    await expect(footer).toContainText(/©|copyright/i);
  });

  test("footer has Legal, Privacy, Terms links", async ({ page }) => {
    await page.goto(BASE, { waitUntil: "load" });
    const footer = page.locator("footer");
    await expect(footer.getByRole("link", { name: /Legal/i })).toBeVisible();
    await expect(footer.getByRole("link", { name: /Privacy/i })).toBeVisible();
    await expect(footer.getByRole("link", { name: /Terms/i })).toBeVisible();
  });

  test("footer has no About or Contact links", async ({ page }) => {
    await page.goto(BASE, { waitUntil: "load" });
    const footer = page.locator("footer");
    await expect(footer.getByRole("link", { name: /About/i })).toHaveCount(0);
    await expect(footer.getByRole("link", { name: /Contact/i })).toHaveCount(0);
  });
});

test.describe("Mobile navigation", () => {
  test("at 390px, hamburger button is visible and desktop nav is hidden", async ({ page }) => {
    await page.setViewportSize(MOBILE);
    await page.goto(BASE, { waitUntil: "load" });

    // Hamburger should be visible
    await expect(hamburgerBtn(page)).toBeVisible();

    // Desktop nav links (inside hidden md:flex) should not be visible
    const desktopNav = page.locator(".hidden.md\\:flex");
    await expect(desktopNav).not.toBeVisible();
  });

  test("tapping hamburger opens menu with all nav links", async ({ page }) => {
    await page.setViewportSize(MOBILE);
    await page.goto(BASE, { waitUntil: "load" });

    await hamburgerBtn(page).click();
    await expect(mobileMenu(page)).toBeVisible();

    // Mobile menu should have all nav links
    const menu = mobileMenu(page);
    await expect(menu.getByRole("link", { name: /Calculators/i })).toBeVisible();
    await expect(menu.getByRole("link", { name: /Canvas/i })).toBeVisible();
    await expect(menu.getByRole("link", { name: /Pricing/i })).toBeVisible();
    await expect(menu.getByRole("link", { name: /Blog/i })).toBeVisible();
  });

  test("tapping a link in mobile nav navigates and closes menu", async ({ page }) => {
    await page.setViewportSize(MOBILE);
    await page.goto(BASE, { waitUntil: "load" });

    await hamburgerBtn(page).click();
    await expect(mobileMenu(page)).toBeVisible();

    // Click the Calculators link
    const calcLink = mobileMenu(page).getByRole("link", { name: /Calculators/i });
    await calcLink.click();
    await page.waitForLoadState("load");

    // Should navigate to /calculators
    expect(page.url()).toContain("/calculators");

    // Menu should close after navigation
    await expect(mobileMenu(page)).not.toBeVisible();
  });

  test("Escape key closes mobile menu", async ({ page }) => {
    await page.setViewportSize(MOBILE);
    await page.goto(BASE, { waitUntil: "load" });

    await hamburgerBtn(page).click();
    await expect(mobileMenu(page)).toBeVisible();

    await page.keyboard.press("Escape");
    await page.waitForTimeout(500);

    // Menu should be hidden
    // The mobile menu container uses height:0 when closed and is not visible
    const menu = mobileMenu(page);
    const isVisible = await menu.isVisible().catch(() => false);
    expect(isVisible).toBe(false);
  });
});
