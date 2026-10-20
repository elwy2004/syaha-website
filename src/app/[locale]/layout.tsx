import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { notFound } from "next/navigation";
import "../globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { availableLocales, getContent } from "@/content";
import { isLocale, localeNames, localeTags, ogLocales, type Locale } from "@/i18n/config";
import { siteUrl } from "@/lib/site";
import { JsonLd, organizationLd } from "@/lib/seo";

const display = Cormorant_Garamond({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const sans = Manrope({
  subsets: ["latin", "latin-ext"],
  variable: "--font-manrope",
  display: "swap",
});

export const dynamicParams = false;

export function generateStaticParams() {
  return availableLocales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: "#123F43",
  width: "device-width",
  initialScale: 1,
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const { ui } = getContent(locale);
  return {
    metadataBase: new URL(siteUrl),
    title: { default: ui.meta.siteTitle, template: "%s | Syaha Tour" },
    description: ui.meta.siteDescription,
    applicationName: "Syaha Tour",
    openGraph: {
      type: "website",
      siteName: "Syaha Tour",
      locale: ogLocales[locale],
      title: ui.meta.siteTitle,
      description: ui.meta.siteDescription,
    },
    twitter: { card: "summary_large_image" },
    formatDetection: { telephone: false, email: false, address: false },
  };
}

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale) || !availableLocales.includes(locale)) notFound();
  const { ui, destinations } = getContent(locale as Locale);

  return (
    <html lang={localeTags[locale]} className={`${display.variable} ${sans.variable}`}>
      <body className="min-h-dvh">
        <a
          href="#main"
          className="fixed left-4 top-4 z-[100] -translate-y-24 rounded-full bg-nile px-5 py-3 text-sm font-semibold text-ivory transition-transform focus:translate-y-0"
        >
          {ui.a11y.skip}
        </a>
        <Header
          locale={locale}
          copy={{ nav: ui.nav, a11y: ui.a11y }}
          destinations={destinations.map((d) => ({ slug: d.slug, name: d.name, tagline: d.tagline }))}
          locales={availableLocales.map((code) => ({ code, name: localeNames[code] }))}
        />
        <main id="main" tabIndex={-1} className="outline-none">
          {children}
        </main>
        <Footer locale={locale} />
        <Reveal />
        <JsonLd data={organizationLd(locale)} />
      </body>
    </html>
  );
}
