import type { Metadata } from "next";
import { AttractionCard } from "@/components/AttractionCard";
import { Breadcrumbs, Container, CtaBand, PageHero } from "@/components/blocks";
import { FilterGrid } from "@/components/FilterGrid";
import { getContent } from "@/content";
import { interestIds } from "@/content/interests";
import type { Locale } from "@/i18n/config";
import { href, planHref, routes } from "@/lib/paths";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const { ui } = getContent(locale);
  return pageMetadata({ locale, path: routes.experiences, title: ui.experiencesPage.title, description: ui.experiencesPage.lead, image: "karnak" });
}

export default async function ExperiencesPage({ params }: Props) {
  const { locale } = await params;
  const { ui, destinations, attractions } = getContent(locale);
  const t = ui.experiencesPage;

  return (
    <>
      <PageHero
        locale={locale}
        image="karnak"
        eyebrow={t.eyebrow}
        title={t.title}
        lead={t.lead}
        breadcrumbs={<Breadcrumbs label={ui.a11y.breadcrumb} light items={[{ name: ui.nav.home, href: href(locale) }, { name: t.title }]} />}
      />

      <section className="border-b border-sand py-14">
        <Container>
          <ul className="grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-5">
            {interestIds.map((id) => (
              <li key={id} data-reveal>
                <a href={`?interest=${id}#browse`} className="group block border-t border-gold pt-4">
                  <span className="font-display text-2xl leading-tight text-nile group-hover:text-gold-deep">{ui.interests[id].label}</span>
                  <span className="mt-2 block text-sm leading-relaxed text-stone">{ui.interests[id].description}</span>
                </a>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section id="browse" className="scroll-mt-24 py-16 sm:py-24">
        <Container>
          <FilterGrid
            filters={[
              { name: "destination", label: t.filterDestination, allLabel: t.all, options: destinations.map((d) => ({ value: d.slug, label: d.name })) },
              { name: "interest", label: t.filterInterest, allLabel: t.all, options: interestIds.map((id) => ({ value: id, label: ui.interests[id].short })) },
            ]}
            copy={{ results: t.resultsCount, empty: t.noResults, clear: t.clearFilters }}
            className="mt-8 grid gap-x-8 gap-y-14 sm:grid-cols-2 xl:grid-cols-3"
            items={attractions.map((a) => ({
              key: a.id,
              tags: { destination: [a.destination], interest: a.interests },
              node: <AttractionCard locale={locale} attraction={a} showDestination />,
            }))}
          />
        </Container>
      </section>

      <CtaBand locale={locale} title={ui.home.ctaTitle} body={ui.home.ctaBody} button={ui.home.ctaButton} link={planHref(locale)} image="aswan-felucca" />
    </>
  );
}
