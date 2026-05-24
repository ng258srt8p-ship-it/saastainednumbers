import { test } from "@playwright/test";
import path from "path";

test("check by-the-numbers section centering", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });

  // Get the 3 stat cards
  const cardData = await page.evaluate(() => {
    const allSections = document.querySelectorAll("section");
    let targetSection: Element | null = null;
    for (const s of allSections) {
      if (s.textContent?.includes("calculators in catalog")) {
        targetSection = s;
        break;
      }
    }
    if (!targetSection) return null;

    const sectionRect = targetSection.getBoundingClientRect();
    const cards = targetSection.querySelectorAll(".rounded-2xl");
    const cardRects = Array.from(cards).map((c) => {
      const r = c.getBoundingClientRect();
      return {
        left: r.left,
        right: r.right,
        width: r.width,
        centerX: r.left + r.width / 2,
      };
    });

    return {
      sectionWidth: sectionRect.width,
      sectionLeft: sectionRect.left,
      sectionCenter: sectionRect.left + sectionRect.width / 2,
      viewportWidth: window.innerWidth,
      cards: cardRects,
    };
  });

  console.log("Card layout data:", JSON.stringify(cardData, null, 2));

  if (cardData) {
    // The group center is the midpoint between first card left and last card right
    const groupLeft = cardData.cards[0].left;
    const groupRight = cardData.cards[cardData.cards.length - 1].right;
    const groupCenter = (groupLeft + groupRight) / 2;

    console.log(`Group center: ${groupCenter}`);
    console.log(`Section center: ${cardData.sectionCenter}`);
    console.log(`Offset from center: ${Math.abs(groupCenter - cardData.sectionCenter)}px`);
  }

  await page.screenshot({ path: "test-results/by-the-numbers.png", fullPage: false });
});
