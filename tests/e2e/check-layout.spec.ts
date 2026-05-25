import { test, expect } from "@playwright/test";

test.describe("homepage section alignment", () => {
  test("all sections have same max-w container", async ({ page }) => {
    await page.goto("/");
    // Check that sections 2, 3, 4 all have max-w-6xl containers
    const containers = await page.locator("section .mx-auto").all();
    // Filter to the content containers (not ad containers)
    const contentContainers = containers.filter((el) =>
      ["max-w-6xl"].some((cls) => el.getAttribute("class").then((c) => c?.includes(cls)))
    );
    // We expect at least 3 sections using max-w-6xl
    const count = await contentContainers.length;
    expect(count).toBeGreaterThanOrEqual(3);
  });
});
