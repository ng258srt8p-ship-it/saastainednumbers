import { chromium } from "@playwright/test";

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  await page.goto("https://saastainednumbers.com", { waitUntil: "networkidle" });
  await page.screenshot({ path: "live-check-full.png", fullPage: true });

  // Check section 3 container class
  const sections = await page.locator("section").all();
  for (let i = 0; i < sections.length; i++) {
    const html = await sections[i].innerHTML();
    const match = html.match(/mx-auto max-w-\[?[a-z0-9-]+\]?/);
    console.log(`Section ${i + 1}:`, match?.[0] ?? "no max-w found");
  }

  await browser.close();
}

main();
