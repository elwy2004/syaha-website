# Business details still needed before launch

The supplied guides describe places and itineraries. They contain no information about the company itself, so nothing below appears anywhere on the site, and none of it has been invented. Each item says where it goes once you have it.

## Needed to launch

| Item | Why it matters | Where it goes |
|---|---|---|
| **Inquiry delivery** (a Resend account with a verified sender domain, or a CRM/webhook URL) | Until one is configured, the form runs in preview mode and inquiries do not reach you. | `.env.local`: `RESEND_*` or `INQUIRY_WEBHOOK_*` |
| **Email address** for replies and the contact page | Visitors currently have no direct contact route. | `CONTACT_EMAIL` |
| **Phone and WhatsApp number** | WhatsApp buttons stay hidden until a number is set. | `CONTACT_PHONE`, `WHATSAPP_NUMBER` |
| **Domain** | Needed for canonical links, hreflang, the sitemap and social previews. | `NEXT_PUBLIC_SITE_URL` |
| **Privacy policy** | The form collects names, emails and phone numbers. Visitors from the EU (German, French, Spanish, Italian and Danish speakers) are covered by GDPR, so a privacy notice is a legal requirement, not a nicety. Legal advice is recommended. | New page, linked from the form consent line and the footer |
| **Legal company name and registered address** | Many EU visitors expect to see who they are dealing with. In Germany an *Impressum* is legally required for commercial sites aimed at German users. | Footer and a new legal page |
| **Tourism licence or registration** (e.g. Egyptian Ministry of Tourism licence number, ETAA membership) | This is the strongest trust signal for a travel company. The site makes no such claim today. | Footer, About section and the `TravelAgency` structured data |
| **Native-speaker review of the seven translations** | They are machine translations. See `TRANSLATION-REVIEW.md`. | `scripts/translations/<locale>.txt` |
| **Photographs** | Every image slot currently shows an illustration. See `IMAGE-CREDITS.md`. | `npm run images:verify` or your own photos |

## Needed to answer visitors' questions

- **Guide languages you can offer.** The form asks for a preferred guide language and promises only to confirm availability in the quote. If you list your actual languages, the form can offer them as choices.
- **Services you actually provide.** The site says quotes may cover transport, guiding, tickets, meals, boats and accommodation. Please confirm which of these you arrange yourselves, which you subcontract, and whether you book hotels, domestic flights or Nile cruises.
- **Booking terms**: deposit, payment methods, cancellation policy and what happens when a site closes on the day. The FAQ promises that each quote states its cancellation terms, so standard terms are needed.
- **Group size limits and whether you run private tours only.**
- **Typical reply time** for inquiries, so the confirmation message can say "within X hours".

## Optional, adds trust

- Logo files. The site uses a typographic wordmark in the brand colours.
- A short "About us": who founded the company, when, and where you are based. Only facts you are happy to stand behind.
- Social media links.
- Genuine customer reviews with permission, or a link to a review platform profile. The site shows no reviews or ratings today and should not until real ones exist.
