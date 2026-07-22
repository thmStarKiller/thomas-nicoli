import { NextResponse } from "next/server";
import { locales, negotiateLocale } from "@/i18n/config";

/**
 * Locale redirect (Next 16 `proxy` convention — formerly `middleware`).
 * Any request path not already prefixed with a supported locale is
 * redirected to the best-matching locale from Accept-Language.
 */
export function proxy(request: Request) {
  const url = new URL(request.url);
  const { pathname } = url;

  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );
  if (pathnameHasLocale) return NextResponse.next();

  const locale = negotiateLocale(request.headers.get("accept-language"));
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    // Skip internals, metadata routes and anything with a file extension.
    "/((?!_next/static|_next/image|_next/data|sitemap.xml|robots.txt|favicon.ico|.*\\..*).*)",
  ],
};
