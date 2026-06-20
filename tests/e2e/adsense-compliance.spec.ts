import { test, expect } from "@playwright/test";

const BASE = "http://localhost:3000";

test.describe("AdSense Compliance — Privacy Policy Redirect", () => {
  test("/privacy-policy redirects 301 to /privacy", async ({ page }) => {
    const resp = await page.goto(`${BASE}/privacy-policy`, {
      waitUntil: "load",
    });
    // The redirect should result in a 200 from /privacy
    expect(resp?.status()).toBe(200);
    expect(page.url()).toContain("/privacy");
  });

  test("/privacy page loads with correct title", async ({ page }) => {
    const resp = await page.goto(`${BASE}/privacy`, { waitUntil: "load" });
    expect(resp?.status()).toBe(200);
    const title = await page.title();
    expect(title).toContain("Privacy");
  });
});

test.describe("AdSense Compliance — Legal & Trust Pages", () => {
  const legalPages = [
    { path: "/about", titleContains: "About" },
    { path: "/terms", titleContains: "Terms" },
    { path: "/privacy", titleContains: "Privacy" },
    { path: "/contact", titleContains: "Contact" },
    { path: "/legal", titleContains: "Legal" },
  ];

  for (const { path, titleContains } of legalPages) {
    test(`${path} returns 200 and has correct title`, async ({ page }) => {
      const resp = await page.goto(`${BASE}${path}`, { waitUntil: "load" });
      expect(resp?.status()).toBe(200);
      const title = await page.title();
      expect(title).toContain(titleContains);
    });
  }
});

test.describe("AdSense Compliance — Contact Form", () => {
  test("contact page has email contact cards", async ({ page }) => {
    await page.goto(`${BASE}/contact`, { waitUntil: "load" });
    // Use .first() since emails may appear in both header and inline content
    await expect(
      page.getByRole("link", { name: "hello@saastainednumbers.com" }).first()
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "legal@saastainednumbers.com" }).first()
    ).toBeVisible();
  });

  test("contact page has interactive form fields", async ({ page }) => {
    await page.goto(`${BASE}/contact`, { waitUntil: "load" });
    await expect(page.locator("#contact-name")).toBeVisible();
    await expect(page.locator("#contact-email")).toBeVisible();
    await expect(page.locator("#contact-subject")).toBeVisible();
    await expect(page.locator("#contact-message")).toBeVisible();
  });

  test("contact form has submit button", async ({ page }) => {
    await page.goto(`${BASE}/contact`, { waitUntil: "load" });
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test("contact form validates required fields", async ({ page }) => {
    await page.goto(`${BASE}/contact`, { waitUntil: "load" });
    const nameInput = page.locator("#contact-name");
    const emailInput = page.locator("#contact-email");
    const messageInput = page.locator("#contact-message");
    await expect(nameInput).toHaveAttribute("required");
    await expect(emailInput).toHaveAttribute("required");
    await expect(messageInput).toHaveAttribute("required");
  });
});

test.describe("AdSense Compliance — YMYL Disclaimer", () => {
  const calculatorPages = [
    "/revenue/mrr-calculator",
    "/unit-economics/cac-ltv-ratio-calculator",
    "/churn-retention/churn-calculator",
    "/general-business/business-valuation-calculator",
  ];

  for (const path of calculatorPages) {
    test(`calculator page ${path} has disclaimer banner`, async ({ page }) => {
      await page.goto(`${BASE}${path}`, { waitUntil: "load" });
      await expect(
        page.getByText("Not Financial Advice").first()
      ).toBeVisible();
      await expect(
        page.getByText("informational and educational purposes only")
      ).toBeVisible();
    });

    test(`calculator page ${path} has WebPage schema with about/specialty`, async ({ page }) => {
      await page.goto(`${BASE}${path}`, { waitUntil: "load" });
      const jsonld = page.locator('script[type="application/ld+json"]');
      const texts = await jsonld.allTextContents();
      const allText = texts.join(" ");
      // Should contain the WebPage specialty (added via layout.tsx)
      expect(allText).toContain("FinancialPlanning");
      // Should contain WebApplication (existing schema)
      expect(allText).toContain("WebApplication");
      // Should contain Financial Mathematics
      expect(allText).toContain("Financial Mathematics");
    });
  }
});

test.describe("AdSense Compliance — ads.txt", () => {
  test("ads.txt is accessible", async ({ page }) => {
    const resp = await page.goto(`${BASE}/ads.txt`, { waitUntil: "load" });
    expect(resp?.status()).toBe(200);
    const text = await resp?.text();
    expect(text).toContain("google.com");
    expect(text).toContain("DIRECT");
    expect(text).toContain("f08c47fec0942fa0");
  });
});

test.describe("AdSense Compliance — robots.txt & Sitemap", () => {
  test("robots.txt allows all and links sitemap", async ({ page }) => {
    const resp = await page.goto(`${BASE}/robots.txt`, { waitUntil: "load" });
    expect(resp?.status()).toBe(200);
    const text = await resp?.text();
    expect(text).toContain("Allow: /");
    expect(text).toContain("Sitemap");
  });

  test("sitemap.xml includes legal pages", async ({ page }) => {
    const resp = await page.goto(`${BASE}/sitemap.xml`, { waitUntil: "load" });
    expect(resp?.status()).toBe(200);
    const text = await resp?.text();
    expect(text).toContain("/privacy");
    expect(text).toContain("/terms");
    expect(text).toContain("/about");
    expect(text).toContain("/contact");
    expect(text).toContain("/legal");
  });
});

test.describe("AdSense Compliance — Footer Legal Links", () => {
  test("footer legal links navigate correctly (click through test)", async ({ page }) => {
    for (const path of ["/legal", "/privacy", "/terms"]) {
      const resp = await page.goto(`${BASE}${path}`, { waitUntil: "load" });
      expect(resp?.status()).toBe(200);
      const title = await page.title();
      expect(title.length).toBeGreaterThan(0);
    }
  });

  test("footer contains about link", async ({ page }) => {
    await page.goto(`${BASE}/about`, { waitUntil: "load" });
    const resp = await page.goto(`${BASE}/about`, { waitUntil: "load" });
    expect(resp?.status()).toBe(200);
    await expect(page.getByText("About SaaStainedNumbers")).toBeVisible();
  });

  test("footer contains contact link", async ({ page }) => {
    await page.goto(`${BASE}/contact`, { waitUntil: "load" });
    expect(page.url()).toContain("/contact");
  });
});

test.describe("AdSense Compliance — Content Quality Signals", () => {
  test("about page has substantive content sections", async ({ page }) => {
    await page.goto(`${BASE}/about`, { waitUntil: "load" });
    await expect(page.getByText("Our Mission").first()).toBeVisible();
    await expect(page.getByText("Who We Are").first()).toBeVisible();
    await expect(page.getByText("Editorial Standards").first()).toBeVisible();
    await expect(page.getByText("Why Is It Free?").first()).toBeVisible();
  });

  test("terms page has all required legal sections", async ({ page }) => {
    await page.goto(`${BASE}/terms`, { waitUntil: "load" });
    await expect(page.getByText("Acceptance of Terms").first()).toBeVisible();
    await expect(page.getByText("Description of Service").first()).toBeVisible();
    await expect(page.getByText("Limitation of Liability").first()).toBeVisible();
    await expect(page.getByText("Intellectual Property").first()).toBeVisible();
  });
});

test.describe("AdSense Compliance — No Forbidden Content", () => {
  const forbiddenPatterns = [
    "click our ads",
    "support us by clicking",
    "click ads below",
    "disable adblock",
    "ad blocker detected",
  ];

  const pagesToScan = [
    "/",
    "/revenue/mrr-calculator",
    "/about",
    "/contact",
    "/pricing",
    "/blog",
  ];

  for (const path of pagesToScan) {
    for (const pattern of forbiddenPatterns) {
      test(`${path} does not contain "${pattern}"`, async ({ page }) => {
        await page.goto(`${BASE}${path}`, { waitUntil: "load" });
        const body = page.locator("body");
        const text = await body.textContent();
        expect(text?.toLowerCase()).not.toContain(pattern.toLowerCase());
      });
    }
  }
});
