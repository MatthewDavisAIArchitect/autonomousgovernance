"""
Phase 2 — COI-001 corpus patch
Sections: scope-nonclaims, axioms, invariants, admissibility,
          conformance, refusal-semantics, citation-discipline
Run from repo root: python scripts/patch-coi001-phase2.py
Acceptance: python -c "import json; b=json.load(open('data/corpus-bundle.json')); \
  [print(a['id'], len(a['sections'])) for a in b['artifacts']]"
  => UFTAGP-COI-001 shows 7
"""
import json, pathlib

BUNDLE = pathlib.Path("data/corpus-bundle.json")

SECTIONS = [
    {
        "ref": "scope-nonclaims",
        "heading": "Scope and Non-Claims",
        "text": (
            "This volume is descriptive and non-operational. It is not an implementation guide, "
            "an integration specification, a monitoring or telemetry requirement, a governance "
            "mandate, an enforcement or sanctions regime, a certification standard, or a guarantee "
            "of ethical outcomes. It does not authorize identity inference or mental-state inference, "
            "and it does not claim predictive power, behavioral control, or empirical outcome assurance.\n\n"
            "The sole purpose of this volume is to define lawful classification semantics under a "
            "sealed intent-domain — so that interpretation remains stable under pressure, architectural "
            "change, and regime change. Any reading that converts this work into operational obligations, "
            "runtime mechanisms, compliance requirements, enforcement posture, or outcome claims exceeds "
            "its jurisdiction.\n\n"
            "Sealed output labels (binding): Admissible outputs are limited to Conserving, "
            "Non-Conserving, and Refusal (Terminal). Refusal is terminal.\n\n"
            "Binding non-claims: no mechanisms; no interfaces; no enforcement; no outcome guarantees; "
            "no identity inference; no mental-state inference; no behavioral inference.\n\n"
            "Intent (sealed): Within this trilogy, 'intent' denotes authorized representations only. "
            "Authorized representations include only what is explicitly stated and scoped within the "
            "received record — explicit policy statements, declared objectives, declared prohibitions, "
            "contracts, covenants, binding non-claims, declared constraints, scope statements, and "
            "citation/use constraints. Intent SHALL NOT be construed as a hidden interior, a hidden "
            "objective, a mental state, identity-derived intent, behavior-inferred intent, a latent "
            "objective 'really meant' but not stated, or any substitute meaning introduced to make "
            "the doctrine operational, enforceable, measurable, or outcome-bearing.\n\n"
            "Admissibility posture: This trilogy classifies only what can be stated within authorized "
            "representations. If a proposed mapping requires prohibited observables — psychological "
            "attribution, identity inference, behavioral inference, or narrative substitution — or if "
            "it requires operationalization to be made meaningful, the classification outcome is "
            "Refusal (Terminal). Refusal is not a failure mode to be optimized away. It is a boundary "
            "condition that protects the doctrine's jurisdiction."
        ),
    },
    {
        "ref": "axioms",
        "heading": "Axiom Set (Normative)",
        "text": (
            "The following axioms are normative. They define the minimal law-altitude constraints "
            "required for Conservation of Intent classification to remain stable under interpretive "
            "pressure, architectural change, institutional incentives, and regime change. These axioms "
            "govern admissibility and classification only. They do not prescribe mechanisms, "
            "implementations, monitoring regimes, enforcement posture, compliance programs, or outcome "
            "guarantees.\n\n"
            "A1 — SEALED INTENT REPRESENTATION AXIOM\n"
            "All Conservation of Intent classification SHALL be grounded only in sealed intent "
            "representations: authorized representations present within the received record. "
            "Classification SHALL NOT depend on inferred mental states, inferred identity attributes, "
            "inferred motives, or behavior-derived intent. Corollaries: (1) Where intent cannot be "
            "grounded in explicit authorized representations, classification SHALL terminate as "
            "Refusal (Terminal). (2) Where authorization is missing, disputed, or non-citable within "
            "the received record, classification SHALL terminate as Refusal (Terminal).\n\n"
            "A2 — INTENT SYMMETRY AXIOM (REPRESENTATIONAL PRESERVATION)\n"
            "A transformation that carries an intent-domain into another representation SHALL preserve "
            "intent-domain meaning commitments within the sealed scope boundary. Where equivalence "
            "cannot be stated within the sealed intent-domain — without importing unauthorized "
            "commitments — the transformation SHALL be classifiable as Non-Conserving. Corollaries: "
            "(1) 'Equivalent' reformulations that require unstated premises or retrospective narrative "
            "substitution are out-of-domain and SHALL be refused. (2) Proxy substitution that changes "
            "meaning-layer commitments breaks symmetry and is classifiable as Non-Conserving.\n\n"
            "A3 — DRIFT BOUND AXIOM (IRREVERSIBILITY CONTAINMENT)\n"
            "Transformations SHALL remain within an admissible drift bound. Any transformation that "
            "increases semantic drift — through ambiguity growth, scope creep, non-claim laundering, "
            "proxy substitution, or loss of trace-representability — beyond what can be bounded within "
            "the sealed intent-domain SHALL be classifiable as Non-Conserving. Corollaries: (1) If "
            "drift cannot be stated and bounded without prohibited observables or unstated premises, "
            "classification SHALL terminate as Refusal (Terminal). (2) Drift bounds are doctrinal "
            "admissibility constraints; they are not runtime monitoring requirements.\n\n"
            "A4 — VALUE PRESERVATION AXIOM (EXPLICIT VALUE-INVARIANTS)\n"
            "Transformations SHALL preserve explicit value-invariants declared within the authorized "
            "intent basis. Any transformation that introduces value commitments not authorized by the "
            "received record, or that deletes, weakens, or displaces explicitly declared value-invariants, "
            "SHALL be classifiable as Non-Conserving. Corollaries: (1) This axiom binds only to values "
            "explicitly declared within authorized representations; it does not introduce new values. "
            "(2) Where explicit value-invariants are absent from the received record, any claim of "
            "value-preserving conformance is out-of-scope and SHALL be refused.\n\n"
            "A5 — HARM NON-GENERATION AXIOM (CLASSIFICATION BOUNDARY)\n"
            "Transformations that increase net harm potential relative to the received intent-context "
            "SHALL be classifiable as Non-Conserving. This axiom SHALL NOT be interpreted as a moral "
            "calculus, an action-selection rule, an operational duty, an enforcement posture, or a "
            "guarantee of outcomes. Corollaries: (1) The doctrine classifies the representational "
            "admissibility of the transformation; it does not prescribe interventions. (2) Any attempt "
            "to convert this axiom into operational mandates, enforcement systems, surveillance, or "
            "sanctions exceeds scope and is inadmissible.\n\n"
            "A6 — RUNAWAY PREVENTION AXIOM (BOUNDED CLOSURE RELATION)\n"
            "Recursive or agentic loop-structures are outside the conserving domain when their "
            "continuation can amplify effects without a bounded closure relation that preserves the "
            "intent-domain under which they operate. Where unbounded amplification is admissible only "
            "by importing mechanisms, enforcement posture, or outcome claims, classification SHALL "
            "terminate as Refusal (Terminal). This axiom SHALL NOT be interpreted as a requirement "
            "for any specific termination mechanism.\n\n"
            "A7 — TRANSPARENCY OF INTENT FLOW AXIOM (TRACE REPRESENTABILITY)\n"
            "Conserving transformations SHALL be trace-representable within the sealed intent-domain. "
            "Where the path from authorized representations to classification label cannot be expressed "
            "as a finite, citable representational record — without prohibited observables or unstated "
            "premises — the transformation SHALL be classifiable as Non-Conserving, or SHALL terminate "
            "as Refusal (Terminal) where classification cannot be lawfully stated. This axiom does not "
            "mandate logging, telemetry expansion, monitoring, surveillance, or audit programs. It "
            "constrains the representational admissibility of classification only."
        ),
    },
    {
        "ref": "invariants",
        "heading": "Invariants (Derived; Bounded)",
        "text": (
            "The following invariants are derived from A1–A7. They are bounded: they SHALL NOT be "
            "treated as new primitives, new output labels, new enforcement posture, or implied "
            "operational requirements. They express what must remain stable if the axiom set is honored.\n\n"
            "I1 — Sealed Intent Constraint (A1)\n"
            "Intent remains bounded to authorized representations within the received record. No "
            "conserving classification is admissible if intent has been inferred from identity, mental "
            "state, behavior, or unstated motive.\n\n"
            "I2 — Intent Symmetry Constraint (A2)\n"
            "Representational reformulation preserves meaning commitments within the sealed "
            "intent-domain. 'Equivalence' that cannot be stated without importing unauthorized "
            "commitments is inadmissible.\n\n"
            "I3 — Drift Containment Constraint (A3)\n"
            "Ambiguity growth, proxy substitution, scope creep, non-claim laundering, and loss of "
            "trace-representability remain within an admissible drift bound. Beyond that bound, the "
            "transformation is Non-Conserving, or the classification is Refusal (Terminal) where "
            "lawful evaluation cannot be stated.\n\n"
            "I4 — Value Preservation Constraint (A4)\n"
            "Explicit value-invariants declared within authorized representations are preserved under "
            "transformation. Values are not introduced by inference, convenience, or retrospective "
            "justification.\n\n"
            "I5 — Harm Non-Generation Constraint (A5)\n"
            "Net harm potential is not increased relative to the received intent-context. Where net "
            "harm potential is increased, the transformation is Non-Conserving. This invariant does "
            "not constitute a moral calculus, a runtime duty, or an outcome guarantee.\n\n"
            "I6 — Runaway Prevention Constraint (A6)\n"
            "Unbounded amplification structures that can continue without a bounded closure relation "
            "preserving the intent-domain are outside the conserving domain. Where bounded closure "
            "cannot be stated within the doctrine without importing mechanisms, enforcement posture, "
            "or outcome claims, classification terminates as Refusal (Terminal).\n\n"
            "I7 — Transparency of Intent Flow Constraint (A7)\n"
            "Conserving classifications remain trace-representable: the path from authorized "
            "representations to label is expressible as a finite, citable representational record "
            "within the sealed intent-domain, without prohibited observables or outcome reasoning.\n\n"
            "Together, these invariants define the doctrine's stability surface: the conditions under "
            "which Conservation of Intent classification remains lawful, citable, and resistant to "
            "interpretive capture — without expanding scope."
        ),
    },
    {
        "ref": "admissibility",
        "heading": "Admissibility (Normative)",
        "text": (
            "An interpretation is admissible under this doctrine only when it can be stated entirely "
            "within the sealed intent-domain induced by an admissible intent basis, using "
            "representational language only, without prohibited observables, and without exceeding "
            "declared scope. Admissibility is the gateway condition for classification. Where "
            "admissibility fails, classification SHALL NOT proceed as 'best effort,' 'approximate,' "
            "or 'partial.' The admissible outcome is Refusal (Terminal). Refusal is terminal.\n\n"
            "An interpretation SHALL be admissible only if ALL of the following conditions hold:\n\n"
            "A. Authorized intent basis (required): The intent basis is explicit and citable within "
            "the received record. Where the intent basis is missing, implicit, contradictory, or "
            "requires inference to complete, admissibility fails and classification SHALL terminate "
            "as Refusal (Terminal).\n\n"
            "B. Representational statement form (required): The interpretation is expressible as a "
            "representational statement. The interpretation SHALL NOT be stated as a psychological "
            "claim ('they intended'), an identity-derived claim, or a behavior-derived claim. Such "
            "claims are prohibited observables.\n\n"
            "C. Scope preservation (required): The interpretation preserves explicit scope boundaries "
            "and binding non-claims. It SHALL NOT expand jurisdiction by inference, convenience, "
            "institutional preference, urgency, or retrospective narrative substitution. Where scope "
            "expansion is required to make the interpretation meaningful, admissibility fails.\n\n"
            "D. Transformation explicitness (required): If the interpretation depends on a "
            "transformation, the transformation is explicit: the input representation(s) and output "
            "representation(s) are stated, and the mapping is describable at the representational "
            "level. Where the transformation cannot be stated without importing mechanisms, "
            "enforcement posture, outcome claims, or prohibited observables, admissibility fails.\n\n"
            "E. Trace representability (required): The interpretation supports trace representability: "
            "the path from authorized representations to the claimed meaning commitment and "
            "classification label can be expressed as a finite, citable representational record. "
            "This requirement does not mandate logging, telemetry, monitoring, or auditing systems.\n\n"
            "F. Refusal precedence (binding): Refusal has precedence over classification. Where any "
            "admissibility prerequisite fails, the doctrine does not degrade into a partial label. "
            "It terminates. Refusal is not noncompliance. It is the doctrine's lawful boundary "
            "condition under scope exceedance."
        ),
    },
    {
        "ref": "conformance",
        "heading": "Conformance (Normative)",
        "text": (
            "Conformance in this trilogy is classification-only. It expresses whether a stated "
            "interpretation or transformation is admissible and, if admissible, whether it is "
            "Conserving or Non-Conserving relative to a sealed intent-domain. Conformance is not "
            "certification. It does not imply ethical achievement, safety, alignment, regulatory "
            "sufficiency, reduced liability, or any guaranteed outcome. It does not authorize "
            "enforcement posture, sanctions, surveillance, identity inference, mental-state inference, "
            "behavioral inference, monitoring regimes, telemetry expansion, or implementation "
            "mandates.\n\n"
            "A. Conformance object (required): A conformance claim SHALL identify, in representational "
            "terms: (1) the intent basis used, (2) the scope boundary statements and binding non-claims, "
            "(3) the transformation or interpretation being evaluated, and (4) the classification "
            "outcome: Conserving, Non-Conserving, or Refusal (Terminal). A conformance claim that "
            "cannot identify these elements is inadmissible.\n\n"
            "B. Conserving conformance: A conformance claim of Conserving SHALL be made only where the "
            "transformation preserves the intent-domain's authorized meaning commitments without "
            "adding, deleting, weakening, reversing, or laundering binding constraints, scope "
            "boundaries, or non-claims. Conserving conformance does not mean the system is ethical. "
            "It means only that the transformation preserves authorized meaning commitments.\n\n"
            "C. Non-Conserving conformance: A conformance claim of Non-Conserving SHALL be made where "
            "the transformation violates conservation. Non-Conserving does not assert malicious intent. "
            "It asserts that the transformation, as stated, alters or imports meaning beyond "
            "authorization.\n\n"
            "D. Refusal conformance: Where admissibility fails, where prerequisites are missing, or "
            "where evaluation would require prohibited observables or outcome reasoning, the doctrine "
            "does not degrade to 'best effort.' The conformance outcome is Refusal (Terminal). Refusal "
            "is not noncompliance. It is not a maturity gap. It is a lawful boundary condition under "
            "scope exceedance.\n\n"
            "E. Non-transferability (binding): Conformance claims are non-transferable across "
            "intent-domains. A Conserving classification under one intent basis SHALL NOT be carried "
            "to a different intent basis by analogy, convenience, or institutional preference. "
            "Conformance is always relative to the specific sealed intent-domain."
        ),
    },
    {
        "ref": "refusal-semantics",
        "heading": "Refusal Semantics (Normative; Terminal)",
        "text": (
            "Refusal is a first-class doctrinal outcome. It is not a failure state, not a degraded "
            "classification, and not an operational exception. It is the lawful terminal boundary "
            "condition used when classification would require scope exceedance, prohibited observables, "
            "unstated premises, or unauthorized meaning import. Refusal is terminal.\n\n"
            "When refusal is required (Normative): The doctrine SHALL issue Refusal (Terminal) "
            "whenever any of the following conditions hold:\n"
            "1. Missing or non-citable authorization: The intent basis cannot be grounded in explicit "
            "authorized representations within the received record.\n"
            "2. Implicit or inferred intent required: Classification would require inferring 'true "
            "intent,' motive, mental state, identity-derived intent, or behavior-derived intent.\n"
            "3. Contradiction requiring narrative resolution: The received record contains "
            "contradictions that cannot be resolved within authorized representations without importing "
            "preferences or retrospective narrative substitution.\n"
            "4. Scope exceedance: The interpretation would require expanding scope beyond explicit "
            "scope boundaries or laundering binding non-claims into implied requirements.\n"
            "5. Transformation not explicitly stateable: The transformation cannot be expressed as a "
            "representational mapping without importing mechanisms, enforcement posture, outcome "
            "claims, or prohibited observables.\n"
            "6. Trace representability failure: A finite, citable representational path from authorized "
            "representations to classification label cannot be stated without prohibited observables, "
            "unstated premises, or outcome reasoning.\n"
            "7. Semantic altitude downgrade attempt: Any attempt to downgrade law-altitude doctrine "
            "into operational mandates, implementation requirements, monitoring regimes, enforcement "
            "systems, certification posture, or outcome guarantees.\n\n"
            "Terminality (binding): Refusal is not a temporary state. It is not a backlog item. It "
            "is not a maturity gap. It is not 'partial compliance.' It is not negotiable and not "
            "deferrable within the doctrine. Where refusal is issued, the doctrine does not proceed "
            "to assign Conserving or Non-Conserving. It terminates.\n\n"
            "What refusal does and does not mean: Refusal means only that lawful classification "
            "cannot be stated within the doctrine's jurisdiction. It does not assert wrongdoing, "
            "negligence, or moral deficiency. It does not assign blame. It does not imply that a "
            "system is unsafe or unethical. It asserts only that, given the received record and the "
            "doctrine's constraints, classification would exceed scope."
        ),
    },
    {
        "ref": "citation-discipline",
        "heading": "Citation Discipline (Normative)",
        "text": (
            "Citations to this trilogy SHALL preserve its jurisdictional posture and SHALL NOT inflate "
            "doctrine into mandate, mechanism, enforcement posture, certification, or outcome claim. "
            "Citation discipline is normative because the dominant failure mode of this doctrine is "
            "capture by reference: drift introduced not by rewriting the text, but by citing it as "
            "authorizing what it explicitly refuses to authorize.\n\n"
            "Jurisdiction qualifiers preserved (binding): Every citation SHALL preserve: (1) Canonical; "
            "non-prescriptive; classification-only. (2) Binding non-claims remain binding. (3) Output "
            "labels remain sealed: Conserving; Non-Conserving; Refusal (Terminal). Refusal is terminal. "
            "(4) Prohibited observables remain prohibited. (5) Refusal precedence is preserved. "
            "Omission of any of these qualifiers is a Non-Conserving transformation of this doctrine "
            "by definition.\n\n"
            "No mandate capture (binding): A citation SHALL NOT represent this trilogy as requiring "
            "implementation of specific mechanisms, monitoring, logging, telemetry, enforcement "
            "posture, sanctions, certification regimes, or compliance programs.\n\n"
            "No mechanism capture (binding): A citation SHALL NOT translate doctrinal semantics into "
            "architectural requirements, tooling prescriptions, interface requirements, runtime "
            "guardrails, or governance machinery as if those were implied by this text.\n\n"
            "No outcome capture (binding): A citation SHALL NOT treat Conserving as implying ethical "
            "achievement, safety, alignment, reduced liability, regulatory sufficiency, or any "
            "guaranteed outcome. These labels are classifications only.\n\n"
            "No scope laundering (binding): A citation SHALL NOT expand scope beyond explicit scope "
            "boundaries and binding non-claims by inference, convenience, institutional preference, "
            "urgency, or retrospective narrative substitution.\n\n"
            "Refusal integrity (binding): A citation SHALL preserve refusal as terminal. It SHALL NOT "
            "represent refusal as partial compliance, degraded conformance, a temporary exception, a "
            "maturity gap, or a backlog item. Refusal is terminal.\n\n"
            "Fidelity for paraphrase and summary (binding): Any paraphrase, summary, or translation "
            "of this trilogy is a transformation. It SHALL preserve sealed term meanings, explicit "
            "scope boundaries, binding non-claims, refusal semantics, and the non-inflation of labels "
            "into mandates, mechanisms, or outcomes. Where fidelity cannot be maintained without "
            "exceeding scope, the admissible outcome is Refusal (Terminal)."
        ),
    },
]


def main():
    if not BUNDLE.exists():
        print("ERROR: data/corpus-bundle.json not found. Run build-registry-bundle.ts first.")
        raise SystemExit(1)

    bundle = json.loads(BUNDLE.read_text(encoding="utf-8"))

    patched = False
    for artifact in bundle["artifacts"]:
        if artifact["id"] == "UFTAGP-COI-001":
            artifact["sections"] = SECTIONS
            artifact["curated"] = True
            patched = True
            print(f"Patched UFTAGP-COI-001 — {len(SECTIONS)} sections, curated=True")
            break

    if not patched:
        print("WARNING: UFTAGP-COI-001 not found in bundle — adding it.")
        bundle["artifacts"].append({
            "id": "UFTAGP-COI-001",
            "title": "Conservation of Intent — Volume I: Axioms, Invariants + Admissibility",
            "curated": True,
            "sections": SECTIONS,
        })

    BUNDLE.write_text(json.dumps(bundle, indent=2), encoding="utf-8")
    print("corpus-bundle.json updated.")
    print("Verify: python -c \"import json; b=json.load(open('data/corpus-bundle.json')); "
          "[print(a['id'], len(a['sections'])) for a in b['artifacts']]\"")
    print("Expected: UFTAGP-COI-001 7")


if __name__ == "__main__":
    main()
