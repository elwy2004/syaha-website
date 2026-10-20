import manifest from "./image-manifest.json";

// Image registry.
//
// Every picture on the site is referenced by an id from this file. An id is
// shown as a real photograph only when `npm run images:verify` has confirmed
// the Wikimedia Commons file exists, read its licence from the file page
// metadata, accepted the licence, downloaded a local copy and written the
// result to image-manifest.json. Until then the site renders an original
// illustrated fallback (see components/Scene.tsx) so nothing is ever shown
// with an unverified licence or a wrong label.
//
// `commons` is the candidate file name, without the "File:" prefix. Names
// marked `from: "cairo-guide"` were written into the supplied Cairo guide and
// several look guessed, so the script reports any that do not exist.

export type Motif =
  | "pyramids"
  | "sphinx"
  | "steppyramid"
  | "bentpyramid"
  | "temple"
  | "colonnade"
  | "colossi"
  | "terrace"
  | "avenue"
  | "obelisk"
  | "mosque"
  | "citadel"
  | "church"
  | "street"
  | "market"
  | "museum"
  | "palace"
  | "tomb"
  | "valley"
  | "nile"
  | "island"
  | "garden"
  | "village"
  | "dam"
  | "abusimbel"
  | "desert"
  | "monastery"
  | "lake";

export type Tone = "dawn" | "day" | "dusk" | "night";

export type ImageEntry = {
  id: string;
  /** Exactly what the photograph must show. Used for alt text and captions. */
  subject: string;
  alt: string;
  motif: Motif;
  tone: Tone;
  commons?: string;
  from?: "cairo-guide" | "luxor-guide";
  /** Why a candidate from the supplied guides was rejected. */
  rejected?: string;
  /** CSS object-position for the photograph crop. */
  focus?: string;
};

export type VerifiedImage = {
  src: string;
  width: number;
  height: number;
  creator: string;
  license: string;
  licenseUrl?: string;
  sourceUrl: string;
  attribution: string;
  commonsFile: string;
  verifiedAt: string;
};

const entries: ImageEntry[] = [
  // Cairo & Giza
  { id: "giza-aerial", subject: "Aerial view of the Giza pyramid complex", alt: "The three pyramids of Giza seen from above, desert stretching beyond", motif: "pyramids", tone: "dusk", commons: "Giza pyramid complex (aerial view).jpg", from: "cairo-guide" },
  { id: "khufu", subject: "The Great Pyramid of Khufu", alt: "The Great Pyramid of Khufu rising from the Giza Plateau", motif: "pyramids", tone: "day", commons: "Kheops-Pyramid.jpg", from: "cairo-guide" },
  { id: "khafre", subject: "The Pyramid of Khafre", alt: "The Pyramid of Khafre with surviving casing stones near its summit", motif: "pyramids", tone: "dawn", commons: "Khafre Pyramid.JPG", from: "cairo-guide" },
  { id: "menkaure", subject: "The Pyramid of Menkaure", alt: "The Pyramid of Menkaure, smallest of the three main Giza pyramids", motif: "pyramids", tone: "day", commons: "Menkaure Pyramid.jpg", from: "cairo-guide" },
  { id: "sphinx", subject: "The Great Sphinx of Giza", alt: "The Great Sphinx of Giza in front of the pyramids", motif: "sphinx", tone: "dawn", commons: "Great Sphinx of Giza.JPG", from: "cairo-guide" },
  { id: "giza-panorama", subject: "The pyramids of Giza from a panoramic viewpoint", alt: "Panoramic view across the desert to the three main pyramids of Giza", motif: "pyramids", tone: "dusk", commons: "Pyramids of Giza.jpg", from: "cairo-guide" },
  { id: "gem", subject: "The Grand Egyptian Museum", alt: "Exterior of the Grand Egyptian Museum near the Giza Pyramids", motif: "museum", tone: "day", commons: "Grand Egyptian Museum.jpg", from: "cairo-guide" },
  { id: "egyptian-museum", subject: "The Egyptian Museum in Tahrir Square", alt: "The historic red facade of the Egyptian Museum in Tahrir, Cairo", motif: "museum", tone: "day", commons: "Egyptian Museum Cairo.jpg", from: "cairo-guide" },
  { id: "nmec", subject: "The National Museum of Egyptian Civilization", alt: "The National Museum of Egyptian Civilization in Fustat, Old Cairo", motif: "museum", tone: "dusk", commons: "National Museum of Egyptian Civilization.jpg", from: "cairo-guide" },
  { id: "islamic-art", subject: "The Museum of Islamic Art, Cairo", alt: "Facade of the Museum of Islamic Art at Bab al-Khalq, Cairo", motif: "museum", tone: "day", commons: "Museum of Islamic Art Cairo.jpg", from: "cairo-guide" },
  { id: "abdeen", subject: "Abdeen Palace, Cairo", alt: "The facade of Abdeen Palace in downtown Cairo", motif: "palace", tone: "day", commons: "Abdeen Palace Cairo.jpg", from: "cairo-guide" },
  { id: "manial", subject: "Manial Palace, Rhoda Island", alt: "Manial Palace and its gardens on Rhoda Island, Cairo", motif: "palace", tone: "dawn", commons: "Manial Palace Cairo.jpg", from: "cairo-guide" },
  { id: "citadel", subject: "The Cairo Citadel", alt: "The walls of the Cairo Citadel above the city", motif: "citadel", tone: "dusk", commons: "Cairo Citadel.jpg", from: "cairo-guide" },
  { id: "muhammad-ali", subject: "The Mosque of Muhammad Ali", alt: "The domes and slender minarets of the Mosque of Muhammad Ali", motif: "mosque", tone: "dusk", commons: "Mosque of Muhammad Ali Cairo.jpg", from: "cairo-guide" },
  { id: "sultan-hassan", subject: "The Mosque-Madrasa of Sultan Hassan", alt: "The monumental stone walls of the Mosque-Madrasa of Sultan Hassan", motif: "mosque", tone: "day", commons: "Sultan Hassan Mosque Cairo.jpg", from: "cairo-guide" },
  { id: "rifai", subject: "Al-Rifa'i Mosque", alt: "Al-Rifa'i Mosque in historic Cairo", motif: "mosque", tone: "dawn", commons: "Al-Rifa i Mosque Cairo.jpg", from: "cairo-guide" },
  { id: "muizz", subject: "Al-Muizz Street", alt: "Historic facades and minarets along Al-Muizz Street", motif: "street", tone: "dusk", commons: "Al-Muizz Street Cairo.jpg", from: "cairo-guide" },
  { id: "khan", subject: "Khan el-Khalili bazaar", alt: "Lanterns and shopfronts in the lanes of Khan el-Khalili", motif: "market", tone: "night", commons: "Khan el-Khalili Cairo.jpg", from: "cairo-guide" },
  { id: "hanging-church", subject: "The Hanging Church, Coptic Cairo", alt: "The twin towers of the Hanging Church in Coptic Cairo", motif: "church", tone: "day", commons: "The Hanging Church Cairo.jpg", from: "cairo-guide" },
  { id: "coptic-cairo", subject: "The Hanging Church, Coptic Cairo", alt: "The Hanging Church, one of the landmarks of Coptic Cairo", motif: "church", tone: "dawn", commons: "Hanging Church Cairo.jpg", from: "cairo-guide" },
  { id: "ben-ezra", subject: "Ben Ezra Synagogue", alt: "Ben Ezra Synagogue in the Coptic Cairo area", motif: "church", tone: "dusk", commons: "Ben Ezra Synagogue Cairo.jpg", from: "cairo-guide" },
  { id: "cairo-felucca", subject: "A felucca on the Nile in Cairo", alt: "A white-sailed felucca on the Nile in Cairo", motif: "nile", tone: "dusk", commons: "Felucca on the Nile Cairo.jpg", from: "cairo-guide" },
  { id: "djoser", subject: "The Step Pyramid of Djoser, Saqqara", alt: "The Step Pyramid of Djoser at Saqqara", motif: "steppyramid", tone: "day", commons: "Step Pyramid of Djoser.jpg", from: "cairo-guide" },
  { id: "dahshur", subject: "The Bent Pyramid of Sneferu, Dahshur", alt: "The Bent Pyramid of Sneferu at Dahshur, its angle changing halfway up", motif: "bentpyramid", tone: "dawn", commons: "Bent Pyramid of Sneferu at Dahshur.jpg", from: "cairo-guide" },
  { id: "memphis", subject: "Colossal statue of Ramesses II, Memphis", alt: "The colossal statue of Ramesses II at the Memphis open-air museum", motif: "colossi", tone: "day", commons: "Ramses II statue Memphis Egypt.jpg", from: "cairo-guide" },
  { id: "wadi-degla", subject: "Wadi Degla Protectorate", alt: "The limestone canyon of Wadi Degla on the edge of Cairo", motif: "desert", tone: "day", commons: "Wadi Degla Protectorate Egypt.jpg", from: "cairo-guide" },

  // Luxor
  { id: "karnak", subject: "Karnak Temple Complex", alt: "Columns of the Great Hypostyle Hall at Karnak", motif: "colonnade", tone: "dawn", commons: "Karnak Temple, Luxor, Egypt (2505681904).jpg", from: "luxor-guide" },
  { id: "luxor-temple", subject: "Luxor Temple", alt: "Luxor Temple with its colonnades and statues of Ramesses II", motif: "temple", tone: "dusk", commons: "Luxor-Temple.jpg", from: "luxor-guide" },
  { id: "luxor-temple-sanctuary", subject: "The sanctuary area of Luxor Temple", alt: "Inside Luxor Temple near the sanctuary", motif: "colonnade", tone: "day", commons: "Luxor Temple, Sanctuary, Luxor, Egypt.jpg", from: "luxor-guide" },
  { id: "avenue-sphinxes", subject: "The Avenue of Sphinxes leading to Luxor Temple", alt: "Rows of sphinx statues lining the avenue towards Luxor Temple", motif: "avenue", tone: "dusk", commons: "The Avenue of Sphinxes leading to the Temple of Luxor.jpg", from: "luxor-guide" },
  { id: "luxor-museum", subject: "Luxor Museum", alt: "Ancient artefacts displayed at the Luxor Museum", motif: "museum", tone: "night", commons: "Luxor Museum, Egypt25.jpg", from: "luxor-guide" },
  { id: "mummification-museum", subject: "Mummification Museum, Luxor", alt: "The Mummification Museum on the Luxor corniche", motif: "museum", tone: "dusk", commons: "Mummification museum Luxor.jpg", from: "luxor-guide" },
  { id: "abu-haggag", subject: "Abu Haggag Mosque within the Luxor Temple precinct", alt: "Abu Haggag Mosque rising above the Luxor Temple precinct", motif: "mosque", tone: "dusk", rejected: "The Luxor guide links a Luxor Temple sanctuary photograph for this mosque, so it was not used." },
  { id: "hatshepsut", subject: "Mortuary Temple of Hatshepsut, Deir el-Bahari", alt: "The terraced Temple of Hatshepsut beneath the cliffs of Deir el-Bahari", motif: "terrace", tone: "dawn", commons: "Temple of Hatshepsut, Deir el-Bahari, Luxor, Egypt.jpg", from: "luxor-guide" },
  { id: "colossi", subject: "The Colossi of Memnon", alt: "The two seated Colossi of Memnon on the Theban plain", motif: "colossi", tone: "dawn", commons: "Colossi of Memnon, Luxor, Egypt.jpg", from: "luxor-guide" },
  { id: "medinet-habu", subject: "Medinet Habu, Luxor West Bank", alt: "Carved gateways and walls at Medinet Habu", motif: "temple", tone: "day", commons: "Temple of Amun at Medinet Habu,West Bank, Luxor.JPG", from: "luxor-guide" },
  { id: "ramesseum", subject: "The Ramesseum", alt: "Columns and fallen statues at the Ramesseum", motif: "colonnade", tone: "dusk", commons: "Ramesseum, Luxor.jpg", from: "luxor-guide" },
  { id: "deir-el-medina", subject: "Deir el-Medina", alt: "The remains of the artisans' village at Deir el-Medina", motif: "valley", tone: "dawn", commons: "Deir el-Medina, Luxor, Egipto, 2022-04-03, DD 18.jpg", from: "luxor-guide" },
  { id: "valley-kings", subject: "The Valley of the Kings", alt: "The Valley of the Kings on Luxor's West Bank", motif: "valley", tone: "day", commons: "Luxor Valley of the Kings A.jpg", from: "luxor-guide" },
  { id: "kv2", subject: "Tomb of Ramesses IV (KV2), Valley of the Kings", alt: "Painted interior of the Tomb of Ramesses IV in the Valley of the Kings", motif: "tomb", tone: "night", commons: "Tomb of Ramses IV in Valley of the Kings on West Bank of Luxor Egypt.jpg", from: "luxor-guide" },
  { id: "tutankhamun", subject: "The Tomb of Tutankhamun (KV62)", alt: "The Tomb of Tutankhamun in the Valley of the Kings", motif: "tomb", tone: "night", commons: "The Tomb of Tutankhamun - Valley of the Kings.jpg", from: "luxor-guide" },
  { id: "valley-queens", subject: "The Valley of the Queens", alt: "The Valley of the Queens necropolis on Luxor's West Bank", motif: "valley", tone: "dusk", commons: "Valley of the Queens.jpg", from: "luxor-guide" },
  { id: "nobles-tombs", subject: "Tombs of the Nobles, Luxor West Bank", alt: "Hillside entrances to the Tombs of the Nobles on Luxor's West Bank", motif: "tomb", tone: "dawn", rejected: "The Luxor guide reused a Valley of the Kings photograph for this entry, so it was not used." },
  { id: "asasif", subject: "Asasif Necropolis", alt: "The Asasif necropolis on Luxor's West Bank", motif: "valley", tone: "dawn", rejected: "The Luxor guide reused a Valley of the Kings photograph for this entry, so it was not used." },
  { id: "dendera", subject: "Dendera Temple Complex", alt: "The columned facade of the Temple of Hathor at Dendera", motif: "temple", tone: "dawn", commons: "Dendera Temple معبد دندرة (189).jpg", from: "luxor-guide" },
  { id: "esna", subject: "Temple of Khnum, Esna", alt: "Decorated columns inside the Temple of Khnum at Esna", motif: "colonnade", tone: "day", commons: "Esna Temple.jpg", from: "luxor-guide" },
  { id: "luxor-corniche", subject: "The Nile at Luxor", alt: "The Nile at Luxor with the West Bank hills beyond", motif: "nile", tone: "dusk" },

  // Aswan & Nubia: no photographs were supplied, so every entry needs a
  // curated Commons file before it can switch from the illustration.
  { id: "philae", subject: "Temple of Isis at Philae, Agilkia Island", alt: "The Temple of Isis at Philae reflected in the Nile", motif: "temple", tone: "dawn" },
  { id: "unfinished-obelisk", subject: "The Unfinished Obelisk, Aswan", alt: "The Unfinished Obelisk lying in the Aswan granite quarry", motif: "obelisk", tone: "day" },
  { id: "high-dam", subject: "The Aswan High Dam", alt: "The Aswan High Dam holding back Lake Nasser", motif: "dam", tone: "day" },
  { id: "nubia-museum", subject: "Nubia Museum, Aswan", alt: "The Nubia Museum in Aswan", motif: "museum", tone: "dusk" },
  { id: "elephantine", subject: "Elephantine Island, Aswan", alt: "Elephantine Island in the Nile at Aswan", motif: "island", tone: "dusk" },
  { id: "botanical-garden", subject: "Aswan Botanical Garden, Kitchener's Island", alt: "Palms and tropical trees in the Aswan Botanical Garden", motif: "garden", tone: "day" },
  { id: "aswan-felucca", subject: "Feluccas on the Nile at Aswan", alt: "Feluccas sailing between granite islands at Aswan", motif: "nile", tone: "dusk" },
  { id: "gharb-soheil", subject: "Gharb Soheil Nubian village", alt: "Brightly painted houses in the Nubian village of Gharb Soheil", motif: "village", tone: "day" },
  { id: "qubbet-el-hawa", subject: "Qubbet el-Hawa and the Tombs of the Nobles, Aswan", alt: "Rock-cut tombs on the hill of Qubbet el-Hawa above the Nile", motif: "tomb", tone: "dusk" },
  { id: "st-simeon", subject: "Monastery of St. Simeon, Aswan", alt: "The mud-brick walls of the Monastery of St. Simeon in the desert", motif: "monastery", tone: "day" },
  { id: "aga-khan", subject: "Aga Khan Mausoleum seen from the Nile", alt: "The Aga Khan Mausoleum on the hill above the Nile at Aswan", motif: "mosque", tone: "dusk" },
  { id: "aswan-souq", subject: "Aswan market and corniche", alt: "The market streets of Aswan", motif: "market", tone: "night" },
  { id: "abu-simbel", subject: "The Great Temple of Ramesses II, Abu Simbel", alt: "The four seated colossi of Ramesses II at Abu Simbel", motif: "abusimbel", tone: "dawn" },
  { id: "kalabsha", subject: "Temple of Kalabsha, New Kalabsha", alt: "The Temple of Kalabsha on the shore of Lake Nasser", motif: "temple", tone: "day" },
  { id: "beit-el-wali", subject: "Beit el-Wali rock temple", alt: "The small rock-cut temple of Beit el-Wali", motif: "tomb", tone: "day" },
  { id: "lake-nasser", subject: "Lake Nasser", alt: "The open water and desert shores of Lake Nasser", motif: "lake", tone: "dawn" },
  { id: "kom-ombo", subject: "Temple of Kom Ombo", alt: "The double Temple of Kom Ombo above the Nile", motif: "colonnade", tone: "dusk" },
  { id: "edfu", subject: "Temple of Horus at Edfu", alt: "The great pylon of the Temple of Horus at Edfu", motif: "temple", tone: "day" },
];

export const imageEntries = entries;

const byId = new Map(entries.map((e) => [e.id, e]));
const verified = manifest as Record<string, VerifiedImage>;

export function getImage(id: string): ImageEntry & { photo?: VerifiedImage } {
  const entry = byId.get(id);
  if (!entry) throw new Error(`Unknown image id: ${id}`);
  const photo = entry.rejected ? undefined : verified[id];
  return photo ? { ...entry, photo } : entry;
}

export function verifiedImages() {
  return entries
    .filter((e) => !e.rejected && verified[e.id])
    .map((e) => ({ ...e, photo: verified[e.id] }));
}

export function pendingImages() {
  return entries.filter((e) => e.rejected || !verified[e.id]);
}
