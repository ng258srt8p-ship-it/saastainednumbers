import { test, expect } from "@playwright/test";
import {
  ALL_CURRENCIES,
  BASE,
  LOCALES,
  currencyBtn,
  currencyDropdown,
  localeSwitcherBtn,
  localeSwitcherDropdown,
} from "./helpers";

const CALCULATOR_PATH = "/revenue/mrr-calculator";

function expectedPathForLocale(locale: string, path = CALCULATOR_PATH) {
  return locale === "en" ? path : `/${locale}${path}`;
}

async function clearPrefs(page: import("@playwright/test").Page) {
  await page.context().clearCookies();
  await page.addInitScript(() => {
    localStorage.removeItem("theme");
  });
}

test.describe("Header currency button — complete behavior", () => {
  test.beforeEach(async ({ page }) => {
    await clearPrefs(page);
    await page.goto(`${BASE}${CALCULATOR_PATH}`, { waitUntil: "load" });
  });

  test("opens an accessible listbox, marks the active option, and closes from the backdrop", async ({ page }) => {
    await expect(currencyBtn(page)).toHaveAttribute("aria-haspopup", "listbox");
    await expect(currencyBtn(page)).toHaveAttribute("aria-expanded", "false");

    await currencyBtn(page).click();
    await expect(currencyBtn(page)).toHaveAttribute("aria-expanded", "true");
    await expect(currencyDropdown(page)).toBeVisible();
    await expect(currencyDropdown(page).locator('button[role="option"][aria-selected="true"]')).toContainText("USD");

    await page.locator(".fixed.inset-0.z-40").click({ force: true });
    await expect(currencyDropdown(page)).not.toBeVisible();
    await expect(currencyBtn(page)).toHaveAttribute("aria-expanded", "false");
  });

  test("every supported currency can be selected from the header", async ({ page }) => {
    for (const currency of ALL_CURRENCIES) {
      await currencyBtn(page).click();
      await currencyDropdown(page).locator('button[role="option"]', { hasText: currency.code }).click();
      await expect(currencyDropdown(page)).not.toBeVisible();
      await expect(currencyBtn(page)).toContainText(currency.code);
      await expect(currencyBtn(page)).toContainText(currency.symbol);

      const cookie = await page.context().cookies(BASE);
      expect(cookie.find((c) => c.name === "currency")?.value).toBe(currency.code);
    }
  });

  test("switching currencies updates calculator money affordances and persists across reloads", async ({ page }) => {
    await currencyBtn(page).click();
    await currencyDropdown(page).locator('button[role="option"]', { hasText: "GBP" }).click();

    await expect(currencyBtn(page)).toContainText("GBP");
    await expect(currencyBtn(page)).toContainText("£");
    await expect(page.locator("span.pointer-events-none").first()).toContainText("£");

    await page.reload({ waitUntil: "load" });
    await expect(currencyBtn(page)).toContainText("GBP");
    await expect(page.locator("span.pointer-events-none").first()).toContainText("£");
  });

  test("can switch through multiple currencies in sequence without stale state", async ({ page }) => {
    const sequence = [
      { code: "EUR", symbol: "€" },
      { code: "JPY", symbol: "¥" },
      { code: "BRL", symbol: "R$" },
      { code: "INR", symbol: "₹" },
      { code: "USD", symbol: "$" },
    ];

    for (const currency of sequence) {
      await currencyBtn(page).click();
      await currencyDropdown(page).locator('button[role="option"]', { hasText: currency.code }).click();
      await expect(currencyBtn(page)).toContainText(currency.code);
      await expect(currencyBtn(page)).toContainText(currency.symbol);
      await expect(currencyDropdown(page)).not.toBeVisible();
    }
  });
});

test.describe("Header language button — complete behavior", () => {
  test.beforeEach(async ({ page }) => {
    await clearPrefs(page);
  });

  test("opens an accessible listbox and lists all supported languages", async ({ page }) => {
    await page.goto(`${BASE}${CALCULATOR_PATH}`, { waitUntil: "load" });

    await expect(localeSwitcherBtn(page)).toHaveAttribute("aria-haspopup", "listbox");
    await expect(localeSwitcherBtn(page)).toHaveAttribute("aria-expanded", "false");

    await localeSwitcherBtn(page).click();
    await expect(localeSwitcherBtn(page)).toHaveAttribute("aria-expanded", "true");
    await expect(localeSwitcherDropdown(page)).toBeVisible();

    for (const locale of LOCALES) {
      await expect(localeSwitcherDropdown(page).locator('button[role="option"]', { hasText: locale.name })).toBeVisible();
    }
  });

  test("each language option sets the locale cookie and lands on the expected locale-prefixed path", async ({ page }) => {
    for (const locale of LOCALES) {
      await page.context().clearCookies();
      await page.goto(`${BASE}${CALCULATOR_PATH}`, { waitUntil: "load" });
      await localeSwitcherBtn(page).click();
      await localeSwitcherDropdown(page).locator('button[role="option"]', { hasText: locale.name }).click();
      await page.waitForLoadState("load");

      await expect(page).toHaveURL(new RegExp(`${expectedPathForLocale(locale.code).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}/?$`));
      const cookies = await page.context().cookies(BASE);
      expect(cookies.find((c) => c.name === "locale")?.value).toBe(locale.code);
      await expect(page.locator("html")).toHaveAttribute("lang", locale.code);
      await expect(localeSwitcherBtn(page)).toContainText(locale.code.toUpperCase());
    }
  });

  test("language switching changes visible header copy", async ({ page }) => {
    await page.goto(`${BASE}${CALCULATOR_PATH}`, { waitUntil: "load" });

    await localeSwitcherBtn(page).click();
    await localeSwitcherDropdown(page).locator('button[role="option"]', { hasText: "Español" }).click();
    await page.waitForLoadState("load");
    await expect(page.getByRole("navigation").first()).toContainText(/Calculadoras|Precios|Blog/i);

    await page.context().clearCookies();
    await page.goto(`${BASE}${CALCULATOR_PATH}`, { waitUntil: "load" });
    await localeSwitcherBtn(page).click();
    await localeSwitcherDropdown(page).locator('button[role="option"]', { hasText: "Deutsch" }).click();
    await page.waitForLoadState("load");
    await expect(page.getByRole("navigation").first()).toContainText(/Rechner|Preise|Blog/i);
  });

  test("currency selection survives language changes", async ({ page }) => {
    await page.goto(`${BASE}${CALCULATOR_PATH}`, { waitUntil: "load" });

    await currencyBtn(page).click();
    await currencyDropdown(page).locator('button[role="option"]', { hasText: "GBP" }).click();
    await expect(currencyBtn(page)).toContainText("GBP");

    await localeSwitcherBtn(page).click();
    await localeSwitcherDropdown(page).locator('button[role="option"]', { hasText: "Français" }).click();

    await expect(page).toHaveURL(/\/fr\/revenue\/mrr-calculator\/?$/);
    await expect(currencyBtn(page)).toContainText("GBP");
    await expect(currencyBtn(page)).toContainText("£");

    const cookies = await page.context().cookies(BASE);
    expect(cookies.find((c) => c.name === "locale")?.value).toBe("fr");
    expect(cookies.find((c) => c.name === "currency")?.value).toBe("GBP");
  });
});
