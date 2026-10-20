// Content model for the Syaha Tour site.
// All customer-facing copy lives in src/content so the agency can update it
// without touching components. Strings are plain English today; keep them in
// these files (not in components) so an Arabic edition can mirror the shape.

export type DestinationSlug = "cairo-giza" | "luxor" | "aswan-nubia";

export type InterestId =
  | "monuments"
  | "museums"
  | "culture"
  | "nile"
  | "specialist";

export type Interest = {
  id: InterestId;
  label: string;
  short: string;
  description: string;
  image: string;
};

export type Attraction = {
  id: string;
  name: string;
  destination: DestinationSlug;
  /** Area or category group id within the destination. */
  group: string;
  /** Short location line, e.g. "West Bank" or "Day trip from Cairo". */
  where?: string;
  summary: string;
  /** Suggested visiting time taken from the supplied guides. */
  visitTime?: string;
  /** Access caveat shown with the attraction. */
  note?: string;
  interests: InterestId[];
  /** Separate excursion rather than part of a standard city day. */
  excursion?: boolean;
  image: string;
};

export type AttractionGroup = {
  id: string;
  label: string;
  intro: string;
};

export type Destination = {
  slug: DestinationSlug;
  name: string;
  shortName: string;
  tagline: string;
  heroImage: string;
  cardImage: string;
  intro: string[];
  metaDescription: string;
  groups: AttractionGroup[];
  highlights: { title: string; body: string; image: string }[];
  practical: { title: string; body: string }[];
};

export type ItineraryStop = {
  time?: string;
  text: string;
  optional?: boolean;
};

export type ItineraryDay = {
  label: string;
  title: string;
  stops: ItineraryStop[];
  note?: string;
};

export type Journey = {
  slug: string;
  title: string;
  destinations: DestinationSlug[];
  duration: string;
  /** Rough length in days, used for sorting and the form preset. */
  days: number;
  summary: string;
  overview: string[];
  highlights: string[];
  itinerary: ItineraryDay[];
  walking: { level: string; detail: string } | null;
  optionalAdditions: string[];
  toConfirm: string[];
  image: string;
  /** Attraction ids featured in the journey (for structured data). */
  attractions: string[];
};

export type Faq = { q: string; a: string };

export type StaySection = {
  id: string;
  eyebrow?: string;
  title: string;
  body: string[];
  items?: { id: string; title: string; body: string }[];
  image: string;
  caption?: string;
};

export type Stay = {
  slug: string;
  name: string;
  /** Location line shown above the hero title. */
  location: string;
  title: string;
  lead: string;
  /** One or two sentences for cards on other pages. */
  summary: string;
  metaDescription: string;
  heroImage: string;
  cardImage: string;
  logo: string;
  website?: string;
  sections: StaySection[];
  gallery: string[];
  ctaTitle: string;
  ctaBody: string;
};
