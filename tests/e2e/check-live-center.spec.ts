import { test } from "@playwright/test";

test("check live site by-the-numbers centering", async ({ page }) => {
  await page.goto("https://saastainednumbers.com", { waitUntil: "networkidle", timeout: 15000 });

  const data = await page.evaluate(() => {
    // Find the ledger section
    const headings = document.querySelectorAll("h2");
    let section: Element | null = null;
    for (const h of headings) {
      if (h.textContent?.includes("ledger")) {
        section = h.closest("section");
        break;
      }
    }
    if (!section) return { error: "section not found" };

    const cards = section.querySelectorAll(".rounded-2xl");
    const cardData = Array.from(cards).map((c) => {
      const r = c.getBoundingClientRect();
      const align = window.getComputedStyle(c).textAlign;
      return { left: r.left, right: r.right, width: r.width, centerX: r.left + r.width / 2, textAlign: align, html: c.outerHTML.slice(0, 200) };
    });

    const sectionRect = section.getBoundingClientRect();
    const groupLeft = cardData[0]?.left ?? 0;
    const groupRight = cardData[cardData.length - 1]?.right ?? 0;
    const groupCenter = (groupLeft + groupRight) / 2;
    const sectionCenter = sectionRect.left + sectionRect.width / 2;

    // Check parent container
    const parent = cardData[0] ? cardData[0].html.match(/<div[^>]*>/)?.[0] : null;

    return {
      viewportWidth: window.innerWidth,
      sectionLeft: sectionRect.left,
      sectionWidth: sectionRect.width,
      sectionCenter,
      groupLeft,
      groupRight,
      groupCenter,
      offsetPx: Math.abs(groupCenter - sectionCenter),
      cards: cardData,
      parentHtml: parent,
    };
  });

  console.log(JSON.stringify(data, null, 2));

  if (data && !("error" in data)) {
    if (data.offsetPx <= 2) {
      console.log("\n✓ CARDS ARE CENTERED (offset: " + data.offsetPx + "px)");
    } else {
      console.log("\n✗ CARDS ARE NOT CENTERED (offset: " + data.offsetPx + "px)");
    }
    console.log("\nText alignment on cards:", data.cards.map(c => c.textAlign));
  }

  await page.screenshot({ path: "test-results/live-site.png", fullPage: false });
});
