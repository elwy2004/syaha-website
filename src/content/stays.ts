import type { Stay } from "./types";

// The two stays Syaha Tour works with. All copy and photographs come from the
// owner's earlier site (syaha-tour.vercel.app); do not add facts that are not
// there, such as prices, room counts, ratings or amenities.

export const stays: Stay[] = [
  {
    slug: "anakob",
    name: "Anakob",
    location: "Anakob · Elephantine Island, Aswan",
    title: "The magic of Nubia, from the Nile.",
    lead: "Aswan’s first floating boutique hotel, designed around the river, the light and the art of Nubia.",
    summary: "Aswan’s first floating boutique hotel, designed around the river, the light and the art of Nubia.",
    metaDescription:
      "Anakob is Aswan’s first floating boutique hotel, reflecting Nubian art and culture, with every bedroom looking out on the Nile. Ask Syaha Tour about a stay.",
    heroImage: "anakob-bluehour",
    cardImage: "anakob-dusk",
    logo: "/images/stays/anakob-logo.png",
    website: "https://anakob.com",
    sections: [
      {
        id: "intro",
        eyebrow: "Aswan’s first floating boutique hotel",
        title: "Designed with the Nile view in mind",
        body: [
          "Anakob is the newest, and the first, boutique floating hotel in Aswan. It reflects Nubian art and culture with a trendy, modern and comfortable setup, and it was designed and positioned with the Nile view in mind: every bedroom looks out on the river, and the shared spaces have panoramic views in every direction.",
        ],
        image: "anakob-exterior",
        caption: "Anakob on the Nile, Aswan",
      },
      {
        id: "design",
        eyebrow: "Nile-view bedrooms and the sundeck",
        title: "Made for the river and the southern sun",
        body: [],
        items: [
          {
            id: "skylight",
            title: "A skylight for the southern sun",
            body: "The skylight is fitted with a heat-reflective transparent film, positioned to let you enjoy the great sun of Upper Egypt without the soaring heat.",
          },
          {
            id: "sundeck",
            title: "A sundeck shaped like a sail",
            body: "The sundeck shade is made from a single piece of tensile fabric, with corners set at different levels to echo the sail of a traditional felucca.",
          },
          {
            id: "rooms",
            title: "Rooms made for the climate",
            body: "Each room is designed with the warm climate in mind. Air conditioning, shutters and insulated walls keep it comfortable, even at the height of summer.",
          },
        ],
        image: "anakob-sundeck",
        caption: "The sundeck",
      },
    ],
    gallery: ["anakob-room", "anakob-breakfast", "anakob-dusk"],
    ctaTitle: "Stay aboard Anakob.",
    ctaBody: "Tell us your dates and who is travelling, and we will come back to you about staying aboard Anakob as part of your time in Aswan.",
  },
  {
    slug: "mango-guesthouse",
    name: "Mango Guesthouse",
    location: "Mango Guesthouse · Elephantine Island, Aswan",
    title: "An island welcome, Nubian style.",
    lead: "Local hospitality, traditional food and the gentle rhythm of island life, in the middle of the Nile at Aswan.",
    summary: "Local hospitality and traditional Nubian food among the gardens of Elephantine Island.",
    metaDescription:
      "Mango Guesthouse sits among the gardens of Elephantine Island in Aswan: local hospitality, traditional Nubian food and the slower rhythm of island life.",
    heroImage: "mango-house",
    cardImage: "mango-house",
    logo: "/images/stays/mango-logo.png",
    sections: [
      {
        id: "intro",
        eyebrow: "A Nubian home on Elephantine Island",
        title: "In the middle of the Nile at Aswan",
        body: [
          "Mango Guesthouse sits among the gardens of Elephantine Island, in the middle of the Nile at Aswan. It is a place for local hospitality and traditional Nubian food, and for experiencing the slower rhythm of island life.",
        ],
        image: "mango-house",
      },
      {
        id: "food",
        eyebrow: "Lunch in the courtyard",
        title: "Traditional Nubian food, shared.",
        body: [
          "Local, traditional Nubian food at Mango Guesthouse, on Elephantine Island.",
          "Meals are served in a shaded courtyard where guests sit down together: one of the simplest and warmest ways to experience Nubian hospitality.",
        ],
        image: "mango-lunch",
        caption: "Lunch in the courtyard",
      },
      {
        id: "island",
        eyebrow: "Elephantine Island",
        title: "Life on the island.",
        body: ["Staying on Elephantine means stepping away from the bustle of Aswan while staying right in the middle of it."],
        items: [
          {
            id: "island",
            title: "An island in the Nile",
            body: "Elephantine sits in the middle of the river opposite Aswan, a green island of gardens, palm trees and quiet lanes, reached by a short boat ride.",
          },
          {
            id: "villages",
            title: "Nubian villages",
            body: "The island is home to Nubian villages, where painted houses and everyday life carry on at their own unhurried pace.",
          },
          {
            id: "abu",
            title: "Ancient Abu",
            body: "At its southern tip lie the ruins of ancient Abu, one of the oldest settlements in Egypt, and one of the river’s historic Nilometers.",
          },
          {
            id: "nearby",
            title: "Close to everything",
            body: "From the island, Philae, the Nubian villages of the west bank and a felucca on the river are all within easy reach.",
          },
        ],
        image: "aswan-aerial",
        caption: "Aswan and its islands from above",
      },
    ],
    gallery: [],
    ctaTitle: "Stay at Mango Guesthouse.",
    ctaBody: "Share your dates and plans, and we will get back to you about staying at Mango Guesthouse as part of your journey through Aswan.",
  },
];
