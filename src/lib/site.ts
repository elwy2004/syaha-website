import "server-only";

// Business configuration read from the environment. Nothing here is hard-coded
// because the supplied guides contain no contact details: each item appears on
// the site only once it has been configured. See .env.example.

function clean(value: string | undefined) {
  const v = value?.trim();
  return v ? v : undefined;
}

export const siteUrl = (clean(process.env.NEXT_PUBLIC_SITE_URL) ?? "http://localhost:3000").replace(/\/$/, "");

/** WhatsApp number in international format, digits only (e.g. 201001234567). */
export function whatsappNumber() {
  const raw = clean(process.env.WHATSAPP_NUMBER);
  if (!raw) return undefined;
  const digits = raw.replace(/[^\d]/g, "");
  return digits.length >= 8 && digits.length <= 15 ? digits : undefined;
}

export function whatsappLink(text?: string) {
  const n = whatsappNumber();
  if (!n) return undefined;
  return `https://wa.me/${n}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
}

export function contactDetails() {
  return {
    email: clean(process.env.CONTACT_EMAIL),
    phone: clean(process.env.CONTACT_PHONE),
    whatsapp: whatsappNumber(),
  };
}

export type InquiryProvider =
  | { kind: "resend"; apiKey: string; to: string[]; from: string }
  | { kind: "webhook"; url: string; secret?: string };

/** The configured inquiry delivery services, in the order they are tried. */
export function inquiryProviders(): InquiryProvider[] {
  const providers: InquiryProvider[] = [];
  const apiKey = clean(process.env.RESEND_API_KEY);
  const to = clean(process.env.INQUIRY_TO_EMAIL);
  const from = clean(process.env.INQUIRY_FROM_EMAIL);
  if (apiKey && to && from) {
    providers.push({ kind: "resend", apiKey, to: to.split(",").map((s) => s.trim()).filter(Boolean), from });
  }
  const url = clean(process.env.INQUIRY_WEBHOOK_URL);
  if (url) providers.push({ kind: "webhook", url, secret: clean(process.env.INQUIRY_WEBHOOK_SECRET) });
  return providers;
}

export function inquiryConfigured() {
  return inquiryProviders().length > 0;
}
