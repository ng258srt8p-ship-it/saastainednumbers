import { test } from "@playwright/test";

test("sidekick ad logo size check", async ({ page }) => {
  await page.goto("http://localhost:3000/revenue/mrr-calculator", { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);
  const logo = page.locator("aside svg[aria-label='Shopify']");
  const box = await logo.boundingBox();
  console.log("\n=== Current Shopify logo size ===");
  console.log(JSON.stringify({ width: box?.width, height: box?.height }, null, 2));
  await page.screenshot({ path: "tests/sidekick-ad.png", fullPage: true });
});
