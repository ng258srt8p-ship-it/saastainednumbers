import { test, expect } from "@playwright/test";
import { BASE, addCalculator, getNodeCount, getNodeDataId } from "./canvas-helpers";

test.describe("Canvas Cable Creation Debug", () => {
  test("DEBUG: test canvas:addEdge handler registration", async ({ page }) => {
    const logs: string[] = [];
    page.on('console', msg => logs.push(`[${msg.type()}] ${msg.text()}`));
    
    await page.goto(`${BASE}/canvas?skip-intro=true`);
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.setItem("canvas-skip-intro", "1");
    });
    await page.waitForSelector(".react-flow", { timeout: 15000 });

    // Add 2 nodes
    await addCalculator(page, "mrr-calculator");
    await addCalculator(page, "mrr-calculator");
    expect(await getNodeCount(page)).toBe(2);

    const calc1Id = await getNodeDataId(page, 0);
    const calc2Id = await getNodeDataId(page, 1);

    // Wait for everything to settle
    await page.waitForTimeout(2000);

    // Now dispatch canvas:addEdge and ALSO check React state
    const result = await page.evaluate(({ s, t }) => {
      const debug: Record<string, any> = {};
      
      // Check if our handler is registered
      debug.beforeDispatch = new Date().toISOString();
      
      // Register a capturing listener to confirm the event propagates
      let capturedEvent: any = null;
      const capture = (e: Event) => { capturedEvent = (e as CustomEvent).detail; };
      window.addEventListener("canvas:addEdge", capture);
      
      // Dispatch
      window.dispatchEvent(new CustomEvent("canvas:addEdge", {
        detail: { source: s, target: t, sourceHandle: "output-mrr", targetHandle: "input-master-1" },
      }));
      
      debug.captured = capturedEvent;
      
      // Now clean up
      window.removeEventListener("canvas:addEdge", capture);
      
      return debug;
    }, { s: calc1Id!, t: calc2Id! });
    
    console.log("Event dispatch result:", JSON.stringify(result));
    console.log("Browser logs:", logs);

    // Also check edge count
    const edgeCount1 = await page.locator(".react-flow__edge, .react-flow__edge-path").count();
    console.log("Edge count:", edgeCount1);

    // Also check if the nodes are still visible
    await expect(page.locator(`[data-id="${calc1Id}"]`)).toBeVisible();
    await expect(page.locator(`[data-id="${calc2Id}"]`)).toBeVisible();
  });
});
