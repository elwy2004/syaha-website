"""Build src/content/locales/<locale>.json from a numbered translation file.

Usage: python3 scripts/translations/apply.py <locale> <source-paths.json>

`source-en.tsv` numbers every unique English string (NNNN<TAB>text) as it was
when the translation was made; `<locale>.txt` holds NNNN|translation lines.
Translations are matched to content by English text, so a string edited in
English afterwards simply shows up as missing in `npm run i18n:check`.
"""
import json, re, sys, pathlib

here = pathlib.Path(__file__).parent
locale, paths_file = sys.argv[1], sys.argv[2]
source = {}
for line in (here / "source-en.tsv").read_text(encoding="utf-8").splitlines():
    num, text = line.split("\t", 1)
    source[num] = text

tr = {}
for n, line in enumerate((here / f"{locale}.txt").read_text(encoding="utf-8").splitlines(), 1):
    if not line.strip():
        continue
    num, text = line.split("|", 1)
    num = num.strip()
    if num not in source:
        sys.exit(f"{locale}.txt line {n}: unknown id {num}")
    if num in tr:
        sys.exit(f"{locale}.txt line {n}: duplicate id {num}")
    tr[source[num]] = text.strip()

# Times and the brand name stay as they are.
keep = re.compile(r"^[\d:]+$|^Syaha Tour$")
missing = [num for num, text in source.items() if text not in tr and not keep.match(text)]
if missing:
    print(f"{locale}: {len(missing)} untranslated ids: {', '.join(missing[:20])}")

paths = json.loads(pathlib.Path(paths_file).read_text(encoding="utf-8"))
out = {}
for key, text in paths.items():
    if text in tr:
        out[key] = tr[text]
    elif keep.match(text):
        out[key] = text
target = here.parent.parent / "src" / "content" / "locales" / f"{locale}.json"
target.write_text(json.dumps(out, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print(f"{locale}: wrote {len(out)} of {len(paths)} keys")
