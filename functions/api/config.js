/**
 * Cloudflare Pages Function: API config endpoint
 * Serves runtime configuration to the browser.
 * Environment variables set in Cloudflare Pages dashboard
 * (Settings > Environment variables) are available via context.env.
 *
 * Usage:
 *   const config = await fetch("/api/config").then(r => r.json());
 *   const key = config.openrouterApiKey;
 */

export async function onRequest(context) {
  const url = new URL(context.request.url);

  // CORS headers so browser can read this
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (context.request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers });
  }

  const openrouterApiKey = context.env.NEXT_PUBLIC_OPENROUTER_API_KEY || "";
  const hasKey = !!openrouterApiKey;

  return new Response(JSON.stringify({
    openrouterApiKey: hasKey ? openrouterApiKey : null,
    configured: hasKey,
    model: "openrouter/free",
  }), { headers });
}
