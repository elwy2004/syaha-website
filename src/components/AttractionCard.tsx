import { Photo } from "./Photo";
import { getContent } from "@/content";
import type { Attraction } from "@/content/types";
import type { Locale } from "@/i18n/config";

export function AttractionCard({ locale, attraction, showDestination = false }: { locale: Locale; attraction: Attraction; showDestination?: boolean }) {
  const { ui, destinations } = getContent(locale);
  const dest = destinations.find((d) => d.slug === attraction.destination);
  return (
    <article className="group flex w-full flex-col bg-ivory">
      <div className="relative aspect-[3/2] overflow-hidden bg-sand">
        <div className="img-zoom absolute inset-0">
          <Photo id={attraction.image} locale={locale} sizes="(min-width:1280px) 30vw, (min-width:640px) 45vw, 100vw" />
        </div>
        {attraction.excursion && (
          <span className="absolute left-3 top-3 rounded-full bg-nile/90 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-ivory">
            {ui.common.excursion}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col pt-5">
        <p className="eyebrow">{showDestination && dest ? `${dest.name} · ${attraction.where ?? ""}` : attraction.where}</p>
        <h3 className="mt-2 font-display text-[1.7rem] font-medium leading-tight text-nile">{attraction.name}</h3>
        <p className="mt-3 leading-relaxed text-stone">{attraction.summary}</p>
        {(attraction.visitTime || attraction.note) && (
          <dl className="mt-auto space-y-2 pt-5 text-sm">
            {attraction.visitTime && (
              <div className="flex gap-2 border-t border-sand pt-3">
                <dt className="font-semibold text-nile">{ui.common.suggestedTime}:</dt>
                <dd className="text-stone">{attraction.visitTime}</dd>
              </div>
            )}
            {attraction.note && (
              <div className={`flex gap-2 ${attraction.visitTime ? "" : "border-t border-sand pt-3"}`}>
                <dt className="sr-only">{ui.common.goodToKnow}</dt>
                <dd className="flex gap-2 text-stone">
                  <svg viewBox="0 0 16 16" className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden="true">
                    <circle cx="8" cy="8" r="6.5" fill="none" stroke="currentColor" />
                    <path d="M8 7v4M8 4.6v.1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                  </svg>
                  <span>{attraction.note}</span>
                </dd>
              </div>
            )}
          </dl>
        )}
      </div>
    </article>
  );
}
