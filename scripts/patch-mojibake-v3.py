import os

BAD_EM_DASH = "\u00e2\u20ac\u201d"
GOOD_EM_DASH = "\u2014"

path = os.path.join("app", "about", "page.tsx")
content = open(path, encoding="utf-8-sig").read()
original = content
content = content.replace(BAD_EM_DASH, GOOD_EM_DASH)
if content == original:
    print("NO CHANGE: " + path)
else:
    open(path, "w", encoding="utf-8").write(content)
    print("Patched: " + path)
print("Done.")
