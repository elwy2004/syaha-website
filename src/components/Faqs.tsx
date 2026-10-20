/** Native disclosure widgets: keyboard and screen-reader friendly by default. */
export function Faqs({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="divide-y divide-sand-deep border-y border-sand-deep">
      {items.map((f) => (
        <details key={f.q} className="group py-1">
          <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-5 font-display text-[1.45rem] leading-snug text-nile marker:hidden [&::-webkit-details-marker]:hidden">
            {f.q}
            <span className="relative mt-3 h-3 w-3 shrink-0" aria-hidden="true">
              <span className="absolute left-0 top-1/2 h-px w-3 bg-gold" />
              <span className="absolute left-1/2 top-0 h-3 w-px bg-gold transition-transform duration-300 group-open:scale-y-0" />
            </span>
          </summary>
          <p className="max-w-2xl pb-6 leading-relaxed text-stone">{f.a}</p>
        </details>
      ))}
    </div>
  );
}
