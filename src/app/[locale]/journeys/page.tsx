import type { Metadata } from "next";
import { Breadcrumbs, Container, CtaBand, JourneyCard, PlainHero } from "@/components/blocks";
import { FilterGrid } from "@/components/FilterGrid";
import { getContent } from "@/content";
import type { Locale } from "@/i18n/config";
import { href, planHref, routes } from "@/lib/paths";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const { ui } = getContent(locale);
  return pageMetadata({ locale, path: routes.journeys, title: ui.journeysPage.title, description: ui.journeysPage.lead });
}

export default async function JourneysPage({ params }: Props) {
  const { locale } = await params;
  const { ui, destinations, journeys } = getContent(locale);
  const t = ui.journeysPage;
  const sorted = [...journeys].sort((a, b) => b.days - a.days);

  return (
    <>
      <PlainHero
        eyebrow={t.eyebrow}
        title={t.title}
        lead={t.lead}
        breadcrumbs={<Breadcrumbs label={ui.a11y.breadcrumb} items={[{ name: ui.nav.home, href: href(locale) }, { name: t.title }]} />}
      />
      <section className="py-14 sm:py-20">
        <Container>
          <FilterGrid
            filters={[{ name: "destination", label: t.filterLabel, allLabel: t.all, options: destinations.map((d) => ({ value: d.slug, label: d.name })) }]}
            copy={{ results: ui.destinationPage.resultsCount, empty: ui.experiencesPage.noResults, clear: ui.experiencesPage.clearFilters }}
            className="mt-8 grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3"
            items={sorted.map((j) => ({
              key: j.slug,
              tags: { destination: j.destinations },
              node: <JourneyCard locale={locale} journey={j} />,
            }))}
          />
        </Container>
      </section>
      <CtaBand locale={locale} title={ui.journeyPage.ctaTitle} body={ui.journeyPage.ctaBody} button={ui.common.requestQuote} link={planHref(locale)} image="karnak" />
    </>
  );
}
