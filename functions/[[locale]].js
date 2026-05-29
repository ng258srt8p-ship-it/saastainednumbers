const LOCALES = ["en", "es", "de", "pt", "fr", "ja"];

export async function onRequest(context) {
  const { request, next } = context;
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

  const first = pathname.split("/").filter(Boolean)[0];

  // Locale-prefixed URLs: serve the pre-built static file directly (already at this path)
  // and set the locale cookie for client-side detection
  if (first && LOCALES.includes(first)) {
    const response = await context.env.ASSETS.fetch(request);
    const headers = new Headers(response.headers);
    headers.set(
      "Set-Cookie",
      `locale=${first};path=/;max-age=31536000;SameSite=Lax`
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
