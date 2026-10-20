// Renders the owner's earlier site (syaha-tour.vercel.app) and saves only the
// sections about the Anakob and Mango guesthouses, with their photos, to
// docs/guesthouses-source/ so they can be added to this site.
import { chromium } from "playwright";
import { mkdirSync, writeFileSync } from "node:fs";

const BASE = "https://syaha-tour.vercel.app/";
const MATCH = /anakob|mango/i;
const out = "docs/guesthouses-source";
mkdirSync(`${out}/images`, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const visited = new Set();
const queue = [BASE];
const found = [];
const images = new Set();

while (queue.length && visited.size < 40) {
  const url = queue.shift();
  if (visited.has(url)) continue;
  visited.add(url);
  try {
    await page.goto(url, { waitUntil: "networkidle", timeout: 45000 });
  } catch (e) {
    found.push({ url, error: String(e) });
    continue;
  }
  await page.waitForTimeout(1500);
  const data = await page.evaluate((src) => {
    const re = new RegExp(src, "i");
    const links = [...document.querySelectorAll("a[href]")].map((a) => a.href);
    // Smallest blocks that mention a guesthouse, widened to their section.
    const blocks = [];
    for (const el of document.querySelectorAll("section, article, [class*=card], li, div")) {
      if (!re.test(el.innerText || "")) continue;
      if ([...el.children].some((c) => re.test(c.innerText || "") && c.innerText.length > 40)) continue;
      const box = el.closest("section, article") || el.parentElement || el;
      blocks.push(box);
    }
    const uniq = [...new Set(blocks)];
    return {
      title: document.title,
      links,
      sections: uniq.map((b) => ({
        text: b.innerText.trim(),
        images: [...b.querySelectorAll("img")].map((i) => ({ src: i.currentSrc || i.src, alt: i.alt })),
        backgrounds: [...b.querySelectorAll("*")].map((n) => getComputedStyle(n).backgroundImage).filter((s) => s.startsWith("url(")),
      })),
    };
  }, MATCH.source);
  for (const l of data.links) {
    const u = new URL(l);
    if (u.origin === new URL(BASE).origin) queue.push(u.origin + u.pathname);
  }
  if (data.sections.length) {
    found.push({ url, title: data.title, sections: data.sections });
    for (const s of data.sections) {
      s.images.forEach((i) => images.add(i.src));
      s.backgrounds.forEach((b) => images.add(b.replace(/^url\(["']?|["']?\)$/g, "")));
    }
  }
}

const saved = [];
let n = 0;
for (const src of images) {
  if (!src || src.startsWith("data:")) continue;
  try {
    const res = await fetch(new URL(src, BASE));
    if (!res.ok) continue;
    const type = res.headers.get("content-type") || "";
    const ext = type.includes("png") ? "png" : type.includes("webp") ? "webp" : type.includes("avif") ? "avif" : type.includes("svg") ? "svg" : "jpg";
    const file = `${String(++n).padStart(2, "0")}.${ext}`;
    writeFileSync(`${out}/images/${file}`, Buffer.from(await res.arrayBuffer()));
    saved.push({ file, src });
  } catch {}
}

writeFileSync(`${out}/content.json`, JSON.stringify({ visited: [...visited], pages: found, images: saved }, null, 2) + "\n");
console.log(`visited ${visited.size} pages, ${found.length} with matches, ${saved.length} images`);
await browser.close();
