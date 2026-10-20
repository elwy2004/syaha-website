# Syaha Tour website

Marketing and inquiry site for Syaha Tour: tailored journeys in Cairo and Giza, Luxor, and Aswan and Nubia. It is built with Next.js 15 (App Router), React 19, TypeScript and Tailwind CSS v4, and is available in eight languages.

The site is **not published**. Before launch, read [Business details still needed](docs/BUSINESS-DETAILS-NEEDED.md), [Translation review](docs/TRANSLATION-REVIEW.md) and [Image credits](IMAGE-CREDITS.md).

## Run it

Requires Node.js 18.18 or newer (20 LTS recommended).

```bash
npm install
cp .env.example .env.local     # optional; every value can stay empty
npm run dev                    # http://localhost:3000 → redirects to /en
```

Production build:

```bash
npm run build
npm start                      # serves the build on port 3000
```

Checks:

```bash
npm run lint
npm run typecheck
npm run i18n:check             # translation coverage per language
```

Environment variables are read when pages are built. **Rebuild after changing `.env.local`** so contact details and WhatsApp buttons appear. The planning form checks inquiry delivery on every request, so it needs only a restart.

## Pages

Every page exists once per language, at `/<locale>/…`, where locale is `en`, `de`, `fr`, `es`, `it`, `da`, `zh` or `ja`. A visit to `/` redirects to the visitor's saved language, or to English.

| Path | Page |
|---|---|
| `/en` | Home: hero, trip finder, destinations, suggested journeys, interests, how it works, FAQs |
| `/en/destinations` | All destinations, with a schematic Nile route |
| `/en/destinations/cairo-giza` · `luxor` · `aswan-nubia` | Destination pages, with places filterable by area and interest |
| `/en/experiences` | Every place, filterable by destination and interest |
| `/en/journeys` | Suggested journeys |
| `/en/journeys/<slug>` | Journey detail with a day-by-day itinerary (8 journeys) |
| `/en/plan-your-trip` | Three-step inquiry form plus review |
| `/en/contact` | Contact details, shown only once configured |
| `/en/image-credits` | Photograph credits and illustration notice |

Filters keep their state in the URL (for example `/en/destinations/luxor?area=royal-tombs&interest=specialist`), so a filtered view can be shared. Journey and destination buttons pre-fill the form (`/en/plan-your-trip?journey=luxor-three-days`).

## Inquiry form

The form validates every step in the browser and validates again on the server (`src/app/api/inquiry/route.ts`, using zod). It is protected against spam by:

- a hidden honeypot field;
- a minimum fill time of 4 seconds;
- a rate limit of 5 submissions per 10 minutes per IP address. The limit is held in memory, so it applies per server instance. Use a shared store such as Upstash Redis if you run several instances.

The form reports success **only after a delivery service accepts the inquiry** with a 2xx response. The server tries every configured service and succeeds if at least one accepts:

- **Email via Resend:** set `RESEND_API_KEY`, `INQUIRY_TO_EMAIL` and `INQUIRY_FROM_EMAIL`.
- **Webhook / CRM:** set `INQUIRY_WEBHOOK_URL` and, optionally, `INQUIRY_WEBHOOK_SECRET`, which is sent as `Authorization: Bearer …`. The body is JSON: `{ reference, receivedAt, inquiry }`, where `inquiry` holds the validated fields, including the page language.

If neither is configured, the form runs in **preview mode**. It says so before the visitor starts, nothing is sent, and the visitor can copy or download their summary instead. If a configured service fails, the visitor sees an error and their answers are kept.

## Languages

English content in `src/content/*.ts` is the source of truth. Translations live in `src/content/locales/<locale>.json`, built from the editable files in `scripts/translations/`. A language appears in the switcher, the sitemap and the hreflang tags only when every key is translated. All seven non-English languages are currently machine translations awaiting native review. See [docs/TRANSLATION-REVIEW.md](docs/TRANSLATION-REVIEW.md) for the editing workflow.

## Images

Every image slot renders an original illustration until a photograph's existence and licence have been verified. The **Fetch images** GitHub Action runs `npm run images:verify` whenever the image list changes: it checks each candidate on Wikimedia Commons, keeps only CC0, public domain, CC BY and CC BY-SA files, and commits local copies to `public/images` with credits in `src/content/image-manifest.json`. It also saves previews of further candidates in `docs/image-candidates/` for slots still without a photo. The script cannot tell whether a photo shows the right place, so review every photo on `/en/image-credits` before launch, as described in [IMAGE-CREDITS.md](IMAGE-CREDITS.md).

## Content rules

These rules come from the brief and are built into the content. Keep them when editing:

- Do not add prices, reviews, ratings, company history, certifications, availability claims or services that have not been confirmed.
- Itineraries are **suggested**. The call to action is "Request a tailored quote", never "Book".
- Special tomb tickets are separate from standard entry. Named tombs are possibilities, not guarantees.
- Abu Simbel is a long day of 10 to 12 hours.
- Lake Nasser sites need advance arrangements and are never an ordinary day tour.
- Kom Ombo and Edfu are optional stops on the onward route.
- Interior access to the Aga Khan Mausoleum is never promised.

## SEO

Each page has its own title, description, canonical URL and hreflang alternates, plus Open Graph and Twitter metadata. A generated social image is included. Structured data covers `TravelAgency`, `TouristDestination`, `TouristTrip`, `BreadcrumbList` and `FAQPage`, with no prices, ratings or addresses.

`robots.txt` **blocks all crawlers unless `ALLOW_INDEXING=true`**, so a preview deployment cannot be indexed by accident.

## Project layout

```
src/app/[locale]/        pages (one tree, rendered per language)
src/app/api/inquiry/     inquiry endpoint
src/components/          UI, including Scene.tsx (illustrations) and InquiryForm.tsx
src/content/             English content, image registry, translations
src/lib/                 env config, SEO helpers, inquiry schema, paths
scripts/                 i18n-check, verify-images, translation tooling
docs/                    launch checklists
```

## Known issues

`npm audit` reports advisories in transitive dependencies of Next.js 15.5.28 (`postcss` and others). They affect build tooling, not the code served to visitors. Run `npm audit` and upgrade Next.js before launch.
