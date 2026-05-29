const LOCALES = ["en", "es", "de", "pt", "fr", "ja"];

export async function onRequest(context) {
  const { request, next, env } = context;
  const url = new URL(request.url);
  const { pathname } = url;

  // Skip API routes, embed routes, and static assets
  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/embed/") ||
    /\.(js|css|png|jpg|jpeg|svg|ico|webp|woff2?|json|xml|txt)$/i.test(pathname)
  ) {
    return next();
  }

  const parts = pathname.split("/").filter(Boolean);
  const first = parts[0];

  // If path starts with a known locale, strip prefix and set cookie
  if (first && LOCALES.includes(first)) {
    const locale = first;
    const restPath = "/" + parts.slice(1).join("/");

    // Fetch static file from the unprefixed path
    const assetUrl = new URL(restPath, url.origin);
    const response = await env.ASSETS.fetch(assetUrl);

    const headers = new Headers(response.headers);
    headers.set(
      "Set-Cookie",
      `locale=${locale};path=/;max-age=31536000;SameSite=Lax`
    );

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  }

  // No locale prefix — serve as-is
  return next();
}
