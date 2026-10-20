import { attractions as enAttractions } from "./attractions";
import { destinations as enDestinations } from "./destinations";
import { journeys as enJourneys } from "./journeys";
import { imageEntries } from "./images";
import { ui as enUi } from "./ui";
import { locales, defaultLocale, type Locale } from "@/i18n/config";

import de from "./locales/de.json";
import fr from "./locales/fr.json";
import es from "./locales/es.json";
import it from "./locales/it.json";
import da from "./locales/da.json";
import zh from "./locales/zh.json";
import ja from "./locales/ja.json";

// Translation model
// ─────────────────
// English content in this folder is the source of truth. Every translatable
// string gets a stable key built from its path, using an item's `id` or `slug`
// instead of its array position (e.g. "attractions.karnak.summary").
// A locale file is a flat map of those keys to translated strings.
// `npm run i18n:check` lists missing or stale keys; a locale is only offered
// in the language switcher, sitemap and hreflang once it covers every key.

type Dict = Record<string, string>;
type LocaleFile = Dict & { _meta?: never };

/** Fields that hold ids, slugs, file names or flags rather than copy. */
const SKIP = new Set([
  "id", "slug", "image", "heroImage", "cardImage", "group", "destination",
  "destinations", "interests", "days", "excursion", "attractions", "optional",
  "commons", "from", "rejected", "focus", "motif", "tone",
]);

const imageCopy = imageEntries.map((e) => ({ id: e.id, subject: e.subject, alt: e.alt }));

const source = {
  ui: enUi,
  destinations: enDestinations,
  attractions: enAttractions,
  journeys: enJourneys,
  images: imageCopy,
};

type Source = typeof source;

function segment(item: unknown, index: number) {
  if (item && typeof item === "object") {
    const rec = item as Record<string, unknown>;
    if (typeof rec.id === "string") return rec.id;
    if (typeof rec.slug === "string") return rec.slug;
  }
  return String(index);
}

function walk(value: unknown, path: string, visit: (path: string, value: string) => string | undefined): unknown {
  if (typeof value === "string") return visit(path, value) ?? value;
  if (Array.isArray(value)) return value.map((item, i) => walk(item, `${path}.${segment(item, i)}`, visit));
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) {
      // Field names such as `destinations` are ids in data records but copy under `ui`.
      const isData = path !== "" && path !== "ui" && !path.startsWith("ui.");
      out[k] = isData && SKIP.has(k) ? v : walk(v, path ? `${path}.${k}` : k, visit);
    }
    return out;
  }
  return value;
}

/** Flat map of every translatable English string, keyed by path. */
export function sourceStrings(): Dict {
  const dict: Dict = {};
  walk(source, "", (path, value) => {
    dict[path] = value;
    return undefined;
  });
  return dict;
}

const files: Record<Exclude<Locale, "en">, LocaleFile> = {
  de: de as LocaleFile,
  fr: fr as LocaleFile,
  es: es as LocaleFile,
  it: it as LocaleFile,
  da: da as LocaleFile,
  zh: zh as LocaleFile,
  ja: ja as LocaleFile,
};

const englishKeys = Object.keys(sourceStrings());

export function missingKeys(locale: Locale): string[] {
  if (locale === "en") return [];
  const file = files[locale];
  return englishKeys.filter((k) => typeof file[k] !== "string" || file[k].trim() === "");
}

/** Locales with a complete translation. Only these are routed and offered. */
export const availableLocales: Locale[] = locales.filter((l) => missingKeys(l).length === 0);

const cache = new Map<Locale, Source>();

export function getContent(locale: Locale): Source {
  const cached = cache.get(locale);
  if (cached) return cached;
  let content: Source = source;
  if (locale !== defaultLocale) {
    const dict = files[locale as Exclude<Locale, "en">];
    content = walk(source, "", (path) => dict[path]) as Source;
  }
  cache.set(locale, content);
  return content;
}

export type SiteContent = Source;
export type Dictionary = Source["ui"];

/** Replace {placeholders} in a translated template. */
export function fmt(template: string, values: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (_, key) => String(values[key] ?? `{${key}}`));
}
