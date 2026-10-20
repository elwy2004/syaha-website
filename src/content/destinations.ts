import type { Destination, DestinationSlug } from "./types";

export const destinations: Destination[] = [
  {
    slug: "cairo-giza",
    name: "Cairo & Giza",
    shortName: "Cairo",
    tagline: "Pyramids, museums and living heritage",
    heroImage: "giza-panorama",
    cardImage: "sphinx",
    metaDescription:
      "Plan Cairo and Giza with Syaha Tour: the Pyramids and Sphinx, the Grand Egyptian Museum, historic and Coptic Cairo, and day trips to Saqqara, Memphis and Dahshur.",
    intro: [
      "Egypt's capital holds five thousand years in a single city. On the Giza Plateau the pyramids of Khufu, Khafre and Menkaure stand beside the Great Sphinx; a few minutes away, the Grand Egyptian Museum gathers the treasures of the pharaohs.",
      "Across the river, the Citadel, the Mamluk mosques of historic Cairo and the lanes of Al-Muizz Street and Khan el-Khalili tell a later story, while the churches of Coptic Cairo sit beside the remains of the Babylon Fortress. Beyond the city, Saqqara, Memphis and Dahshur trace how the pyramids began.",
    ],
    groups: [
      { id: "giza", label: "Giza Plateau", intro: "The three great pyramids, the Sphinx and the viewpoints between them." },
      { id: "museums", label: "Museums", intro: "Ancient civilisation, Islamic art and royal palaces." },
      { id: "historic", label: "Historic Cairo", intro: "The Citadel, Mamluk mosques and the old bazaar." },
      { id: "coptic", label: "Coptic heritage", intro: "Churches, a historic synagogue and the Babylon Fortress." },
      { id: "excursions", label: "Optional excursions", intro: "Earlier pyramids, ancient Memphis, the Nile and the desert." },
    ],
    highlights: [
      { title: "Begin at the plateau", body: "Start with the panoramic viewpoint to see all three pyramids together, then walk among them with a guide who explains how and why they were built.", image: "khufu" },
      { title: "Two great museums", body: "Pair the Grand Egyptian Museum with the National Museum of Egyptian Civilization and its Royal Mummies Hall, or the historic Egyptian Museum in Tahrir.", image: "gem" },
      { title: "Cairo on foot", body: "Al-Muizz Street is best explored slowly: mosques, madrasas and gates from several Islamic periods, ending among the lanes of Khan el-Khalili.", image: "muizz" },
    ],
    practical: [
      { title: "Separate sites, separate days", body: "Saqqara, Memphis and Dahshur sit outside central Cairo. Allow a full day for them rather than adding them to a Giza visit." },
      { title: "Special tickets", body: "Entering the Great Pyramid, some museum areas and special tombs needs separate tickets with their own rules. We check availability before including them." },
      { title: "Dress and etiquette", body: "Mosques and churches expect respectful dress. Your guide explains visitor rules at each site." },
      { title: "What a quotation covers", body: "Transport, guiding, entrance tickets, lunch, drinks and boat rides are listed line by line, so you know exactly what is included." },
    ],
  },
  {
    slug: "luxor",
    name: "Luxor",
    shortName: "Luxor",
    tagline: "Temples, royal tombs and ancient Thebes",
    heroImage: "karnak",
    cardImage: "hatshepsut",
    metaDescription:
      "Plan Luxor with Syaha Tour: Karnak and Luxor Temple on the East Bank, the Valley of the Kings, Hatshepsut's temple and the Nobles' Tombs on the West Bank, with a suggested three-day itinerary.",
    intro: [
      "Luxor is one of the great open-air archaeological landscapes of the world. On the East Bank, Karnak and Luxor Temple are joined by the Avenue of Sphinxes; across the Nile, the West Bank holds the royal tombs and mortuary temples of ancient Thebes.",
      "Most travellers need three days to see it well: one for the East Bank temples and museums, one for the Valley of the Kings and Hatshepsut's temple, and one for Medinet Habu, the artisans' village and a careful choice of Nobles' Tombs.",
    ],
    groups: [
      { id: "east-bank", label: "East Bank", intro: "Karnak, Luxor Temple, the Avenue of Sphinxes and two fine museums." },
      { id: "west-temples", label: "West Bank temples", intro: "Hatshepsut, the Colossi, Medinet Habu, the Ramesseum and Deir el-Medina." },
      { id: "royal-tombs", label: "Royal tombs", intro: "The Valleys of the Kings and Queens, with optional special tickets." },
      { id: "specialist", label: "Specialist heritage", intro: "Nobles' Tombs and quieter necropolises, subject to access." },
      { id: "excursions", label: "Separate excursions", intro: "Dendera to the north and Esna to the south." },
    ],
    highlights: [
      { title: "An unhurried morning at Karnak", body: "The Great Hypostyle Hall, the Sacred Lake and the obelisks deserve time. Allow two to three hours, more if you love archaeology.", image: "karnak" },
      { title: "Choosing your royal tombs", body: "A standard ticket at the Valley of the Kings covers a selection of tombs. Special tombs such as Tutankhamun and Seti I can be added separately when they are open.", image: "kv2" },
      { title: "Daily life in paint", body: "At Deir el-Medina and in the Nobles' Tombs, scenes of farming, crafts and ceremonies show how ordinary Egyptians lived.", image: "deir-el-medina" },
    ],
    practical: [
      { title: "Crossing to the West Bank", body: "We arrange a vehicle after the river crossing, or a boat crossing linked to local transport, and plan the route to avoid backtracking." },
      { title: "Standard versus special tickets", body: "The standard Valley of the Kings ticket does not include every tomb. Tutankhamun, Seti I and Nefertari may need special tickets, and the selection open changes for conservation. Named tombs are possibilities, not guarantees." },
      { title: "Tombs and heat", body: "Expect steps, narrow passages and hot weather. Comfortable shoes, water and an early start make a real difference." },
      { title: "Photography", body: "Restrictions or extra charges may apply at some sites. We check the current rules for your visit." },
      { title: "Hot-air ballooning", body: "Available as an option subject to weather, permits and operator availability. It is never confirmed until the operator does." },
    ],
  },
  {
    slug: "aswan-nubia",
    name: "Aswan & Nubia",
    shortName: "Aswan",
    tagline: "Nile islands, Nubian culture and Abu Simbel",
    heroImage: "aswan-felucca",
    cardImage: "abu-simbel",
    metaDescription:
      "Plan Aswan and Nubia with Syaha Tour: Philae, Nubian villages, felucca trips, the Tombs of the Nobles, a full-day excursion to Abu Simbel and specialist Lake Nasser journeys.",
    intro: [
      "Aswan is where the Nile is at its loveliest, flowing between granite boulders and green islands. Philae's Temple of Isis is reached by boat, feluccas drift past Elephantine, and in Gharb Soheil the painted houses of a Nubian village welcome visitors.",
      "South of the city lie the monuments of Nubia: the great temples of Abu Simbel, a long but unforgettable day away, and the temples rescued from Lake Nasser at New Kalabsha. Northbound, Kom Ombo and Edfu make natural stops on the road to Luxor.",
    ],
    groups: [
      { id: "aswan-highlights", label: "Aswan highlights", intro: "Philae, the Unfinished Obelisk, the High Dam and the Nubia Museum." },
      { id: "islands", label: "Islands and the Nile", intro: "Elephantine, the Botanical Garden, feluccas and the corniche." },
      { id: "nubian", label: "Nubian culture", intro: "Gharb Soheil, local crafts and optional hospitality." },
      { id: "west-bank", label: "West Bank heritage", intro: "Rock tombs, a desert monastery and the Aga Khan Mausoleum." },
      { id: "abu-simbel", label: "Abu Simbel", intro: "The temples of Ramesses II and Nefertari, a long day trip." },
      { id: "kalabsha", label: "New Kalabsha", intro: "Rescued Nubian temples near the High Dam." },
      { id: "lake-nasser", label: "Lake Nasser", intro: "Remote temples for specialist journeys." },
      { id: "northbound", label: "Northbound", intro: "Kom Ombo and Edfu on the way to Luxor." },
    ],
    highlights: [
      { title: "Philae by boat", body: "The short boat ride to Agilkia Island is part of the experience. Allow two to three hours for the Temple of Isis.", image: "philae" },
      { title: "A day in Nubia", body: "Explore Gharb Soheil's architecture and crafts, with optional Nubian hospitality, then return along the river past the islands.", image: "gharb-soheil" },
      { title: "The road to Abu Simbel", body: "A long day of around 10 to 12 hours in total, rewarded by the temples of Ramesses II and Nefertari.", image: "abu-simbel" },
    ],
    practical: [
      { title: "Boats are part of the plan", body: "Philae, the islands and the Nubian villages are reached by boat, with a vehicle for sites on land." },
      { title: "Abu Simbel is a full day", body: "It lies roughly 280 to 300 km from Aswan each way. Departure time follows the transport arrangements and regulations in force." },
      { title: "Lake Nasser needs advance planning", body: "Remote temples such as Amada, Wadi el-Sebua, Dakka and Maharraqa usually need a boat or specialist trip, sometimes with an overnight stay. They are arranged in advance and never sold as an ordinary day tour." },
      { title: "Climbs and heat", body: "Qubbet el-Hawa involves climbing; St. Simeon may involve walking from the boat. Tell us about mobility needs and we will shape the days around them." },
      { title: "Times are estimates", body: "Visit lengths here are planning estimates, not official schedules. Opening hours, tickets and routes are confirmed before booking." },
    ],
  },
];

export function getDestination(slug: string) {
  return destinations.find((d) => d.slug === slug);
}

export const destinationNames: Record<DestinationSlug, string> = {
  "cairo-giza": "Cairo & Giza",
  luxor: "Luxor",
  "aswan-nubia": "Aswan & Nubia",
};
