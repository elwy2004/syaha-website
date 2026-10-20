import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs, Container, CtaBand, PageHero } from "@/components/blocks";
import { Itinerary } from "@/components/Itinerary";
import { Photo } from "@/components/Photo";
import { getContent } from "@/content";
import { journeys as sourceJourneys } from "@/content/journeys";
import type { Locale } from "@/i18n/config";
import { href, planHref, routes } from "@/lib/paths";
import { breadcrumbLd, journeyLd, JsonLd, pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: Locale; slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return sourceJourneys.map((j) => ({ slug: j.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const j = getContent(locale).journeys.find((x) => x.slug === slug);
  if (!j) return {};
  return pageMetadata({ locale, path: routes.journey(slug), title: j.title, description: j.summary, image: j.image });
}

export default async function JourneyPage({ params }: Props) {
  const { locale, slug } = await params;
  const { ui, journeys, destinations, attractions } = getContent(locale);
  const j = journeys.find((x) => x.slug === slug);
  if (!j) notFound();
  const t = ui.journeyPage;
  const dests = j.destinations.map((s) => destinations.find((d) => d.slug === s)!);
  const places = j.attractions.map((id) => attractions.find((a) => a.id === id)).filter((a) => a !== undefined);
  const quote = planHref(locale, { journey: j.slug, destination: j.destinations[0] });
  const crumbs = [
    { name: ui.nav.home, path: "/" },
    { name: ui.nav.journeys, path: routes.journeys },
    { name: j.title, path: routes.journey(j.slug) },
  ];

  return (
    <>
      <PageHero
        locale={locale}
        image={j.image}
        eyebrow={`${t.badge} · ${dests.map((d) => d.name).join(" · ")}`}
        title={j.title}
        lead={j.summary}
        breadcrumbs={
          <Breadcrumbs
            label={ui.a11y.breadcrumb}
            light
            items={crumbs.map((c, i) => ({ name: c.name, href: i < crumbs.length - 1 ? href(locale, c.path) : undefined }))}
          />
        }
      >
        <dl className="mt-9 flex flex-wrap gap-x-10 gap-y-4 border-t border-ivory/20 pt-6 text-sm">
          <div>
            <dt className="eyebrow eyebrow-light">{ui.common.duration}</dt>
            <dd className="mt-1 font-display text-2xl">{j.duration}</dd>
          </div>
          <div>
            <dt className="eyebrow eyebrow-light">{ui.common.destination}</dt>
            <dd className="mt-1 font-display text-2xl">
              {dests.map((d, i) => (
                <span key={d.slug}>
                  {i > 0 && " · "}
                  <Link href={href(locale, routes.destination(d.slug))} className="link-underline">
                    {d.name}
                  </Link>
                </span>
              ))}
            </dd>
          </div>
        </dl>
      </PageHero>

      <section className="py-16 sm:py-24">
        <Container className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="flex gap-3 border border-gold/40 bg-sand/40 p-5 text-sm leading-relaxed text-charcoal/85" role="note">
              <svg viewBox="0 0 16 16" className="mt-0.5 h-4 w-4 shrink-0 text-gold-deep" aria-hidden="true">
                <circle cx="8" cy="8" r="6.5" fill="none" stroke="currentColor" />
                <path d="M8 7v4M8 4.6v.1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
              {t.notice}
            </p>

            <h2 className="mt-14 eyebrow">{t.overview}</h2>
            <div className="prose-editorial mt-5 text-lg leading-relaxed text-charcoal/85">
              {j.overview.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </div>

            <h2 className="mt-16 font-display text-4xl text-nile sm:text-5xl">{t.itinerary}</h2>
            <div className="mt-6">
              <Itinerary days={j.itinerary} copy={{ expandAll: t.expandAll, collapseAll: t.collapseAll, optional: t.optional }} />
            </div>
          </div>

          <aside className="space-y-10 lg:col-span-4 lg:col-start-9">
            <div className="bg-nile p-7 text-ivory sm:p-9">
              <h2 className="eyebrow eyebrow-light">{ui.common.highlights}</h2>
              <ul className="mt-5 space-y-3">
                {j.highlights.map((h) => (
                  <li key={h} className="flex gap-3 font-display text-xl leading-snug">
                    <span className="mt-3 h-px w-4 shrink-0 bg-gold" aria-hidden="true" />
                    {h}
                  </li>
                ))}
              </ul>
              <Link href={quote} className="btn btn-gold mt-8 w-full">
                {ui.common.requestQuote}
              </Link>
            </div>

            <div>
              <h2 className="eyebrow">{t.walking}</h2>
              {j.walking ? (
                <>
                  <p className="mt-3 font-display text-2xl text-nile">{j.walking.level}</p>
                  <p className="mt-2 leading-relaxed text-stone">{j.walking.detail}</p>
                </>
              ) : (
                <p className="mt-3 leading-relaxed text-stone">{t.walkingUnknown}</p>
              )}
            </div>

            <div>
              <h2 className="eyebrow">{t.additions}</h2>
              <ul className="mt-4 space-y-2.5">
                {j.optionalAdditions.map((a) => (
                  <li key={a} className="flex gap-3 leading-relaxed">
                    <span className="mt-[0.7rem] h-1.5 w-1.5 shrink-0 rotate-45 bg-gold" aria-hidden="true" />
                    {a}
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-sand-deep pt-8">
              <h2 className="eyebrow">{t.toConfirm}</h2>
              <p className="mt-3 text-sm leading-relaxed text-stone">{t.toConfirmBody}</p>
              <ul className="mt-4 space-y-2.5">
                {j.toConfirm.map((c) => (
                  <li key={c} className="flex gap-3 leading-relaxed">
                    <svg viewBox="0 0 16 16" className="mt-1 h-4 w-4 shrink-0 text-nile" aria-hidden="true">
                      <rect x="1.5" y="1.5" width="13" height="13" rx="2" fill="none" stroke="currentColor" />
                      <path d="m4.5 8.2 2.3 2.3 4.7-5" fill="none" stroke="#B58B50" strokeWidth="1.5" />
                    </svg>
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </Container>
      </section>

      {places.length > 0 && (
        <section className="border-t border-sand bg-ivory-deep py-16 sm:py-24" aria-labelledby="places-title">
          <Container>
            <h2 id="places-title" className="font-display text-4xl text-nile sm:text-5xl">
              {t.related}
            </h2>
            <ul className="-mx-5 mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4">
              {places.map((a) => (
                <li key={a.id} className="w-[72vw] shrink-0 snap-start sm:w-auto">
                  <div className="relative aspect-[4/3] overflow-hidden bg-sand">
                    <Photo id={a.image} locale={locale} sizes="(min-width:1024px) 25vw, (min-width:640px) 50vw, 72vw" />
                  </div>
                  <p className="mt-4 font-display text-xl leading-tight text-nile">{a.name}</p>
                  {a.visitTime && <p className="mt-1 text-sm text-stone">{ui.common.suggestedTime}: {a.visitTime}</p>}
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}

      <CtaBand locale={locale} title={t.ctaTitle} body={t.ctaBody} button={ui.common.requestQuote} link={quote} image={j.image} />
      <JsonLd data={journeyLd(j, locale)} />
      <JsonLd data={breadcrumbLd(crumbs, locale)} />
    </>
  );
}
