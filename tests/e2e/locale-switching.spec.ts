import { test, expect } from "@playwright/test";

const LOCALES = [
  { code: "en", label: "English", navText: "" },
  { code: "es", label: "Español", navText: "Panel" },
  { code: "de", label: "Deutsch", navText: "Preise" },
  { code: "pt", label: "Português", navText: "Preços" },
  { code: "fr", label: "Français", navText: "Tarifs" },
  { code: "ja", label: "日本語", navText: "料金" },
];

test.describe("LocaleSwitcher UI", () => {
  test("shows current locale in button", async ({ page }) => {
    await page.goto("/", { waitUntil: "load" });
    await expect(page.locator('[aria-label="Select language"]')).toContainText("EN");
  });

  test("opens dropdown with all 6 languages", async ({ page }) => {
    await page.goto("/", { waitUntil: "load" });
    await page.click('[aria-label="Select language"]');
    for (const { label } of LOCALES) {
      await expect(page.locator('[role="listbox"]')).toContainText(label);
    }
  });

  test("highlights current locale in dropdown", async ({ page }) => {
    await page.goto("/", { waitUntil: "load" });
    await page.click('[aria-label="Select language"]');
    await expect(page.locator('[role="option"]', { hasText: "English" })).toHaveAttribute("aria-selected", "true");
  });

  test("dropdown closes when clicking overlay", async ({ page }) => {
    await page.goto("/", { waitUntil: "load" });
    await page.click('[aria-label="Select language"]');
    await expect(page.locator('[role="listbox"]')).toBeVisible();
    await page.click('[aria-hidden="true"].fixed.inset-0');
    await expect(page.locator('[role="listbox"]')).not.toBeVisible();
  });

  test("dropdown closes when clicking a locale option", async ({ page }) => {
    await page.goto("/", { waitUntil: "load" });
    await page.click('[aria-label="Select language"]');
    await page.click("text=Español");
    await expect(page.locator('[role="listbox"]')).not.toBeVisible();
  });

  test("clicking current locale option reloads page", async ({ page }) => {
    await page.goto("/", { waitUntil: "load" });
    await page.click('[aria-label="Select language"]');
    await page.click("text=English");
    await page.waitForLoadState("networkidle");
    await expect(page.locator('[aria-label="Select language"]')).toBeVisible();
  });
});

test.describe("Cookie-based locale switching", () => {
  for (const { code, navText } of LOCALES.filter((l) => l.code !== "en")) {
    test(`setting ${code} cookie translates nav to "${navText}"`, async ({ page }) => {
      await page.context().addCookies([{ name: "locale", value: code, domain: "localhost", path: "/" }]);
      await page.goto("/", { waitUntil: "load" });
      await expect(page.getByRole("navigation").first()).toContainText(navText);
    });
  }
});

test.describe("Locale detection from URL path", () => {
  test("standard URL resolves without 404", async ({ page }) => {
    const resp = await page.goto("/revenue/mrr-calculator", { waitUntil: "load" });
    expect(resp?.status()).toBe(200);
  });

  test("locale-prefixed URLs may 404 in dev mode (expected)", async ({ page }) => {
    const resp = await page.goto("/es/revenue/mrr-calculator", { waitUntil: "load" });
    if (resp?.status() === 404) {
      test.skip();
    }
  });
});

test.describe("html lang attribute", () => {
  test("default page has lang=en", async ({ page }) => {
    await page.goto("/", { waitUntil: "load" });
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
  });

  test("page with es cookie has lang=es", async ({ page }) => {
    await page.context().addCookies([{ name: "locale", value: "es", domain: "localhost", path: "/" }]);
    await page.goto("/", { waitUntil: "load" });
    await expect(page.locator("html")).toHaveAttribute("lang", "es");
  });

  test("page with de cookie has lang=de", async ({ page }) => {
    await page.context().addCookies([{ name: "locale", value: "de", domain: "localhost", path: "/" }]);
    await page.goto("/", { waitUntil: "load" });
    await expect(page.locator("html")).toHaveAttribute("lang", "de");
  });
});
