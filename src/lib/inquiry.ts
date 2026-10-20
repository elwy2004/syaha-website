import { z } from "zod";

// Shared inquiry schema: the client validates each step with it and the
// server validates the whole submission again before delivering it.

export const destinationValues = ["cairo-giza", "luxor", "aswan-nubia", "unsure"] as const;
export const lengthValues = ["1-3", "4-6", "7-9", "10-14", "15+", "unsure"] as const;
export const interestValues = ["monuments", "museums", "culture", "nile", "specialist", "photography"] as const;
export const paceValues = ["relaxed", "balanced", "active"] as const;
export const budgetValues = ["", "moderate", "comfortable", "premium", "luxury"] as const;
export const contactValues = ["email", "phone", "whatsapp"] as const;

const isoDate = /^\d{4}-\d{2}-\d{2}$/;
const phonePattern = /^\+[1-9][\d\s().-]{6,20}$/;

export type FieldError =
  | "destinations"
  | "dates"
  | "dateOrder"
  | "datePast"
  | "flexibleWhen"
  | "adults"
  | "children"
  | "length"
  | "name"
  | "email"
  | "phone"
  | "phoneRequired"
  | "consent";

const text = (max: number) => z.string().trim().max(max);

export const inquirySchema = z
  .object({
    destinations: z.array(z.enum(destinationValues)).min(1, "destinations").max(4),
    journey: text(80).optional().default(""),
    dateMode: z.enum(["exact", "flexible"]),
    startDate: z.string().optional().default(""),
    endDate: z.string().optional().default(""),
    flexibleWhen: text(200).optional().default(""),
    adults: z.coerce.number().int().min(1, "adults").max(50, "adults"),
    children: z.coerce.number().int().min(0, "children").max(20, "children"),
    childrenAges: text(120).optional().default(""),
    length: z.enum(lengthValues, { message: "length" }),
    interests: z.array(z.enum(interestValues)).max(6).default([]),
    pace: z.enum(paceValues).default("balanced"),
    budget: z.enum(budgetValues).default(""),
    accessibility: text(1000).optional().default(""),
    name: text(120).min(2, "name"),
    email: z.string().trim().max(200).email("email"),
    phone: text(40).optional().default(""),
    contactMethod: z.enum(contactValues).default("email"),
    language: text(80).optional().default(""),
    requests: text(3000).optional().default(""),
    consent: z.literal(true, { message: "consent" }),
    locale: text(10).optional().default("en"),
    // Spam protection: a hidden field people never fill, and the time the form was opened.
    website: z.string().max(0).optional().default(""),
    startedAt: z.coerce.number().int().positive(),
  })
  .superRefine((v, ctx) => {
    for (const [field, message] of Object.entries(crossFieldErrors(v))) {
      ctx.addIssue({ code: "custom", path: [field], message });
    }
  });

type CrossFieldInput = {
  dateMode?: unknown; startDate?: unknown; endDate?: unknown; flexibleWhen?: unknown;
  phone?: unknown; contactMethod?: unknown;
};

/**
 * Checks that depend on more than one field. Kept outside the schema because
 * zod skips refinements while any other field is invalid, which would hide
 * date errors on step 1 while the contact step is still empty.
 */
function crossFieldErrors(input: CrossFieldInput): Record<string, FieldError> {
  const str = (x: unknown) => (typeof x === "string" ? x.trim() : "");
  const errors: Record<string, FieldError> = {};
  const startDate = str(input.startDate);
  const endDate = str(input.endDate);
  const phone = str(input.phone);
  if (input.dateMode === "exact") {
    if (!isoDate.test(startDate)) errors.startDate = "dates";
    else {
      const today = new Date().toISOString().slice(0, 10);
      if (startDate < today) errors.startDate = "datePast";
      if (endDate && (!isoDate.test(endDate) || endDate <= startDate)) errors.endDate = "dateOrder";
    }
  } else if (input.dateMode === "flexible" && str(input.flexibleWhen).length < 2) {
    errors.flexibleWhen = "flexibleWhen";
  }
  if (phone && !phonePattern.test(phone)) errors.phone = "phone";
  if (input.contactMethod !== undefined && input.contactMethod !== "email" && !phone) errors.phone = "phoneRequired";
  return errors;
}

export type InquiryInput = z.input<typeof inquirySchema>;
export type Inquiry = z.output<typeof inquirySchema>;

/** Which form fields belong to each step, for step-by-step validation. */
export const stepFields: string[][] = [
  ["destinations", "journey", "dateMode", "startDate", "endDate", "flexibleWhen", "adults", "children", "childrenAges", "length"],
  ["interests", "pace", "budget", "accessibility"],
  ["name", "email", "phone", "contactMethod", "language", "requests", "consent"],
];

const errorKeys = new Set<string>([
  "destinations", "dates", "dateOrder", "datePast", "flexibleWhen", "adults", "children",
  "length", "name", "email", "phone", "phoneRequired", "consent",
]);

const fallbackError: Record<string, FieldError> = {
  destinations: "destinations",
  dateMode: "dates",
  startDate: "dates",
  endDate: "dateOrder",
  adults: "adults",
  children: "children",
  length: "length",
  name: "name",
  email: "email",
  phone: "phone",
  consent: "consent",
};

/** Validate and return the first error per field, as translation keys. */
export function validate(input: unknown, fields?: string[]): Record<string, FieldError> {
  const result = inquirySchema.safeParse(input);
  if (result.success) return {};
  const errors: Record<string, FieldError> = {};
  const cross = input && typeof input === "object" ? crossFieldErrors(input as CrossFieldInput) : {};
  for (const [field, key] of Object.entries(cross)) {
    if (!fields || fields.includes(field)) errors[field] = key;
  }
  for (const issue of result.error.issues) {
    const field = String(issue.path[0] ?? "");
    if (fields && !fields.includes(field)) continue;
    if (["website", "startedAt", "locale"].includes(field)) continue;
    if (errors[field]) continue;
    const known = errorKeys.has(issue.message) ? (issue.message as FieldError) : undefined;
    errors[field] = known ?? fallbackError[field] ?? "name";
  }
  return errors;
}
