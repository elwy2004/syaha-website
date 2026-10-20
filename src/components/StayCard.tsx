import Link from "next/link";
import { Photo } from "./Photo";
import { fmt, getContent } from "@/content";
import type { Stay } from "@/content/types";
import type { Locale } from "@/i18n/config";
import { href, routes } from "@/lib/paths";

export function StayCard({ locale, stay }: { locale: Locale; stay: Stay }) {
  const { ui } = getContent(locale);
  return (
    <article className="group relative" data-reveal>
      <div className="relative aspect-[4/3] overflow-hidden bg-sand">
        <div className="img-zoom absolute inset-0">
          <Photo id={stay.cardImage} locale={locale} sizes="(min-width:768px) 50vw, 100vw" />
        </div>
      </div>
      <p className="eyebrow mt-6">{stay.location}</p>
      <h3 className="mt-3 font-display text-[2.1rem] leading-tight text-nile">
        <Link href={href(locale, routes.stay(stay.slug))} className="after:absolute after:inset-0">
          {stay.name}
        </Link>
      </h3>
      <p className="mt-3 max-w-xl leading-relaxed text-stone">{stay.summary}</p>
      <p className="mt-5 text-sm font-semibold text-nile">
        <span className="link-underline">{fmt(ui.staysPage.discover, { name: stay.name })}</span> <span aria-hidden="true">→</span>
      </p>
    </article>
  );
}
