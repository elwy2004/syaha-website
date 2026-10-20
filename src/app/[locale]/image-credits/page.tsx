import type { Metadata } from "next";
import { Breadcrumbs, Container, PlainHero } from "@/components/blocks";
import { Scene } from "@/components/Scene";
import { getContent } from "@/content";
import { imageEntries, verifiedImages } from "@/content/images";
import type { Locale } from "@/i18n/config";
import { href, routes } from "@/lib/paths";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const { ui } = getContent(locale);
  return pageMetadata({ locale, path: routes.credits, title: ui.creditsPage.title, description: ui.creditsPage.lead });
}

export default async function CreditsPage({ params }: Props) {
  const { locale } = await params;
  const { ui, images } = getContent(locale);
  const t = ui.creditsPage;
  const photos = verifiedImages();
  const verifiedIds = new Set(photos.map((p) => p.id));
  const pending = imageEntries.filter((e) => !verifiedIds.has(e.id));
  const subject = (id: string) => images.find((i) => i.id === id)?.subject ?? id;

  return (
    <>
      <PlainHero
        eyebrow={t.eyebrow}
        title={t.title}
        lead={t.lead}
        breadcrumbs={<Breadcrumbs label={ui.a11y.breadcrumb} items={[{ name: ui.nav.home, href: href(locale) }, { name: t.title }]} />}
      />
      <section className="py-14 sm:py-20">
        <Container className="space-y-16">
          <div>
            <h2 className="font-display text-4xl text-nile">{t.photos}</h2>
            {photos.length === 0 ? (
              <p className="mt-4 text-stone">{t.noPhotos}</p>
            ) : (
              <div className="mt-6 overflow-x-auto">
                <table className="w-full min-w-[40rem] text-left text-sm">
                  <thead className="border-b border-sand-deep text-xs uppercase tracking-[0.14em] text-gold-deep">
                    <tr>
                      <th className="py-3 pr-4 font-semibold">{t.subject}</th>
                      <th className="py-3 pr-4 font-semibold">{t.creator}</th>
                      <th className="py-3 pr-4 font-semibold">{t.license}</th>
                      <th className="py-3 font-semibold">{t.source}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sand">
                    {photos.map((p) => (
                      <tr key={p.id}>
                        <td className="py-3 pr-4 font-medium text-nile">{subject(p.id)}</td>
                        <td className="py-3 pr-4">{p.photo.creator}</td>
                        <td className="py-3 pr-4">
                          {p.photo.supplied ? t.permission : p.photo.licenseUrl ? <a className="underline underline-offset-2" href={p.photo.licenseUrl} rel="license noopener" target="_blank">{p.photo.license}</a> : p.photo.license}
                        </td>
                        <td className="py-3">
                          {p.photo.supplied ? (
                            p.photo.sourceUrl ? (
                              <a className="underline underline-offset-2" href={p.photo.sourceUrl} target="_blank" rel="noopener">{t.supplied}</a>
                            ) : (
                              t.supplied
                            )
                          ) : (
                            <a className="underline underline-offset-2" href={p.photo.sourceUrl} target="_blank" rel="noopener">Wikimedia Commons</a>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <h2 className="font-display text-4xl text-nile">{t.illustrations}</h2>
              <p className="mt-4 leading-relaxed text-stone">{t.illustrationsBody}</p>
              <div className="relative mt-6 aspect-[16/10] overflow-hidden">
                <Scene motif="pyramids" tone="dusk" className="absolute inset-0 h-full w-full" />
              </div>
            </div>
            {pending.length > 0 && (
              <div className="lg:col-span-6 lg:col-start-7">
                <h3 className="eyebrow">{t.pendingTitle}</h3>
                <ul className="mt-4 columns-1 gap-8 text-sm text-stone sm:columns-2">
                  {pending.map((e) => (
                    <li key={e.id} className="break-inside-avoid py-1">{subject(e.id)}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </Container>
      </section>
    </>
  );
}
