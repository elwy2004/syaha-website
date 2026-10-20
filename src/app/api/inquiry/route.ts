import { NextResponse, type NextRequest } from "next/server";
import { inquiryProviders, type InquiryProvider } from "@/lib/site";
import { validate, inquirySchema, type Inquiry } from "@/lib/inquiry";

// Receives trip inquiries. A success response is returned only after a
// configured delivery service (email via Resend and/or a CRM webhook) has
// accepted the inquiry. With nothing configured, the route answers 503 and the
// form switches to preview mode so the visitor can copy or download it.

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const MIN_FILL_MS = 4000;
const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_PER_WINDOW;
}

function reference() {
  const d = new Date();
  const date = `${String(d.getUTCFullYear()).slice(2)}${String(d.getUTCMonth() + 1).padStart(2, "0")}${String(d.getUTCDate()).padStart(2, "0")}`;
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `ST-${date}-${rand}`;
}

const labels: Record<string, string> = {
  "cairo-giza": "Cairo & Giza",
  luxor: "Luxor",
  "aswan-nubia": "Aswan & Nubia",
  unsure: "Not sure yet",
};

function summarise(i: Inquiry, ref: string) {
  const lines: [string, string][] = [
    ["Reference", ref],
    ["Destinations", i.destinations.map((d) => labels[d] ?? d).join(", ")],
    ["Suggested journey", i.journey || "None selected"],
    ["Dates", i.dateMode === "exact" ? `${i.startDate}${i.endDate ? ` to ${i.endDate}` : ""}` : `Flexible: ${i.flexibleWhen}`],
    ["Travellers", `${i.adults} adult(s), ${i.children} child(ren)${i.childrenAges ? ` (ages ${i.childrenAges})` : ""}`],
    ["Trip length", i.length],
    ["Interests", i.interests.join(", ") || "Not specified"],
    ["Pace", i.pace],
    ["Budget", i.budget || "Not specified"],
    ["Accessibility", i.accessibility || "None given"],
    ["Name", i.name],
    ["Email", i.email],
    ["Phone / WhatsApp", i.phone || "Not given"],
    ["Preferred contact", i.contactMethod],
    ["Guide language", i.language || "Not specified"],
    ["Requests", i.requests || "None"],
    ["Site language", i.locale],
    ["Consent to contact", "Yes"],
  ];
  return lines;
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

async function deliver(provider: InquiryProvider, inquiry: Inquiry, ref: string) {
  const rows = summarise(inquiry, ref);
  const signal = AbortSignal.timeout(10000);
  if (provider.kind === "resend") {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      signal,
      headers: { Authorization: `Bearer ${provider.apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: provider.from,
        to: provider.to,
        reply_to: inquiry.email,
        subject: `Trip inquiry ${ref}: ${inquiry.name}`,
        text: rows.map(([k, v]) => `${k}: ${v}`).join("\n"),
        html: `<table cellpadding="6" style="font-family:sans-serif;font-size:14px;border-collapse:collapse">${rows
          .map(([k, v]) => `<tr><th align="left" valign="top" style="color:#123F43">${escapeHtml(k)}</th><td style="white-space:pre-wrap">${escapeHtml(v)}</td></tr>`)
          .join("")}</table>`,
      }),
    });
    return res.ok;
  }
  const res = await fetch(provider.url, {
    method: "POST",
    signal,
    headers: {
      "Content-Type": "application/json",
      ...(provider.secret ? { Authorization: `Bearer ${provider.secret}` } : {}),
    },
    body: JSON.stringify({ reference: ref, receivedAt: new Date().toISOString(), inquiry: { ...inquiry, website: undefined } }),
  });
  return res.ok;
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
  if (rateLimited(ip)) return NextResponse.json({ ok: false, code: "rate_limited" }, { status: 429 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, code: "invalid" }, { status: 400 });
  }

  // A filled honeypot is a bot: refuse before validation so it learns nothing.
  const honeypot = (body as { website?: unknown } | null)?.website;
  if (typeof honeypot === "string" && honeypot.trim() !== "") {
    return NextResponse.json({ ok: false, code: "rejected" }, { status: 400 });
  }

  const errors = validate(body);
  const parsed = inquirySchema.safeParse(body);
  if (!parsed.success || Object.keys(errors).length) {
    return NextResponse.json({ ok: false, code: "invalid", errors }, { status: 422 });
  }
  const inquiry = parsed.data;

  // Bots fill the hidden field or submit instantly. Reject without delivering.
  const elapsed = Date.now() - inquiry.startedAt;
  if (inquiry.website || elapsed < MIN_FILL_MS || elapsed > 1000 * 60 * 60 * 24) {
    return NextResponse.json({ ok: false, code: "rejected" }, { status: 400 });
  }

  const providers = inquiryProviders();
  if (providers.length === 0) {
    return NextResponse.json({ ok: false, code: "not_configured" }, { status: 503 });
  }

  const ref = reference();
  const results = await Promise.allSettled(providers.map((p) => deliver(p, inquiry, ref)));
  const accepted = results.some((r) => r.status === "fulfilled" && r.value);
  if (!accepted) {
    console.error("Inquiry delivery failed", results.map((r) => (r.status === "rejected" ? String(r.reason) : "non-2xx")));
    return NextResponse.json({ ok: false, code: "delivery_failed" }, { status: 502 });
  }
  return NextResponse.json({ ok: true, reference: ref });
}
