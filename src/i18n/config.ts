export const locales = ["en", "de", "fr", "es", "it", "da", "zh", "ja"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

/** Names shown in the language switcher, written in their own language. */
export const localeNames: Record<Locale, string> = {
  en: "English",
  de: "Deutsch",
  fr: "Français",
  es: "Español",
  it: "Italiano",
  da: "Dansk",
  zh: "中文",
  ja: "日本語",
};

/** BCP 47 tags for <html lang>, hreflang and Open Graph. */
export const localeTags: Record<Locale, string> = {
  en: "en",
  de: "de",
  fr: "fr",
  es: "es",
  it: "it",
  da: "da",
  zh: "zh-Hans",
  ja: "ja",
};

export const ogLocales: Record<Locale, string> = {
  en: "en_GB",
  de: "de_DE",
  fr: "fr_FR",
  es: "es_ES",
  it: "it_IT",
  da: "da_DK",
  zh: "zh_CN",
  ja: "ja_JP",
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
