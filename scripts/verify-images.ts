// Verifies candidate photographs on Wikimedia Commons and makes local copies.
//
//   npm run images:verify                 check every candidate, download accepted ones
//   npm run images:verify -- --dry-run    report only, change nothing
//   npm run images:verify -- --only khufu,sphinx
//
// For each image entry with a `commons` file name (and no `rejected` reason) it:
//   1. asks the Commons API whether the file exists,
//   2. reads the licence and author from the file page metadata,
//   3. accepts only CC0, public domain, CC BY and CC BY-SA (never NC or ND),
//   4. downloads a 2000px rendition and saves public/images/<id>.webp,
//   5. records creator, licence and source in src/content/image-manifest.json.
//
// The script cannot tell whether a photograph actually shows the named place.
// Look at every accepted photo on /en/image-credits before launch and remove
// any that are wrong (delete its manifest entry and add a `rejected` reason).
//
// commons.wikimedia.org and upload.wikimedia.org must be reachable.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { imageEntries, type VerifiedImage } from "../src/content/images";

const API = "https://commons.wikimedia.org/w/api.php";
const USER_AGENT = "SyahaTourImageVerifier/1.0 (image licence check for a travel website)";
const WIDTH = 2000;
const root = join(__dirname, "..");
const manifestPath = join(root, "src/content/image-manifest.json");
const outDir = join(root, "public/images");

const dryRun = process.argv.includes("--dry-run");
const onlyAt = process.argv.indexOf("--only");
const only = onlyAt > -1 ? new Set(process.argv[onlyAt + 1].split(",")) : null;

type Meta = Record<string, { value?: string } | undefined>;

function stripHtml(html = "") {
  return html.replace(/<[^>]*>/g, "").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();
}

/** Returns the reason a licence is refused, or null if it is acceptable. */
function licenceProblem(name: string): string | null {
  if (!name) return "no licence in file metadata";
  if (/\b(NC|ND)\b|non-?commercial|no-?deriv/i.test(name)) return `licence not allowed: ${name}`;
  if (/^(CC0|Public domain|PD\b|PD-)/i.test(name)) return null;
  if (/^CC BY(-SA)? \d(\.\d)?/i.test(name)) return null;
  return `licence not on allowlist: ${name}`;
}

async function lookup(file: string) {
  const params = new URLSearchParams({
    action: "query",
    titles: `File:${file}`,
    prop: "imageinfo",
    iiprop: "url|size|mime|extmetadata",
    iiurlwidth: String(WIDTH),
    format: "json",
    formatversion: "2",
  });
  const res = await fetch(`${API}?${params}`, { headers: { "User-Agent": USER_AGENT } });
  if (!res.ok) throw new Error(`Commons API returned ${res.status}`);
  const data = await res.json();
  const page = data?.query?.pages?.[0];
  if (!page || page.missing || !page.imageinfo?.[0]) return null;
  return page.imageinfo[0] as {
    url: string;
    thumburl?: string;
    descriptionurl: string;
    mime: string;
    extmetadata: Meta;
  };
}

async function main() {
  const manifest: Record<string, VerifiedImage> = JSON.parse(readFileSync(manifestPath, "utf8"));
  const sharp = dryRun ? null : (await import("sharp")).default;
  if (!dryRun) mkdirSync(outDir, { recursive: true });

  const report = { accepted: [] as string[], refused: [] as string[], missing: [] as string[], skipped: [] as string[] };

  for (const entry of imageEntries) {
    if (only && !only.has(entry.id)) continue;
    if (entry.rejected || !entry.commons) {
      report.skipped.push(`${entry.id}: ${entry.rejected ?? "no candidate file"}`);
      continue;
    }
    try {
      const info = await lookup(entry.commons);
      if (!info) {
        report.missing.push(`${entry.id}: File:${entry.commons} does not exist`);
        continue;
      }
      if (!/^image\/(jpeg|png|webp)$/.test(info.mime)) {
        report.refused.push(`${entry.id}: unsupported type ${info.mime}`);
        continue;
      }
      const meta = info.extmetadata;
      const license = stripHtml(meta.LicenseShortName?.value);
      const problem = licenceProblem(license);
      if (problem) {
        report.refused.push(`${entry.id}: ${problem}`);
        continue;
      }
      const creator = stripHtml(meta.Artist?.value) || "Unknown author";
      const licenseUrl = meta.LicenseUrl?.value;
      const attribution = stripHtml(meta.Attribution?.value) || `${creator}, ${license}, via Wikimedia Commons`;

      if (dryRun) {
        report.accepted.push(`${entry.id}: ${license}, ${creator}`);
        continue;
      }
      const img = await fetch(info.thumburl ?? info.url, { headers: { "User-Agent": USER_AGENT } });
      if (!img.ok) throw new Error(`download returned ${img.status}`);
      const out = await sharp!(Buffer.from(await img.arrayBuffer()))
        .rotate()
        .resize({ width: WIDTH, withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(join(outDir, `${entry.id}.webp`));

      manifest[entry.id] = {
        src: `/images/${entry.id}.webp`,
        width: out.width,
        height: out.height,
        creator,
        license,
        licenseUrl,
        sourceUrl: info.descriptionurl,
        attribution,
        commonsFile: entry.commons,
        verifiedAt: new Date().toISOString().slice(0, 10),
      };
      report.accepted.push(`${entry.id}: ${license}, ${creator}`);
    } catch (err) {
      report.refused.push(`${entry.id}: ${(err as Error).message}`);
    }
  }

  if (!dryRun) writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");

  for (const [label, lines] of Object.entries(report)) {
    console.log(`\n${label} (${lines.length})`);
    for (const line of lines) console.log(`  ${line}`);
  }
  if (!dryRun && report.accepted.length) {
    console.log("\nRebuild the site, then check each accepted photo on /en/image-credits shows the right place.");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
