"use client";

import { useId, useState } from "react";
import type { ItineraryDay } from "@/content/types";

export function Itinerary({
  days,
  copy,
}: {
  days: ItineraryDay[];
  copy: { expandAll: string; collapseAll: string; optional: string };
}) {
  const [open, setOpen] = useState<boolean[]>(() => days.map((_, i) => i === 0));
  const id = useId();
  const allOpen = open.every(Boolean);

  return (
    <div>
      {days.length > 1 && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => setOpen(days.map(() => !allOpen))}
            className="text-sm font-semibold text-gold-deep underline-offset-4 hover:underline"
          >
            {allOpen ? copy.collapseAll : copy.expandAll}
          </button>
        </div>
      )}
      <ol className="mt-4 border-t border-sand-deep">
        {days.map((day, i) => {
          const panel = `${id}-panel-${i}`;
          const button = `${id}-button-${i}`;
          return (
            <li key={day.label + i} className="border-b border-sand-deep">
              <h3>
                <button
                  id={button}
                  type="button"
                  aria-expanded={open[i]}
                  aria-controls={panel}
                  onClick={() => setOpen((prev) => prev.map((v, j) => (j === i ? !v : v)))}
                  className="group flex w-full items-start gap-5 py-6 text-left sm:gap-8"
                >
                  <span className="w-16 shrink-0 pt-1 text-xs font-semibold uppercase tracking-[0.18em] text-gold-deep sm:w-20">{day.label}</span>
                  <span className="flex-1 font-display text-[1.6rem] leading-snug text-nile group-hover:text-nile-soft sm:text-3xl">{day.title}</span>
                  <span className="relative mt-3 h-3.5 w-3.5 shrink-0" aria-hidden="true">
                    <span className="absolute left-0 top-1/2 h-px w-3.5 bg-gold" />
                    <span className={`absolute left-1/2 top-0 h-3.5 w-px bg-gold transition-transform duration-300 ${open[i] ? "scale-y-0" : ""}`} />
                  </span>
                </button>
              </h3>
              <div id={panel} role="region" aria-labelledby={button} hidden={!open[i]} className="pb-8 sm:pl-28">
                <ul className="space-y-3">
                  {day.stops.map((stop, j) => (
                    <li key={j} className="flex gap-4">
                      <span className="w-16 shrink-0 text-sm tabular-nums text-stone">{stop.time ?? ""}</span>
                      <span className="flex-1 leading-relaxed">
                        {stop.text}
                        {stop.optional && (
                          <span className="ml-2 inline-block rounded-full border border-gold/60 px-2 py-0.5 align-middle text-[0.68rem] font-semibold uppercase tracking-[0.1em] text-gold-deep">
                            {copy.optional}
                          </span>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
                {day.note && <p className="mt-5 border-l-2 border-gold bg-sand/40 px-4 py-3 text-sm leading-relaxed text-charcoal/80">{day.note}</p>}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
