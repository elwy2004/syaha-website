import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, isLocale } from "@/i18n/config";

// Every page lives under a locale prefix (/en, /de, …). Requests without one
// are redirected to the visitor's saved language, then their browser's
// preferred language, then English. Locales that are
// not fully translated are not generated, so they return 404 rather than
// showing mixed-language pages.

/** First supported locale in an Accept-Language header, by quality. */
function preferredLocale(header: string | null) {
  if (!header) return undefined;
  return header
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().split(";");
      const q = params.find((p) => p.trim().startsWith("q="));
      return { base: tag.toLowerCase().split("-")[0], q: q ? Number(q.trim().slice(2)) || 0 : 1 };
    })
    .filter((l) => l.q > 0)
    .sort((a, b) => b.q - a.q)
    .map((l) => l.base)
    .find(isLocale);
}

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const first = pathname.split("/")[1] ?? "";
  if (isLocale(first)) return NextResponse.next();

  const saved = request.cookies.get("NEXT_LOCALE")?.value;
  const locale =
    (saved && isLocale(saved) ? saved : undefined) ??
    preferredLocale(request.headers.get("accept-language")) ??
    defaultLocale;
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  url.search = search;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!api|_next|images|.*\\..*).*)"],
};
