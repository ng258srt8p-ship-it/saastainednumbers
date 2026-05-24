import { test, expect } from "@playwright/test";

const BASE = "http://localhost:3000";

test.describe("Locale Switcher", () => {
  for (const [code, navText] of [["es", "Panel"], ["de", "Preise"], ["fr", "Tarifs"], ["pt", "Preços"], ["ja", "料金"]] as const) {
    test(`setting ${code} cookie renders "${navText}" in nav`, async ({ page }) => {
      await page.context().addCookies([{ name: "locale", value: code, domain: "localhost", path: "/" }]);
      await page.goto(BASE, { waitUntil: "networkidle" });
      await expect(page.locator("nav")).toContainText(navText);
    });
  }
});
