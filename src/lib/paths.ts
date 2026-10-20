import type { Locale } from "@/i18n/config";

export function href(locale: Locale, path = "") {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return clean === "/" ? `/${locale}` : `/${locale}${clean}`;
}

export const routes = {
  home: "/",
  destinations: "/destinations",
  destination: (slug: string) => `/destinations/${slug}`,
  experiences: "/experiences",
  journeys: "/journeys",
  journey: (slug: string) => `/journeys/${slug}`,
  plan: "/plan-your-trip",
  contact: "/contact",
  credits: "/image-credits",
};

export function planHref(locale: Locale, opts: { destination?: string; journey?: string } = {}) {
  const params = new URLSearchParams();
  if (opts.destination) params.set("destination", opts.destination);
  if (opts.journey) params.set("journey", opts.journey);
  const q = params.toString();
  return href(locale, routes.plan) + (q ? `?${q}` : "");
}
