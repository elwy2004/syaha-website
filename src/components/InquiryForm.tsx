"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useId, useMemo, useRef, useState, type ReactNode } from "react";
import { stepFields, validate, type FieldError, type InquiryInput } from "@/lib/inquiry";
import type { UI } from "@/content/ui";

type FormCopy = UI["form"];

type Props = {
  copy: FormCopy;
  locale: string;
  configured: boolean;
  destinations: { value: string; label: string }[];
  journeys: { value: string; label: string; destinations: string[]; days: number }[];
  interests: { value: string; label: string }[];
};

type Values = {
  destinations: string[];
  journey: string;
  dateMode: "exact" | "flexible";
  startDate: string;
  endDate: string;
  flexibleWhen: string;
  adults: string;
  children: string;
  childrenAges: string;
  length: string;
  interests: string[];
  pace: "relaxed" | "balanced" | "active";
  budget: string;
  accessibility: string;
  name: string;
  email: string;
  phone: string;
  contactMethod: "email" | "phone" | "whatsapp";
  language: string;
  requests: string;
  consent: boolean;
  website: string;
};

type Status = "idle" | "submitting" | "success" | "error" | "not_configured" | "rate_limited";

const lengthKeys = ["1-3", "4-6", "7-9", "10-14", "15+", "unsure"];
const budgetKeys = ["", "moderate", "comfortable", "premium", "luxury"];

function lengthFor(days: number) {
  if (days <= 3) return "1-3";
  if (days <= 6) return "4-6";
  if (days <= 9) return "7-9";
  if (days <= 14) return "10-14";
  return "15+";
}

const empty: Values = {
  destinations: [],
  journey: "",
  dateMode: "exact",
  startDate: "",
  endDate: "",
  flexibleWhen: "",
  adults: "2",
  children: "0",
  childrenAges: "",
  length: "",
  interests: [],
  pace: "balanced",
  budget: "",
  accessibility: "",
  name: "",
  email: "",
  phone: "",
  contactMethod: "email",
  language: "",
  requests: "",
  consent: false,
  website: "",
};

export function InquiryForm(props: Props) {
  return (
    <Suspense fallback={<Form {...props} preset={{}} />}>
      <WithParams {...props} />
    </Suspense>
  );
}

function WithParams(props: Props) {
  const params = useSearchParams();
  const preset = useMemo(
    () => ({ destination: params.get("destination") ?? undefined, journey: params.get("journey") ?? undefined }),
    [params],
  );
  return <Form {...props} preset={preset} />;
}

function Form({ copy, locale, configured, destinations, journeys, interests, preset }: Props & { preset: { destination?: string; journey?: string } }) {
  const uid = useId();
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<Values>(empty);
  const [errors, setErrors] = useState<Record<string, FieldError>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [reference, setReference] = useState("");
  const [copied, setCopied] = useState(false);
  const startedAt = useRef(Date.now());
  const headingRef = useRef<HTMLHeadingElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);
  const totalSteps = 3;

  // Carry the destination or journey chosen on the previous page into the form.
  useEffect(() => {
    const j = journeys.find((x) => x.value === preset.journey);
    const d = destinations.find((x) => x.value === preset.destination);
    if (!j && !d) return;
    setValues((v) => ({
      ...v,
      journey: j ? j.value : v.journey,
      destinations: j ? j.destinations : d ? [d.value] : v.destinations,
      length: j && j.days >= 1 ? lengthFor(j.days) : v.length,
    }));
  }, [preset.journey, preset.destination, journeys, destinations]);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    headingRef.current?.focus();
  }, [step]);

  useEffect(() => {
    if (status !== "idle" && status !== "submitting") resultRef.current?.focus();
  }, [status]);

  const set = <K extends keyof Values>(key: K, value: Values[K]) => {
    setValues((v) => ({ ...v, [key]: value }));
    if (errors[key as string]) setErrors((prev) => omit(prev, key as string));
  };

  const toggle = (key: "destinations" | "interests", value: string) => {
    setValues((v) => {
      let list = v[key].includes(value) ? v[key].filter((x) => x !== value) : [...v[key], value];
      if (key === "destinations") {
        if (value === "unsure" && list.includes("unsure")) list = ["unsure"];
        else list = list.filter((x) => x !== "unsure" || value === "unsure");
      }
      return { ...v, [key]: list };
    });
    if (errors[key]) setErrors((prev) => omit(prev, key));
  };

  const payload = (): InquiryInput => ({
    ...values,
    destinations: values.destinations as InquiryInput["destinations"],
    length: values.length as InquiryInput["length"],
    interests: values.interests as InquiryInput["interests"],
    budget: values.budget as InquiryInput["budget"],
    adults: Number(values.adults),
    children: Number(values.children || 0),
    consent: values.consent as true,
    locale,
    startedAt: startedAt.current,
  });

  const check = (fields: string[]) => {
    const found = validate(payload(), fields);
    setErrors(found);
    if (Object.keys(found).length) {
      requestAnimationFrame(() => summaryRef.current?.focus());
      return false;
    }
    return true;
  };

  const next = () => {
    if (check(stepFields[step])) setStep((s) => s + 1);
  };

  const submit = async () => {
    if (!check(stepFields.flat())) {
      const firstBad = stepFields.findIndex((fields) => fields.some((f) => validate(payload(), fields)[f]));
      if (firstBad >= 0) setStep(firstBad);
      return;
    }
    setStatus("submitting");
    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload()),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; reference?: string; code?: string; errors?: Record<string, FieldError> };
      if (res.ok && data.ok && data.reference) {
        setReference(data.reference);
        setStatus("success");
      } else if (data.code === "not_configured") {
        setStatus("not_configured");
      } else if (data.code === "rate_limited") {
        setStatus("rate_limited");
      } else if (data.code === "invalid" && data.errors && Object.keys(data.errors).length) {
        setErrors(data.errors);
        const firstBad = stepFields.findIndex((fields) => fields.some((f) => data.errors![f]));
        setStatus("idle");
        setStep(firstBad >= 0 ? firstBad : 0);
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  // Plain-text summary for copying or downloading when delivery is unavailable.
  const rows = (): [string, string][] => {
    const destLabel = (v: string) => (v === "unsure" ? copy.notSure : destinations.find((d) => d.value === v)?.label ?? v);
    return [
      [copy.destinations, values.destinations.map(destLabel).join(", ") || copy.notProvided],
      [copy.journey, journeys.find((j) => j.value === values.journey)?.label ?? copy.journeyNone],
      [
        copy.dates,
        values.dateMode === "exact"
          ? `${values.startDate || copy.notProvided}${values.endDate ? ` → ${values.endDate}` : ""}`
          : `${copy.datesFlexible}: ${values.flexibleWhen}`,
      ],
      [copy.adults, values.adults],
      [copy.children, `${values.children}${values.childrenAges ? ` (${values.childrenAges})` : ""}`],
      [copy.length, copy.lengthOptions[lengthKeys.indexOf(values.length)] ?? copy.notProvided],
      [copy.interests, values.interests.map((i) => interests.find((x) => x.value === i)?.label ?? copy.photography).join(", ") || copy.notProvided],
      [copy.pace, { relaxed: copy.paceRelaxed, balanced: copy.paceBalanced, active: copy.paceActive }[values.pace]],
      [copy.budget, copy.budgetOptions[budgetKeys.indexOf(values.budget)] ?? copy.notProvided],
      [copy.accessibility, values.accessibility || copy.notProvided],
      [copy.name, values.name],
      [copy.email, values.email],
      [copy.phone, values.phone || copy.notProvided],
      [copy.contactMethod, { email: copy.contactEmail, phone: copy.contactPhone, whatsapp: copy.contactWhatsapp }[values.contactMethod]],
      [copy.language, values.language || copy.notProvided],
      [copy.requests, values.requests || copy.notProvided],
    ];
  };
  const summaryText = () => `Syaha Tour\n\n${rows().map(([k, v]) => `${k}: ${v}`).join("\n")}\n`;

  const copySummary = async () => {
    try {
      await navigator.clipboard.writeText(summaryText());
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  };

  const downloadSummary = () => {
    const blob = new Blob([summaryText()], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "syaha-tour-inquiry.txt";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const err = (field: string) => (errors[field] ? copy.errors[errors[field]] : undefined);
  const today = new Date().toISOString().slice(0, 10);

  if (status === "success") {
    return (
      <div ref={resultRef} tabIndex={-1} role="status" className="bg-nile p-8 text-ivory outline-none sm:p-12">
        <svg viewBox="0 0 48 48" className="h-12 w-12 text-gold" aria-hidden="true">
          <circle cx="24" cy="24" r="22" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="m15 24.5 6 6 12-13" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
        <h2 className="mt-6 font-display text-4xl leading-tight">{copy.successTitle}</h2>
        <p className="mt-4 max-w-xl leading-relaxed text-ivory/85">{copy.successBody}</p>
        <p className="mt-6 text-sm">
          {copy.successReference}: <strong className="font-semibold tracking-wide text-gold-soft">{reference}</strong>
        </p>
      </div>
    );
  }

  const stepTitle = step < 3 ? copy.steps[step] : copy.reviewTitle;
  const errorList = Object.entries(errors);

  return (
    <div>
      {!configured && (
        <div className="mb-8 flex gap-4 border border-gold bg-sand/50 p-5 text-sm leading-relaxed" role="note">
          <span className="mt-0.5 h-fit shrink-0 self-start rounded-full bg-gold px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-[0.12em] text-nile-deep">{copy.previewBadge}</span>
          <div className="min-w-0">
            <p className="font-semibold text-nile">{copy.previewTitle}</p>
            <p className="mt-1 text-charcoal/80">{copy.previewBody}</p>
          </div>
        </div>
      )}

      {/* Progress */}
      <div>
        <p className="text-sm text-stone" aria-live="polite">
          {copy.stepOf.replace("{current}", String(Math.min(step + 1, 4))).replace("{total}", "4")}
        </p>
        <ol className="mt-3 grid grid-cols-4 gap-2" aria-label={copy.stepOf.replace("{current}", String(step + 1)).replace("{total}", "4")}>
          {copy.steps.map((label, i) => (
            <li key={label} aria-current={i === step ? "step" : undefined}>
              <span className={`block h-1 rounded-full transition-colors ${i <= step ? "bg-gold" : "bg-sand-deep/60"}`} />
              <span className={`mt-2 hidden text-xs sm:block ${i === step ? "font-semibold text-nile" : "text-stone"}`}>{label}</span>
            </li>
          ))}
        </ol>
      </div>

      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          if (step < totalSteps) next();
          else void submit();
        }}
        className="mt-10"
        aria-labelledby={`${uid}-title`}
      >
        <h2 id={`${uid}-title`} ref={headingRef} tabIndex={-1} className="font-display text-4xl leading-tight text-nile outline-none sm:text-5xl">
          {stepTitle}
        </h2>

        {errorList.length > 0 && (
          <div ref={summaryRef} tabIndex={-1} role="alert" className="mt-6 border-l-4 border-error bg-error/5 p-5 outline-none">
            <p className="font-semibold text-error">{copy.errorSummary}</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
              {errorList.map(([field, key]) => (
                <li key={field}>
                  <a href={`#${uid}-${field}`} className="underline underline-offset-2">
                    {copy.errors[key]}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Honeypot: hidden from people and assistive technology. */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
          <label>
            Website
            <input type="text" tabIndex={-1} autoComplete="off" value={values.website} onChange={(e) => set("website", e.target.value)} />
          </label>
        </div>

        <div className="mt-8 space-y-9">
          {step === 0 && (
            <>
              <fieldset id={`${uid}-destinations`} tabIndex={-1} aria-describedby={`${uid}-destinations-hint`} aria-invalid={!!err("destinations")} className="outline-none">
                <legend className="text-base font-semibold text-nile">
                  {copy.destinations} <Req copy={copy} />
                </legend>
                <p id={`${uid}-destinations-hint`} className="mt-1 text-sm text-stone">{copy.destinationsHint}</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  {[...destinations, { value: "unsure", label: copy.notSure }].map((d) => (
                    <Chip key={d.value} type="checkbox" name="destinations" checked={values.destinations.includes(d.value)} onChange={() => toggle("destinations", d.value)}>
                      {d.label}
                    </Chip>
                  ))}
                </div>
                <FieldError id={`${uid}-destinations-error`} message={err("destinations")} />
              </fieldset>

              <Field id={`${uid}-journey`} label={copy.journey} optional={copy.optional}>
                <select id={`${uid}-journey`} className="field" value={values.journey} onChange={(e) => set("journey", e.target.value)}>
                  <option value="">{copy.journeyNone}</option>
                  {journeys.map((j) => (
                    <option key={j.value} value={j.value}>{j.label}</option>
                  ))}
                </select>
              </Field>

              <fieldset>
                <legend className="text-base font-semibold text-nile">
                  {copy.dates} <Req copy={copy} />
                </legend>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Chip type="radio" name="dateMode" checked={values.dateMode === "exact"} onChange={() => set("dateMode", "exact")}>{copy.datesExact}</Chip>
                  <Chip type="radio" name="dateMode" checked={values.dateMode === "flexible"} onChange={() => set("dateMode", "flexible")}>{copy.datesFlexible}</Chip>
                </div>
                {values.dateMode === "exact" ? (
                  <div className="mt-5 grid gap-5 sm:grid-cols-2">
                    <Field id={`${uid}-startDate`} label={copy.startDate} error={err("startDate")} required={copy.required}>
                      <input id={`${uid}-startDate`} type="date" min={today} className="field" value={values.startDate} onChange={(e) => set("startDate", e.target.value)} aria-invalid={!!err("startDate")} aria-describedby={err("startDate") ? `${uid}-startDate-error` : undefined} />
                    </Field>
                    <Field id={`${uid}-endDate`} label={copy.endDate} optional={copy.optional} error={err("endDate")}>
                      <input id={`${uid}-endDate`} type="date" min={values.startDate || today} className="field" value={values.endDate} onChange={(e) => set("endDate", e.target.value)} aria-invalid={!!err("endDate")} aria-describedby={err("endDate") ? `${uid}-endDate-error` : undefined} />
                    </Field>
                  </div>
                ) : (
                  <div className="mt-5">
                    <Field id={`${uid}-flexibleWhen`} label={copy.flexibleWhen} hint={copy.flexibleWhenHint} error={err("flexibleWhen")} required={copy.required}>
                      <input id={`${uid}-flexibleWhen`} type="text" className="field" value={values.flexibleWhen} onChange={(e) => set("flexibleWhen", e.target.value)} aria-invalid={!!err("flexibleWhen")} aria-describedby={`${uid}-flexibleWhen-hint${err("flexibleWhen") ? ` ${uid}-flexibleWhen-error` : ""}`} />
                    </Field>
                  </div>
                )}
              </fieldset>

              <div className="grid gap-5 sm:grid-cols-3">
                <Field id={`${uid}-adults`} label={copy.adults} error={err("adults")}>
                  <input id={`${uid}-adults`} type="number" inputMode="numeric" min={1} max={50} className="field" value={values.adults} onChange={(e) => set("adults", e.target.value)} aria-invalid={!!err("adults")} aria-describedby={err("adults") ? `${uid}-adults-error` : undefined} />
                </Field>
                <Field id={`${uid}-children`} label={copy.children} error={err("children")}>
                  <input id={`${uid}-children`} type="number" inputMode="numeric" min={0} max={20} className="field" value={values.children} onChange={(e) => set("children", e.target.value)} aria-invalid={!!err("children")} aria-describedby={err("children") ? `${uid}-children-error` : undefined} />
                </Field>
                {Number(values.children) > 0 && (
                  <Field id={`${uid}-childrenAges`} label={copy.childrenAges} optional={copy.optional}>
                    <input id={`${uid}-childrenAges`} type="text" className="field" value={values.childrenAges} onChange={(e) => set("childrenAges", e.target.value)} />
                  </Field>
                )}
              </div>

              <Field id={`${uid}-length`} label={copy.length} error={err("length")} required={copy.required}>
                <select id={`${uid}-length`} className="field" value={values.length} onChange={(e) => set("length", e.target.value)} aria-invalid={!!err("length")} aria-describedby={err("length") ? `${uid}-length-error` : undefined}>
                  <option value="" disabled>—</option>
                  {lengthKeys.map((k, i) => (
                    <option key={k} value={k}>{copy.lengthOptions[i]}</option>
                  ))}
                </select>
              </Field>
            </>
          )}

          {step === 1 && (
            <>
              <fieldset aria-describedby={`${uid}-interests-hint`}>
                <legend className="text-base font-semibold text-nile">
                  {copy.interests} <span className="font-normal text-stone">({copy.optional})</span>
                </legend>
                <p id={`${uid}-interests-hint`} className="mt-1 text-sm text-stone">{copy.interestsHint}</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  {[...interests, { value: "photography", label: copy.photography }].map((i) => (
                    <Chip key={i.value} type="checkbox" name="interests" checked={values.interests.includes(i.value)} onChange={() => toggle("interests", i.value)}>
                      {i.label}
                    </Chip>
                  ))}
                </div>
              </fieldset>

              <fieldset>
                <legend className="text-base font-semibold text-nile">{copy.pace}</legend>
                <div className="mt-4 flex flex-wrap gap-3">
                  {(["relaxed", "balanced", "active"] as const).map((p) => (
                    <Chip key={p} type="radio" name="pace" checked={values.pace === p} onChange={() => set("pace", p)}>
                      {{ relaxed: copy.paceRelaxed, balanced: copy.paceBalanced, active: copy.paceActive }[p]}
                    </Chip>
                  ))}
                </div>
              </fieldset>

              <Field id={`${uid}-budget`} label={copy.budget} hint={copy.budgetHint} optional={copy.optional}>
                <select id={`${uid}-budget`} className="field" value={values.budget} onChange={(e) => set("budget", e.target.value)} aria-describedby={`${uid}-budget-hint`}>
                  {budgetKeys.map((k, i) => (
                    <option key={k || "none"} value={k}>{copy.budgetOptions[i]}</option>
                  ))}
                </select>
              </Field>

              <Field id={`${uid}-accessibility`} label={copy.accessibility} hint={copy.accessibilityHint} optional={copy.optional}>
                <textarea id={`${uid}-accessibility`} rows={3} className="field" value={values.accessibility} onChange={(e) => set("accessibility", e.target.value)} aria-describedby={`${uid}-accessibility-hint`} />
              </Field>
            </>
          )}

          {step === 2 && (
            <>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field id={`${uid}-name`} label={copy.name} error={err("name")} required={copy.required}>
                  <input id={`${uid}-name`} type="text" autoComplete="name" className="field" value={values.name} onChange={(e) => set("name", e.target.value)} aria-invalid={!!err("name")} aria-describedby={err("name") ? `${uid}-name-error` : undefined} />
                </Field>
                <Field id={`${uid}-email`} label={copy.email} error={err("email")} required={copy.required}>
                  <input id={`${uid}-email`} type="email" autoComplete="email" className="field" value={values.email} onChange={(e) => set("email", e.target.value)} aria-invalid={!!err("email")} aria-describedby={err("email") ? `${uid}-email-error` : undefined} />
                </Field>
              </div>

              <fieldset>
                <legend className="text-base font-semibold text-nile">{copy.contactMethod}</legend>
                <div className="mt-4 flex flex-wrap gap-3">
                  {(["email", "phone", "whatsapp"] as const).map((m) => (
                    <Chip key={m} type="radio" name="contactMethod" checked={values.contactMethod === m} onChange={() => set("contactMethod", m)}>
                      {{ email: copy.contactEmail, phone: copy.contactPhone, whatsapp: copy.contactWhatsapp }[m]}
                    </Chip>
                  ))}
                </div>
              </fieldset>

              <Field id={`${uid}-phone`} label={copy.phone} hint={copy.phoneHint} error={err("phone")} optional={values.contactMethod === "email" ? copy.optional : undefined} required={values.contactMethod !== "email" ? copy.required : undefined}>
                <input id={`${uid}-phone`} type="tel" autoComplete="tel" inputMode="tel" placeholder="+" className="field" value={values.phone} onChange={(e) => set("phone", e.target.value)} aria-invalid={!!err("phone")} aria-describedby={`${uid}-phone-hint${err("phone") ? ` ${uid}-phone-error` : ""}`} />
              </Field>

              <Field id={`${uid}-language`} label={copy.language} hint={copy.languageHint} optional={copy.optional}>
                <input id={`${uid}-language`} type="text" className="field" value={values.language} onChange={(e) => set("language", e.target.value)} aria-describedby={`${uid}-language-hint`} />
              </Field>

              <Field id={`${uid}-requests`} label={copy.requests} hint={copy.requestsHint} optional={copy.optional}>
                <textarea id={`${uid}-requests`} rows={4} className="field" value={values.requests} onChange={(e) => set("requests", e.target.value)} aria-describedby={`${uid}-requests-hint`} />
              </Field>

              <div>
                <label htmlFor={`${uid}-consent`} className="flex cursor-pointer items-start gap-3">
                  <input
                    id={`${uid}-consent`}
                    type="checkbox"
                    checked={values.consent}
                    onChange={(e) => set("consent", e.target.checked)}
                    aria-invalid={!!err("consent")}
                    aria-describedby={err("consent") ? `${uid}-consent-error` : undefined}
                    className="mt-1 h-5 w-5 shrink-0 accent-nile"
                  />
                  <span className="leading-relaxed">
                    {copy.consent} <Req copy={copy} />
                  </span>
                </label>
                <FieldError id={`${uid}-consent-error`} message={err("consent")} />
              </div>
            </>
          )}

          {step === 3 && (
            <div>
              <p className="text-stone">{copy.reviewBody}</p>
              <dl className="mt-6 divide-y divide-sand border-y border-sand">
                {rows().map(([k, v], i) => {
                  const target = i < 6 ? 0 : i < 10 ? 1 : 2;
                  return (
                    <div key={k} className="grid gap-1 py-3 sm:grid-cols-[13rem_1fr_auto] sm:gap-4">
                      <dt className="text-sm font-semibold text-nile">{k}</dt>
                      <dd className="break-words text-charcoal/85">{v}</dd>
                      <dd>
                        <button type="button" className="text-sm font-semibold text-gold-deep underline-offset-4 hover:underline" onClick={() => setStep(target)}>
                          {copy.edit}
                          <span className="sr-only">: {k}</span>
                        </button>
                      </dd>
                    </div>
                  );
                })}
              </dl>
            </div>
          )}
        </div>

        {(status === "error" || status === "not_configured" || status === "rate_limited") && (
          <div ref={resultRef} tabIndex={-1} role="alert" className="mt-10 border border-error/40 bg-error/5 p-6 outline-none">
            <p className="font-display text-2xl text-error">{status === "not_configured" ? copy.notConfiguredTitle : copy.errorTitle}</p>
            <p className="mt-2 leading-relaxed text-charcoal/85">
              {status === "not_configured" ? copy.previewBody : status === "rate_limited" ? copy.rateLimited : copy.errorBody}
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              {status !== "not_configured" && (
                <button type="button" className="btn btn-primary" onClick={() => void submit()}>
                  {copy.errorRetry}
                </button>
              )}
              <button type="button" className="btn btn-outline text-nile" onClick={copySummary}>
                {copied ? copy.copied : copy.copy}
              </button>
              <button type="button" className="btn btn-outline text-nile" onClick={downloadSummary}>
                {copy.download}
              </button>
            </div>
            <p className="sr-only" aria-live="polite">{copied ? copy.copied : ""}</p>
          </div>
        )}

        <div className="mt-12 flex flex-col-reverse gap-3 border-t border-sand pt-8 sm:flex-row sm:items-center sm:justify-between">
          {step > 0 ? (
            <button type="button" className="btn btn-outline text-nile" onClick={() => setStep((s) => s - 1)}>
              <span aria-hidden="true">←</span> {copy.back}
            </button>
          ) : (
            <span />
          )}
          <button type="submit" className="btn btn-primary min-w-48" disabled={status === "submitting"} aria-busy={status === "submitting"}>
            {status === "submitting" ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-ivory/40 border-t-ivory" aria-hidden="true" />
                {copy.sending}
              </>
            ) : step < totalSteps ? (
              <>
                {copy.next} <span aria-hidden="true">→</span>
              </>
            ) : (
              copy.submit
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

function omit<T extends Record<string, unknown>>(obj: T, key: string): T {
  const copy = { ...obj };
  delete copy[key];
  return copy;
}

function Req({ copy }: { copy: FormCopy }) {
  return (
    <span className="text-gold-deep">
      <span aria-hidden="true">*</span>
      <span className="sr-only">({copy.required})</span>
    </span>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-2 flex items-center gap-2 text-sm font-medium text-error">
      <svg viewBox="0 0 16 16" className="h-4 w-4 shrink-0" aria-hidden="true">
        <circle cx="8" cy="8" r="7" fill="currentColor" />
        <path d="M8 4.5v4.5M8 11v.2" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
      {message}
    </p>
  );
}

function Field({
  id,
  label,
  hint,
  error,
  optional,
  required,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  optional?: string;
  required?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="block font-semibold text-nile">
        {label}
        {optional && <span className="ml-1 font-normal text-stone">({optional})</span>}
        {required && (
          <span className="text-gold-deep">
            {" "}
            <span aria-hidden="true">*</span>
            <span className="sr-only">({required})</span>
          </span>
        )}
      </label>
      {hint && (
        <p id={`${id}-hint`} className="mt-1 text-sm text-stone">
          {hint}
        </p>
      )}
      <div className="mt-2">{children}</div>
      <FieldError id={`${id}-error`} message={error} />
    </div>
  );
}

function Chip({
  type,
  name,
  checked,
  onChange,
  children,
}: {
  type: "checkbox" | "radio";
  name: string;
  checked: boolean;
  onChange: () => void;
  children: ReactNode;
}) {
  return (
    <label className="relative cursor-pointer">
      <input type={type} name={name} checked={checked} onChange={onChange} className="peer sr-only" />
      <span
        className={`flex min-h-11 items-center gap-2 rounded-full border px-5 py-2.5 text-[0.95rem] transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-gold peer-focus-visible:ring-offset-2 ${
          checked ? "border-nile bg-nile text-ivory" : "border-sand-deep bg-[#fffdf9] hover:border-gold"
        }`}
      >
        {type === "checkbox" && checked && (
          <svg viewBox="0 0 16 16" className="-ml-1 h-3.5 w-3.5" aria-hidden="true">
            <path d="m3 8.5 3 3 7-7" fill="none" stroke="currentColor" strokeWidth="2" />
          </svg>
        )}
        {children}
      </span>
    </label>
  );
}
