import Link from "next/link";
import type { Metadata } from "next";
import { Photo } from "@/components/Photo";
import { Finder } from "@/components/Finder";
import { Container, CtaBand, JourneyCard, SectionHeading } from "@/components/blocks";
import { Faqs } from "@/components/Faqs";
import { getContent } from "@/content";
import { interestIds, interestImages } from "@/content/interests";
import type { Locale } from "@/i18n/config";
import { href, planHref, routes } from "@/lib/paths";
import { pageMetadata, JsonLd } from "@/lib/seo";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const { ui } = getContent(locale);
  return { ...pageMetadata({ locale, path: "/", description: ui.meta.siteDescription, image: "giza-panorama" }), title: { absolute: ui.meta.siteTitle } };
}

const featured = ["discover-aswan-nubia-7-days", "luxor-three-days", "pyramids-grand-egyptian-museum", "saqqara-memphis-dahshur"];

export default async function Home({ params }: Props) {
  const { locale } = await params;
  const { ui, destinations, journeys, attractions } = getContent(locale);
  const t = ui.home;
  const picks = featured.map((s) => journeys.find((j) => j.slug === s)!).filter(Boolean);

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: ui.faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };

  return (
    <>
      {/* 1. Hero */}
      <section className="relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden bg-nile-deep text-ivory">
        <div className="absolute inset-0 -z-10">
          <div className="hero-drift absolute inset-0">
            <Photo id="giza-panorama" locale={locale} priority sizes="100vw" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-nile-deep via-nile-deep/40 to-nile-deep/25" />
          <div className="absolute inset-0 bg-gradient-to-r from-nile-deep/60 to-transparent" />
        </div>
        <Container className="pb-10 pt-36 sm:pb-14">
          <div className="max-w-4xl">
            <p className="eyebrow eyebrow-light fade-up">{t.eyebrow}</p>
            <h1 className="fade-up mt-5 font-display text-[3.1rem] leading-[0.98] font-medium tracking-[-0.02em] text-balance [animation-delay:120ms] sm:text-7xl lg:text-[6.4rem]">
              {t.heroTitle}
            </h1>
            <p className="fade-up mt-7 max-w-xl text-lg leading-relaxed text-ivory/85 [animation-delay:240ms] sm:text-xl">{t.heroBody}</p>
            <div className="fade-up mt-9 flex flex-col gap-3 [animation-delay:360ms] sm:flex-row sm:gap-4">
              <Link href={href(locale, routes.plan)} className="btn btn-gold">
                {t.heroPrimary}
                <span aria-hidden="true">→</span>
              </Link>
              <Link href={href(locale, routes.destinations)} className="btn btn-outline text-ivory">
                {t.heroSecondary}
              </Link>
            </div>
          </div>
          {/* 2. Finder */}
          <div className="fade-up mt-14 max-w-4xl [animation-delay:480ms] lg:ml-auto lg:mt-16">
            <Finder
              action={href(locale, routes.experiences)}
              copy={{
                title: t.finderTitle,
                destination: t.finderDestination,
                interest: t.finderInterest,
                anyDestination: t.finderAnyDestination,
                anyInterest: t.finderAnyInterest,
                submit: t.finderSubmit,
              }}
              destinations={destinations.map((d) => ({ value: d.slug, label: d.name }))}
              interests={interestIds.map((id) => ({ value: id, label: ui.interests[id].label }))}
            />
          </div>
        </Container>
      </section>

      {/* 3. Destinations */}
      <section className="py-24 sm:py-32" aria-labelledby="home-destinations">
        <Container>
          <SectionHeading id="home-destinations" eyebrow={t.destinationsEyebrow} title={t.destinationsTitle} />
          <div className="mt-16 space-y-20 sm:space-y-28">
            {destinations.map((d, i) => {
              const count = attractions.filter((a) => a.destination === d.slug).length;
              const flip = i % 2 === 1;
              return (
                <article key={d.slug} className="group relative grid items-center gap-8 lg:grid-cols-12 lg:gap-12" data-reveal>
                  <div className={`relative overflow-hidden bg-sand lg:col-span-7 ${flip ? "lg:order-2 lg:col-start-6" : ""} aspect-[4/3] lg:aspect-[16/11]`}>
                    <div className="img-zoom absolute inset-0">
                      <Photo id={d.cardImage} locale={locale} sizes="(min-width:1024px) 58vw, 100vw" />
                    </div>
                    <span className="absolute bottom-0 left-0 bg-ivory px-5 py-3 font-display text-5xl leading-none text-gold sm:text-6xl" aria-hidden="true">
                      0{i + 1}
                    </span>
                  </div>
                  <div className={`lg:col-span-5 ${flip ? "lg:order-1 lg:col-start-1 lg:row-start-1" : ""}`}>
                    <p className="eyebrow">{d.tagline}</p>
                    <h3 className="mt-4 font-display text-5xl font-medium leading-none text-nile sm:text-6xl">
                      <Link href={href(locale, routes.destination(d.slug))} className="after:absolute after:inset-0">
                        {d.name}
                      </Link>
                    </h3>
                    <p className="mt-6 text-lg leading-relaxed text-stone">{d.intro[0]}</p>
                    <p className="mt-6 flex items-center gap-4 text-sm font-semibold text-gold-deep">
                      <span>{ui.destinationsPage.sitesCount.replace("{count}", String(count))}</span>
                      <span className="h-px flex-1 bg-sand-deep" aria-hidden="true" />
                      <span className="text-nile transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </Container>
      </section>

      {/* 4. Editorial introduction */}
      <section className="relative overflow-hidden bg-sand/55 py-24 sm:py-32" aria-labelledby="home-intro">
        <Container className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="relative aspect-[3/4] overflow-hidden" data-reveal>
              <Photo id="colossi" locale={locale} sizes="(min-width:1024px) 40vw, 100vw" />
            </div>
          </div>
          <div className="lg:col-span-6 lg:col-start-7 lg:self-center">
            <SectionHeading id="home-intro" eyebrow={t.introEyebrow} title={t.introTitle} />
            <div className="prose-editorial mt-8 text-lg leading-relaxed text-charcoal/85" data-reveal>
              {t.introBody.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </div>
            <dl className="mt-12 grid gap-8 border-t border-sand-deep pt-10 sm:grid-cols-3" data-reveal>
              {t.introPoints.map((pt) => (
                <div key={pt.title}>
                  <dt className="font-display text-2xl leading-tight text-nile">{pt.title}</dt>
                  <dd className="mt-2 text-sm leading-relaxed text-stone">{pt.body}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Container>
      </section>

      {/* 5. Selected journeys */}
      <section className="py-24 sm:py-32" aria-labelledby="home-journeys">
        <Container>
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <SectionHeading id="home-journeys" eyebrow={t.journeysEyebrow} title={t.journeysTitle} body={t.journeysBody} />
            <Link href={href(locale, routes.journeys)} className="btn btn-outline shrink-0 self-start text-nile lg:self-auto">
              {ui.common.allJourneys}
            </Link>
          </div>
          <div className="mt-14 space-y-14">
            <div data-reveal>
              <JourneyCard locale={locale} journey={picks[0]} variant="wide" />
            </div>
            <div className="grid gap-x-8 gap-y-14 md:grid-cols-3" data-reveal>
              {picks.slice(1).map((j) => (
                <JourneyCard key={j.slug} locale={locale} journey={j} />
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* 6. Experience categories */}
      <section className="bg-nile py-24 text-ivory sm:py-32" aria-labelledby="home-experiences">
        <Container>
          <SectionHeading id="home-experiences" eyebrow={t.experiencesEyebrow} title={t.experiencesTitle} light />
          <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2">
            {interestIds.map((id, i) => {
              const big = i === 0;
              return (
                <li
                  key={id}
                  className={`group relative overflow-hidden bg-nile-deep ${big ? "aspect-[4/3] sm:col-span-2 lg:row-span-2 lg:aspect-auto" : "aspect-[4/3] lg:aspect-auto lg:min-h-[18rem]"}`}
                  data-reveal
                >
                  <div className="img-zoom absolute inset-0 opacity-80">
                    <Photo id={interestImages[id]} locale={locale} decorative sizes="(min-width:1024px) 50vw, 100vw" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-nile-deep via-nile-deep/40 to-transparent" />
                  <div className="relative flex h-full flex-col justify-end p-6 sm:p-8">
                    <h3 className={`font-display font-medium leading-tight ${big ? "text-4xl sm:text-5xl" : "text-3xl"}`}>
                      <Link href={`${href(locale, routes.experiences)}?interest=${id}`} className="after:absolute after:inset-0">
                        {ui.interests[id].label}
                      </Link>
                    </h3>
                    <p className="mt-2 max-w-md text-sm leading-relaxed text-ivory/80">{ui.interests[id].description}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </Container>
      </section>

      {/* 7. Inquiry process */}
      <section className="py-24 sm:py-32" aria-labelledby="home-process">
        <Container>
          <SectionHeading id="home-process" eyebrow={t.processEyebrow} title={t.processTitle} align="center" />
          <ol className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {t.process.map((step, i) => (
              <li key={step.title} className="relative border-t border-sand-deep pt-8" data-reveal>
                <span className="absolute -top-px left-0 h-px w-14 bg-gold" aria-hidden="true" />
                <span className="font-display text-6xl leading-none text-gold/70" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-5 font-display text-[1.75rem] leading-tight text-nile">{step.title}</h3>
                <p className="mt-3 leading-relaxed text-stone">{step.body}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* 8. FAQs */}
      <section className="bg-ivory-deep py-24 sm:py-32" aria-labelledby="home-faq">
        <Container className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHeading id="home-faq" eyebrow={t.faqEyebrow} title={t.faqTitle} />
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <Faqs items={ui.faqs} />
          </div>
        </Container>
      </section>

      {/* 9. Final CTA */}
      <CtaBand locale={locale} title={t.ctaTitle} body={t.ctaBody} button={t.ctaButton} link={planHref(locale)} image="philae" />
      <JsonLd data={faqLd} />
    </>
  );
}
