import { type Page, expect } from "@playwright/test";

export const BASE = "http://localhost:3000";
export const MOBILE = { width: 390, height: 844 };

// ─── All 6 supported locales ──────────────────────────────────────────────
export const LOCALES = [
  { code: "en", name: "English" },
  { code: "es", name: "Español" },
  { code: "de", name: "Deutsch" },
  { code: "pt", name: "Português" },
  { code: "fr", name: "Français" },
  { code: "ja", name: "日本語" },
] as const;

// ─── All 20 supported currencies ──────────────────────────────────────────
export const ALL_CURRENCIES = [
  { code: "USD", symbol: "$" },
  { code: "EUR", symbol: "€" },
  { code: "GBP", symbol: "£" },
  { code: "JPY", symbol: "¥" },
  { code: "CAD", symbol: "C$" },
  { code: "AUD", symbol: "A$" },
  { code: "BRL", symbol: "R$" },
  { code: "CHF", symbol: "Fr" },
  { code: "INR", symbol: "₹" },
  { code: "CNY", symbol: "¥" },
  { code: "MXN", symbol: "MX$" },
  { code: "SEK", symbol: "kr" },
  { code: "NOK", symbol: "kr" },
  { code: "NZD", symbol: "NZ$" },
  { code: "KRW", symbol: "₩" },
  { code: "SGD", symbol: "S$" },
  { code: "HKD", symbol: "HK$" },
  { code: "TWD", symbol: "NT$" },
  { code: "ZAR", symbol: "R" },
  { code: "DKK", symbol: "kr" },
] as const;

// Five representative currencies for deep testing (avoids 6×20=120 explosion)
export const REP_CURRENCIES = ["EUR", "GBP", "JPY", "BRL", "INR"] as const;

// Default currency per locale
export const DEFAULT_CURRENCY: Record<string, string> = {
  en: "USD", es: "EUR", de: "EUR", pt: "EUR", fr: "EUR", ja: "JPY",
};

// ─── Locator helpers ──────────────────────────────────────────────────────

export function currencyBtn(page: Page) {
  return page.locator('button[aria-label="Select currency"]').first();
}

export function currencyDropdown(page: Page) {
  return page.locator('div[role="listbox"][aria-label="Select currency"]');
}

export function localeSwitcherBtn(page: Page) {
  return page.locator('button[aria-label*="Select language"]').first();
}

export function localeSwitcherDropdown(page: Page) {
  return page.locator('[role="listbox"][aria-label*="Select language"]');
}

export function hamburgerBtn(page: Page) {
  return page.locator('button[aria-label*="Open navigation"]');
}

export function mobileMenu(page: Page) {
  return page.locator('div[role="dialog"]');
}

export function themeToggle(page: Page) {
  // Matches both pre-hydration ("Toggle theme") and post-hydration ("Switch to dark/light mode") labels
  return page.locator('button[aria-label*="theme" i], button[aria-label*="Switch to" i]');
}

export function embedBtn(page: Page) {
  return page.getByRole("button", { name: /embed/i }).first();
}

export function getInsightsBtn(page: Page) {
  return page.getByRole("button", { name: /get insights|obtener|erhalten|obter|obtenir|取得/i }).first();
}

export function shareBtn(page: Page) {
  return page.getByRole("button", { name: /share|compartir|teilen|compartilhar|partager|共有/i }).first();
}

// ─── Action helpers ──────────────────────────────────────────────────────

/** Switch to a specific currency via the header dropdown */
export async function switchCurrency(page: Page, currencyCode: string) {
  await currencyBtn(page).click();
  await currencyDropdown(page).locator('button[role="option"]', { hasText: currencyCode }).click();
  await page.waitForTimeout(300);
}

/** Toggle dark mode on/off */
export async function toggleDarkMode(page: Page, targetTheme: "dark" | "light") {
  const btn = themeToggle(page);
  const currentTheme = await page.evaluate(() => document.documentElement.classList.contains("dark") ? "dark" : "light");
  if (currentTheme !== targetTheme) {
    await btn.click();
    await page.waitForTimeout(300);
  }
}

/** Clear all workspace canvas storage */
export async function clearCanvasStorage(page: Page) {
  await page.evaluate(() => localStorage.removeItem("canvas-workspace-state"));
}

/** Add a calculator to the canvas workspace by name */
export async function addCalculatorToCanvas(page: Page, calcName: string) {
  const aside = page.locator("aside");
  const btn = aside.getByRole("button", { name: new RegExp(calcName, "i") }).first();
  await btn.click();
  await page.waitForTimeout(300);
}

/** Navigate to a calculator page with optional locale prefix */
export async function gotoCalculator(page: Page, category: string, slug: string, locale = "en") {
  const prefix = locale === "en" ? "" : `/${locale}`;
  await page.goto(`${BASE}${prefix}/${category}/${slug}`, { waitUntil: "load" });
}

/** Get the current locale from the URL */
export function getCurrentLocale(page: Page): string {
  const path = page.url();
  const first = path.split("/").filter(Boolean)[0];
  const localeCodes = ["en", "es", "de", "pt", "fr", "ja"];
  return localeCodes.includes(first) ? first : "en";
}

/** Slugs for representative calculators across categories */
export const CALC_SLUGS = [
  { category: "revenue", slug: "mrr-calculator", name: "MRR Calculator" },
  { category: "churn", slug: "churn-rate-calculator", name: "Churn Rate Calculator" },
  { category: "growth", slug: "growth-rate-calculator", name: "Growth Rate Calculator" },
  { category: "unit-economics", slug: "cac-calculator", name: "CAC Calculator" },
  { category: "side-hustle", slug: "solo-fund-manager", name: "Solo Fund Manager" },
  { category: "personal-finance", slug: "fire-calculator", name: "FIRE Calculator" },
  { category: "general-business", slug: "break-even-calculator", name: "Break Even Calculator" },
  { category: "ai-cost", slug: "llm-cost-calculator", name: "LLM Cost Calculator" },
] as const;
