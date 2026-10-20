import Link from "next/link";
import { Wordmark } from "./Wordmark";
import { Container } from "./blocks";
import { getContent } from "@/content";
import type { Locale } from "@/i18n/config";
import { href, routes } from "@/lib/paths";
import { contactDetails, whatsappLink } from "@/lib/site";

export function Footer({ locale }: { locale: Locale }) {
  const { ui, destinations } = getContent(locale);
  const contact = contactDetails();
  const wa = whatsappLink();
  return (
    <footer className="bg-nile-deep text-ivory/80">
      <Container className="grid gap-12 py-16 sm:py-20 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Wordmark tone="light" />
          <p className="mt-6 max-w-sm leading-relaxed">{ui.footer.tagline}</p>
          <Link href={href(locale, routes.plan)} className="btn btn-gold mt-8">
            {ui.nav.plan}
          </Link>
        </div>
        <nav aria-label={ui.a11y.footerNav} className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-7">
          <div>
            <p className="eyebrow eyebrow-light">{ui.nav.destinations}</p>
            <ul className="mt-4 space-y-2.5">
              {destinations.map((d) => (
                <li key={d.slug}>
                  <Link href={href(locale, routes.destination(d.slug))} className="link-underline hover:text-ivory">
                    {d.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="eyebrow eyebrow-light">{ui.footer.explore}</p>
            <ul className="mt-4 space-y-2.5">
              <li><Link href={href(locale, routes.experiences)} className="link-underline hover:text-ivory">{ui.nav.experiences}</Link></li>
              <li><Link href={href(locale, routes.journeys)} className="link-underline hover:text-ivory">{ui.nav.journeys}</Link></li>
              <li><Link href={href(locale, routes.credits)} className="link-underline hover:text-ivory">{ui.nav.credits}</Link></li>
            </ul>
          </div>
          <div>
            <p className="eyebrow eyebrow-light">{ui.footer.plan}</p>
            <ul className="mt-4 space-y-2.5">
              <li><Link href={href(locale, routes.plan)} className="link-underline hover:text-ivory">{ui.nav.plan}</Link></li>
              <li><Link href={href(locale, routes.contact)} className="link-underline hover:text-ivory">{ui.nav.contact}</Link></li>
              {contact.email && (
                <li><a href={`mailto:${contact.email}`} className="link-underline break-all hover:text-ivory">{contact.email}</a></li>
              )}
              {wa && (
                <li><a href={wa} className="link-underline hover:text-ivory" rel="noopener" target="_blank">WhatsApp</a></li>
              )}
            </ul>
          </div>
        </nav>
      </Container>
      <div className="border-t border-ivory/10">
        <Container className="flex flex-col gap-4 py-8 text-xs leading-relaxed text-ivory/60 sm:flex-row sm:items-start sm:justify-between">
          <p className="max-w-2xl">{ui.footer.disclaimer}</p>
          <p className="shrink-0">© {new Date().getFullYear()} {ui.footer.rights}</p>
        </Container>
      </div>
    </footer>
  );
}
