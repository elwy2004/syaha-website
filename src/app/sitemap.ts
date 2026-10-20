import type { MetadataRoute } from "next";
import { availableLocales } from "@/content";
import { destinations } from "@/content/destinations";
import { journeys } from "@/content/journeys";
import { stays } from "@/content/stays";
import { localeTags } from "@/i18n/config";
import { routes } from "@/lib/paths";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "",
    routes.destinations,
    ...destinations.map((d) => routes.destination(d.slug)),
    routes.experiences,
    routes.journeys,
    ...journeys.map((j) => routes.journey(j.slug)),
    routes.stays,
    ...stays.map((s) => routes.stay(s.slug)),
    routes.plan,
    routes.contact,
    routes.credits,
  ];
  return paths.flatMap((path) =>
    availableLocales.map((locale) => ({
      url: `${siteUrl}/${locale}${path}`,
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1 : path.startsWith("/destinations") || path.startsWith("/journeys") ? 0.8 : 0.5,
      alternates: {
        languages: Object.fromEntries(availableLocales.map((l) => [localeTags[l], `${siteUrl}/${l}${path}`])),
      },
    })),
  );
}
