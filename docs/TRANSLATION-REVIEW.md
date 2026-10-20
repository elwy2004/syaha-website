# Translation review

**All seven translations are machine translations and need review by a native speaker before launch.** They were written by an AI model (Claude), not by a professional translator.

| Locale | Language | Status | Notes |
|---|---|---|---|
| `en` | English | Source | Written from the supplied guides. The Aswan guide was translated from Arabic. |
| `de` | German | Unreviewed | Formal "Sie". German place names (Kairo, Gizeh, Assuan, Cheops). |
| `fr` | French | Unreviewed | "Vous". French place names (Le Caire, Louxor, Assouan, Khéops). |
| `es` | Spanish | Unreviewed | "Usted". Spanish place names (El Cairo, Guiza, Asuán, Keops). |
| `it` | Italian | Unreviewed | "Voi" (plural). Italian place names (Il Cairo, Assuan, Cheope). |
| `da` | Danish | Unreviewed | "Du". Danish place names (Kairo, Nubien, Kheops). |
| `zh` | Chinese (Simplified) | Unreviewed | Uses 您. Standard mainland transliterations (开罗, 卢克索, 阿斯旺). Tagged `zh-Hans`. |
| `ja` | Japanese | Unreviewed | です・ます style. Standard katakana names (カイロ, ルクソール, アスワン). |

## What a reviewer should check first

1. **The accuracy safeguards survived translation.** These sentences protect the business, so check that each one still makes the same promise:
   - Itineraries are *suggested* and are not fixed departures.
   - Special tomb tickets are separate, and named tombs are possibilities, not guarantees.
   - Abu Simbel is a long day of 10 to 12 hours.
   - The Lake Nasser sites need advance arrangements and are never an ordinary day tour.
   - Interior access to the Aga Khan Mausoleum is not included or promised.
2. **Form errors and the preview/failure messages.** A visitor sees these exactly when something goes wrong.
3. **Monument names.** Spellings vary by country. Pick the form your market expects.
4. **Tone.** Check that the level of formality suits your brand in each market.

## How to edit a translation

Each language has one plain-text file, `scripts/translations/<locale>.txt`. Each line holds one sentence in the form `NNNN|text`, and the matching English is on the same `NNNN` line of `scripts/translations/source-en.tsv`.

1. Edit the text after the `|`. Keep any `{placeholders}` exactly as they are.
2. Rebuild the locale file:
   ```
   npx tsx scripts/i18n-check.ts --export /tmp/en.json
   python3 scripts/translations/apply.py <locale> /tmp/en.json
   npm run i18n:check
   ```
3. Rebuild the site.

If the English copy changes later, `npm run i18n:check` lists the missing and stale keys for each language. A language is removed from the switcher, the sitemap and hreflang automatically until all of its keys are present again, so a half-translated language never reaches visitors.
