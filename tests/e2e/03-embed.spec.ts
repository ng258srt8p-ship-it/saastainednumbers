import { test, expect } from "@playwright/test";
import { BASE, CALC_SLUGS } from "./helpers";

test.describe("Embed pages load correctly", () => {
  for (const { category, slug, name } of CALC_SLUGS) {
    test(`embed for ${name} (${slug}) loads with 200`, async ({ page }) => {
      const response = await page.goto(`${BASE}/embed/${slug}`, { waitUntil: "load" });
      expect(response?.status()).toBe(200);
    });
  }
});

test.describe("Embed pages have no nav or footer", () => {
  test("embed page has no nav header", async ({ page }) => {
    await page.goto(`${BASE}/embed/mrr-calculator`, { waitUntil: "load" });
    // The embed layout is minimal, no Nav component
    // The ShowWhenNotEmbed wrapper hides the nav on /embed routes
    const nav = page.locator("nav");
    await expect(nav).toHaveCount(0);
  });

  test("embed page has no footer", async ({ page }) => {
    await page.goto(`${BASE}/embed/mrr-calculator`, { waitUntil: "load" });
    // FooterShow component returns null for /embed routes
    const footer = page.locator("footer");
    await expect(footer).toHaveCount(0);
  });
});

test.describe("Embed pages have inputs and attribution", () => {
  for (const { slug, name } of CALC_SLUGS) {
    test(`${name} embed has at least one input and SaaStainedNumbers attribution`, async ({ page }) => {
      await page.goto(`${BASE}/embed/${slug}`, { waitUntil: "load" });

      // At least one input exists
      const inputs = page.locator('input[type="range"], input[type="text"]');
      await expect(inputs.first()).toBeVisible();

      // Attribution text exists
      const attribution = page.locator("text=SaaStainedNumbers");
      await expect(attribution.first()).toBeVisible();
    });
  }
});

test.describe("Embed URL params", () => {
  test("theme=dark adds dark class to html", async ({ page }) => {
    await page.goto(`${BASE}/embed/mrr-calculator?theme=dark`, { waitUntil: "load" });
    await page.waitForTimeout(500);
    const hasDark = await page.evaluate(() =>
      document.documentElement.classList.contains("dark")
    );
    expect(hasDark).toBe(true);
  });

  test("theme=light does not add dark class", async ({ page }) => {
    await page.goto(`${BASE}/embed/mrr-calculator?theme=light`, { waitUntil: "load" });
    await page.waitForTimeout(500);
    const hasDark = await page.evaluate(() =>
      document.documentElement.classList.contains("dark")
    );
    expect(hasDark).toBe(false);
  });

  test("hideHeader=true hides the embed header", async ({ page }) => {
    await page.goto(`${BASE}/embed/mrr-calculator?hideHeader=true`, { waitUntil: "load" });
    await page.waitForTimeout(500);
    // The header with title and description should not be visible
    const header = page.locator("h2").filter({ hasText: "MRR Calculator" });
    await expect(header).toHaveCount(0);
  });

  test("default (no hideHeader) shows the embed header", async ({ page }) => {
    await page.goto(`${BASE}/embed/mrr-calculator`, { waitUntil: "load" });
    await page.waitForTimeout(500);
    const header = page.locator("h2").filter({ hasText: "MRR Calculator" });
    await expect(header).toBeVisible();
  });
});

test.describe("Embed postMessage", () => {
  test("input change dispatches postMessage to parent", async ({ page }) => {
    await page.goto(`${BASE}/embed/mrr-calculator`, { waitUntil: "load" });
    await page.waitForTimeout(500);

    // Set up message listener before triggering input change
    const messages: unknown[] = [];
    await page.evaluate(() => {
      (window as Record<string, unknown>).__capturedMessages = [];
      window.addEventListener("message", (event) => {
        (window as Record<string, unknown>).__capturedMessages =
          [...((window as Record<string, unknown>).__capturedMessages as unknown[]), event.data];
      });
    });

    // Change an input value
    const slider = page.locator('input[type="range"]').first();
    await slider.fill("200");
    await page.waitForTimeout(1000);

    // Check that postMessage was dispatched (embed sends source: "saastainednumbers-embed")
    const capturedMessages = await page.evaluate(() => {
      return (window as Record<string, unknown>).__capturedMessages as Array<Record<string, unknown>>;
    });

    // Filter for embed messages
    const embedMessages = capturedMessages.filter(
      (m) => m && typeof m === "object" && "source" in m && m.source === "saastainednumbers-embed"
    );
    expect(embedMessages.length).toBeGreaterThan(0);

    // Verify the message structure
    const lastMessage = embedMessages[embedMessages.length - 1] as Record<string, unknown>;
    expect(lastMessage).toHaveProperty("slug", "mrr-calculator");
    expect(lastMessage).toHaveProperty("inputs");
    expect(lastMessage).toHaveProperty("results");
  });
});

test.describe("Embed smoke test loop", () => {
  for (const { slug } of CALC_SLUGS) {
    test(`embed /embed/${slug} returns 200`, async ({ page }) => {
      const response = await page.goto(`${BASE}/embed/${slug}`, { waitUntil: "load" });
      expect(response?.status()).toBe(200);
    });
  }
});
