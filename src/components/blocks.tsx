import Link from "next/link";
import type { ReactNode } from "react";
import { Photo } from "./Photo";
import type { Locale } from "@/i18n/config";
import type { Journey } from "@/content/types";
import { getContent } from "@/content";
import { href, planHref, routes } from "@/lib/paths";

export function SectionHeading({
  eyebrow,
  title,
  body,
  align = "left",
  light = false,
  as: Tag = "h2",
  id,
}: {
  eyebrow?: string;
  title: string;
  body?: ReactNode;
  align?: "left" | "center";
  light?: boolean;
  as?: "h1" | "h2";
  id?: string;
}) {
  return (
    <div className={`${align === "center" ? "mx-auto text-center" : ""} max-w-3xl`} data-reveal>
      {eyebrow && <p className={`eyebrow ${light ? "eyebrow-light" : ""}`}>{eyebrow}</p>}
      <Tag
        id={id}
        className={`mt-4 font-display text-[2.4rem] leading-[1.05] font-medium tracking-[-0.01em] text-balance sm:text-5xl lg:text-[3.6rem] ${light ? "text-ivory" : "text-nile"}`}
      >
        {title}
      </Tag>
      {body && <div className={`mt-5 text-lg leading-relaxed text-pretty ${light ? "text-ivory/80" : "text-stone"}`}>{body}</div>}
    </div>
  );
}

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[90rem] px-5 sm:px-8 lg:px-12 ${className}`}>{children}</div>;
}

export function Breadcrumbs({ items, label, light = false }: { items: { name: string; href?: string }[]; label: string; light?: boolean }) {
  return (
    <nav aria-label={label} className={`text-xs tracking-wide ${light ? "text-ivory/75" : "text-stone"}`}>
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-2">
            {i > 0 && <span aria-hidden="true">/</span>}
            {item.href ? (
              <Link href={item.href} className="link-underline">
                {item.name}
              </Link>
            ) : (
              <span aria-current="page">{item.name}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/** Large photographic page hero with a restrained overlay for contrast. */
export function PageHero({
  locale,
  image,
  eyebrow,
  title,
  lead,
  children,
  breadcrumbs,
  tall = false,
}: {
  locale: Locale;
  image: string;
  eyebrow?: string;
  title: string;
  lead?: string;
  children?: ReactNode;
  breadcrumbs?: ReactNode;
  tall?: boolean;
}) {
  return (
    <section className={`relative isolate flex items-end overflow-hidden bg-nile-deep text-ivory ${tall ? "min-h-[88svh]" : "min-h-[72svh]"}`}>
      <div className="absolute inset-0 -z-10">
        <div className="hero-drift absolute inset-0">
          <Photo id={image} locale={locale} priority sizes="100vw" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-nile-deep/90 via-nile-deep/35 to-nile-deep/30" />
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-nile-deep/50 to-transparent" />
      </div>
      <Container className="pb-14 pt-32 sm:pb-20">
        {breadcrumbs}
        <div className="fade-up mt-6 max-w-4xl">
          {eyebrow && <p className="eyebrow eyebrow-light">{eyebrow}</p>}
          <h1 className="mt-4 font-display text-[2.9rem] leading-[1.02] font-medium tracking-[-0.015em] text-balance sm:text-6xl lg:text-[5.2rem]">
            {title}
          </h1>
          {lead && <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ivory/85 text-pretty sm:text-xl">{lead}</p>}
          {children}
        </div>
      </Container>
    </section>
  );
}

/** A simple page header for utility pages without a photograph. */
export function PlainHero({ eyebrow, title, lead, breadcrumbs }: { eyebrow?: string; title: string; lead?: string; breadcrumbs?: ReactNode }) {
  return (
    <section className="relative overflow-hidden bg-sand/60 pb-14 pt-32 sm:pb-20 sm:pt-40">
      <svg className="pointer-events-none absolute -right-20 bottom-0 h-72 w-[46rem] text-gold/25" viewBox="0 0 600 200" aria-hidden="true">
        <path d="M0 150 C 120 60, 220 60, 320 130 S 520 200, 600 90" fill="none" stroke="currentColor" strokeWidth="1.2" />
        <path d="M0 175 C 120 85, 220 85, 320 155 S 520 225, 600 115" fill="none" stroke="currentColor" strokeWidth="0.8" />
      </svg>
      <Container>
        {breadcrumbs}
        <div className="fade-up mt-6 max-w-3xl">
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          <h1 className="mt-4 font-display text-[2.8rem] leading-[1.03] font-medium text-nile text-balance sm:text-6xl">{title}</h1>
          {lead && <p className="mt-5 text-lg leading-relaxed text-stone text-pretty">{lead}</p>}
        </div>
      </Container>
    </section>
  );
}

export function CtaBand({
  locale,
  title,
  body,
  button,
  link,
  image = "giza-panorama",
}: {
  locale: Locale;
  title: string;
  body: string;
  button: string;
  link: string;
  image?: string;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-nile text-ivory">
      <div className="absolute inset-0 -z-10 opacity-45">
        <Photo id={image} locale={locale} decorative sizes="100vw" />
      </div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-nile via-nile/85 to-nile/40" />
      <Container className="py-24 sm:py-32">
        <div className="max-w-2xl" data-reveal>
          <span className="rule-gold" />
          <h2 className="mt-6 font-display text-[2.4rem] leading-[1.05] font-medium text-balance sm:text-6xl">{title}</h2>
          <p className="mt-5 text-lg leading-relaxed text-ivory/85">{body}</p>
          <Link href={link} className="btn btn-gold mt-9">
            {button}
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </Container>
    </section>
  );
}

export function JourneyCard({ locale, journey, variant = "standard" }: { locale: Locale; journey: Journey; variant?: "standard" | "wide" }) {
  const { ui, destinations } = getContent(locale);
  const destNames = journey.destinations.map((s) => destinations.find((d) => d.slug === s)?.name).join(" · ");
  const wide = variant === "wide";
  return (
    <article className={`group relative flex h-full flex-col bg-ivory ${wide ? "lg:flex-row" : ""}`}>
      <div className={`relative overflow-hidden bg-sand ${wide ? "aspect-[4/3] lg:aspect-auto lg:w-[55%]" : "aspect-[4/3]"}`}>
        <div className="img-zoom absolute inset-0">
          <Photo id={journey.image} locale={locale} sizes={wide ? "(min-width:1024px) 50vw, 100vw" : "(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"} />
        </div>
        <span className="absolute left-4 top-4 rounded-full bg-ivory/90 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-nile backdrop-blur">
          {journey.duration}
        </span>
      </div>
      <div className={`flex flex-1 flex-col ${wide ? "justify-center p-8 lg:p-14" : "pt-6"}`}>
        <p className="eyebrow">
          {ui.journeysPage.badge} · {destNames}
        </p>
        <h3 className={`mt-3 font-display font-medium leading-tight text-nile ${wide ? "text-4xl lg:text-5xl" : "text-[1.85rem]"}`}>
          <Link href={href(locale, routes.journey(journey.slug))} className="after:absolute after:inset-0 focus-visible:outline-none">
            {journey.title}
          </Link>
        </h3>
        <p className="mt-3 leading-relaxed text-stone">{journey.summary}</p>
        {wide && (
          <ul className="mt-6 space-y-2 text-[0.95rem]">
            {journey.highlights.slice(0, 4).map((h) => (
              <li key={h} className="flex gap-3">
                <span className="mt-2.5 h-px w-4 shrink-0 bg-gold" aria-hidden="true" />
                {h}
              </li>
            ))}
          </ul>
        )}
        <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-gold-deep transition-colors group-hover:text-nile">
          {ui.common.viewJourney}
          <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
        </span>
      </div>
      <span className="pointer-events-none absolute inset-0 ring-gold ring-offset-4 group-has-[a:focus-visible]:ring-2" aria-hidden="true" />
    </article>
  );
}

export function planLinkFor(locale: Locale, opts: { destination?: string; journey?: string }) {
  return planHref(locale, opts);
}
