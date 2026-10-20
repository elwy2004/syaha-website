// Shared Wikimedia Commons client: identifies itself as the Commons API
// policy asks, spaces requests out and backs off when told to (HTTP 429).

export const API = "https://commons.wikimedia.org/w/api.php";
const USER_AGENT = "SyahaTourImageVerifier/1.1 (https://github.com/elwy2004/syaha-website; image licence check)";
const MIN_GAP_MS = 1200;
let last = 0;

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function commonsFetch(url: string, attempt = 0): Promise<Response> {
  const gap = last + MIN_GAP_MS - Date.now();
  if (gap > 0) await wait(gap);
  last = Date.now();
  const res = await fetch(url, { headers: { "User-Agent": USER_AGENT }, signal: AbortSignal.timeout(30000) });
  if ((res.status === 429 || res.status >= 500) && attempt < 5) {
    const retryAfter = Number(res.headers.get("retry-after"));
    await wait(Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter * 1000 : 5000 * 2 ** attempt);
    return commonsFetch(url, attempt + 1);
  }
  return res;
}

/** Returns the reason a licence is refused, or null if it is acceptable. */
export function licenceProblem(name: string): string | null {
  if (!name) return "no licence in file metadata";
  if (/\b(NC|ND)\b|non-?commercial|no-?deriv/i.test(name)) return `licence not allowed: ${name}`;
  if (/^(CC0|Public domain|PD\b|PD-)/i.test(name)) return null;
  if (/^CC BY(-SA)? \d(\.\d)?/i.test(name)) return null;
  return `licence not on allowlist: ${name}`;
}

export function stripHtml(html = "") {
  return html.replace(/<[^>]*>/g, "").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();
}
