/**
 * GA4 Admin Panel Config Helper
 *
 * Run: npx playwright test tests/e2e/ga4-admin-setup.spec.ts --headed
 *
 * This opens the Google Analytics admin panel and guides through:
 * 1. Verifying the data stream is correct (G-BHDH2PETBK)
 * 2. Marking custom events as conversions
 * 3. Configuring event tracking settings
 *
 * IMPORTANT: You must be logged into Google in the browser that opens.
 * Playwright will use your local Chrome profile if available.
 */

import { test } from "@playwright/test";

const GA_ADMIN_URL =
  "https://analytics.google.com/analytics/web/#/a396022171p539251423/admin";

test("GA4 admin config — user-assisted setup", async ({ page }) => {
  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("  GA4 Admin Config Helper");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
  console.log("STEP 1: Log into Google Analytics");
  console.log("  URL: " + GA_ADMIN_URL);
  console.log("  Sign in with your Google account when prompted.\n");

  await page.goto(GA_ADMIN_URL, { waitUntil: "networkidle" });

  console.log("  Waiting for you to log in and reach the admin panel...");
  console.log("  (You have 60 seconds to complete sign-in)\n");

  // Wait for the user to log in and land on the admin page
  await page.waitForURL("**/analytics/web/**", { timeout: 120000 });

  console.log("  ✓ Logged in.\n");
  console.log("STEP 2: Verify the data stream");
  console.log("  In the admin panel, verify:");
  console.log("  - Property ID: 396022171");
  console.log("  - Measurement ID: G-BHDH2PETBK");
  console.log("  - Data Stream ID: 539251423\n");

  console.log("STEP 3: Navigate to Events → Conversions");
  console.log("  Go to: Admin → Property → Events");
  console.log("  Mark these events as conversions:");
  console.log("    1. calculate_tool  — core engagement signal");
  console.log("    2. share_tool      — viral loop indicator");
  console.log("    3. affiliate_click — revenue tracking");
  console.log("    4. feedback        — user sentiment signal");
  console.log("    5. embed_generate  — distribution signal\n");

  console.log("STEP 4: Configure conversion events");
  console.log("  Click 'Conversions' → 'New conversion event'");
  console.log("  Add each event name from STEP 3 one at a time.\n");

  console.log("STEP 5: Check stream settings");
  console.log("  Go to: Admin → Property → Data Streams → Web stream");
  console.log("  Verify the stream URL matches your domain.");
  console.log("  Recommendation: set session timeout to 30 minutes");
  console.log("  (default is 30 minutes, which is fine for this site)\n");

  console.log("STEP 6: (Optional) Configure referral exclusions");
  console.log("  Go to: Admin → Property → Data Streams → Web stream");
  console.log("  → Configure tag settings → Show all → List unwanted referrals");
  console.log("  Add: saastainednumbers.com");
  console.log("  This prevents internal navigation from counting as referrals.\n");

  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("  Configuration complete.");
  console.log("  Events will appear in GA4 reports ~24h after they fire.");
  console.log("  Check: Reports → Engagement → Events");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  // Wait so the user can follow along
  await page.waitForTimeout(30000);
});
