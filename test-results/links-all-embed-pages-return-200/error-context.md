# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: links.spec.ts >> all embed pages return 200
- Location: tests/e2e/links.spec.ts:32:5

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.goto: net::ERR_ABORTED; maybe frame was detached?
Call log:
  - navigating to "http://localhost:3000/", waiting until "networkidle"

```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test";
  2  | 
  3  | const BASE = "http://localhost:3000";
  4  | 
  5  | test("all links on homepage return 200", async ({ page }) => {
  6  |   const resp = await page.goto(BASE, { waitUntil: "networkidle" });
  7  |   expect(resp?.status()).toBe(200);
  8  |   const links = await page.locator("a").all();
  9  |   const hrefs = await Promise.all(links.map((l) => l.getAttribute("href")));
  10 |   const unique = [...new Set(hrefs.filter(Boolean) as string[])];
  11 |   for (const href of unique) {
  12 |     if (href.startsWith("/")) {
  13 |       const r = await page.goto(`${BASE}${href}`, { waitUntil: "networkidle" });
  14 |       expect(r?.status()).toBe(200);
  15 |     }
  16 |   }
  17 | });
  18 | 
  19 | test("all calculator pages return 200", async ({ page }) => {
  20 |   const resp = await page.goto(BASE, { waitUntil: "networkidle" });
  21 |   expect(resp?.status()).toBe(200);
  22 |   const calcLinks = page.locator('a[href*="/revenue/"], a[href*="/growth-efficiency/"], a[href*="/churn-retention/"], a[href*="/unit-economics/"]');
  23 |   const hrefs = await calcLinks.evaluateAll((links) =>
  24 |     links.map((l) => (l as HTMLAnchorElement).href)
  25 |   );
  26 |   for (const href of hrefs) {
  27 |     const r = await page.goto(href, { waitUntil: "networkidle" });
  28 |     expect(r?.status()).toBe(200);
  29 |   }
  30 | });
  31 | 
  32 | test("all embed pages return 200", async ({ page }) => {
> 33 |   const resp = await page.goto(BASE, { waitUntil: "networkidle" });
     |                           ^ Error: page.goto: net::ERR_ABORTED; maybe frame was detached?
  34 |   expect(resp?.status()).toBe(200);
  35 |   const embedLinks = page.locator('a[href*="/embed/"]');
  36 |   const hrefs = await embedLinks.evaluateAll((links) =>
  37 |     links.map((l) => (l as HTMLAnchorElement).href)
  38 |   );
  39 |   for (const href of hrefs) {
  40 |     const r = await page.goto(href, { waitUntil: "networkidle" });
  41 |     expect(r?.status()).toBe(200);
  42 |   }
  43 | });
  44 | 
  45 | test("all category pages return 200 (including empty categories)", async ({ page }) => {
  46 |   for (const cat of ["revenue", "unit-economics", "churn-retention", "growth-efficiency"]) {
  47 |     const r = await page.goto(`${BASE}/${cat}`, { waitUntil: "networkidle" });
  48 |     expect(r?.status()).toBe(200);
  49 |   }
  50 | });
  51 | 
  52 | test("static pages return 200", async ({ page }) => {
  53 |   for (const path of ["/blog", "/dashboard", "/prelaunch", "/request-calculator"]) {
  54 |     const r = await page.goto(`${BASE}${path}`, { waitUntil: "networkidle" });
  55 |     expect(r?.status()).toBe(200);
  56 |   }
  57 | });
  58 | 
  59 | test("unknown calculator slug shows not-found content", async ({ page }) => {
  60 |   await page.goto(`${BASE}/revenue/nonexistent-calc`, { waitUntil: "networkidle" });
  61 |   await expect(page.locator("text=Calculator Not Found")).toBeVisible();
  62 | });
  63 | 
```