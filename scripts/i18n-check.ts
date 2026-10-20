// Reports translation coverage for every locale.
//   npm run i18n:check            summary; exits 1 if any locale has stale keys
//   npm run i18n:check -- --export <file>   write the English source strings
import { writeFileSync } from "node:fs";
import { locales } from "../src/i18n/config";
import { missingKeys, sourceStrings } from "../src/content";
import de from "../src/content/locales/de.json";
import fr from "../src/content/locales/fr.json";
import es from "../src/content/locales/es.json";
import it from "../src/content/locales/it.json";
import da from "../src/content/locales/da.json";
import zh from "../src/content/locales/zh.json";
import ja from "../src/content/locales/ja.json";

const files: Record<string, Record<string, string>> = { de, fr, es, it, da, zh, ja };
const source = sourceStrings();
const exportAt = process.argv.indexOf("--export");
if (exportAt > -1) {
  writeFileSync(process.argv[exportAt + 1], JSON.stringify(source, null, 2) + "\n");
  console.log(`Wrote ${Object.keys(source).length} strings`);
  process.exit(0);
}

let stale = 0;
for (const l of locales) {
  if (l === "en") continue;
  const missing = missingKeys(l);
  const extra = Object.keys(files[l]).filter((k) => !(k in source));
  // Placeholders such as {name} must survive translation.
  const broken = Object.keys(source).filter((k) => {
    const want = (source[k].match(/\{\w+\}/g) ?? []).sort().join();
    const got = (files[l][k]?.match(/\{\w+\}/g) ?? []).sort().join();
    return files[l][k] !== undefined && want !== got;
  });
  stale += extra.length + broken.length;
  const status = missing.length === 0 ? "complete" : `${missing.length} missing`;
  console.log(`${l}: ${status}${extra.length ? `, ${extra.length} stale` : ""}${broken.length ? `, ${broken.length} placeholder errors` : ""}`);
  if (process.argv.includes("--verbose")) [...missing, ...extra, ...broken].forEach((k) => console.log("   ", k));
}
process.exit(stale ? 1 : 0);
