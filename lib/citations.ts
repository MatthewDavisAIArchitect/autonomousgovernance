import type { Artifact } from "@/lib/types"

export type CitationFormat = "chicago" | "apa" | "bibtex"

// Prohibited use descriptions — mirrors the 5 capture patterns from classify route
export const PROHIBITED_USES = [
  "mandate",
  "requires implementation",
  "enforcement",
  "monitoring",
  "compliance program",
  "must implement",
  "runtime control",
  "cryptographic",
  "instrumentation",
  "telemetry",
  "ethically aligned",
  "confirmed safe",
  "safety assurance",
  "alignment guarantee",
  "reduced liability",
  "behavioral monitoring",
  "identity inference",
  "extends to cover",
  "provisional",
  "best-effort",
  "maturity gap",
  "temporary noncompliance",
  "negotiable refusal",
]

export function checkProhibitedUse(intendedUse: string): string | null {
  const lower = intendedUse.toLowerCase()
  for (const term of PROHIBITED_USES) {
    if (lower.includes(term.toLowerCase())) {
      return term
    }
  }
  return null
}

export function formatChicago(artifact: Artifact): string {
  const year = new Date().getFullYear()
  return `Davis, Matthew A. "${artifact.title}." UFTAGP Research Site, ${year}. Canonical; non-prescriptive; classification-only. https://autonomousgovernance.org/corpus/${artifact.id}.`
}

export function formatAPA(artifact: Artifact): string {
  const year = new Date().getFullYear()
  return `Davis, M. A. (${year}). ${artifact.title} [Doctrine volume, canonical]. UFTAGP Research Site. https://autonomousgovernance.org/corpus/${artifact.id}`
}

export function formatBibTeX(artifact: Artifact): string {
  const key = artifact.id.replace(/-/g, "_").toLowerCase()
  const year = new Date().getFullYear()
  return `@misc{${key},
  author    = {Davis, Matthew A.},
  title     = {${artifact.title}},
  year      = {${year}},
  note      = {Canonical; non-prescriptive; classification-only},
  url       = {https://autonomousgovernance.org/corpus/${artifact.id}},
  publisher = {UFTAGP Research Site}
}`
}

export function generateCitation(artifact: Artifact, format: CitationFormat): string {
  switch (format) {
    case "chicago": return formatChicago(artifact)
    case "apa":     return formatAPA(artifact)
    case "bibtex":  return formatBibTeX(artifact)
  }
}
