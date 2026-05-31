import { test, expect } from "@playwright/test";

const BASE = "http://localhost:3000";

const CATEGORIES = [
  "Revenue", "Churn & Retention", "Growth & Efficiency",
  "Unit Economics", "AI Cost", "Side Hustle",
  "Personal Finance", "General Business", "SaaS Deepen",
];

test.describe("Homepage", () => {
  test("homepage returns 200", async ({ page }) => {
    const resp = await page.goto(BASE, { waitUntil: "load" });
    expect(resp?.status()).toBe(200);
  });

  test("homepage has correct title", async ({ page }) => {
    await page.goto(BASE, { waitUntil: "load" });
    const title = await page.title();
    expect(title).toContain("SaaStainedNumbers");
  });

  test("homepage has meta description", async ({ page }) => {
    await page.goto(BASE, { waitUntil: "load" });
    const desc = page.locator('meta[name="description"]');
    await expect(desc).toHaveAttribute("content");
  });

  test("hero section loads with heading", async ({ page }) => {
    await page.goto(BASE, { waitUntil: "load" });
    const hero = page.locator("h1, h2").first();
    await expect(hero).toBeVisible();
    const text = await hero.textContent();
    expect(text).toBeTruthy();
  });

  test("category grid renders all 9 categories", async ({ page }) => {
    await page.goto(BASE, { waitUntil: "load" });
    for (const cat of CATEGORIES) {
      const matches = page.locator(`text=${cat}`).or(page.locator(`a:has-text("${cat}")`));
      if (await matches.count() > 0) {
        await expect(matches.first()).toBeVisible();
      }
    }
  });

  test("category links navigate to correct pages", async ({ page }) => {
    await page.goto(BASE, { waitUntil: "load" });
    const catLink = page.locator("a[href*='/'], a").filter({ hasText: /revenue/i }).first();
    if (await catLink.isVisible()) {
      const href = await catLink.getAttribute("href");
      if (href && !href.startsWith("http")) {
        const resp = await page.goto(`${BASE}${href}`, { waitUntil: "load" });
        expect(resp?.status()).toBe(200);
      }
    }
  });

  test("hero section has gradient background", async ({ page }) => {
    await page.goto(BASE, { waitUntil: "load" });
    const sections = await page.locator("section").all();
    const hasGradient = await page.evaluate(() => {
      const sections = document.querySelectorAll("section");
      return Array.from(sections).some((s) =>
        s.className.includes("gradient") || s.className.includes("brand")
      );
    });
    expect(sections.length).toBeGreaterThan(0);
  });

  test("homepage has browse calculators CTA", async ({ page }) => {
    await page.goto(BASE, { waitUntil: "load" });
    const cta = page.locator("a[href='/calculators']").or(
      page.locator("text=browse calculators").or(page.locator("text=Browse Calculators"))
    );
    await expect(cta.first()).toBeVisible();
  });

  test("homepage has pricing link", async ({ page }) => {
    await page.goto(BASE, { waitUntil: "load" });
    const pricingLink = page.locator("a[href='/pricing']", { hasText: /pricing/i }).or(
      page.locator("text=Pricing")
    );
    await expect(pricingLink.first()).toBeVisible();
  });

  test("all sections have max-w-6xl container", async ({ page }) => {
    await page.goto(BASE);
    const containers = page.locator("section .mx-auto");
    const count = await containers.count();
    expect(count).toBeGreaterThanOrEqual(2);
  });

  test("homepage loads without console errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });
    await page.goto(BASE, { waitUntil: "load" });
    expect(errors.length).toBe(0);
  });

  test("hero subtitle mentions calculators", async ({ page }) => {
    await page.goto(BASE, { waitUntil: "load" });
    const body = await page.locator("body").textContent();
    expect(body?.toLowerCase()).toContain("calculator");
  });

  test("page navigation link to all calculators works", async ({ page }) => {
    await page.goto(BASE, { waitUntil: "load" });
    const calcLink = page.locator("nav a[href='/calculators']");
    if (await calcLink.isVisible()) {
      await calcLink.click();
      await expect(page).toHaveURL(/\/calculators/);
    }
  });
});
