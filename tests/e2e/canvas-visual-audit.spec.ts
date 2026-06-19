import { test } from "@playwright/test";

const PAGES = [
  { path: "/", file: "homepage" },
  { path: "/canvas", file: "canvas" },
  { path: "/blog", file: "blog" },
  { path: "/pricing", file: "pricing" },
  { path: "/calculators", file: "calculators" },
  { path: "/revenue", file: "category-revenue" },
  { path: "/revenue/mrr-calculator", file: "calculator-mrr" },
  { path: "/revenue/mrr-calculator?embed=1", file: "embed-mrr-queryparam" },
  { path: "/embed/mrr-calculator", file: "embed-mrr-route" },
  { path: "/side-hustle/youtube-ad-revenue-calculator", file: "calculator-youtube" },
  { path: "/about", file: "about" },
  { path: "/ai-cost/chatgpt-api-cost-calculator", file: "calculator-chatgpt" },
];

test.describe.configure({ mode: "serial" });

PAGES.forEach(({ path, file }) => {
  test(`Screenshot: ${file}`, async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(path, { waitUntil: "networkidle" });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: `/tmp/visual-audit/${file}.png`, fullPage: true });
  });
});
