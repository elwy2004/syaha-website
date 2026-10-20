import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs, Container, CtaBand, PageHero } from "@/components/blocks";
import { Photo } from "@/components/Photo";
import { StayCard } from "@/components/StayCard";
import { fmt, getContent } from "@/content";
import { stays as sourceStays } from "@/content/stays";
import type { Locale } from "@/i18n/config";
import { href, planHref, routes } from "@/lib/paths";
import { breadcrumbLd, JsonLd, pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: Locale; slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return sourceStays.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const s = getContent(locale).stays.find((x) => x.slug === slug);
  if (!s) return {};
  return pageMetadata({ locale, path: routes.stay(slug), title: s.name, description: s.metaDescription, image: s.heroImage });
}

export default async function StayPage({ params }: Props) {
  const { locale, slug } = await params;
  const { ui, stays } = getContent(locale);
  const s = stays.find((x) => x.slug === slug);
  if (!s) notFound();
  const t = ui.stayPage;
  const ask = planHref(locale, { destination: "aswan-nubia" });
  const site = s.website?.replace(/^https?:\/\//, "");
  const crumbs = [
    { name: ui.nav.home, path: "/" },
    { name: ui.nav.stays, path: routes.stays },
    { name: s.name, path: routes.stay(s.slug) },
  ];
  const others = stays.filter((x) => x.slug !== s.slug);

  return (
    <>
      <PageHero
        locale={locale}
        image={s.heroImage}
        eyebrow={s.location}
        title={s.title}
        lead={s.lead}
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
          <Link href={ask} className="btn btn-gold">
            {t.ask}
            <span aria-hidden="true">→</span>
          </Link>
          {s.website && (
            <a href={s.website} className="btn btn-outline text-ivory" target="_blank" rel="noopener">
              {fmt(t.visit, { site: site ?? s.name })}
              <span aria-hidden="true">↗</span>
            </a>
          )}
        </div>
      </PageHero>

      {s.sections.map((sec, i) => (
        <section key={sec.id} className={`py-20 sm:py-28 ${i % 2 === 1 ? "bg-ivory-deep" : ""}`} aria-labelledby={`stay-${sec.id}`}>
          <Container className="grid items-center gap-12 lg:grid-cols-12">
            <figure className={`lg:col-span-6 ${i % 2 === 1 ? "lg:order-2 lg:col-start-7" : ""}`} data-reveal>
              <div className={`relative overflow-hidden bg-sand ${sec.id === "food" ? "aspect-[4/5] max-w-lg" : "aspect-[4/3]"}`}>
                <Photo id={sec.image} locale={locale} sizes="(min-width:1024px) 50vw, 100vw" />
              </div>
              {sec.caption && <figcaption className="mt-3 text-xs uppercase tracking-[0.16em] text-stone">{sec.caption}</figcaption>}
            </figure>
            <div className={`lg:col-span-5 ${i % 2 === 1 ? "lg:order-1 lg:col-start-1" : "lg:col-start-8"}`} data-reveal>
              {i === 0 && (
                <Image src={s.logo} alt={s.name} width={200} height={80} className="mb-8 h-14 w-auto rounded-sm" />
              )}
              {sec.eyebrow && <p className="eyebrow">{sec.eyebrow}</p>}
              <h2 id={`stay-${sec.id}`} className="mt-4 font-display text-[2.3rem] leading-[1.08] text-nile text-balance sm:text-5xl">
                {sec.title}
              </h2>
              {sec.body.map((p) => (
                <p key={p} className="mt-5 text-lg leading-relaxed text-stone">{p}</p>
              ))}
              {sec.items && (
                <ol className="mt-8 space-y-6">
                  {sec.items.map((item, n) => (
                    <li key={item.id} className="grid grid-cols-[2.5rem_1fr] gap-x-3 border-t border-sand-deep pt-5">
                      <span className="font-display text-2xl leading-none text-gold" aria-hidden="true">
                        {String(n + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <h3 className="font-display text-2xl leading-tight text-nile">{item.title}</h3>
                        <p className="mt-2 leading-relaxed text-stone">{item.body}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          </Container>
        </section>
      ))}

      {s.gallery.length > 0 && (
        <section className="pb-20 sm:pb-28" aria-label={t.gallery}>
          <Container className="grid gap-4 sm:grid-cols-3">
            {s.gallery.map((id) => (
              <div key={id} className="relative aspect-[4/3] overflow-hidden bg-sand" data-reveal>
                <Photo id={id} locale={locale} sizes="(min-width:640px) 33vw, 100vw" />
              </div>
            ))}
          </Container>
        </section>
      )}

      <CtaBand locale={locale} title={s.ctaTitle} body={s.ctaBody} button={t.ask} link={ask} image={s.heroImage} />

      {others.length > 0 && (
        <section className="py-20 sm:py-28" aria-labelledby="other-stays">
          <Container>
            <h2 id="other-stays" className="eyebrow">{t.otherStay}</h2>
            <div className="mt-8 grid gap-12 md:grid-cols-2">
              {others.map((o) => (
                <StayCard key={o.slug} locale={locale} stay={o} />
              ))}
              <div className="self-end" data-reveal>
                <Link href={href(locale, routes.destination("aswan-nubia"))} className="btn btn-outline text-nile">
                  {t.explore}
                </Link>
              </div>
            </div>
          </Container>
        </section>
      )}
      <JsonLd data={breadcrumbLd(crumbs, locale)} />
    </>
  );
}
