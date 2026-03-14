// lib/constraints.ts
// 15 binding constraints for the Constraints Ledger page (Task 4d).
// Source: UFTAGP-SPEC-001 v1.6 invariant set INV-01 through INV-18.
// Each constraint links to its source section in the corpus reader.

export type ConstraintCategory =
  | 'Scope'
  | 'Output Labels'
  | 'Intent'
  | 'Capture Prevention'
  | 'Citation'
  | 'Refusal/Drift'

export interface Constraint {
  id: string
  label: string
  statement: string
  category: ConstraintCategory
  sourceSection: string
  artifactId: string
}

export const CONSTRAINTS: Constraint[] = [
  {
    id: 'INV-01',
    label: 'No Outcome Claims',
    statement:
      'The project makes no claims about enforcement, implementation, or outcome. Doctrine describes what counts as conserving or violating intent — it does not prescribe what should happen as a result.',
    category: 'Scope',
    sourceSection: 'S1.2',
    artifactId: 'UFTAGP-SPEC-001',
  },
  {
    id: 'INV-02',
    label: 'Sealed Label Colors Reserved',
    statement:
      'The classification colors label-conserving, label-non-conserving, and label-refusal are reserved exclusively for ClassificationLabel component output. No other component, page, or UI element may use these color values.',
    category: 'Output Labels',
    sourceSection: 'S4.1',
    artifactId: 'UFTAGP-SPEC-001',
  },
  {
    id: 'INV-03',
    label: 'Sealed Terms Non-Expandable',
    statement:
      'Sealed glossary terms are non-expandable. Tooltips display exactly: the term, verbatim definition, source artifact ID, and section reference. No editorial additions, cross-references, or related terms are permitted.',
    category: 'Intent',
    sourceSection: 'S4.3',
    artifactId: 'UFTAGP-SPEC-001',
  },
  {
    id: 'INV-04',
    label: 'Artifact ID Format Enforced',
    statement:
      'All artifact IDs must conform to the pattern UFTAGP-[A-Z]{2,4}-\\d{3}. IDs that do not match this pattern are invalid and must not be rendered, stored, or transmitted.',
    category: 'Citation',
    sourceSection: 'S5.1',
    artifactId: 'UFTAGP-SPEC-001',
  },
  {
    id: 'INV-05',
    label: 'Corpus Static Import Only',
    statement:
      'corpus-bundle.json must be loaded via static import only. File system reads (fs.readFileSync) are prohibited. Dynamic import is permitted only where static import is architecturally infeasible.',
    category: 'Scope',
    sourceSection: 'S5.3',
    artifactId: 'UFTAGP-SPEC-001',
  },
  {
    id: 'INV-06',
    label: 'Terminal Refusal Is Final',
    statement:
      'Refusal (Terminal) is a terminal classification state. No retry button, rephrase suggestion, or alternative path may be presented after a terminal refusal. The terminality statement is required output.',
    category: 'Refusal/Drift',
    sourceSection: 'S6.2',
    artifactId: 'UFTAGP-SPEC-001',
  },
  {
    id: 'INV-07',
    label: 'ORCID iD Never Stored',
    statement:
      'Raw ORCID iDs are hashed immediately on receipt using SHA-256 + SESSION_SECRET and then discarded. The raw iD must not appear in any database, log, session, or intermediate variable beyond the hashing operation itself.',
    category: 'Scope',
    sourceSection: 'S7.1',
    artifactId: 'UFTAGP-SPEC-001',
  },
  {
    id: 'INV-08',
    label: 'Eligibility Read From Session',
    statement:
      'Vote eligibility is evaluated at ORCID authentication time and stored as a boolean in the encrypted session cookie. Eligibility must not be re-evaluated at vote time because the raw ORCID iD is unavailable at that point.',
    category: 'Scope',
    sourceSection: 'S7.2',
    artifactId: 'UFTAGP-SPEC-001',
  },
  {
    id: 'INV-09',
    label: 'Vote Count Via DB Trigger Only',
    statement:
      'The vote_count field is maintained exclusively by a Supabase database trigger. Application routes must not update vote_count directly. Duplicate detection is governed by the DB UNIQUE constraint, not application logic.',
    category: 'Scope',
    sourceSection: 'S7.3',
    artifactId: 'UFTAGP-SPEC-001',
  },
  {
    id: 'INV-11',
    label: 'MCR Badge Text Is Canonical',
    statement:
      'The researcher contribution badge text is "MCR on File" everywhere it appears in the interface. The phrase "Verified Logic" must not appear in any component, page, label, or tooltip in the UFTAGP codebase.',
    category: 'Output Labels',
    sourceSection: 'S8.1',
    artifactId: 'UFTAGP-SPEC-001',
  },
  {
    id: 'INV-12',
    label: 'No Implementation Prescriptions',
    statement:
      'All public-facing copy, including the About page, must not contain outcome claims, implementation prescriptions, or enforcement assertions. The project describes doctrine — it does not prescribe action.',
    category: 'Scope',
    sourceSection: 'S8.3',
    artifactId: 'UFTAGP-SPEC-001',
  },
  {
    id: 'INV-13',
    label: 'Zero Vote Counts Always Visible',
    statement:
      'Vote counts must be visible on all community submissions regardless of value, including zero. Submissions with zero votes must not be hidden, filtered, visually distinguished, or ranked below submissions with positive vote counts on grounds of their zero value alone.',
    category: 'Citation',
    sourceSection: 'S8.4',
    artifactId: 'UFTAGP-SPEC-001',
  },
  {
    id: 'INV-15',
    label: 'UFTAGP Codebase Isolation',
    statement:
      'The UFTAGP codebase must contain no references to SpineGraph, the Davis Canon COM pipeline, or any other project sharing infrastructure. Environment variables, types, and constants must be scoped exclusively to UFTAGP.',
    category: 'Capture Prevention',
    sourceSection: 'S9.1',
    artifactId: 'UFTAGP-SPEC-001',
  },
  {
    id: 'INV-16',
    label: 'Engine Labels Isolated to Engine',
    statement:
      'Classification Engine output labels (Conserving, Non-Conserving, Refusal (Terminal)) must not be applied to community submissions. Community submissions display researcher-tagged transformation_class as plain text in mid-grey on id-bg only.',
    category: 'Output Labels',
    sourceSection: 'S9.2',
    artifactId: 'UFTAGP-SPEC-001',
  },
  {
    id: 'INV-17',
    label: 'Vote Count Is Sole Sort Signal',
    statement:
      'Community submissions are sorted by vote_count DESC. classificationCount is secondary display metadata. It must not influence, modify, or substitute for vote_count in any sort, ranking, or ordering operation.',
    category: 'Citation',
    sourceSection: 'S9.3',
    artifactId: 'UFTAGP-SPEC-001',
  },
]

export const CONSTRAINT_CATEGORIES: ConstraintCategory[] = [
  'Scope',
  'Output Labels',
  'Intent',
  'Capture Prevention',
  'Citation',
  'Refusal/Drift',
]
