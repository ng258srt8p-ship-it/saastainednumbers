import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const LOCALES = ["en", "es", "de", "pt", "fr", "ja"];
const DEFAULT_LOCALE = "en";

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

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();

  if (!request.cookies.has("locale")) {
    const locale = detectLocale(request);
    response.cookies.set("locale", locale, {
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
