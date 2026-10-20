import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AttractionCard } from "@/components/AttractionCard";
import { Breadcrumbs, Container, CtaBand, JourneyCard, PageHero, SectionHeading } from "@/components/blocks";
import { FilterGrid } from "@/components/FilterGrid";
import { Photo } from "@/components/Photo";
import { fmt, getContent } from "@/content";
import { destinations as sourceDestinations } from "@/content/destinations";
import { interestIds } from "@/content/interests";
import type { Locale } from "@/i18n/config";
import { href, planHref, routes } from "@/lib/paths";
import { breadcrumbLd, destinationLd, JsonLd, pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: Locale; slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return sourceDestinations.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const d = getContent(locale).destinations.find((x) => x.slug === slug);
  if (!d) return {};
  return pageMetadata({ locale, path: routes.destination(slug), title: d.name, description: d.metaDescription, image: d.heroImage });
}

export default async function DestinationPage({ params }: Props) {
  const { locale, slug } = await params;
  const { ui, destinations, attractions, journeys } = getContent(locale);
  const d = destinations.find((x) => x.slug === slug);
  if (!d) notFound();
  const t = ui.destinationPage;
  const list = attractions.filter((a) => a.destination === d.slug);
  const related = journeys.filter((j) => j.destinations.includes(d.slug));
  const usedInterests = interestIds.filter((id) => list.some((a) => a.interests.includes(id)));
  const crumbs = [
    { name: ui.nav.home, path: "/" },
    { name: ui.nav.destinations, path: routes.destinations },
    { name: d.name, path: routes.destination(d.slug) },
  ];

  return (
    <>
      <PageHero
        locale={locale}
        image={d.heroImage}
        eyebrow={d.tagline}
        title={d.name}
        tall
        breadcrumbs={
          <Breadcrumbs
            label={ui.a11y.breadcrumb}
            light
            items={crumbs.map((c, i) => ({ name: c.name, href: i < crumbs.length - 1 ? href(locale, c.path) : undefined }))}
          />
        }
      >
        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <Link href={planHref(locale, { destination: d.slug })} className="btn btn-gold">
            {fmt(ui.common.planDestination, { name: d.name })}
          </Link>
          <a href="#places" className="btn btn-outline text-ivory">
            {t.browseEyebrow}
          </a>
        </div>
      </PageHero>

      {/* Introduction */}
      <section className="py-20 sm:py-28">
        <Container className="grid gap-10 lg:grid-cols-12">
          <p className="font-display text-[1.9rem] leading-[1.25] text-nile text-pretty sm:text-[2.35rem] lg:col-span-7" data-reveal>
            {d.intro[0]}
          </p>
          <div className="lg:col-span-4 lg:col-start-9" data-reveal>
            <span className="rule-gold" />
            <p className="mt-6 text-lg leading-relaxed text-stone">{d.intro[1]}</p>
            <ul className="mt-8 space-y-2 text-sm">
              {d.groups.map((g) => (
                <li key={g.id} className="flex items-baseline justify-between gap-4 border-b border-sand py-2">
                  <span className="font-semibold text-nile">{g.label}</span>
                  <span className="text-stone">{list.filter((a) => a.group === g.id).length}</span>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {/* Attraction browser */}
      <section id="places" className="scroll-mt-24 bg-ivory-deep py-20 sm:py-28" aria-labelledby="places-title">
        <Container>
          <SectionHeading id="places-title" eyebrow={t.browseEyebrow} title={t.browseTitle} />
          <div className="mt-10">
            <FilterGrid
              filters={[
                { name: "area", label: t.filterArea, allLabel: t.filterAll, options: d.groups.map((g) => ({ value: g.id, label: g.label })) },
                {
                  name: "interest",
                  label: t.filterInterest,
                  allLabel: t.filterAll,
                  options: usedInterests.map((id) => ({ value: id, label: ui.interests[id].short })),
                },
              ]}
              copy={{ results: t.resultsCount, empty: t.noResults, clear: t.clearFilters }}
              className="mt-8 grid gap-x-8 gap-y-14 sm:grid-cols-2 xl:grid-cols-3"
              items={list.map((a) => ({
                key: a.id,
                tags: { area: [a.group], interest: a.interests },
                node: <AttractionCard locale={locale} attraction={a} />,
              }))}
            />
          </div>
        </Container>
      </section>

      {/* Highlights */}
      <section className="py-20 sm:py-28" aria-labelledby="highlights-title">
        <Container>
          <SectionHeading id="highlights-title" eyebrow={t.highlightsEyebrow} title={t.highlightsTitle} />
          <div className="mt-14 grid gap-12 md:grid-cols-3 md:gap-8">
            {d.highlights.map((h, i) => (
              <article key={h.title} className={i === 1 ? "md:mt-16" : ""} data-reveal>
                <div className="relative aspect-[4/5] overflow-hidden bg-sand">
                  <Photo id={h.image} locale={locale} sizes="(min-width:768px) 33vw, 100vw" />
                </div>
                <h3 className="mt-6 font-display text-[1.9rem] leading-tight text-nile">{h.title}</h3>
                <p className="mt-3 leading-relaxed text-stone">{h.body}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      {/* Suggested itineraries */}
      <section className="border-t border-sand py-20 sm:py-28" aria-labelledby="journeys-title">
        <Container>
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <SectionHeading id="journeys-title" eyebrow={t.journeysEyebrow} title={fmt(t.journeysTitle, { name: d.name })} />
            <Link href={href(locale, routes.journeys)} className="btn btn-outline shrink-0 self-start text-nile">
              {ui.common.allJourneys}
            </Link>
          </div>
          {related.length === 1 ? (
            <div className="mt-12" data-reveal>
              <JourneyCard locale={locale} journey={related[0]} variant="wide" />
            </div>
          ) : (
            <div className="mt-12 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3" data-reveal>
              {related.map((j) => (
                <JourneyCard key={j.slug} locale={locale} journey={j} />
              ))}
            </div>
          )}
        </Container>
      </section>

      {/* Practical notes */}
      <section className="bg-sand/55 py-20 sm:py-28" aria-labelledby="practical-title">
        <Container className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHeading id="practical-title" eyebrow={t.practicalEyebrow} title={fmt(t.practicalTitle, { name: d.name })} />
            <p className="mt-6 text-sm leading-relaxed text-stone" data-reveal>
              {t.officialInfo}
            </p>
          </div>
          <dl className="grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:col-span-7 lg:col-start-6">
            {d.practical.map((p) => (
              <div key={p.title} className="border-t border-sand-deep pt-5" data-reveal>
                <dt className="font-display text-2xl leading-tight text-nile">{p.title}</dt>
                <dd className="mt-3 leading-relaxed text-charcoal/80">{p.body}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      <CtaBand
        locale={locale}
        title={fmt(t.ctaTitle, { name: d.name })}
        body={t.ctaBody}
        button={ui.common.requestQuote}
        link={planHref(locale, { destination: d.slug })}
        image={d.cardImage}
      />
      <JsonLd data={destinationLd(d, locale)} />
      <JsonLd data={breadcrumbLd(crumbs, locale)} />
    </>
  );
}
