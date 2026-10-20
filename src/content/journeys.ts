import type { Journey } from "./types";

// Suggested journeys from the supplied guides. These are starting points for a
// tailored quotation, not scheduled departures. The Luxor programme follows the
// detailed Word guide; the Aswan programme is translated from the Arabic guide.

const baseConfirm = {
  transport: "Private vehicle and pickup point",
  guide: "Guide and guiding language",
  tickets: "Entrance tickets, including any special tickets",
  meals: "Meals and drinks",
};

export const journeys: Journey[] = [
  {
    slug: "pyramids-grand-egyptian-museum",
    title: "Pyramids & Grand Egyptian Museum",
    destinations: ["cairo-giza"],
    duration: "1 day",
    days: 1,
    summary:
      "The Giza Plateau and the Great Sphinx in the morning, the treasures of the Grand Egyptian Museum after lunch.",
    overview: [
      "The essential first day in Egypt. Begin on the Giza Plateau with the pyramids of Khufu, Khafre and Menkaure, take in the panoramic viewpoint, and stand before the Great Sphinx.",
      "After a lunch break, continue to the nearby Grand Egyptian Museum for its monumental galleries and the Tutankhamun collection.",
    ],
    highlights: [
      "The Great Pyramid and the panoramic viewpoint",
      "The Great Sphinx",
      "The Tutankhamun collection at the Grand Egyptian Museum",
    ],
    itinerary: [
      {
        label: "Morning",
        title: "The Giza Plateau",
        stops: [
          { text: "The Great Pyramid of Khufu, seen from outside" },
          { text: "Panoramic viewpoint over the three main pyramids" },
          { text: "The Great Sphinx" },
          { text: "Inside the Great Pyramid with a separate ticket, if available", optional: true },
        ],
      },
      { label: "Midday", title: "Lunch break", stops: [{ text: "Lunch near the plateau" }] },
      {
        label: "Afternoon",
        title: "Grand Egyptian Museum",
        stops: [{ text: "Galleries and the Tutankhamun collection" }],
        note: "Museum tickets may be timed; we confirm entry when we quote.",
      },
    ],
    walking: null,
    optionalAdditions: [
      "Entry to the interior of the Great Pyramid (separate ticket, subject to availability)",
      "An evening felucca on the Nile",
    ],
    toConfirm: [baseConfirm.transport, baseConfirm.guide, baseConfirm.tickets, baseConfirm.meals],
    image: "khufu",
    attractions: ["giza-pyramids", "khufu", "giza-viewpoint", "sphinx", "gem"],
  },
  {
    slug: "historic-cairo",
    title: "Historic Cairo",
    destinations: ["cairo-giza"],
    duration: "1 day",
    days: 1,
    summary:
      "The Citadel and the Mosque of Muhammad Ali, Sultan Hassan and Al-Rifa'i, then Al-Muizz Street and Khan el-Khalili.",
    overview: [
      "A day among the domes and minarets of medieval Cairo. Start high at the Citadel, Salah al-Din's 12th-century fortress, with the Ottoman-style Mosque of Muhammad Ali and views across the city.",
      "Descend to the monumental Mamluk complex of Sultan Hassan and its neighbour Al-Rifa'i, then walk Al-Muizz Street past mosques, madrasas and gates to finish in the lanes of Khan el-Khalili.",
    ],
    highlights: [
      "City views from the Cairo Citadel",
      "Sultan Hassan and Al-Rifa'i side by side",
      "A guided walk along Al-Muizz Street",
      "Khan el-Khalili's crafts and cafés",
    ],
    itinerary: [
      {
        label: "Morning",
        title: "The Citadel",
        stops: [{ text: "Cairo Citadel" }, { text: "Mosque of Muhammad Ali" }],
      },
      {
        label: "Midday",
        title: "Mamluk Cairo",
        stops: [{ text: "Mosque-Madrasa of Sultan Hassan" }, { text: "Al-Rifa'i Mosque" }],
      },
      {
        label: "Afternoon",
        title: "Old streets and the bazaar",
        stops: [{ text: "Walking Al-Muizz Street" }, { text: "Khan el-Khalili" }],
      },
    ],
    walking: {
      level: "On foot in the old city",
      detail: "Al-Muizz Street is explored as a guided walk through historic streets.",
    },
    optionalAdditions: ["Museum of Islamic Art", "An evening at a traditional café in Khan el-Khalili"],
    toConfirm: [
      baseConfirm.transport,
      baseConfirm.guide,
      baseConfirm.tickets,
      baseConfirm.meals,
      "Dress guidance for mosque visits",
    ],
    image: "muhammad-ali",
    attractions: ["citadel", "muhammad-ali", "sultan-hassan", "rifai", "muizz", "khan-el-khalili"],
  },
  {
    slug: "old-cairo-museums",
    title: "Old Cairo & Museums",
    destinations: ["cairo-giza"],
    duration: "1 day",
    days: 1,
    summary:
      "The National Museum of Egyptian Civilization, Coptic Cairo, and the Egyptian Museum or the Museum of Islamic Art.",
    overview: [
      "Follow Egyptian civilisation from its beginnings to the medieval city. The National Museum of Egyptian Civilization, home to the Royal Mummies Hall, sits close to Coptic Cairo, where churches and lanes surround the Babylon Fortress.",
      "In the afternoon choose between the historic Egyptian Museum in Tahrir and the Museum of Islamic Art, and end on the river if you like.",
    ],
    highlights: [
      "The Royal Mummies Hall at NMEC",
      "The Hanging Church and Coptic Cairo",
      "Your choice of the Egyptian Museum or the Museum of Islamic Art",
    ],
    itinerary: [
      {
        label: "Morning",
        title: "Egyptian civilisation",
        stops: [{ text: "National Museum of Egyptian Civilization" }],
      },
      {
        label: "Midday",
        title: "Coptic Cairo",
        stops: [{ text: "The Hanging Church and the lanes of Coptic Cairo" }],
      },
      {
        label: "Afternoon",
        title: "A second museum",
        stops: [
          { text: "The Egyptian Museum in Tahrir, or the Museum of Islamic Art" },
          { text: "Nile felucca ride", optional: true },
        ],
      },
    ],
    walking: null,
    optionalAdditions: ["Nile felucca ride", "Ben Ezra Synagogue, where access allows"],
    toConfirm: [baseConfirm.transport, baseConfirm.guide, baseConfirm.tickets, baseConfirm.meals, "Felucca and its operator, if added"],
    image: "nmec",
    attractions: ["nmec", "coptic-cairo", "hanging-church", "egyptian-museum", "islamic-art", "cairo-felucca"],
  },
  {
    slug: "saqqara-memphis-dahshur",
    title: "Saqqara, Memphis & Dahshur",
    destinations: ["cairo-giza"],
    duration: "1 day",
    days: 1,
    summary:
      "The story of the pyramids before Giza: the Step Pyramid, ancient Memphis, and the Bent and Red Pyramids.",
    overview: [
      "These sites lie outside central Cairo and deserve a full day of their own. At Saqqara, the Step Pyramid of Djoser is among Egypt's earliest monumental stone buildings.",
      "Continue to the open-air museum at Memphis, one of Egypt's earliest capitals, and finish at Dahshur, where the Bent Pyramid and the Red Pyramid show pyramid builders learning their craft.",
    ],
    highlights: [
      "The Step Pyramid of Djoser",
      "Monumental sculpture at Memphis",
      "The Bent Pyramid and the Red Pyramid",
    ],
    itinerary: [
      { label: "Morning", title: "Saqqara", stops: [{ text: "The Step Pyramid of Djoser and its surroundings" }] },
      { label: "Midday", title: "Memphis", stops: [{ text: "Memphis Open-Air Museum" }] },
      { label: "Afternoon", title: "Dahshur", stops: [{ text: "The Bent Pyramid" }, { text: "The Red Pyramid" }] },
    ],
    walking: null,
    optionalAdditions: ["Combine with a Giza day for a pyramid-focused itinerary"],
    toConfirm: [baseConfirm.transport, baseConfirm.guide, baseConfirm.tickets, baseConfirm.meals],
    image: "djoser",
    attractions: ["saqqara", "memphis", "dahshur"],
  },
  {
    slug: "coptic-cairo-half-day",
    title: "Half-Day Coptic Cairo",
    destinations: ["cairo-giza"],
    duration: "Half day",
    days: 0.5,
    summary: "The Hanging Church, historic lanes and nearby heritage sites in Old Cairo.",
    overview: [
      "A focused half day in the heart of Egypt's Christian heritage. Explore the Hanging Church, built above a gatehouse of the Babylon Fortress, and the quiet lanes around it.",
      "Nearby heritage sites, including Ben Ezra Synagogue, are added according to what is open on the day.",
    ],
    highlights: ["The Hanging Church", "The lanes of Coptic Cairo", "Nearby heritage sites, as open"],
    itinerary: [
      {
        label: "Half day",
        title: "Coptic Cairo",
        stops: [
          { text: "The Hanging Church" },
          { text: "Historic lanes and nearby heritage sites" },
          { text: "Ben Ezra Synagogue, where access allows", optional: true },
        ],
        note: "We confirm which buildings are open on the day.",
      },
    ],
    walking: { level: "Lanes on foot", detail: "The historic lanes of Coptic Cairo are explored on foot." },
    optionalAdditions: ["Pair with the National Museum of Egyptian Civilization for a full day"],
    toConfirm: [baseConfirm.transport, baseConfirm.guide, baseConfirm.tickets],
    image: "hanging-church",
    attractions: ["coptic-cairo", "hanging-church", "ben-ezra"],
  },
  {
    slug: "nile-local-market-evening",
    title: "Nile & Local Market Evening",
    destinations: ["cairo-giza"],
    duration: "Evening",
    days: 0.25,
    summary: "A pre-arranged felucca or Nile-side experience, then a traditional market if timing allows.",
    overview: [
      "End a day of monuments gently. Sail on a pre-arranged felucca or enjoy a Nile-side experience as the city lights come on.",
      "If timing allows, continue to a traditional market for an evening stroll.",
    ],
    highlights: ["Cairo from the river", "A traditional market in the evening"],
    itinerary: [
      {
        label: "Evening",
        title: "River and market",
        stops: [
          { text: "Felucca ride or Nile-side experience" },
          { text: "Traditional market visit, if timing allows", optional: true },
        ],
      },
    ],
    walking: null,
    optionalAdditions: ["Dinner arranged on request"],
    toConfirm: [
      baseConfirm.transport,
      "Felucca operator, duration, departure point and safety arrangements",
      baseConfirm.meals,
    ],
    image: "cairo-felucca",
    attractions: ["cairo-felucca", "khan-el-khalili"],
  },
  {
    slug: "luxor-three-days",
    title: "Luxor in Three Days",
    destinations: ["luxor"],
    duration: "3 days",
    days: 3,
    summary:
      "East Bank temples and museums, the Valley of the Kings and Hatshepsut's temple, then Medinet Habu and a selection of Nobles' Tombs.",
    overview: [
      "A balanced first visit to ancient Thebes. Day one stays on the East Bank with Karnak, a museum and an evening at Luxor Temple. Day two crosses the river early for the royal tombs and Hatshepsut's terraced temple.",
      "Day three slows down for Medinet Habu, the Ramesseum or Deir el-Medina, and two or three Nobles' Tombs chosen from those open on the day. Each day is tuned to your energy and interests rather than packed with every site.",
    ],
    highlights: [
      "The Great Hypostyle Hall at Karnak",
      "Royal tombs in the Valley of the Kings",
      "Hatshepsut's temple at Deir el-Bahari",
      "Painted scenes of daily life in the Nobles' Tombs",
    ],
    itinerary: [
      {
        label: "Day 1",
        title: "East Bank temples and museums",
        stops: [
          { time: "Morning", text: "Karnak Temple Complex, with the Open-Air Museum if open" },
          { time: "Midday", text: "Lunch break" },
          { time: "Afternoon", text: "Luxor Museum or the Mummification Museum" },
          { time: "Evening", text: "Luxor Temple and a section of the Avenue of Sphinxes, subject to opening hours" },
        ],
      },
      {
        label: "Day 2",
        title: "Valley of the Kings, Hatshepsut and the Colossi",
        stops: [
          { time: "Early", text: "Valley of the Kings, visiting tombs included in the standard ticket" },
          { text: "Special tombs such as Tutankhamun or Seti I, with separate tickets where open", optional: true },
          { text: "Temple of Hatshepsut at Deir el-Bahari" },
          { text: "Photo stop at the Colossi of Memnon" },
          { text: "Valley of the Queens, only if time, energy and access permit", optional: true },
        ],
        note: "The tombs open on the day are set by the site and change for conservation. We never promise a named tomb.",
      },
      {
        label: "Day 3",
        title: "Mortuary temples and Nobles' Tombs",
        stops: [
          { time: "Morning", text: "Medinet Habu" },
          { text: "The Ramesseum or Deir el-Medina" },
          { time: "Afternoon", text: "Two or three Nobles' Tombs that are open and suit your group" },
        ],
        note: "Prefer a specialist day? Dendera or Esna can replace this day, though a separate day often works better.",
      },
    ],
    walking: {
      level: "Steps and narrow passages",
      detail: "Tombs involve stairs, narrow passages and high outdoor temperatures. For families and travellers with limited mobility we reduce the number of tombs, build in rest breaks and check walking distances and drop-off points.",
    },
    optionalAdditions: [
      "Special tomb tickets: Tutankhamun (KV62), Seti I (KV17), Nefertari (QV66), when open",
      "Valley of the Queens",
      "Sound and Light show at Karnak",
      "Hot-air balloon flight, subject to weather, permits and operator confirmation",
      "A separate day trip to Dendera or Esna",
    ],
    toConfirm: [
      baseConfirm.transport,
      "Nile crossing to the West Bank",
      baseConfirm.guide,
      "Standard and special entrance tickets",
      baseConfirm.meals,
      "Accommodation for your nights in Luxor",
      "Photography rules and any extra charges",
    ],
    image: "hatshepsut",
    attractions: [
      "karnak", "luxor-museum", "mummification-museum", "luxor-temple", "avenue-sphinxes",
      "valley-kings", "hatshepsut", "colossi", "medinet-habu", "ramesseum", "deir-el-medina", "nobles-tombs",
    ],
  },
  {
    slug: "discover-aswan-nubia-7-days",
    title: "Discover Aswan & Nubia in 7 Days",
    destinations: ["aswan-nubia"],
    duration: "7 days",
    days: 7,
    summary:
      "Aswan's great sites, a day of Nubian culture, Abu Simbel, New Kalabsha, and an optional Lake Nasser or northbound finish.",
    overview: [
      "A week to understand Aswan and Nubia properly. The first days cover Philae, the Unfinished Obelisk, the Nubia Museum, Elephantine and the islands, then a full day of Nubian culture at Gharb Soheil.",
      "The second half travels south: a long day to Abu Simbel, the rescued temples of New Kalabsha, and a day reserved for remote Lake Nasser sites if a specialist trip can be arranged. The final day either heads north via Kom Ombo and Edfu or stays in Aswan.",
    ],
    highlights: [
      "The Temple of Isis at Philae, reached by boat",
      "Gharb Soheil and optional Nubian hospitality",
      "The temples of Ramesses II and Nefertari at Abu Simbel",
      "Kalabsha, rescued from Lake Nasser",
    ],
    itinerary: [
      {
        label: "Day 1",
        title: "High Dam, Philae and the Unfinished Obelisk",
        stops: [
          { time: "08:00", text: "Meet at your hotel or the airport" },
          { time: "09:00", text: "The High Dam, once entry is confirmed" },
          { time: "10:30", text: "Boat from the Philae landing to the temple, about two hours on site" },
          { time: "13:00", text: "Lunch" },
          { time: "14:30", text: "The Unfinished Obelisk and the granite quarries" },
          { time: "16:00", text: "Return to the hotel; the souq in the evening", optional: true },
        ],
      },
      {
        label: "Day 2",
        title: "Museums, islands and the West Bank",
        stops: [
          { time: "09:00", text: "Nubia Museum" },
          { time: "11:00", text: "Elephantine Island and the Nilometer, where open" },
          { time: "13:00", text: "Lunch" },
          { time: "14:00", text: "The Botanical Garden" },
          { time: "15:30", text: "Tombs of the Nobles, if walking conditions and time allow", optional: true },
          { time: "Evening", text: "The Nile corniche or a short felucca ride" },
        ],
      },
      {
        label: "Day 3",
        title: "Nubian culture and the Nile",
        stops: [
          { time: "09:00", text: "Gharb Soheil" },
          { time: "10:30", text: "A cultural walk among the crafts and houses" },
          { time: "12:00", text: "Nubian hospitality or lunch", optional: true },
          { time: "13:30", text: "A Nile trip past the islands" },
          { time: "15:00", text: "Free time for photography and shopping" },
        ],
      },
      {
        label: "Day 4",
        title: "Abu Simbel",
        stops: [
          { time: "Early", text: "Departure, timed to the confirmed transport arrangements" },
          { text: "The Great Temple of Ramesses II and the Temple of Nefertari, with time for interpretation and photographs" },
          { text: "Rest stop, then return to Aswan" },
        ],
        note: "A long day of around 10 to 12 hours in total. The route, entry and current instructions are confirmed in advance.",
      },
      {
        label: "Day 5",
        title: "Kalabsha and nearby Nubian monuments",
        stops: [
          { time: "Morning", text: "Temple of Kalabsha at New Kalabsha" },
          { text: "Beit el-Wali or another nearby site, only if access and entry can be secured", optional: true },
          { time: "Afternoon", text: "Return to Aswan" },
        ],
        note: "Not every Lake Nasser temple can be reached on a short overland visit.",
      },
      {
        label: "Day 6",
        title: "Lake Nasser specialist day, or a day in Aswan",
        stops: [
          { text: "A pre-arranged specialist trip to accessible sites such as Amada, Wadi el-Sebua, Dakka or Maharraqa", optional: true },
          { text: "Local alternative: a reserve day for a local tour of your choice or free time in Aswan" },
        ],
        note: "These remote sites may need a boat, an overnight stay or several days. We only offer them once a specialist route is confirmed; otherwise the local alternative applies.",
      },
      {
        label: "Day 7",
        title: "Kom Ombo and Edfu, or departure from Aswan",
        stops: [
          { text: "Option A: travel north to Kom Ombo, then Edfu, continuing to Luxor only if time allows" },
          { text: "Option B: stay in Aswan for the souq and corniche, then transfer to the airport or station" },
        ],
        note: "Road time, visits, breaks and luggage handling are calculated before we confirm an arrival time.",
      },
    ],
    walking: {
      level: "Mostly moderate, with climbs",
      detail: "The Tombs of the Nobles at Qubbet el-Hawa involve climbing and walking, and Abu Simbel is a long day. Tell us about heat sensitivity or mobility needs and we will adjust the pace.",
    },
    optionalAdditions: [
      "Lake Nasser specialist trip, by advance arrangement only",
      "Nubian hospitality or lunch at Gharb Soheil",
      "Monastery of St. Simeon",
      "Onward journey to Luxor via Kom Ombo and Edfu",
    ],
    toConfirm: [
      "Vehicle, its capacity and pickup point",
      "Boats for Philae, the islands and Nubian villages",
      baseConfirm.guide,
      "Entrance tickets",
      baseConfirm.meals,
      "Accommodation in Aswan",
      "Any permits or route instructions for Abu Simbel and Lake Nasser",
    ],
    image: "philae",
    attractions: [
      "high-dam", "philae", "unfinished-obelisk", "nubia-museum", "elephantine", "botanical-garden",
      "qubbet-el-hawa", "gharb-soheil", "abu-simbel", "kalabsha", "lake-nasser", "kom-ombo", "edfu",
    ],
  },
];

export function getJourney(slug: string) {
  return journeys.find((j) => j.slug === slug);
}
