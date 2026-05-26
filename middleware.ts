import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();
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
