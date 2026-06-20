import { test, expect } from "@playwright/test";

const BASE = "http://localhost:3000";

const CALC_PAGES = [
  { slug: "mrr-calculator", category: "revenue", title: "MRR Calculator" },
  { slug: "cac-calculator", category: "growth-efficiency", title: "CAC Calculator" },
  { slug: "ltv-calculator", category: "revenue", title: "LTV Calculator" },
];

const NON_CALC_PAGES = [
  { path: "/", label: "Homepage" },
  { path: "/blog", label: "Blog" },
  { path: "/about", label: "About" },
  { path: "/pricing", label: "Pricing" },
  { path: "/privacy", label: "Privacy" },
  { path: "/contact", label: "Contact" },
  { path: "/advertisers", label: "Advertisers" },
  { path: "/terms", label: "Terms" },
  { path: "/legal", label: "Legal" },
  { path: "/dashboard", label: "Dashboard" },
  { path: "/calculators", label: "Calculators (list)" },
];

test.describe("AI Chat Widget — Visibility", () => {
  for (const { slug, category, title } of CALC_PAGES) {
    test(`${title} shows chat button`, async ({ page }) => {
      await page.goto(`${BASE}/${category}/${slug}`, { waitUntil: "load" });
      const button = page.locator('button[aria-label="Open AI Chat"]');
      await expect(button).toBeVisible({ timeout: 10000 });
    });
  }

  for (const { path, label } of NON_CALC_PAGES) {
    test(`${label} does NOT show chat button`, async ({ page }) => {
      await page.goto(`${BASE}${path}`, { waitUntil: "load" });
      const button = page.locator('button[aria-label="Open AI Chat"]');
      await expect(button).toHaveCount(0, { timeout: 10000 });
    });
  }

  test("Canvas page shows chat button", async ({ page }) => {
    await page.goto(`${BASE}/canvas`, { waitUntil: "load" });
    const button = page.locator('button[aria-label="Open AI Chat"]');
    await expect(button).toBeVisible({ timeout: 10000 });
  });

  for (const { slug, category } of CALC_PAGES) {
    test(`Embed /${slug} does NOT show chat button`, async ({ page }) => {
      await page.goto(`${BASE}/embed/${slug}`, { waitUntil: "load" });
      const button = page.locator('button[aria-label="Open AI Chat"]');
      await expect(button).toHaveCount(0, { timeout: 10000 });
    });
  }
});

test.describe("AI Chat Widget — Interaction", () => {
  test("opening chat shows context-aware placeholder", async ({ page }) => {
    await page.goto(`${BASE}/revenue/mrr-calculator`, { waitUntil: "load" });

    // Click the chat button
    const button = page.locator('button[aria-label="Open AI Chat"]');
    await button.click();

    // Verify the panel opened
    const panel = page.locator('text=Ask AI');
    await expect(panel).toBeVisible({ timeout: 5000 });

    // Verify context-aware placeholder text
    const placeholder = page.locator("text=Ask me about the MRR Calculator calculator.");
    await expect(placeholder).toBeVisible({ timeout: 3000 });
  });

  test("typing and send button enables", async ({ page }) => {
    await page.goto(`${BASE}/revenue/mrr-calculator`, { waitUntil: "load" });

    // Open chat
    await page.locator('button[aria-label="Open AI Chat"]').click();
    await page.waitForTimeout(500);

    // Find the textarea
    const textarea = page.locator("textarea");
    await expect(textarea).toBeVisible({ timeout: 3000 });

    // Type something — send button should enable
    await textarea.fill("What is a good MRR growth rate?");
    const sendButton = page.locator('button[aria-label="Send message"]');
    await expect(sendButton).toBeEnabled();

    // Verify the textarea has the text
    await expect(textarea).toHaveValue("What is a good MRR growth rate?");
  });

  test("sending a message returns a response or graceful error", async ({ page }) => {
    await page.goto(`${BASE}/revenue/mrr-calculator`, { waitUntil: "load" });

    // Open chat
    await page.locator('button[aria-label="Open AI Chat"]').click();
    await page.waitForTimeout(500);

    // Type and send
    const textarea = page.locator("textarea");
    await textarea.fill("What is a good MRR growth rate?");
    await page.locator('button[aria-label="Send message"]').click();

    // Should get either a response or a graceful error
    // The API key is valid, so a real response is expected
    const errorLocator = page.locator(".border-red-200");
    const responseLocator = page.locator("text=based on your").first();
    const anyLocator = page.locator("text=SaaS").first();

    // Wait up to 25s for ANY feedback (response text or error)
    await expect(
      errorLocator.or(responseLocator).or(anyLocator)
    ).toBeVisible({ timeout: 25000 });
  });

  test("chat can be closed and reopened", async ({ page }) => {
    await page.goto(`${BASE}/revenue/mrr-calculator`, { waitUntil: "load" });

    // Open
    await page.locator('button[aria-label="Open AI Chat"]').click();
    await expect(page.locator("text=Ask AI")).toBeVisible({ timeout: 3000 });

    // Close using the X button
    await page.locator('button[aria-label="Close chat"]').click();
    await expect(page.locator("text=Ask AI")).not.toBeVisible({ timeout: 3000 });
  });

  test("Shift+Enter inserts newline instead of sending", async ({ page }) => {
    await page.goto(`${BASE}/revenue/mrr-calculator`, { waitUntil: "load" });

    // Open chat
    await page.locator('button[aria-label="Open AI Chat"]').click();
    await page.waitForTimeout(500);

    const textarea = page.locator("textarea");
    await textarea.focus();
    await textarea.fill("Line one");
    await page.keyboard.press("Shift+Enter");
    await textarea.type("Line two");

    // Should contain a newline
    const value = await textarea.inputValue();
    expect(value).toContain("\n");
  });
});

test.describe("AI Chat Widget — Mobile Responsive", () => {
  test("chat panel is within viewport on mobile (375px)", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(`${BASE}/revenue/mrr-calculator`, { waitUntil: "load" });

    // Open chat
    await page.locator('button[aria-label="Open AI Chat"]').click();
    await page.waitForTimeout(500);

    // The panel should be visible (not clipped)
    const panel = page.locator("text=Ask AI");
    await expect(panel).toBeVisible();

    // The panel width should not exceed viewport width
    const box = await panel.boundingBox();
    if (box) {
      expect(box.width).toBeLessThanOrEqual(375);
      expect(box.x).toBeGreaterThanOrEqual(0);
      expect(box.y).toBeGreaterThanOrEqual(0);
    }
  });

  test("chat button is visible on mobile (375px)", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(`${BASE}/revenue/mrr-calculator`, { waitUntil: "load" });
    const button = page.locator('button[aria-label="Open AI Chat"]');
    await expect(button).toBeVisible();
  });
});
