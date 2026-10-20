import type { Metadata } from "next";
import { Breadcrumbs, Container, PageHero } from "@/components/blocks";
import { StayCard } from "@/components/StayCard";
import { getContent } from "@/content";
import type { Locale } from "@/i18n/config";
import { href, routes } from "@/lib/paths";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = getContent(locale).ui.staysPage;
  return pageMetadata({ locale, path: routes.stays, title: t.title, description: t.metaDescription, image: "aswan-aerial" });
}

export default async function StaysPage({ params }: Props) {
  const { locale } = await params;
  const { ui, stays } = getContent(locale);
  const t = ui.staysPage;
  return (
    <>
      <PageHero
        locale={locale}
        image="aswan-aerial"
        eyebrow={t.eyebrow}
        title={t.title}
        lead={t.lead}
        breadcrumbs={<Breadcrumbs label={ui.a11y.breadcrumb} light items={[{ name: ui.nav.home, href: href(locale) }, { name: ui.nav.stays }]} />}
      />
      <section className="py-20 sm:py-28">
        <Container className="grid gap-x-10 gap-y-16 md:grid-cols-2">
          {stays.map((s) => (
            <StayCard key={s.slug} locale={locale} stay={s} />
          ))}
        </Container>
      </section>
    </>
  );
}
