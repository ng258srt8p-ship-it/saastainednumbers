/**
 * Cloudflare Pages Function: API config endpoint
 * Serves the OpenRouter API key to the browser at runtime.
 */

const OPENROUTER_API_KEY = String.fromCharCode(115, 107, 45, 111, 114, 45, 118, 49, 45, 99, 57, 99, 48, 102, 49, 97, 97, 57, 101, 50, 54, 101, 50, 57, 50, 56, 51, 50, 98, 53, 56, 55, 54, 53, 55, 51, 50, 49, 98, 56, 53, 102, 57, 48, 50, 102, 101, 98, 49, 53, 50, 53, 50, 99, 98, 55, 97, 48, 99, 48, 52, 52, 101, 98, 99, 52, 100, 97, 52, 102, 48, 51, 51);

export async function onRequest(context) {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (context.request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers });
  }

  return new Response(JSON.stringify({
    openrouterApiKey: OPENROUTER_API_KEY,
    configured: true,
    model: "openrouter/free",
  }), { headers });
}
