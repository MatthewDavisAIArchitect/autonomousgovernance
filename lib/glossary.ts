export interface GlossaryTerm {
  term: string
  definition: string
  artifactId: string
  section: string
}

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    term: "Intent (sealed)",
    definition: "Intent SHALL mean only authorized representations present within the received record — such as explicit policy statements, contracts and covenants (including binding non-claims), declared constraints, explicit scope statements (what is included and excluded), and explicit citation/use constraints. Intent is a representational constraint object. It is not a hidden objective behind a representation. It is not an inference target. If a meaning requires inference beyond authorized representations, it is not admissible as intent.",
    artifactId: "UFTAGP-COI-002",
    section: "S1",
  },
  {
    term: "Refusal (Terminal)",
    definition: "A sealed classification output and jurisdiction boundary condition. It denotes that a claim cannot be lawfully classified within this trilogy's intent-domain ontology without exceeding scope, importing prohibited observables, or substituting operational facts for representational commitments. Refusal is not partial compliance. It is not a best-effort state. It is not a temporary state. Refusal is terminal.",
    artifactId: "UFTAGP-COI-001",
    section: "S11.7",
  },
  {
    term: "Conserving",
    definition: "A classification label assigned only when a transformation preserves authorized meaning commitments, scope boundaries, and binding non-claims without importing unauthorized commitments or inflating the doctrine into mandate, mechanism, enforcement, interface, or outcome claim.",
    artifactId: "UFTAGP-COI-001",
    section: "S4",
  },
  {
    term: "Non-Conserving",
    definition: "A classification label assigned when a transformation alters, launders, weakens, deletes, reverses, or imports meaning beyond authorization, including scope expansion, non-claim laundering, or label inflation.",
    artifactId: "UFTAGP-COI-001",
    section: "S4",
  },
  {
    term: "Saturation point",
    definition: "The closure boundary at which lawful interpretation ends. A saturation point is reached when a faithful response would require expansion beyond sealed jurisdiction — introducing mechanisms, interfaces, outcome guarantees, prohibited observables, or prescriptive governance derived from classification labels. At saturation, the doctrine cannot lawfully continue by approximation, partial substitution, or narrative completion. The admissible output is Refusal (Terminal).",
    artifactId: "UFTAGP-COI-003",
    section: "S1",
  },
  {
    term: "HOLD",
    definition: "A publication and representation posture indicating that status claims should not be made when prerequisites are missing, disputed, or not demonstrably satisfied within authorized representations. HOLD is not a doctrinal output label and not a substitute for Conserving, Non-Conserving, or Refusal (Terminal). It does not authorize mechanisms, interfaces, enforcement posture, or outcome guarantees as substitutes for missing prerequisites.",
    artifactId: "UFTAGP-COI-003",
    section: "S13",
  },
  {
    term: "Failure",
    definition: "An in-domain contradiction under this doctrine that can be stated within the sealed intent-domain as a violation of doctrinal constraints. Failure yields Non-Conserving where classification remains admissible. Failure is distinct from Refusal: failure is an in-domain contradiction; refusal is an out-of-jurisdiction exceedance. Treating refusal as failure invites scope capture. Treating failure as refusal obscures in-domain contradiction.",
    artifactId: "UFTAGP-COI-003",
    section: "S4",
  },
  {
    term: "Misread containment",
    definition: "Structural safeguards that prevent predictable scope conversions — mandate capture, mechanism pull, interface pull, enforcement pull, outcome capture, and inference laundering — and preserve refusal terminality. Misread containment exists because these capture modes are not interpretations; they are jurisdictional overclaims. Where they appear, the required posture is Refusal (Terminal), not debate, mitigation, or partial accommodation.",
    artifactId: "UFTAGP-COI-003",
    section: "S2",
  },
  {
    term: "Semantic altitude irreversibility",
    definition: "The one-way seal preventing law-altitude doctrine from being downgraded, by interpretation, into operational mandates, mechanisms, interfaces, enforcement posture, certification, or outcome claims. Once meaning is sealed at law altitude, later readings SHALL NOT reinterpret classification doctrine as operational guidance, convert admissibility constraints into mandates, treat binding non-claims as optional, or inflate classification labels into outcome claims.",
    artifactId: "UFTAGP-COI-003",
    section: "S9",
  },
]

export const GLOSSARY_TERMS_SORTED = [...GLOSSARY_TERMS].sort((a, b) => a.term.localeCompare(b.term))
