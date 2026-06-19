import { test, expect } from "@playwright/test";

test.describe.configure({ mode: "serial" });

test("i18n: pricing page headings resolved", async ({ page }) => {
  await page.goto("/pricing", { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);
  const h1 = page.locator("h1");
  await expect(h1).not.toContainText("pricing.");
  await expect(h1).toContainText("Free");
});

test("i18n: footer text resolved", async ({ page }) => {
  await page.goto("/pricing", { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);
  const footer = page.locator("footer");
  await expect(footer).not.toContainText("footer.");
  await expect(footer).not.toContainText("common.");
  await expect(footer).not.toContainText("category.");
  await expect(footer).toContainText("Product");
});

test("i18n: blog page title resolved", async ({ page }) => {
  await page.goto("/blog", { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);
  const title = await page.title();
  expect(title).not.toContain("blog.");
  expect(title).toContain("Blog");
});

test("i18n: dashboard page title resolved", async ({ page }) => {
  await page.goto("/dashboard", { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);
  const title = await page.title();
  expect(title).not.toContain("dashboard.");
  expect(title).toContain("Dashboard");
});

test("i18n: calculators page title resolved", async ({ page }) => {
  await page.goto("/calculators", { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);
  const title = await page.title();
  expect(title).not.toContain("category.");
  expect(title).toContain("Calculators");
});

test("embed ?embed=1: no nav or footer", async ({ page }) => {
  await page.goto("/revenue/mrr-calculator?embed=1", { waitUntil: "networkidle" });
  await page.waitForTimeout(3000);
  const footers = page.locator("footer");
  await expect(footers).toHaveCount(0);
  // The glassmorphism nav bar (backdrop-blur) should be hidden — only breadcrumb nav may remain
  const glassNav = page.locator("nav").filter({ hasText: /Pricing|Blog/ });
  await expect(glassNav).toHaveCount(0);
});

test("embed route: no nav or footer", async ({ page }) => {
  await page.goto("/embed/mrr-calculator", { waitUntil: "networkidle" });
  await page.waitForTimeout(2000);
  const nav = page.locator("nav");
  const footer = page.locator("footer");
  await expect(nav).toHaveCount(0);
  await expect(footer).toHaveCount(0);
});

test("canvas page: footer hidden", async ({ page }) => {
  await page.goto("/canvas", { waitUntil: "networkidle" });
  await page.waitForTimeout(2000);
  const footer = page.locator("footer");
  await expect(footer).toHaveCount(0);
});

test("non-embed page: nav and footer present", async ({ page }) => {
  await page.goto("/revenue/mrr-calculator", { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);
  const nav = page.locator("nav");
  const footer = page.locator("footer");
  await expect(nav).not.toHaveCount(0);
  await expect(footer).not.toHaveCount(0);
});
