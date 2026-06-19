import { test, expect } from "@playwright/test";
import fs from "fs";

const RESULTS: string[] = [];
function log(s: string) { RESULTS.push(s); }

const PAGES = [
  { path: "/", label: "Homepage" },
  { path: "/canvas", label: "Canvas page" },
  { path: "/blog", label: "Blog listing" },
  { path: "/pricing", label: "Pricing" },
  { path: "/calculators", label: "All calculators" },
  { path: "/revenue", label: "Category: Revenue" },
  { path: "/revenue/mrr-calculator", label: "Calculator: MRR" },
  { path: "/revenue/mrr-calculator?embed=1", label: "Embed: MRR" },
  { path: "/ai-cost", label: "Category: AI Cost" },
  { path: "/ai-cost/chatgpt-api-cost-calculator", label: "Calculator: ChatGPT API Cost" },
  { path: "/churn-retention", label: "Category: Churn" },
  { path: "/general-business/break-even-calculator", label: "Calculator: Break Even" },
  { path: "/side-hustle/youtube-ad-revenue-calculator", label: "Calculator: YouTube" },
  { path: "/personal-finance/fire-calculator", label: "Calculator: FIRE" },
  { path: "/embed/mrr-calculator", label: "Embed route: MRR" },
];

const RESULTS_FILE = "/tmp/canvas-audit-results.txt";

test.describe.configure({ mode: "serial" });

PAGES.forEach(({ path, label }) => {
  test(`AUDIT: ${label} (${path})`, async ({ page }) => {
    const errs: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errs.push(msg.text().slice(0, 300));
    });
    page.on("pageerror", (err) => errs.push(`PAGE ERROR: ${err.message.slice(0, 300)}`));

    await page.goto(path, { waitUntil: "networkidle" });
    await page.waitForTimeout(3000);
    await page.evaluate(() => new Promise((r) => setTimeout(r, 500)));

    log(`\n=== ${label} (${path}) ===`);

    // Footer
    const footer = page.locator("footer");
    const fc = await footer.count();
    log(`  Footer count: ${fc}`);
    if (fc > 0) {
      const visible = await footer.first().isVisible();
      log(`  Footer visible: ${visible}`);
      const text = (await footer.first().textContent()) || "";
      log(`  Footer text (first 120): ${text.trim().slice(0, 120).replace(/\n/g, " ")}`);
    }

    // Nav
    const nav = page.locator("nav");
    const nc = await nav.count();
    log(`  Nav count: ${nc}`);
    if (nc > 0) {
      const visible = await nav.first().isVisible();
      log(`  Nav visible: ${visible}`);
    }

    // Console errors
    if (errs.length > 0) {
      log(`  Console errors (${errs.length}):`);
      errs.forEach((e) => log(`    ${e}`));
    } else {
      log(`  Console errors: none`);
    }

    // Horizontal overflow
    const bw = await page.evaluate(() => document.body.scrollWidth);
    const vw = await page.evaluate(() => window.innerWidth);
    if (bw > vw + 5) log(`  HORIZONTAL OVERFLOW: body ${bw} > viewport ${vw}`);

    // Page title
    const title = await page.title();
    log(`  Title: ${title}`);

    // Buttons — look for any with empty/incomplete text
    const btns = page.locator("button");
    const bcount = await btns.count();
    for (let i = 0; i < Math.min(bcount, 40); i++) {
      const btn = btns.nth(i);
      const text = (await btn.textContent()) || "";
      const aria = await btn.getAttribute("aria-label");
      const tid = await btn.getAttribute("data-testid");
      if (text.trim() && text.trim().length < 2) {
        log(`  Button[${i}] short text: "${text.trim()}" tid="${tid||""}" aria="${aria||""}"`);
      }
      if (text.trim() && !aria && !tid) {
        // Check if it looks like an icon-only button without label
        const html = await btn.innerHTML();
        if (!html.includes("<span") && !html.includes("<svg") && html.trim().length < 5) {
          log(`  Button[${i}] maybe icon-only no label: "${text.trim()}" ${html.trim().slice(0,80)}`);
        }
      }
    }

    // Check for key React warnings in the page source
    const html = await page.content();
    if (html.includes("Encountered two children with the same key")) {
      log(`  REACT KEY WARNING present in DOM`);
    }

    // Check for NaN in rendered text
    const bodyText = await page.locator("body").textContent() || "";
    if (bodyText.includes("NaN")) {
      // Find where NaN is
      try {
        const naan = page.locator("body").getByText("NaN", { exact: true });
        const nacount = await naan.count();
        log(`  NaN visible in text: ${nacount} occurrences`);
      } catch { log(`  NaN visible in text (failed to locate)`); }
    }
  });
});

test.afterAll(() => {
  fs.writeFileSync(RESULTS_FILE, RESULTS.join("\n"), "utf-8");
  console.log(`Results (${RESULTS.length} lines) written to ${RESULTS_FILE}`);
});
