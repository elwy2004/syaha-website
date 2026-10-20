"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useId, useMemo, type ReactNode } from "react";

export type FilterDef = {
  name: string;
  label: string;
  allLabel: string;
  options: { value: string; label: string }[];
};

export type FilterItem = {
  key: string;
  /** Values per filter name; an item matches when it has the selected value. */
  tags: Record<string, string[]>;
  node: ReactNode;
};

type Copy = { results: string; empty: string; clear: string };

function Grid({
  filters,
  items,
  copy,
  className,
  selected,
  onSelect,
}: {
  filters: FilterDef[];
  items: FilterItem[];
  copy: Copy;
  className: string;
  selected: Record<string, string>;
  onSelect?: (updates: Record<string, string>) => void;
}) {
  const id = useId();
  const visible = items.filter((item) =>
    filters.every((f) => !selected[f.name] || item.tags[f.name]?.includes(selected[f.name])),
  );
  const active = filters.some((f) => selected[f.name]);

  return (
    <div>
      <div className="flex flex-col gap-6 border-y border-sand-deep py-6 lg:flex-row lg:items-start lg:gap-12">
        {filters.map((f) => (
          <div key={f.name} role="group" aria-labelledby={`${id}-${f.name}`} className="min-w-0">
            <p id={`${id}-${f.name}`} className="eyebrow">
              {f.label}
            </p>
            <div className="-mx-1 mt-3 flex flex-wrap gap-2">
              {[{ value: "", label: f.allLabel }, ...f.options].map((o) => {
                const pressed = (selected[f.name] ?? "") === o.value;
                return (
                  <button
                    key={o.value || "all"}
                    type="button"
                    aria-pressed={pressed}
                    disabled={!onSelect}
                    onClick={() => onSelect?.({ [f.name]: o.value })}
                    className={`min-h-10 rounded-full border px-4 py-2 text-sm transition-colors ${
                      pressed
                        ? "border-nile bg-nile text-ivory"
                        : "border-sand-deep bg-transparent text-charcoal hover:border-gold hover:bg-sand/40"
                    }`}
                  >
                    {o.label}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 flex items-center justify-between gap-4 text-sm text-stone">
        <p aria-live="polite" role="status">
          {copy.results.replace("{count}", String(visible.length)).replace("{total}", String(items.length))}
        </p>
        {active && onSelect && (
          <button
            type="button"
            className="font-semibold text-gold-deep underline-offset-4 hover:underline"
            onClick={() => onSelect(Object.fromEntries(filters.map((f) => [f.name, ""])))}
          >
            {copy.clear}
          </button>
        )}
      </div>
      {visible.length === 0 ? (
        <p className="mt-10 border border-dashed border-sand-deep p-10 text-center text-stone">{copy.empty}</p>
      ) : (
        <ul className={className}>
          {visible.map((item) => (
            <li key={item.key} className="flex">
              {item.node}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function UrlGrid(props: { filters: FilterDef[]; items: FilterItem[]; copy: Copy; className: string }) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const selected = useMemo(() => {
    const out: Record<string, string> = {};
    for (const f of props.filters) {
      const v = params.get(f.name) ?? "";
      if (f.options.some((o) => o.value === v)) out[f.name] = v;
    }
    return out;
  }, [params, props.filters]);

  const onSelect = useCallback(
    (updates: Record<string, string>) => {
      const next = new URLSearchParams(window.location.search);
      for (const [name, value] of Object.entries(updates)) {
        if (value) next.set(name, value);
        else next.delete(name);
      }
      const q = next.toString();
      router.replace(`${pathname}${q ? `?${q}` : ""}`, { scroll: false });
    },
    [pathname, router],
  );

  return <Grid {...props} selected={selected} onSelect={onSelect} />;
}

/** Filterable list whose state lives in the URL, so results can be linked. */
export function FilterGrid(props: { filters: FilterDef[]; items: FilterItem[]; copy: Copy; className: string }) {
  return (
    <Suspense fallback={<Grid {...props} selected={{}} />}>
      <UrlGrid {...props} />
    </Suspense>
  );
}
