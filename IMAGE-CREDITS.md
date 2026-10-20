# Image credits and status

**Status today: no third-party photographs are displayed.** Every image slot on the site shows an original SVG illustration drawn for Syaha Tour (`src/components/Scene.tsx`). Each one is labelled "Illustration" in its alt text, so none can be mistaken for a photograph of the named place. The illustrations need no credit.

Photographs were not added because this build environment cannot reach Wikimedia Commons (commons.wikimedia.org and upload.wikimedia.org are blocked by its network policy). Without that access, none of the candidate files below could be confirmed to exist, and none of their licences could be read.

## How a photograph gets onto the site

1. Run `npm run images:verify` from a machine that can reach Wikimedia Commons. The script:
   - checks that each candidate file exists;
   - reads its licence and author from the file page metadata;
   - accepts only CC0, public domain, CC BY and CC BY-SA, and refuses NC, ND and unknown licences;
   - saves a local WebP copy in `public/images/`;
   - writes the credit to `src/content/image-manifest.json`.
2. Rebuild the site. Accepted photos replace their illustrations, and the [/en/image-credits](http://localhost:3000/en/image-credits) page lists the creator, licence and source link for each one automatically.
3. **Look at every accepted photo** on that page and confirm that it shows the named place. The script checks the licence, but it cannot check what a picture shows. If a photo is wrong, delete its entry from the manifest and add a `rejected` reason in `src/content/images.ts`.

To use your own photography, add the file to `public/images/` and write its manifest entry by hand. Put the photographer's name as `creator` and your own licence statement as `license`.

## Summary

- 65 image slots in total.
- 43 slots have a candidate file name. The names come from the supplied Cairo and Luxor guides, and several Cairo names look guessed, so the verification script reports any that do not exist.
- 3 slots were rejected because the Luxor guide links the wrong photograph for them:
  - "Abu Haggag Mosque" points to a Luxor Temple sanctuary photo;
  - "Nobles' Tombs" and "Asasif" both reuse a Valley of the Kings photo.
- 19 slots have no candidate, including every Aswan and Nubia slot, because the Aswan guide names no images. A photographer or a fresh Commons search is needed for these.

## Every slot

| Id | Must show | Candidate file | Named in | Status |
|---|---|---|---|---|
| `giza-aerial` | Aerial view of the Giza pyramid complex | [Giza pyramid complex (aerial view).jpg](https://commons.wikimedia.org/wiki/File:Giza_pyramid_complex_(aerial_view).jpg) | Cairo guide | Candidate, not yet verified |
| `khufu` | The Great Pyramid of Khufu | [Kheops-Pyramid.jpg](https://commons.wikimedia.org/wiki/File:Kheops-Pyramid.jpg) | Cairo guide | Candidate, not yet verified |
| `khafre` | The Pyramid of Khafre | [Khafre Pyramid.JPG](https://commons.wikimedia.org/wiki/File:Khafre_Pyramid.JPG) | Cairo guide | Candidate, not yet verified |
| `menkaure` | The Pyramid of Menkaure | [Menkaure Pyramid.jpg](https://commons.wikimedia.org/wiki/File:Menkaure_Pyramid.jpg) | Cairo guide | Candidate, not yet verified |
| `sphinx` | The Great Sphinx of Giza | [Great Sphinx of Giza.JPG](https://commons.wikimedia.org/wiki/File:Great_Sphinx_of_Giza.JPG) | Cairo guide | Candidate, not yet verified |
| `giza-panorama` | The pyramids of Giza from a panoramic viewpoint | [Pyramids of Giza.jpg](https://commons.wikimedia.org/wiki/File:Pyramids_of_Giza.jpg) | Cairo guide | Candidate, not yet verified |
| `gem` | The Grand Egyptian Museum | [Grand Egyptian Museum.jpg](https://commons.wikimedia.org/wiki/File:Grand_Egyptian_Museum.jpg) | Cairo guide | Candidate, not yet verified |
| `egyptian-museum` | The Egyptian Museum in Tahrir Square | [Egyptian Museum Cairo.jpg](https://commons.wikimedia.org/wiki/File:Egyptian_Museum_Cairo.jpg) | Cairo guide | Candidate, not yet verified |
| `nmec` | The National Museum of Egyptian Civilization | [National Museum of Egyptian Civilization.jpg](https://commons.wikimedia.org/wiki/File:National_Museum_of_Egyptian_Civilization.jpg) | Cairo guide | Candidate, not yet verified |
| `islamic-art` | The Museum of Islamic Art, Cairo | [Museum of Islamic Art Cairo.jpg](https://commons.wikimedia.org/wiki/File:Museum_of_Islamic_Art_Cairo.jpg) | Cairo guide | Candidate, not yet verified |
| `abdeen` | Abdeen Palace, Cairo | [Abdeen Palace Cairo.jpg](https://commons.wikimedia.org/wiki/File:Abdeen_Palace_Cairo.jpg) | Cairo guide | Candidate, not yet verified |
| `manial` | Manial Palace, Rhoda Island | [Manial Palace Cairo.jpg](https://commons.wikimedia.org/wiki/File:Manial_Palace_Cairo.jpg) | Cairo guide | Candidate, not yet verified |
| `citadel` | The Cairo Citadel | [Cairo Citadel.jpg](https://commons.wikimedia.org/wiki/File:Cairo_Citadel.jpg) | Cairo guide | Candidate, not yet verified |
| `muhammad-ali` | The Mosque of Muhammad Ali | [Mosque of Muhammad Ali Cairo.jpg](https://commons.wikimedia.org/wiki/File:Mosque_of_Muhammad_Ali_Cairo.jpg) | Cairo guide | Candidate, not yet verified |
| `sultan-hassan` | The Mosque-Madrasa of Sultan Hassan | [Sultan Hassan Mosque Cairo.jpg](https://commons.wikimedia.org/wiki/File:Sultan_Hassan_Mosque_Cairo.jpg) | Cairo guide | Candidate, not yet verified |
| `rifai` | Al-Rifa'i Mosque | [Al-Rifa i Mosque Cairo.jpg](https://commons.wikimedia.org/wiki/File:Al-Rifa_i_Mosque_Cairo.jpg) | Cairo guide | Candidate, not yet verified |
| `muizz` | Al-Muizz Street | [Al-Muizz Street Cairo.jpg](https://commons.wikimedia.org/wiki/File:Al-Muizz_Street_Cairo.jpg) | Cairo guide | Candidate, not yet verified |
| `khan` | Khan el-Khalili bazaar | [Khan el-Khalili Cairo.jpg](https://commons.wikimedia.org/wiki/File:Khan_el-Khalili_Cairo.jpg) | Cairo guide | Candidate, not yet verified |
| `hanging-church` | The Hanging Church, Coptic Cairo | [The Hanging Church Cairo.jpg](https://commons.wikimedia.org/wiki/File:The_Hanging_Church_Cairo.jpg) | Cairo guide | Candidate, not yet verified |
| `coptic-cairo` | The Hanging Church, Coptic Cairo | [Hanging Church Cairo.jpg](https://commons.wikimedia.org/wiki/File:Hanging_Church_Cairo.jpg) | Cairo guide | Candidate, not yet verified |
| `ben-ezra` | Ben Ezra Synagogue | [Ben Ezra Synagogue Cairo.jpg](https://commons.wikimedia.org/wiki/File:Ben_Ezra_Synagogue_Cairo.jpg) | Cairo guide | Candidate, not yet verified |
| `cairo-felucca` | A felucca on the Nile in Cairo | [Felucca on the Nile Cairo.jpg](https://commons.wikimedia.org/wiki/File:Felucca_on_the_Nile_Cairo.jpg) | Cairo guide | Candidate, not yet verified |
| `djoser` | The Step Pyramid of Djoser, Saqqara | [Step Pyramid of Djoser.jpg](https://commons.wikimedia.org/wiki/File:Step_Pyramid_of_Djoser.jpg) | Cairo guide | Candidate, not yet verified |
| `dahshur` | The Bent Pyramid of Sneferu, Dahshur | [Bent Pyramid of Sneferu at Dahshur.jpg](https://commons.wikimedia.org/wiki/File:Bent_Pyramid_of_Sneferu_at_Dahshur.jpg) | Cairo guide | Candidate, not yet verified |
| `memphis` | Colossal statue of Ramesses II, Memphis | [Ramses II statue Memphis Egypt.jpg](https://commons.wikimedia.org/wiki/File:Ramses_II_statue_Memphis_Egypt.jpg) | Cairo guide | Candidate, not yet verified |
| `wadi-degla` | Wadi Degla Protectorate | [Wadi Degla Protectorate Egypt.jpg](https://commons.wikimedia.org/wiki/File:Wadi_Degla_Protectorate_Egypt.jpg) | Cairo guide | Candidate, not yet verified |
| `karnak` | Karnak Temple Complex | [Karnak Temple, Luxor, Egypt (2505681904).jpg](https://commons.wikimedia.org/wiki/File:Karnak_Temple%2C_Luxor%2C_Egypt_(2505681904).jpg) | Luxor guide | Candidate, not yet verified |
| `luxor-temple` | Luxor Temple | [Luxor-Temple.jpg](https://commons.wikimedia.org/wiki/File:Luxor-Temple.jpg) | Luxor guide | Candidate, not yet verified |
| `luxor-temple-sanctuary` | The sanctuary area of Luxor Temple | [Luxor Temple, Sanctuary, Luxor, Egypt.jpg](https://commons.wikimedia.org/wiki/File:Luxor_Temple%2C_Sanctuary%2C_Luxor%2C_Egypt.jpg) | Luxor guide | Candidate, not yet verified |
| `avenue-sphinxes` | The Avenue of Sphinxes leading to Luxor Temple | [The Avenue of Sphinxes leading to the Temple of Luxor.jpg](https://commons.wikimedia.org/wiki/File:The_Avenue_of_Sphinxes_leading_to_the_Temple_of_Luxor.jpg) | Luxor guide | Candidate, not yet verified |
| `luxor-museum` | Luxor Museum | [Luxor Museum, Egypt25.jpg](https://commons.wikimedia.org/wiki/File:Luxor_Museum%2C_Egypt25.jpg) | Luxor guide | Candidate, not yet verified |
| `mummification-museum` | Mummification Museum, Luxor | [Mummification museum Luxor.jpg](https://commons.wikimedia.org/wiki/File:Mummification_museum_Luxor.jpg) | Luxor guide | Candidate, not yet verified |
| `abu-haggag` | Abu Haggag Mosque within the Luxor Temple precinct | – | – | Rejected: The Luxor guide links a Luxor Temple sanctuary photograph for this mosque, so it was not used. |
| `hatshepsut` | Mortuary Temple of Hatshepsut, Deir el-Bahari | [Temple of Hatshepsut, Deir el-Bahari, Luxor, Egypt.jpg](https://commons.wikimedia.org/wiki/File:Temple_of_Hatshepsut%2C_Deir_el-Bahari%2C_Luxor%2C_Egypt.jpg) | Luxor guide | Candidate, not yet verified |
| `colossi` | The Colossi of Memnon | [Colossi of Memnon, Luxor, Egypt.jpg](https://commons.wikimedia.org/wiki/File:Colossi_of_Memnon%2C_Luxor%2C_Egypt.jpg) | Luxor guide | Candidate, not yet verified |
| `medinet-habu` | Medinet Habu, Luxor West Bank | [Temple of Amun at Medinet Habu,West Bank, Luxor.JPG](https://commons.wikimedia.org/wiki/File:Temple_of_Amun_at_Medinet_Habu%2CWest_Bank%2C_Luxor.JPG) | Luxor guide | Candidate, not yet verified |
| `ramesseum` | The Ramesseum | [Ramesseum, Luxor.jpg](https://commons.wikimedia.org/wiki/File:Ramesseum%2C_Luxor.jpg) | Luxor guide | Candidate, not yet verified |
| `deir-el-medina` | Deir el-Medina | [Deir el-Medina, Luxor, Egipto, 2022-04-03, DD 18.jpg](https://commons.wikimedia.org/wiki/File:Deir_el-Medina%2C_Luxor%2C_Egipto%2C_2022-04-03%2C_DD_18.jpg) | Luxor guide | Candidate, not yet verified |
| `valley-kings` | The Valley of the Kings | [Luxor Valley of the Kings A.jpg](https://commons.wikimedia.org/wiki/File:Luxor_Valley_of_the_Kings_A.jpg) | Luxor guide | Candidate, not yet verified |
| `kv2` | Tomb of Ramesses IV (KV2), Valley of the Kings | [Tomb of Ramses IV in Valley of the Kings on West Bank of Luxor Egypt.jpg](https://commons.wikimedia.org/wiki/File:Tomb_of_Ramses_IV_in_Valley_of_the_Kings_on_West_Bank_of_Luxor_Egypt.jpg) | Luxor guide | Candidate, not yet verified |
| `tutankhamun` | The Tomb of Tutankhamun (KV62) | [The Tomb of Tutankhamun - Valley of the Kings.jpg](https://commons.wikimedia.org/wiki/File:The_Tomb_of_Tutankhamun_-_Valley_of_the_Kings.jpg) | Luxor guide | Candidate, not yet verified |
| `valley-queens` | The Valley of the Queens | [Valley of the Queens.jpg](https://commons.wikimedia.org/wiki/File:Valley_of_the_Queens.jpg) | Luxor guide | Candidate, not yet verified |
| `nobles-tombs` | Tombs of the Nobles, Luxor West Bank | – | – | Rejected: The Luxor guide reused a Valley of the Kings photograph for this entry, so it was not used. |
| `asasif` | Asasif Necropolis | – | – | Rejected: The Luxor guide reused a Valley of the Kings photograph for this entry, so it was not used. |
| `dendera` | Dendera Temple Complex | [Dendera Temple معبد دندرة (189).jpg](https://commons.wikimedia.org/wiki/File:Dendera_Temple_%D9%85%D8%B9%D8%A8%D8%AF_%D8%AF%D9%86%D8%AF%D8%B1%D8%A9_(189).jpg) | Luxor guide | Candidate, not yet verified |
| `esna` | Temple of Khnum, Esna | [Esna Temple.jpg](https://commons.wikimedia.org/wiki/File:Esna_Temple.jpg) | Luxor guide | Candidate, not yet verified |
| `luxor-corniche` | The Nile at Luxor | – | – | No candidate; illustration shown |
| `philae` | Temple of Isis at Philae, Agilkia Island | – | – | No candidate; illustration shown |
| `unfinished-obelisk` | The Unfinished Obelisk, Aswan | – | – | No candidate; illustration shown |
| `high-dam` | The Aswan High Dam | – | – | No candidate; illustration shown |
| `nubia-museum` | Nubia Museum, Aswan | – | – | No candidate; illustration shown |
| `elephantine` | Elephantine Island, Aswan | – | – | No candidate; illustration shown |
| `botanical-garden` | Aswan Botanical Garden, Kitchener's Island | – | – | No candidate; illustration shown |
| `aswan-felucca` | Feluccas on the Nile at Aswan | – | – | No candidate; illustration shown |
| `gharb-soheil` | Gharb Soheil Nubian village | – | – | No candidate; illustration shown |
| `qubbet-el-hawa` | Qubbet el-Hawa and the Tombs of the Nobles, Aswan | – | – | No candidate; illustration shown |
| `st-simeon` | Monastery of St. Simeon, Aswan | – | – | No candidate; illustration shown |
| `aga-khan` | Aga Khan Mausoleum seen from the Nile | – | – | No candidate; illustration shown |
| `aswan-souq` | Aswan market and corniche | – | – | No candidate; illustration shown |
| `abu-simbel` | The Great Temple of Ramesses II, Abu Simbel | – | – | No candidate; illustration shown |
| `kalabsha` | Temple of Kalabsha, New Kalabsha | – | – | No candidate; illustration shown |
| `beit-el-wali` | Beit el-Wali rock temple | – | – | No candidate; illustration shown |
| `lake-nasser` | Lake Nasser | – | – | No candidate; illustration shown |
| `kom-ombo` | Temple of Kom Ombo | – | – | No candidate; illustration shown |
| `edfu` | Temple of Horus at Edfu | – | – | No candidate; illustration shown |
