import type { Metadata } from "next";
import { availableLocales, getContent } from "@/content";
import { defaultLocale, localeTags, ogLocales, type Locale } from "@/i18n/config";
import { contactDetails, siteUrl } from "./site";
import { getImage } from "@/content/images";
import type { Destination, Journey } from "@/content/types";
import { attractions } from "@/content/attractions";

/** Canonical, hreflang alternates and social metadata for one page. */
export function pageMetadata({
  locale,
  path,
  title,
  description,
  image,
}: {
  locale: Locale;
  path: string;
  title?: string;
  description: string;
  image?: string;
}): Metadata {
  const suffix = path === "/" ? "" : path;
  const languages: Record<string, string> = {};
  for (const l of availableLocales) languages[localeTags[l]] = `${siteUrl}/${l}${suffix}`;
  languages["x-default"] = `${siteUrl}/${defaultLocale}${suffix}`;
  const photo = image ? getImage(image).photo : undefined;
  return {
    title,
    description,
    alternates: { canonical: `${siteUrl}/${locale}${suffix}`, languages },
    openGraph: {
      title: title ?? undefined,
      description,
      url: `${siteUrl}/${locale}${suffix}`,
      locale: ogLocales[locale],
      ...(photo ? { images: [{ url: photo.src, width: photo.width, height: photo.height }] } : {}),
    },
  };
}

export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}

/** Organisation data limited to facts that exist: no address, ratings or offers. */
export function organizationLd(locale: Locale) {
  const c = contactDetails();
  const contactPoint =
    c.email || c.phone
      ? [{ "@type": "ContactPoint", contactType: "customer service", ...(c.email ? { email: c.email } : {}), ...(c.phone ? { telephone: c.phone } : {}) }]
      : undefined;
  return {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "@id": `${siteUrl}/#organization`,
    name: "Syaha Tour",
    url: `${siteUrl}/${locale}`,
    description: getContent(locale).ui.meta.siteDescription,
    areaServed: { "@type": "Country", name: "Egypt" },
    ...(contactPoint ? { contactPoint } : {}),
  };
}

export function breadcrumbLd(items: { name: string; path: string }[], locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${siteUrl}/${locale}${item.path === "/" ? "" : item.path}`,
    })),
  };
}

export function destinationLd(d: Destination, locale: Locale) {
  const list = getContent(locale).attractions.filter((a) => a.destination === d.slug);
  return {
    "@context": "https://schema.org",
    "@type": "TouristDestination",
    name: d.name,
    description: d.intro[0],
    url: `${siteUrl}/${locale}/destinations/${d.slug}`,
    containedInPlace: { "@type": "Country", name: "Egypt" },
    includesAttraction: list.map((a) => ({ "@type": "TouristAttraction", name: a.name, description: a.summary })),
  };
}

/** A suggested trip: itinerary only, never prices, availability or offers. */
export function journeyLd(j: Journey, locale: Locale) {
  const names = getContent(locale).attractions;
  return {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: j.title,
    description: j.summary,
    url: `${siteUrl}/${locale}/journeys/${j.slug}`,
    provider: { "@id": `${siteUrl}/#organization` },
    itinerary: {
      "@type": "ItemList",
      itemListElement: j.attractions
        .filter((id) => attractions.some((a) => a.id === id))
        .map((id, i) => ({
          "@type": "ListItem",
          position: i + 1,
          item: { "@type": "TouristAttraction", name: names.find((a) => a.id === id)?.name },
        })),
    },
  };
}
