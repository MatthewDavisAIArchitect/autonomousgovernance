import os

# Mojibake patterns found in app/about/page.tsx and app/analytics/page.tsx
# These are UTF-8 multibyte sequences misread as CP1252 single chars.
# All replacements expressed as pure unicode escapes -- no raw non-ASCII in source.

TARGETS = [
    os.path.join("app", "about", "page.tsx"),
    os.path.join("app", "analytics", "page.tsx"),
]

# Build replacement table from hex inspection of actual file bytes
# U+00E2 U+20AC U+201C  ->  U+2014  em dash
# U+00E2 U+20AC U+2122  ->  U+2014  em dash (alternate Windows encoding)
# U+00E2 U+20AC U+00A6  ->  U+2026  ellipsis
# U+00E2 U+2020 U+2019  ->  U+2192  right arrow (for analytics arrow)

REPLACEMENTS = [
    ("\u00e2\u20ac\u201c", "\u2014"),
    ("\u00e2\u20ac\u2122", "\u2014"),
    ("\u00e2\u20ac\u00a6", "\u2026"),
    ("\u00e2\u2020\u2019", "\u2192"),
]

for path in TARGETS:
    if not os.path.exists(path):
        print("SKIP (not found): " + path)
        continue

    content = open(path, encoding="utf-8").read()
    original = content

    for bad, good in REPLACEMENTS:
        content = content.replace(bad, good)

    if content == original:
        # Fallback: dump hex of any remaining non-ASCII runs for diagnosis
        lines = content.splitlines()
        found = False
        for i, line in enumerate(lines):
            if any(ord(c) > 127 for c in line):
                run = ""
                for ch in line:
                    if ord(ch) > 127:
                        run += "U+" + format(ord(ch), "04X") + " "
                if run:
                    print("UNMATCHED line " + str(i+1) + ": " + run.strip())
                    found = True
        if not found:
            print("NO CHANGE (already clean): " + path)
        continue

    with open(path, "w", encoding="utf-8") as f:
        f.write(content)

    print("Patched: " + path + " (" + str(len(content.splitlines())) + " lines)")

print("Done.")
