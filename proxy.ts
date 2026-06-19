import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const LOCALES = ["en", "es", "de", "pt", "fr", "ja"];
const DEFAULT_LOCALE = "en";

const LOCALE_DEFAULT_CURRENCY: Record<string, string> = {
  en: "USD", es: "EUR", de: "EUR", pt: "EUR", fr: "EUR", ja: "JPY",
};

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
  const response = NextResponse.next();

  const locale = request.cookies.get("locale")?.value ?? detectLocale(request);

  if (!request.cookies.has("locale")) {
    response.cookies.set("locale", locale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
  }

  if (!request.cookies.has("currency")) {
    const defaultCurrency = LOCALE_DEFAULT_CURRENCY[locale] ?? "USD";
    response.cookies.set("currency", defaultCurrency, {
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
  matcher: "/((?!api|_next|.*\\..*).*)",
};
