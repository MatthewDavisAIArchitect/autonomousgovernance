import { ArtifactType, ClassificationLabel, ReadingPath } from "@/lib/types";

export const UFTAGP_ID_REGEX = /^UFTAGP-[A-Z]{2,4}-\d{3}$/;

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
