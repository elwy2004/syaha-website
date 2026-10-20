import Link from "next/link";
import type { Metadata } from "next";
import { Breadcrumbs, Container, CtaBand, PlainHero } from "@/components/blocks";
import { getContent } from "@/content";
import type { Locale } from "@/i18n/config";
import { href, planHref, routes } from "@/lib/paths";
import { pageMetadata } from "@/lib/seo";
import { contactDetails, whatsappLink } from "@/lib/site";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const { ui } = getContent(locale);
  return pageMetadata({ locale, path: routes.contact, title: ui.contactPage.title, description: ui.contactPage.lead });
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  const { ui } = getContent(locale);
  const t = ui.contactPage;
  const c = contactDetails();
  const wa = whatsappLink();
  const hasDirect = Boolean(c.email || c.phone || wa);

  return (
    <>
      <PlainHero
        eyebrow={t.eyebrow}
        title={t.title}
        lead={t.lead}
        breadcrumbs={<Breadcrumbs label={ui.a11y.breadcrumb} items={[{ name: ui.nav.home, href: href(locale) }, { name: t.title }]} />}
      />
      <section className="py-16 sm:py-24">
        <Container className="grid gap-12 lg:grid-cols-2">
          <div className="bg-nile p-8 text-ivory sm:p-12">
            <h2 className="font-display text-4xl leading-tight">{ui.planPage.title}</h2>
            <p className="mt-4 leading-relaxed text-ivory/85">{ui.planPage.lead}</p>
            <Link href={planHref(locale)} className="btn btn-gold mt-8">
              {t.formCta} <span aria-hidden="true">→</span>
            </Link>
          </div>
          <div>
            <h2 className="eyebrow">{t.direct}</h2>
            {hasDirect ? (
              <dl className="mt-6 divide-y divide-sand border-y border-sand">
                {c.email && (
                  <div className="flex flex-wrap justify-between gap-4 py-5">
                    <dt className="font-semibold text-nile">{t.email}</dt>
                    <dd><a className="link-underline break-all" href={`mailto:${c.email}`}>{c.email}</a></dd>
                  </div>
                )}
                {c.phone && (
                  <div className="flex flex-wrap justify-between gap-4 py-5">
                    <dt className="font-semibold text-nile">{t.phone}</dt>
                    <dd><a className="link-underline" href={`tel:${c.phone.replace(/[^\d+]/g, "")}`}>{c.phone}</a></dd>
                  </div>
                )}
                {wa && (
                  <div className="flex flex-wrap justify-between gap-4 py-5">
                    <dt className="font-semibold text-nile">{t.whatsapp}</dt>
                    <dd><a className="link-underline" href={wa} target="_blank" rel="noopener">{ui.common.whatsapp}</a></dd>
                  </div>
                )}
              </dl>
            ) : (
              <p className="mt-6 border-l-2 border-gold pl-5 leading-relaxed text-stone">{t.noDirect}</p>
            )}
          </div>
        </Container>
      </section>
      <CtaBand locale={locale} title={ui.home.ctaTitle} body={ui.home.ctaBody} button={ui.home.ctaButton} link={planHref(locale)} image="luxor-temple" />
    </>
  );
}
