// Searches Wikimedia Commons for photographs of every image slot that has no
// verified photo yet, keeps only allowed licences, and saves small previews in
// docs/image-candidates/ with a candidates.json index. A person (or Claude)
// then looks at the previews and copies the right file name into the
// `commons` field in src/content/images.ts.
//
//   npx tsx scripts/find-image-candidates.ts
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { imageEntries } from "../src/content/images";
import { API, commonsFetch, licenceProblem, stripHtml } from "./commons";

const root = join(__dirname, "..");
const outDir = join(root, "docs/image-candidates");
const manifest = JSON.parse(readFileSync(join(root, "src/content/image-manifest.json"), "utf8"));
const PER_SLOT = 4;

type Candidate = { file: string; preview: string; license: string; creator: string; width: number; height: number };

async function search(query: string) {
  const params = new URLSearchParams({
    action: "query",
    generator: "search",
    gsrsearch: `${query} filetype:bitmap`,
    gsrnamespace: "6",
    gsrlimit: "15",
    prop: "imageinfo",
    iiprop: "url|size|mime|extmetadata",
    iiurlwidth: "480",
    format: "json",
    formatversion: "2",
  });
  const res = await commonsFetch(`${API}?${params}`);
  if (!res.ok) throw new Error(`Commons API returned ${res.status}`);
  const pages = ((await res.json())?.query?.pages ?? []) as {
    title: string;
    index: number;
    imageinfo?: { thumburl?: string; width: number; height: number; mime: string; extmetadata: Record<string, { value?: string }> }[];
  }[];
  return pages.sort((a, b) => a.index - b.index);
}

async function main() {
  mkdirSync(outDir, { recursive: true });
  const index: Record<string, { subject: string; query: string; candidates: Candidate[]; error?: string }> = {};
  for (const entry of imageEntries) {
    if (manifest[entry.id]) continue;
    const query = entry.subject.replace(/^The /, "");
    const slot: (typeof index)[string] = { subject: entry.subject, query, candidates: [] };
    index[entry.id] = slot;
    try {
      for (const page of await search(query)) {
        const info = page.imageinfo?.[0];
        if (!info?.thumburl || !/^image\/(jpeg|png|webp)$/.test(info.mime)) continue;
        if (info.width < 1200 || info.width < info.height) continue; // landscape, large enough for a hero
        const license = stripHtml(info.extmetadata.LicenseShortName?.value);
        if (licenceProblem(license)) continue;
        const n = slot.candidates.length + 1;
        const img = await commonsFetch(info.thumburl);
        if (!img.ok) continue;
        const preview = `${entry.id}-${n}.jpg`;
        writeFileSync(join(outDir, preview), Buffer.from(await img.arrayBuffer()));
        slot.candidates.push({
          file: page.title.replace(/^File:/, ""),
          preview,
          license,
          creator: stripHtml(info.extmetadata.Artist?.value),
          width: info.width,
          height: info.height,
        });
        if (slot.candidates.length >= PER_SLOT) break;
      }
    } catch (err) {
      slot.error = (err as Error).message;
    }
    console.log(`${entry.id}: ${slot.candidates.length} candidate(s)${slot.error ? ` (${slot.error})` : ""}`);
  }
  writeFileSync(join(outDir, "candidates.json"), JSON.stringify(index, null, 2) + "\n");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
