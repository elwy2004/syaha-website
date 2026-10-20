"use client";

import { useRouter } from "next/navigation";
import { useId, useState } from "react";

type Option = { value: string; label: string };

/** Homepage selector that opens the experiences browser pre-filtered. */
export function Finder({
  action,
  copy,
  destinations,
  interests,
}: {
  action: string;
  copy: { title: string; destination: string; interest: string; anyDestination: string; anyInterest: string; submit: string };
  destinations: Option[];
  interests: Option[];
}) {
  const router = useRouter();
  const [destination, setDestination] = useState("");
  const [interest, setInterest] = useState("");
  const id = useId();

  return (
    <form
      action={action}
      method="get"
      onSubmit={(e) => {
        e.preventDefault();
        const q = new URLSearchParams();
        if (destination) q.set("destination", destination);
        if (interest) q.set("interest", interest);
        router.push(`${action}${q.size ? `?${q}` : ""}`);
      }}
      className="grid gap-3 bg-ivory p-5 text-charcoal shadow-[0_30px_80px_-30px_rgba(11,43,46,0.55)] sm:grid-cols-[1fr_1fr_auto] sm:items-end sm:gap-4 sm:p-6"
      aria-labelledby={`${id}-title`}
    >
      <p id={`${id}-title`} className="font-display text-2xl text-nile sm:col-span-3">
        {copy.title}
      </p>
      <label className="block">
        <span className="eyebrow block">{copy.destination}</span>
        <select name="destination" value={destination} onChange={(e) => setDestination(e.target.value)} className="field mt-2">
          <option value="">{copy.anyDestination}</option>
          {destinations.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className="eyebrow block">{copy.interest}</span>
        <select name="interest" value={interest} onChange={(e) => setInterest(e.target.value)} className="field mt-2">
          <option value="">{copy.anyInterest}</option>
          {interests.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </label>
      <button type="submit" className="btn btn-primary h-12 sm:px-8">
        {copy.submit}
        <span aria-hidden="true">→</span>
      </button>
    </form>
  );
}
