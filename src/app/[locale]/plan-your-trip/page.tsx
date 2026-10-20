import type { Metadata } from "next";
import { connection } from "next/server";
import { Breadcrumbs, Container, PlainHero } from "@/components/blocks";
import { InquiryForm } from "@/components/InquiryForm";
import { Photo } from "@/components/Photo";
import { getContent } from "@/content";
import { interestIds } from "@/content/interests";
import type { Locale } from "@/i18n/config";
import { href, routes } from "@/lib/paths";
import { pageMetadata } from "@/lib/seo";
import { inquiryConfigured, whatsappLink } from "@/lib/site";

type Props = { params: Promise<{ locale: Locale }> };



export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const { ui } = getContent(locale);
  return pageMetadata({ locale, path: routes.plan, title: ui.planPage.title, description: ui.planPage.lead });
}

export default async function PlanPage({ params }: Props) {
  // Rendered per request so the preview notice always matches the inquiry
  // service configuration the API route sees at runtime.
  await connection();
  const { locale } = await params;
  const { ui, destinations, journeys } = getContent(locale);
  const t = ui.planPage;
  const wa = whatsappLink();

  return (
    <>
      <PlainHero
        eyebrow={t.eyebrow}
        title={t.title}
        lead={t.lead}
        breadcrumbs={<Breadcrumbs label={ui.a11y.breadcrumb} items={[{ name: ui.nav.home, href: href(locale) }, { name: t.title }]} />}
      />
      <section className="py-14 sm:py-20">
        <Container className="grid gap-14 lg:grid-cols-12">
          <div className="min-w-0 lg:col-span-8">
            <InquiryForm
              copy={ui.form}
              locale={locale}
              configured={inquiryConfigured()}
              destinations={destinations.map((d) => ({ value: d.slug, label: d.name }))}
              journeys={journeys.map((j) => ({ value: j.slug, label: `${j.title} (${j.duration})`, destinations: j.destinations, days: j.days }))}
              interests={interestIds.map((id) => ({ value: id, label: ui.interests[id].label }))}
            />
          </div>
          <aside className="lg:col-span-3 lg:col-start-10">
            <div className="lg:sticky lg:top-28">
              <div className="relative hidden aspect-[3/4] overflow-hidden bg-sand lg:block">
                <Photo id="colossi" locale={locale} sizes="25vw" />
              </div>
              <h2 className="mt-8 eyebrow">{t.asideTitle}</h2>
              <ol className="mt-5 space-y-5">
                {t.aside.map((s, i) => (
                  <li key={s} className="flex gap-4">
                    <span className="font-display text-3xl leading-none text-gold">{i + 1}</span>
                    <span className="leading-relaxed text-stone">{s}</span>
                  </li>
                ))}
              </ol>
              {wa && (
                <a href={wa} target="_blank" rel="noopener" className="btn btn-outline mt-8 w-full text-nile">
                  {ui.common.whatsapp}
                </a>
              )}
            </div>
          </aside>
        </Container>
      </section>
    </>
  );
}
