import { test, expect } from "@playwright/test";
import { BASE, MOBILE, toggleDarkMode } from "./helpers";

test.describe("Contact Page - Desktop", () => {
  test("contact page loads with heading", async ({ page }) => {
    await page.goto(`${BASE}/contact`, { waitUntil: "load" });
    const h1 = page.locator("h1");
    await expect(h1).toContainText(/Contact|Contacto/i);
  });

  test("contact page shows 3 mailto links", async ({ page }) => {
    await page.goto(`${BASE}/contact`, { waitUntil: "load" });
    const mailLinks = page.locator('a[href^="mailto:"]');
    const count = await mailLinks.count();
    expect(count).toBeGreaterThanOrEqual(3);
  });

  test("contact form has name, email, subject, message fields", async ({ page }) => {
    await page.goto(`${BASE}/contact`, { waitUntil: "load" });
    await expect(page.locator("#contact-name")).toBeVisible();
    await expect(page.locator("#contact-email")).toBeVisible();
    await expect(page.locator("#contact-subject")).toBeVisible();
    await expect(page.locator("#contact-message")).toBeVisible();
  });

  test("contact form has submit button", async ({ page }) => {
    await page.goto(`${BASE}/contact`, { waitUntil: "load" });
    const submitBtn = page.locator('button[type="submit"]');
    await expect(submitBtn).toBeVisible();
  });

  test("contact form subject has General selected by default", async ({ page }) => {
    await page.goto(`${BASE}/contact`, { waitUntil: "load" });
    await expect(page.locator("#contact-subject")).toHaveValue("general");
  });

  test("contact form submit shows validation errors on empty fields", async ({ page }) => {
    await page.goto(`${BASE}/contact`, { waitUntil: "load" });
    const submitBtn = page.locator('button[type="submit"]');
    await submitBtn.click();
    // After clicking submit with empty fields, the form's enableValidation
    // should show validation messages from the browser
    const nameInput = page.locator("#contact-name");
    const validation = await nameInput.evaluate((el: HTMLInputElement) => el.validationMessage);
    expect(validation.length).toBeGreaterThan(0);
  });
});

test.describe("Contact Page - Mobile", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(MOBILE);
  });

  test("contact form fields visible on mobile", async ({ page }) => {
    await page.goto(`${BASE}/contact`, { waitUntil: "load" });
    await expect(page.locator("#contact-name")).toBeVisible();
    await expect(page.locator("#contact-email")).toBeVisible();
    await expect(page.locator("#contact-message")).toBeVisible();
  });
});

test.describe("Contact Page - Cross-Locale", () => {
  test("Spanish contact page has translated heading", async ({ page }) => {
    await page.goto(`${BASE}/es/contact`, { waitUntil: "load" });
    const h1 = page.locator("h1");
    await expect(h1).toContainText(/Contacto/i);
  });

  test("German contact page loads", async ({ page }) => {
    await page.goto(`${BASE}/de/contact`, { waitUntil: "load" });
    const h1 = page.locator("h1");
    await expect(h1).toBeVisible();
  });
});
