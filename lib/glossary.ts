// lib/glossary.ts
// Sealed glossary terms — definitions are verbatim from the COI corpus Glossary (Back Matter).
// Source: Conservation of Intent, Volume I (Doctrine) — Matthew A. Davis, 2026.
// INV-03: do not add cross-references, editorial additions, or related terms.

export interface GlossaryTerm {
  term: string
  definition: string
  artifactId: string
  section: string
}

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    term: 'Intent (sealed)',
    definition:
      'Intent, within this trilogy, means authorized representations only. It is not a psychological interior, a hidden motive, an identity-derived property, a mental-state inference target, or a behavior-inferred attribution.',
    artifactId: 'UFTAGP-COI-001',
    section: 'S1',
  },
  {
    term: 'Intent-domain',
    definition:
      'The bounded meaning-domain induced by an admissible intent basis, including its explicit scope boundaries and binding non-claims.',
    artifactId: 'UFTAGP-COI-001',
    section: 'S2',
  },
  {
    term: 'Refusal (Terminal)',
    definition:
      'A sealed outcome issued when lawful classification cannot be stated within scope (due to missing prerequisites, scope exceedance, prohibited observables, unstated premises, or non-trace-representable paths). Refusal is terminal.',
    artifactId: 'UFTAGP-COI-001',
    section: 'S11.7',
  },
]

export const GLOSSARY_MAP: Record<string, GlossaryTerm> = Object.fromEntries(
  GLOSSARY_TERMS.map((t) => [t.term, t])
)

export const GLOSSARY_TERMS_SORTED: GlossaryTerm[] = [...GLOSSARY_TERMS].sort(
  (a, b) => a.term.localeCompare(b.term)
)
