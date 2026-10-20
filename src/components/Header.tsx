"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { Wordmark } from "./Wordmark";
import { LanguageSwitcher } from "./LanguageSwitcher";
import type { Locale } from "@/i18n/config";

type NavCopy = {
  nav: { destinations: string; allDestinations: string; experiences: string; journeysShort: string; contact: string; plan: string; home: string; journeys: string; stays: string };
  a11y: { openMenu: string; closeMenu: string; mainNav: string; language: string };
};

type DestinationLink = { slug: string; name: string; tagline: string };

const OVERLAY = [/^\/[a-z]{2}\/?$/, /^\/[a-z]{2}\/stay(\/[^/]+)?\/?$/, /^\/[a-z]{2}\/destinations\/[^/]+\/?$/, /^\/[a-z]{2}\/journeys\/[^/]+\/?$/];

export function Header({
  locale,
  copy,
  destinations,
  locales,
}: {
  locale: Locale;
  copy: NavCopy;
  destinations: DestinationLink[];
  locales: { code: Locale; name: string }[];
}) {
  const pathname = usePathname() ?? "";
  const overlay = OVERLAY.some((r) => r.test(pathname));
  const [scrolled, setScrolled] = useState(false);
  const [destOpen, setDestOpen] = useState(false);
  const destRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const panelId = useId();
  const base = `/${locale}`;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menus on navigation.
  useEffect(() => {
    setDestOpen(false);
    dialogRef.current?.close();
  }, [pathname]);

  useEffect(() => {
    if (!destOpen) return;
    const onDown = (e: PointerEvent) => {
      if (!destRef.current?.contains(e.target as Node)) setDestOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setDestOpen(false);
        destRef.current?.querySelector<HTMLButtonElement>("button")?.focus();
      }
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [destOpen]);

  const solid = !overlay || scrolled;
  const isActive = (path: string) => pathname === `${base}${path}` || pathname.startsWith(`${base}${path}/`);

  const linkClass = (path: string) =>
    `link-underline py-1 text-[0.92rem] font-medium ${isActive(path) ? "bg-[length:100%_1px]" : ""}`;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,color] duration-500 ${
        solid ? "bg-ivory/95 text-charcoal shadow-[0_1px_0_rgba(18,63,67,0.08)] backdrop-blur-md" : "bg-transparent text-ivory"
      }`}
    >
      <div className="mx-auto flex h-[4.5rem] max-w-[90rem] items-center justify-between gap-6 px-5 sm:px-8 lg:h-20 lg:px-12">
        <Link href={base} aria-label="Syaha Tour" className="shrink-0">
          <Wordmark tone={solid ? "dark" : "light"} />
        </Link>

        <nav aria-label={copy.a11y.mainNav} className="hidden lg:block">
          <ul className="flex items-center gap-9">
            <li>
              <div ref={destRef} className="relative">
                <button
                  type="button"
                  aria-expanded={destOpen}
                  aria-controls={panelId}
                  onClick={() => setDestOpen((v) => !v)}
                  className={`flex items-center gap-1.5 py-1 text-[0.92rem] font-medium ${isActive("/destinations") ? "underline decoration-gold underline-offset-[6px]" : ""}`}
                >
                  {copy.nav.destinations}
                  <svg viewBox="0 0 12 12" className={`h-3 w-3 transition-transform ${destOpen ? "rotate-180" : ""}`} aria-hidden="true">
                    <path d="M2 4.5 6 8.5 10 4.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </button>
                <div
                  id={panelId}
                  hidden={!destOpen}
                  className="absolute left-1/2 top-full mt-4 w-[34rem] -translate-x-1/2 rounded-sm bg-ivory p-3 text-charcoal shadow-[0_24px_60px_-20px_rgba(18,63,67,0.35)] ring-1 ring-nile/10"
                >
                  <ul className="grid grid-cols-1 gap-1">
                    {destinations.map((d) => (
                      <li key={d.slug}>
                        <Link
                          href={`${base}/destinations/${d.slug}`}
                          className="group flex items-baseline justify-between gap-4 rounded-sm px-4 py-3 hover:bg-sand/50 focus-visible:bg-sand/50"
                        >
                          <span className="font-display text-2xl text-nile">{d.name}</span>
                          <span className="text-right text-xs text-stone">{d.tagline}</span>
                        </Link>
                      </li>
                    ))}
                    <li className="mt-1 border-t border-sand pt-1">
                      <Link href={`${base}/destinations`} className="flex px-4 py-3 text-sm font-semibold text-gold-deep hover:text-nile">
                        {copy.nav.allDestinations} →
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </li>
            <li>
              <Link href={`${base}/experiences`} className={linkClass("/experiences")} aria-current={isActive("/experiences") ? "page" : undefined}>
                {copy.nav.experiences}
              </Link>
            </li>
            <li>
              <Link href={`${base}/journeys`} className={linkClass("/journeys")} aria-current={isActive("/journeys") ? "page" : undefined}>
                {copy.nav.journeysShort}
              </Link>
            </li>
            <li>
              <Link href={`${base}/stay`} className={linkClass("/stay")} aria-current={isActive("/stay") ? "page" : undefined}>
                {copy.nav.stays}
              </Link>
            </li>
            <li>
              <Link href={`${base}/contact`} className={linkClass("/contact")} aria-current={isActive("/contact") ? "page" : undefined}>
                {copy.nav.contact}
              </Link>
            </li>
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          {locales.length > 1 && (
            <div className="hidden lg:block">
              <LanguageSwitcher locale={locale} locales={locales} label={copy.a11y.language} />
            </div>
          )}
          <Link href={`${base}/plan-your-trip`} className={`btn hidden sm:inline-flex ${solid ? "btn-primary" : "btn-gold"}`}>
            {copy.nav.plan}
          </Link>
          <button
            type="button"
            className="-mr-2 flex h-11 w-11 items-center justify-center lg:hidden"
            aria-label={copy.a11y.openMenu}
            aria-haspopup="dialog"
            onClick={() => dialogRef.current?.showModal()}
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
              <path d="M3 7h18M3 12h18M9 17h12" stroke="currentColor" strokeWidth="1.5" fill="none" />
            </svg>
          </button>
        </div>
      </div>

      <dialog
        ref={dialogRef}
        aria-label={copy.a11y.mainNav}
        className="m-0 h-dvh max-h-none w-full max-w-none bg-nile p-0 text-ivory backdrop:bg-nile-deep/60"
      >
        <div className="flex h-full flex-col overflow-y-auto px-6 pb-10">
          <div className="flex h-[4.5rem] items-center justify-between">
            <Link href={base} aria-label="Syaha Tour" onClick={() => dialogRef.current?.close()}>
              <Wordmark tone="light" />
            </Link>
            <button
              type="button"
              autoFocus
              className="-mr-2 flex h-11 w-11 items-center justify-center"
              aria-label={copy.a11y.closeMenu}
              onClick={() => dialogRef.current?.close()}
            >
              <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
                <path d="M5 5l14 14M19 5 5 19" stroke="currentColor" strokeWidth="1.5" fill="none" />
              </svg>
            </button>
          </div>
          <nav aria-label={copy.a11y.mainNav} className="mt-8">
            <p className="eyebrow eyebrow-light">{copy.nav.destinations}</p>
            <ul className="mt-3 space-y-1">
              {destinations.map((d) => (
                <li key={d.slug}>
                  <Link href={`${base}/destinations/${d.slug}`} className="block py-2 font-display text-[2.1rem] leading-tight" onClick={() => dialogRef.current?.close()}>
                    {d.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href={`${base}/destinations`} className="block py-2 text-sm font-semibold text-gold-soft" onClick={() => dialogRef.current?.close()}>
                  {copy.nav.allDestinations} →
                </Link>
              </li>
            </ul>
            <ul className="mt-8 space-y-1 border-t border-ivory/15 pt-6 text-lg">
              {[
                ["/experiences", copy.nav.experiences],
                ["/journeys", copy.nav.journeys],
                ["/stay", copy.nav.stays],
                ["/contact", copy.nav.contact],
              ].map(([path, label]) => (
                <li key={path}>
                  <Link href={`${base}${path}`} className="block py-2.5" onClick={() => dialogRef.current?.close()}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="mt-auto pt-10">
            <Link href={`${base}/plan-your-trip`} className="btn btn-gold w-full" onClick={() => dialogRef.current?.close()}>
              {copy.nav.plan}
            </Link>
            {locales.length > 1 && (
              <div className="mt-6">
                <LanguageSwitcher locale={locale} locales={locales} label={copy.a11y.language} variant="list" />
              </div>
            )}
          </div>
        </div>
      </dialog>
    </header>
  );
}
