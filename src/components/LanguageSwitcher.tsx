"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import type { Locale } from "@/i18n/config";

function swap(pathname: string, to: Locale) {
  const parts = pathname.split("/");
  parts[1] = to;
  return parts.join("/") || `/${to}`;
}

function remember(locale: Locale) {
  document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000; samesite=lax`;
}

export function LanguageSwitcher({
  locale,
  locales,
  label,
  variant = "menu",
}: {
  locale: Locale;
  locales: { code: Locale; name: string }[];
  label: string;
  variant?: "menu" | "list";
}) {
  const pathname = usePathname() ?? `/${locale}`;
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();
  const current = locales.find((l) => l.code === locale);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (variant === "list") {
    return (
      <nav aria-label={label}>
        <ul className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
          {locales.map((l) => (
            <li key={l.code}>
              <Link
                href={swap(pathname, l.code)}
                hrefLang={l.code}
                lang={l.code}
                aria-current={l.code === locale ? "true" : undefined}
                onClick={() => remember(l.code)}
                className={l.code === locale ? "font-semibold text-gold-soft" : "opacity-80 hover:opacity-100"}
              >
                {l.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    );
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        aria-label={`${label}: ${current?.name ?? locale}`}
        onClick={() => setOpen((v) => !v)}
        className="flex h-11 items-center gap-1.5 px-2 text-[0.8rem] font-semibold uppercase tracking-[0.14em]"
      >
        <svg viewBox="0 0 20 20" className="h-4 w-4" aria-hidden="true">
          <circle cx="10" cy="10" r="7.5" fill="none" stroke="currentColor" strokeWidth="1.2" />
          <path d="M2.5 10h15M10 2.5c2.2 2.3 2.2 12.7 0 15M10 2.5c-2.2 2.3-2.2 12.7 0 15" fill="none" stroke="currentColor" strokeWidth="1.2" />
        </svg>
        {locale}
      </button>
      <ul
        id={id}
        hidden={!open}
        className="absolute right-0 top-full mt-2 min-w-44 rounded-sm bg-ivory py-2 text-charcoal shadow-[0_24px_60px_-20px_rgba(18,63,67,0.35)] ring-1 ring-nile/10"
      >
        {locales.map((l) => (
          <li key={l.code}>
            <Link
              href={swap(pathname, l.code)}
              hrefLang={l.code}
              lang={l.code}
              aria-current={l.code === locale ? "true" : undefined}
              onClick={() => {
                remember(l.code);
                setOpen(false);
              }}
              className={`block px-4 py-2 text-sm hover:bg-sand/50 ${l.code === locale ? "font-semibold text-nile" : ""}`}
            >
              {l.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
