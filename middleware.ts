import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const locales = ["en", "es", "de", "pt", "fr", "ja"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const locale = request.cookies.get("locale")?.value;

  if (locale && locales.includes(locale)) {
    const response = NextResponse.next();
    addCachingHeaders(response, pathname);
    return response;
  }

  const acceptLang = request.headers.get("accept-language") ?? "";
  const preferred = acceptLang
    .split(",")
    .map((l) => l.split(";")[0].trim().slice(0, 2))
    .find((l) => locales.includes(l));

  const response = NextResponse.next();
  if (preferred) {
    response.cookies.set("locale", preferred, {
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
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
