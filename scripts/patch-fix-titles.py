"""
patch-fix-titles.py
Rewrites TITLE_MAP in scripts/build-registry-bundle.ts with
ASCII-safe Unicode escapes for em dashes. Python handles the
encoding correctly where PowerShell does not.
"""

import re

TARGET = "scripts/build-registry-bundle.ts"

NEW_TITLE_MAP = (
    'const TITLE_MAP: Record<string, string> = {\n'
    '  "UFTAGP-SPEC-001": "Governing Specification",\n'
    '  "UFTAGP-COI-001": "Conservation of Intent \\u2014 Volume I: Axioms, Invariants + Admissibility",\n'
    '  "UFTAGP-COI-002": "Conservation of Intent \\u2014 Volume II: Intent-Domain Ontology + Transformational Relations",\n'
    '  "UFTAGP-COI-003": "Conservation of Intent \\u2014 Volume III: Interpretation Saturation and Limits",\n'
    '};'
)

with open(TARGET, "r", encoding="utf-8") as f:
    content = f.read()

pattern = r'const TITLE_MAP: Record<string, string> = \{[^}]+\};'
match = re.search(pattern, content, flags=re.DOTALL)

if not match:
    print("ERROR: TITLE_MAP block not found — check file manually")
else:
    new_content = content[:match.start()] + NEW_TITLE_MAP + content[match.end():]
    with open(TARGET, "w", encoding="utf-8") as f:
        f.write(new_content)
    print(f"Patched {TARGET} — TITLE_MAP replaced with ASCII-safe \\u2014 escapes")
    for line in NEW_TITLE_MAP.splitlines():
        print(f"  {line}")
