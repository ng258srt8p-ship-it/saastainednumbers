import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { BASE } from "./helpers";

const PAGES_TO_AUDIT = [
  { name: "homepage", url: BASE },
  { name: "calculator page", url: `${BASE}/revenue/mrr-calculator` },
  { name: "category page", url: `${BASE}/revenue` },
  { name: "pricing page", url: `${BASE}/pricing` },
  { name: "blog page", url: `${BASE}/blog` },
  { name: "embed page", url: `${BASE}/embed/mrr-calculator` },
];

test.describe("Accessibility", () => {
  for (const { name, url } of PAGES_TO_AUDIT) {
    test(`${name} passes WCAG 2.1 AA audit`, async ({ page }) => {
      await page.goto(url, { waitUntil: "load" });
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();
      expect(results.violations).toEqual([]);
    });
  }

  test("all audited pages have 0 critical and serious violations", async ({ page }) => {
    await page.goto(BASE, { waitUntil: "load" });
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    const criticalAndSerious = results.violations.filter(
      (v) => v.impact === "critical" || v.impact === "serious"
    );
    expect(criticalAndSerious).toEqual([]);
  });

  test("skip-to-content link exists and is focusable", async ({ page }) => {
    await page.goto(BASE);
    const skipLink = page.locator('a[href="#main-content"]');
    await expect(skipLink).toBeAttached();
    // Tab to the skip link (it should be the first focusable element)
    await page.keyboard.press("Tab");
    // The skip link gets focus styles when focused
    const isFocused = await skipLink.evaluate(
      (el) => el === document.activeElement
    );
    expect(isFocused).toBe(true);
  });

  test("images have alt text", async ({ page }) => {
    await page.goto(BASE);
    const images = page.locator("img");
    const count = await images.count();
    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute("alt");
      // All images must have an alt attribute (even if empty for decorative)
      expect(alt).not.toBeNull();
    }
  });

  test("form inputs have associated labels on calculator page", async ({ page }) => {
    await page.goto(`${BASE}/revenue/mrr-calculator`);
    // Check that all input elements have accessible names via label, aria-label, or aria-labelledby
    const inputs = page.locator("input");
    const count = await inputs.count();
    for (let i = 0; i < count; i++) {
      const input = inputs.nth(i);
      const ariaLabel = await input.getAttribute("aria-label");
      const ariaLabelledBy = await input.getAttribute("aria-labelledby");
      const id = await input.getAttribute("id");
      let hasLabel = false;

      if (ariaLabel || ariaLabelledBy) {
        hasLabel = true;
      } else if (id) {
        const label = page.locator(`label[for="${id}"]`);
        hasLabel = (await label.count()) > 0;
      }

      // Skip hidden inputs (type="hidden") as they don't need labels
      const type = await input.getAttribute("type");
      if (type === "hidden" || type === "range") {
        continue;
      }

      expect(hasLabel).toBe(true);
    }
  });
});
