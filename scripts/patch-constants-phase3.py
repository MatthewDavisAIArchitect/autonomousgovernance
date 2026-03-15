"""
patch-constants-phase3.py
Phase 3 — add PATH_SECTIONS to lib/constants.ts
Governing Spec: UFTAGP-SPEC-001 v1.6
Pattern: writes complete file — no regex replacement on TypeScript.
"""

import os

TARGET = os.path.join("lib", "constants.ts")

CONTENT = """\
import { ArtifactType, ClassificationLabel, ReadingPath } from "@/lib/types";

export const UFTAGP_ID_REGEX = /^UFTAGP-[A-Z]{2,4}-\\d{3}$/;

export const ARTIFACT_TYPES: ArtifactType[] = ["COI", "WP", "SPEC", "AXM", "ONT"];

export const SEALED_LABELS: readonly ClassificationLabel[] = ["Conserving", "Non-Conserving", "Refusal (Terminal)"] as const;

export const READING_PATHS: Record<ReadingPath, { label: string; entrySection: string }> = {
  executive:  { label: "Executive Path",        entrySection: "Framing Statement" },
  architect:  { label: "Architect Path",        entrySection: "Axiom Set S8.4" },
  researcher: { label: "Researcher Deep-Dive",  entrySection: "Definitions Part I" },
  misread:    { label: "Misread Safeguards",    entrySection: "S12 Misread Safeguards" },
  axiom:      { label: "Axiom / Invariant Map", entrySection: "Primitive Crosswalk S8.6" },
};

export const SEALED_COLORS = {
  conserving:    "#4A7C59",
  nonConserving: "#B5651D",
  refusal:       "#8B2020",
} as const;

export const PATH_CONTEXT_PREFIXES: Record<ReadingPath, string[]> = {
  executive:  ["Framing Statement", "S1 Introduction", "S2 Scope"],
  architect:  ["S8.4 Axiom Set", "S8.5 Invariants", "S9 Conformance", "S10 Classification"],
  researcher: ["Definitions Part I", "S3 Foundations", "S4 Methodology", "S8 Formal Framework"],
  misread:    ["S12 Misread Safeguards", "S11 Prohibited Forms", "S13 Boundary Conditions"],
  axiom:      ["Primitive Crosswalk S8.6", "S8.4 Axiom Set", "S8.5 Invariants"],
};

export const PATH_SECTIONS: Record<string, string[]> = {
  executive: [
    "COI-001:scope-nonclaims", "COI-001:citation-discipline",
    "COI-003:saturation-definition", "COI-003:overclaim-taxonomy",
  ],
  architect: [
    "COI-001:axioms", "COI-001:invariants", "COI-001:admissibility",
    "COI-001:conformance", "COI-003:failure-vs-refusal",
  ],
  researcher: [], // all sections — no truncation
  misread: [
    "COI-001:refusal-semantics", "COI-001:citation-discipline",
    "COI-003:overclaim-taxonomy", "COI-003:citation-discipline",
  ],
  axiom: [
    "COI-001:axioms", "COI-001:invariants", "COI-001:refusal-semantics",
    "COI-003:failure-vs-refusal",
  ],
};
"""


def main():
    with open(TARGET, "w", encoding="utf-8") as f:
        f.write(CONTENT)
    print(f"Patched {TARGET} — PATH_SECTIONS added ({len(CONTENT.splitlines())} lines)")


if __name__ == "__main__":
    main()
