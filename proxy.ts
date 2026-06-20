import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const LOCALES = ["en", "es", "de", "pt", "fr", "ja"];
const DEFAULT_LOCALE = "en";

const LOCALE_DEFAULT_CURRENCY: Record<string, string> = {
  en: "USD", es: "EUR", de: "EUR", pt: "EUR", fr: "EUR", ja: "JPY",
};

// Paths that should never trigger locale redirect
const SKIP_PATHS = [
  "/api/",
  "/_next/",
  "/favicon",
  "/robots.txt",
  "/sitemap.xml",
  "/ads.txt",
  "/feed.xml",
  "/logo.svg",
  "/apple-touch-icon",
  ".png",
  ".ico",
  ".webp",
  ".jpg",
  ".jpeg",
  ".gif",
  ".svg",
  ".css",
  ".js",
  ".woff",
  ".woff2",
  ".ttf",
  ".eot",
  ".json",
];

function shouldSkip(pathname: string): boolean {
  return SKIP_PATHS.some((prefix) => pathname.startsWith(prefix) || pathname.includes(prefix));
}

function getLocaleFromPath(pathname: string): string | null {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length > 0 && LOCALES.includes(segments[0])) {
    return segments[0];
  }
  return null;
}

function detectLocale(request: NextRequest): string {
  const cookie = request.cookies.get("locale")?.value;
  if (cookie && LOCALES.includes(cookie)) return cookie;

  const acceptLanguage = request.headers.get("Accept-Language") ?? "";
  for (const lang of acceptLanguage.split(",")) {
    const code = lang.split("-")[0]?.split(";")[0]?.trim().toLowerCase();
    if (code && LOCALES.includes(code)) return code;
  }

  return DEFAULT_LOCALE;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // === REDIRECT: /privacy-policy -> /privacy ===
  if (pathname === "/privacy-policy" || pathname.startsWith("/privacy-policy/")) {
    const url = new URL("/privacy", request.url);
    url.search = request.nextUrl.search;
    return NextResponse.redirect(url, 301);
  }

  // Skip non-page paths (static assets, api, etc.)
  if (shouldSkip(pathname)) {
    return NextResponse.next();
  }

  // Skip embed routes (no locale redirect on embeds)
  if (pathname.startsWith("/embed/") || pathname === "/embed") {
    return NextResponse.next();
  }

  const response = NextResponse.next();
  const locale = request.cookies.get("locale")?.value ?? detectLocale(request);

  // Set locale cookie if missing
  if (!request.cookies.has("locale")) {
    response.cookies.set("locale", locale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
  }

  // Set currency cookie if missing
  if (!request.cookies.has("currency")) {
    const defaultCurrency = LOCALE_DEFAULT_CURRENCY[locale] ?? "USD";
    response.cookies.set("currency", defaultCurrency, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
  }

  // === LOCALE REDIRECT: if user prefers non-English and URL has no locale prefix ===
  const pathLocale = getLocaleFromPath(pathname);
  if (!pathLocale && locale !== DEFAULT_LOCALE) {
    const url = new URL(`/${locale}${pathname}`, request.url);
    url.search = request.nextUrl.search;
    const redirectResponse = NextResponse.redirect(url, 302);
    // Preserve cookies on the redirect
    redirectResponse.cookies.set("locale", locale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
    return redirectResponse;
  }

  // If path has a locale prefix, ensure cookie matches
  if (pathLocale && pathLocale !== locale) {
    response.cookies.set("locale", pathLocale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
  }

  addCachingHeaders(response, pathname);
  return response;
}

function addCachingHeaders(response: NextResponse, pathname: string) {
  if (pathname.startsWith("/embed/")) {
    response.headers.set("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=604800");
  } else {
    response.headers.set("Cache-Control", "public, s-maxage=86400, stale-while-revalidate=604800");
  }
}

export const config = {
  matcher: "/((?!api|_next|.*\\\\..*).*)",
};
