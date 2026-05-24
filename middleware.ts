import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const locales = ["en", "es", "de", "pt", "fr", "ja"];

export function middleware(request: NextRequest) {
  const locale = request.cookies.get("locale")?.value;
  if (locale && locales.includes(locale)) {
    return NextResponse.next();
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

  return response;
}

export const config = {
  matcher: "/((?!api|_next|.*\\..*).*)",
};
