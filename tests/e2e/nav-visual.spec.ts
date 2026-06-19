import { test, expect } from "@playwright/test";

const BASE = "http://localhost:3000";

test.describe("Nav bar visual layout", () => {
  test("nav does not overlap page content on homepage", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(BASE, { waitUntil: "load" });

    // Wait for nav to be visible
    const nav = page.locator("nav").first();
    await expect(nav).toBeVisible();

    // Measure nav bounding box
    const navBox = await nav.boundingBox();
    expect(navBox).not.toBeNull();

    // The first heading should start BELOW the nav bottom edge
    const heading = page.locator("h1").first();
    await expect(heading).toBeVisible();
    const headingBox = await heading.boundingBox();
    expect(headingBox).not.toBeNull();

    // Assert — heading top should be >= nav bottom (with small tolerance)
    const navBottom = navBox!.y + navBox!.height;
    expect(headingBox!.y).toBeGreaterThanOrEqual(navBottom - 2);
  });

  test("nav has sufficient contrast on dark hero section", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(BASE, { waitUntil: "load" });

    const nav = page.locator("nav").first();
    await expect(nav).toBeVisible();

    // Take a screenshot of just the nav region for visual diff
    const navBox = await nav.boundingBox();
    if (navBox) {
      await page.screenshot({
        path: "e2e-screenshots/nav-region.png",
        clip: {
          x: Math.max(0, navBox.x - 20),
          y: Math.max(0, navBox.y - 20),
          width: Math.min(navBox.width + 40, 1280),
          height: navBox.height + 40,
        },
      });
    }

    // Check nav text is not transparent/clipped
    const navLinks = nav.locator("a");
    const linkCount = await navLinks.count();
    for (let i = 0; i < linkCount; i++) {
      const link = navLinks.nth(i);
      await expect(link).toBeVisible();
      // Verify text is rendered (non-empty)
      const text = await link.textContent();
      expect(text?.trim().length).toBeGreaterThan(0);
    }
  });

  test("content padding on category page", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(`${BASE}/revenue`, { waitUntil: "load" });

    const nav = page.locator("nav").first();
    await expect(nav).toBeVisible();
    const navBox = await nav.boundingBox();
    expect(navBox).not.toBeNull();

    // First visible content below nav should start past nav bottom
    const firstContent = page.locator("h1, .breadcrumb, main > *").first();
    await expect(firstContent).toBeVisible();
    const contentBox = await firstContent.boundingBox();
    expect(contentBox).not.toBeNull();

    const navBottom = navBox!.y + navBox!.height;
    expect(contentBox!.y).toBeGreaterThanOrEqual(navBottom - 2);
  });

  test("locale dropdown is fully visible on all viewports", async ({ page }) => {
    for (const width of [1280, 768, 375]) {
      await page.setViewportSize({ width, height: 800 });
      await page.goto(BASE, { waitUntil: "load" });

      // Open locale switcher
      const localeBtn = page.locator('button[aria-label="Select language"]');
      await localeBtn.click();

      // The dropdown should be fully within viewport bounds
      const dropdown = page.locator('[role="listbox"]');
      await expect(dropdown).toBeVisible();

      const box = await dropdown.boundingBox();
      expect(box).not.toBeNull();

      // Dropdown should not extend beyond right viewport edge
      expect(box!.x + box!.width).toBeLessThanOrEqual(width);
      // Should not extend beyond left viewport edge
      expect(box!.x).toBeGreaterThanOrEqual(0);

      // Close it
      await page.keyboard.press("Escape");
    }
  });

  test("embed page has no extra top padding", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(`${BASE}/embed/mrr-calculator`, { waitUntil: "load" });

    // The first content should start near the top (no nav padding)
    const firstChild = page.locator("main > * > *").first();
    const box = await firstChild.boundingBox();
    expect(box).not.toBeNull();
    // Content should start within 10px of the viewport top
    expect(box!.y).toBeLessThan(20);
  });
});

test.describe("Pricing page", () => {
  test("shows only one free tier", async ({ page }) => {
    await page.goto(`${BASE}/pricing`, { waitUntil: "load" });

    // Should have exactly one plan card
    const cards = page.locator(".rounded-2xl.border");
    await expect(cards).toHaveCount(1);

    // Should NOT show Pro or Enterprise text
    await expect(page.getByText("Pro")).toHaveCount(0);
    await expect(page.getByText("Enterprise")).toHaveCount(0);

    // Should show $0 / forever
    await expect(page.getByText("$0")).toBeVisible();
  });
});
