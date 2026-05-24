import { NextResponse } from "next/server";

const locales = ["en", "es", "de", "pt", "fr", "ja"];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get("locale");
  const redirectTo = searchParams.get("redirect") || "/";

  if (!locale || !locales.includes(locale)) {
    return NextResponse.redirect(new URL(redirectTo, request.url));
  }

  const response = NextResponse.redirect(new URL(redirectTo, request.url));
  response.cookies.set("locale", locale, {
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
    sameSite: "lax",
  });

  return response;
}
