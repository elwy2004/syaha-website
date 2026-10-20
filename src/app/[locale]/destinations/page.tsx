import Link from "next/link";
import type { Metadata } from "next";
import { Breadcrumbs, Container, CtaBand, PlainHero } from "@/components/blocks";
import { Photo } from "@/components/Photo";
import { fmt, getContent } from "@/content";
import type { Locale } from "@/i18n/config";
import { href, planHref, routes } from "@/lib/paths";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const { ui } = getContent(locale);
  return pageMetadata({ locale, path: routes.destinations, title: ui.destinationsPage.title, description: ui.destinationsPage.lead });
}

export default async function DestinationsPage({ params }: Props) {
  const { locale } = await params;
  const { ui, destinations, attractions } = getContent(locale);
  const t = ui.destinationsPage;

  return (
    <>
      <PlainHero
        eyebrow={t.eyebrow}
        title={t.title}
        lead={t.lead}
        breadcrumbs={<Breadcrumbs label={ui.a11y.breadcrumb} items={[{ name: ui.nav.home, href: href(locale) }, { name: t.title }]} />}
      />

      <section className="py-6 sm:py-10">
        <Container className="space-y-6">
          {destinations.map((d, i) => (
            <article key={d.slug} className="group relative isolate flex min-h-[70svh] items-end overflow-hidden bg-nile-deep text-ivory" data-reveal>
              <div className="img-zoom absolute inset-0 -z-10">
                <Photo id={d.heroImage} locale={locale} sizes="100vw" priority={i === 0} />
              </div>
              <div className="absolute inset-0 -z-10 bg-gradient-to-t from-nile-deep/90 via-nile-deep/30 to-transparent" />
              <div className="grid w-full gap-6 p-6 sm:p-10 lg:grid-cols-12 lg:p-14">
                <div className="lg:col-span-7">
                  <p className="eyebrow eyebrow-light">{d.tagline}</p>
                  <h2 className="mt-3 font-display text-5xl font-medium leading-none sm:text-7xl">
                    <Link href={href(locale, routes.destination(d.slug))} className="after:absolute after:inset-0">
                      {d.name}
                    </Link>
                  </h2>
                </div>
                <div className="lg:col-span-5 lg:self-end">
                  <p className="leading-relaxed text-ivory/85">{d.intro[0]}</p>
                  <p className="mt-5 flex items-center gap-3 text-sm font-semibold text-gold-soft">
                    {fmt(t.sitesCount, { count: attractions.filter((a) => a.destination === d.slug).length })}
                    <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
                  </p>
                </div>
              </div>
            </article>
          ))}
        </Container>
      </section>

      <section className="py-20 sm:py-28" aria-labelledby="combine-title">
        <Container className="grid items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-6" data-reveal>
            <p className="eyebrow">{ui.nav.destinations}</p>
            <h2 id="combine-title" className="mt-4 font-display text-4xl leading-tight text-nile sm:text-5xl">
              {t.combineTitle}
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-stone">{t.combineBody}</p>
            <Link href={planHref(locale)} className="btn btn-primary mt-8">
              {ui.nav.plan}
            </Link>
          </div>
          <figure className="lg:col-span-5 lg:col-start-8" data-reveal>
            <NileRoute names={destinations.map((d) => d.name)} minor={t.mapStops} label={t.mapLabel} />
          </figure>
        </Container>
      </section>

      <CtaBand locale={locale} title={ui.home.ctaTitle} body={ui.home.ctaBody} button={ui.home.ctaButton} link={planHref(locale)} image="colossi" />
    </>
  );
}

/** A schematic of the Nile from Cairo to Aswan; not to scale. */
function NileRoute({ names, minor, label }: { names: string[]; minor: string[]; label: string }) {
  const stops = [
    { y: 60, label: names[0], major: true },
    { y: 330, label: names[1], major: true },
    { y: 400, label: minor[0], major: false },
    { y: 455, label: minor[1], major: false },
    { y: 510, label: minor[2], major: false },
    { y: 570, label: names[2], major: true },
  ];
  return (
    <svg viewBox="0 0 360 640" className="mx-auto h-auto w-full max-w-sm" role="img" aria-label={label}>
      <rect width="360" height="640" fill="#E7D8BF" opacity="0.45" />
      <path d="M150 20 C 120 120, 200 180, 170 260 S 120 380, 160 450 S 190 560, 170 620" fill="none" stroke="#123F43" strokeWidth="5" strokeLinecap="round" />
      <path d="M150 20 C 120 120, 200 180, 170 260 S 120 380, 160 450 S 190 560, 170 620" fill="none" stroke="#7FA3A0" strokeWidth="1.5" strokeDasharray="2 8" />
      {stops.map((s) => {
        const x = s.y < 200 ? 152 : s.y < 400 ? 150 : s.y < 520 ? 172 : 176;
        return (
          <g key={s.label}>
            <circle cx={x} cy={s.y} r={s.major ? 9 : 4.5} fill={s.major ? "#B58B50" : "#F7F3EB"} stroke="#123F43" strokeWidth="1.5" />
            <text
              x={x + (s.major ? 22 : 16)}
              y={s.y + 6}
              fontFamily="var(--font-display)"
              fontSize={s.major ? 26 : 16}
              fill={s.major ? "#123F43" : "#5D625E"}
            >
              {s.label}
            </text>
          </g>
        );
      })}
      <text x="24" y="40" fontSize="11" letterSpacing="3" fill="#8C6A3A" fontFamily="var(--font-sans)">N ↑</text>
    </svg>
  );
}
