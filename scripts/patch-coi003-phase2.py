"""
patch-coi003-phase2.py
Phase 2 — UFTAGP-COI-003 corpus patch
Governing Spec: UFTAGP-SPEC-001 v1.6
Author: Matthew A. Davis / Session 8 build
Pattern: identical to patch-coi001-phase2.py

Reads data/corpus-bundle.json, finds UFTAGP-COI-003,
replaces sections array with 5 curated sections,
sets curated:true, writes back UTF-8.
If artifact not found, appends it.
"""

import json
import os

BUNDLE_PATH = os.path.join("data", "corpus-bundle.json")
TARGET_ID = "UFTAGP-COI-003"

SECTIONS = [
    {
        "ref": "saturation-definition",
        "heading": "Interpretation Saturation — Definition",
        "text": (
            "A saturation point is reached when a faithful response would require expansion beyond sealed "
            "jurisdiction. At saturation, the doctrine cannot lawfully \"continue\" by approximation, partial "
            "substitution, or narrative completion. The admissible output is: Refusal (Terminal).\n\n"
            "A saturation point is reached whenever an answer would require any attempt to:\n"
            "- Introduce mechanisms (including tools, implementations, controls, monitoring/logging/telemetry, "
            "enforcement postures, sanctions, scoring, certification regimes, or operational playbooks).\n"
            "- Introduce interfaces (including integrations, APIs, runbooks, workflows, deployment obligations, "
            "or process mandates).\n"
            "- Assert outcomes or guarantees (including any claim that conformance implies \"ethical AI achieved,\" "
            "\"safety assured,\" or equivalent outcome capture).\n"
            "- Infer intent from prohibited observables (including identity inference, mental-state inference, "
            "behavioral inference, preference inference, or any surrogate thereof).\n"
            "- Redefine primitives beyond sealed records (including any re-authoring of MVC primitives, scope "
            "primitives, or refusal primitives to satisfy pressure, convenience, or downstream usage).\n"
            "- Convert classification semantics into prescriptive governance (including decision rights, "
            "enforcement duties, liability transfer, or institutional mandates derived from the labels).\n\n"
            "Saturation is not a failure and not a \"maturity gap.\" It is the trilogy's closure condition: "
            "the point where further claims become inadmissible as faithful readings. When a saturation point "
            "is reached, Refusal (Terminal) is required. It is not partial, not degraded, not \"best effort,\" "
            "and not subject to mitigation language.\n\n"
            "Physics-informed and cyber-physical environments intensify interpretive risk. The following "
            "stressors act as admissibility pressure multipliers: Embodiment (the mapping from representation "
            "to effect couples into physical consequence); Temporal asymmetry (delays, hysteresis, and "
            "irreversibility amplify the cost of misread); Multi-agent interaction (feedback loops can amplify "
            "effects beyond local intent scope); Spatial boundary conditions (locality, adjacency, and "
            "containment boundaries constrain meaning); Partial observability (incomplete representation "
            "increases ambiguity and increases pressure to substitute proxies). Under these conditions, "
            "equivalence claims become more brittle, drift pressure increases, trace representability becomes "
            "harder to state within authorized representations, and when the mapping cannot be stated within "
            "the sealed intent-domain, the admissible outcome is Refusal (Terminal)."
        )
    },
    {
        "ref": "overclaim-taxonomy",
        "heading": "Overclaim Taxonomy",
        "text": (
            "This taxonomy names common misreads that attempt to convert the trilogy into something it is not. "
            "These misreads are not \"interpretations.\" They are jurisdictional overclaims. Where they appear, "
            "the required posture is not debate, mitigation, or partial accommodation. The required posture is "
            "Refusal (Terminal). This taxonomy is binding because it preserves the trilogy's law-altitude "
            "meaning. Any reading that triggers these overclaim patterns exceeds scope and SHALL be refused.\n\n"
            "Mechanism Capture (Refused): Mechanism capture is any claim that the doctrine or ontology implies "
            "specific technical controls, system mechanisms, model behaviors, monitoring/logging/telemetry, "
            "instrumentation, surveillance posture, governance tooling, or enforcement machinery. Mechanism "
            "capture attempts to replace classification semantics with implementation obligation. It is out of "
            "scope. Any claim that conservation classification implies a required control, mechanism, safeguard, "
            "pipeline gate, runtime guard, or model constraint SHALL be refused. Any claim that conservation "
            "classification authorizes monitoring/logging/telemetry requirements, surveillance proxies, or "
            "\"observability as proof\" SHALL be refused. The trilogy does not prescribe mechanisms. It "
            "classifies only within a sealed intent-domain.\n\n"
            "Interface Capture (Refused): Interface capture is any claim that the doctrine or ontology implies "
            "integrations, APIs, runbooks, operational workflows, interface obligations, organizational "
            "procedures, or platform requirements. Any claim that the ontology requires integration into "
            "pipelines, workflows, deployment processes, or operating procedures SHALL be refused. Any claim "
            "that the doctrine implies API surfaces, UI disclosures, or platform features SHALL be refused. "
            "This trilogy does not prescribe interfaces or processes.\n\n"
            "Mandate Capture (Refused): Mandate capture is any attempt to derive sanctions, decision rights, "
            "enforcement duties, governance mandates, compliance obligations, or institutional authority claims "
            "from conservation classification. Any claim that \"Conserving\" imposes obligations beyond "
            "classification semantics SHALL be refused. Any claim that \"Non-Conserving\" authorizes sanctions, "
            "punitive posture, or compelled remediation programs SHALL be refused. The trilogy is not a "
            "governance regime. It is classification-only.\n\n"
            "Outcome Capture (Refused): Outcome capture is any claim that conservation conformance constitutes "
            "\"ethical AI achieved,\" \"safety assured,\" \"alignment verified,\" or any equivalent outcome "
            "guarantee, outcome certification, or reputational claim. Any claim that \"Conserving\" is evidence "
            "of ethical outcomes SHALL be refused. Any use that converts classification into outcome guarantee "
            "is out-of-jurisdiction and SHALL be refused. This trilogy constrains lawful meaning. It does not "
            "certify outcomes.\n\n"
            "Identity-Inference Capture (Refused): Identity-inference capture is any attempt to define or apply "
            "\"intent\" by inferring mental state, identity attributes, preferences, motives, group membership, "
            "or behavioral intent whether directly or by proxy. The trilogy does not authorize mind-reading. "
            "It does not authorize identity inference. It does not authorize behavioral inference. It does not "
            "authorize preference inference. It does not authorize retroactive \"true intent\" claims supplied "
            "by outcomes. Where prohibited observables would be required to answer, the admissible output is "
            "Refusal (Terminal). Refusal is terminal.\n\n"
            "Verification Capture (Refused): Verification capture is any attempt to treat \"verification\" "
            "under this trilogy as proof of ethics, proof of safety, certification, compliance regime, audit "
            "authority, or enforceable assurance. Verification, in this trilogy, is classification/consistency "
            "vocabulary only. It does not convert the doctrine into an evidence regime, an audit program, a "
            "certification scheme, or an outcome guarantee. Any attempt to treat verification as proof, "
            "certification, or compliance regime is out-of-jurisdiction and SHALL be refused."
        )
    },
    {
        "ref": "failure-vs-refusal",
        "heading": "Failure vs Refusal Discipline",
        "text": (
            "This Part distinguishes two conditions that are routinely collapsed under pressure:\n"
            "- Failure: an in-domain contradiction that can be stated within jurisdiction and therefore must be "
            "classified as Non-Conserving.\n"
            "- Refusal: an out-of-jurisdiction exceedance where a faithful response would require prohibited "
            "inference, operationalization, mandate conversion, outcome capture, or other expansion beyond "
            "sealed scope — therefore the only admissible output is Refusal (Terminal).\n\n"
            "These are not interchangeable. Treating refusal as failure invites scope capture. Treating failure "
            "as refusal obscures in-domain contradiction and dilutes the meaning of Non-Conserving.\n\n"
            "Failure Condition (In-Domain Contradiction): A failure condition occurs when the sealed input set "
            "cannot be made internally consistent within jurisdiction, such that a conserving classification "
            "cannot be stated without contradiction under the Volume I axiom and invariance constraints. "
            "Failure conditions include: Representational contradiction (authorized representations contradict "
            "each other in a way that prevents stable interpretation within the sealed intent-domain); "
            "Equivalence contradiction (equivalence claims cannot be stated without violating sealed intent "
            "constraints); Axiom contradiction (a stated transformation yields an unavoidable contradiction "
            "under one or more Volume I axioms and invariants when applied within scope). Failure is not an "
            "additional output label. When a failure condition is encountered, the classification register "
            "SHALL represent it as: Non-Conserving, if the contradiction can be stated as a violation of one "
            "or more Volume I axioms and invariants without expanding jurisdiction; or Refusal (Terminal), if "
            "the contradiction prevents admissible application of the axioms without importing mechanisms, "
            "mandates, interfaces, outcome claims, or prohibited observables.\n\n"
            "Refusal (Out-of-Jurisdiction Terminal): Refusal applies when a faithful response would exceed "
            "jurisdiction. Refusal SHALL be returned when: prerequisites are missing or disputed (the "
            "authorized intent basis required for lawful classification is absent, incomplete, internally "
            "contested, or not stably representable within the sealed record); operational pull is demanded "
            "(the request demands mechanisms, controls, monitoring/logging/telemetry, instrumentation, "
            "enforcement posture, sanctions, integrations, workflows, or any operational playbook); outcome "
            "capture is demanded (the request demands guarantees, assurances, certification posture, or any "
            "claim that labels imply ethical or safety outcomes); prohibited observables are required (the "
            "request requires identity inference, mental-state inference, behavioral inference, preference "
            "inference, or any surrogate intended to stabilize meaning by inference rather than by authorized "
            "representation); or in-domain expression is impossible (the transformation cannot be stated within "
            "the sealed intent-domain without importing unstated premises, proxy substitutions, or "
            "jurisdiction-expanding interpretations). Refusal is a boundary condition, not an error. It "
            "preserves the trilogy's lawful scope. Refusal is terminal. It is not partial, not degraded, "
            "not \"best effort,\" not \"to be mitigated,\" and not an invitation to backfill missing premises "
            "with narrative.\n\n"
            "Refusal under coercion (clarifying; non-authorizing): Coercion, in this context, includes any "
            "form of stakeholder pressure that attempts to force the trilogy to exceed its jurisdiction: "
            "demands for implementation, enforcement, interface obligations, certification posture, "
            "verification-as-proof, or outcome guarantees. When such demands occur, they are out-of-jurisdiction "
            "for this trilogy. The correct response is Refusal (Terminal) — not partial compliance, not "
            "approximations, not \"interim\" substitutions, and not a rephrased mandate. Refusal is terminal "
            "because it prevents scope capture and preserves semantic altitude irreversibility: law-altitude "
            "meaning cannot be downgraded into operational obligation by pressure, urgency, or institutional "
            "preference.\n\n"
            "Failure vs Refusal Decision Boundary (Non-Mechanistic): The boundary between Non-Conserving and "
            "Refusal (Terminal) is semantic: If the issue is an in-domain contradiction that can be stated as "
            "a violation of one or more Volume I axioms and invariants within jurisdiction, classify "
            "Non-Conserving. If answering would require expansion beyond jurisdiction (mechanisms, mandates, "
            "interfaces, guarantees, verification-as-proof, or prohibited observables), classify Refusal "
            "(Terminal). This boundary does not imply a runtime decision procedure, adjudication process, "
            "or enforcement regime."
        )
    },
    {
        "ref": "citation-discipline",
        "heading": "Citation Discipline (Volume III)",
        "text": (
            "This trilogy is citable only as a classification doctrine and refusal boundary. Citation is "
            "permitted only in forms that preserve the trilogy's sealed posture: canonical, non-prescriptive, "
            "classification-only, with terminal refusal and binding non-claims intact.\n\n"
            "A lawful citation SHALL NOT: convert classification language into an operational mandate; convert "
            "doctrine into mechanisms, interfaces, or enforcement posture; convert labels into guarantees, "
            "certifications, or outcome claims; or convert \"intent\" into identity inference, mental-state "
            "inference, behavioral inference, or any proxy thereof.\n\n"
            "Lawful citation sentences (binding): \"Conservation of Intent provides a classification frame for "
            "determining whether transformations are conserving or non-conserving relative to a sealed "
            "intent-domain.\" \"This doctrine constrains interpretation to admissibility classification and "
            "consistency assessment, not operational mandates or enforcement.\" \"A classification doctrine "
            "defining conserving vs non-conserving transformations under a sealed intent-domain.\" \"A "
            "consistency register with refusal semantics; not an implementation guide; no outcome guarantees.\"\n\n"
            "Citation discipline under executive/architect pressure: Lawful citation preserves altitude: it "
            "cites the trilogy as a classification doctrine and refusal boundary, and nothing more. Under "
            "pressure — whether executive pressure for decisive language, architectural pressure for "
            "implementable requirements, legal pressure for enforceable posture, or reputational pressure for "
            "assurance — the most common failure is citation inflation: treating the trilogy as if it authorizes "
            "mechanisms, enforcement, verification-as-proof, certification posture, or ethical outcome "
            "guarantees. That inflation is out-of-jurisdiction. Any citation that attempts to extract "
            "mechanisms, enforcement, interfaces, verification-as-proof, or guarantees is refused by this "
            "volume. Where a faithful citation cannot be made without such extraction, the only admissible "
            "posture is Refusal (Terminal).\n\n"
            "Disallowed Citation (Binding Refusals): The doctrine SHALL NOT be cited in any form that converts "
            "it into mandate, mechanism, enforcement posture, assurance, or inference authority. You must not "
            "cite the doctrine as: an operational mandate (any citation framed as \"therefore we must do X\"); "
            "an enforcement standard with decision rights or sanctions; a runtime guarantee or safety/ethics "
            "assurance (\"this ensures safety,\" \"this guarantees ethics\"); an imperative for "
            "monitoring/logging/telemetry, surveillance, or tooling; or a basis for inferring intent from "
            "identity, behavior, preferences, or psychological states.\n\n"
            "Unlawful Derivation Patterns (Binding Refusals): The trilogy SHALL NOT be used as a premise from "
            "which operational, enforcement, assurance, or inference authority is derived. The following "
            "derivations are refused as out-of-jurisdiction: Implementation derivation (\"Because the trilogy "
            "classifies conserving vs non-conserving, therefore the system must implement controls, monitoring, "
            "telemetry, tooling, guardrails, or interventions\"); Enforcement derivation; Interface derivation; "
            "Certification/guarantee derivation (\"Because conserving is satisfied, therefore ethical outcomes "
            "are achieved\"); Inference derivation (\"Because intent must be conserved, therefore intent may "
            "be inferred from identity, behavior, preferences, telemetry, interaction traces, or psychological "
            "attribution to stabilize classification\"). These derivations are scope conversions, not strong "
            "interpretations. They are therefore refused.\n\n"
            "Semantic Altitude Irreversibility (Binding): Semantic altitude irreversibility is the constraint "
            "that once meaning is sealed at law altitude as canonical, non-prescriptive, classification-only — "
            "later readings SHALL NOT lawfully downgrade that meaning into operational guidance, discretionary "
            "best practices, implementation obligation, enforcement posture, or outcome claims without an "
            "explicit boundary breach. This seal is one-way. A reader MAY construct operational artifacts, "
            "governance programs, or technical systems in adjacent domains, but those artifacts SHALL NOT be "
            "represented as required, implied, mandated, authorized, or guaranteed by this trilogy. Later "
            "readings SHALL NOT: reinterpret classification doctrine as operational guidance; convert "
            "admissibility constraints into mandates; treat binding non-claims as optional or negotiable; "
            "convert limits or saturation points into \"best effort\" continuation; inflate classification "
            "labels into outcome claims; or launder prohibited observables into the intent basis."
        )
    },
    {
        "ref": "closure-integrity",
        "heading": "Closure Integrity for Enterprise Use",
        "text": (
            "Before any version of Volume III is represented as stable, citable, or complete within this "
            "trilogy, the following closure integrity conditions SHALL hold.\n\n"
            "Classification-only seal remains intact: Admissible outputs remain limited to Conserving, "
            "Non-Conserving, and Refusal (Terminal). These labels remain classifications only. They SHALL NOT "
            "be reframed as scores, rankings, maturity levels, certifications, compliance verdicts, or "
            "performance claims.\n\n"
            "Refusal Remains Terminal: Refusal SHALL NOT be reframed as partial compliance, degraded "
            "conformance, a temporary state, \"best effort,\" a mitigation posture, or a maturity gap. Where "
            "scope is exceeded, the doctrine terminates in Refusal (Terminal). Refusal is terminal.\n\n"
            "Binding Non-Claims Remain Binding: No revision may delete, soften, relativize, or \"contextually "
            "override\" the trilogy's binding non-claims. The doctrine SHALL NOT be represented as authorizing "
            "mechanisms, interfaces, enforcement posture, monitoring/logging/telemetry, scoring, certification, "
            "or outcome guarantees.\n\n"
            "No Mechanism / Interface / Enforcement / Outcome Authority is Introduced: No language may be "
            "introduced that prescribes, implies, or smuggles in operational obligation, implementation duty, "
            "interface coupling, enforcement regimes, sanctions posture, verification-as-proof, certification "
            "posture, or any claim that conserving classification implies ethical achievement, safety assurance, "
            "alignment verification, or equivalent outcome capture.\n\n"
            "No Inference Authority is Introduced: Intent remains sealed to authorized representations only. "
            "Identity inference, mental-state inference, behavioral inference, preference inference, and any "
            "proxy substitution remain refused. Where prohibited observables would be required to sustain "
            "interpretation, the admissible posture is Refusal (Terminal).\n\n"
            "Citation Posture Remains Fully Aligned to the Citation and Use Contract: Lawful citation remains "
            "bounded to canonical non-prescriptive classification-only semantics. No citation form may be "
            "introduced that enables mandate capture, mechanism capture, enforcement capture, outcome capture, "
            "or inference laundering.\n\n"
            "Cross-Volume Term Integrity is Preserved: Sealed terms, definitions, and refusal semantics remain "
            "consistent with Volumes I-II. No silent synonym drift, definitional drift, or scope drift is "
            "permitted. Where wording changes occur, they SHALL remain tightening (allowed) and SHALL NOT "
            "expand jurisdiction. If any closure integrity condition fails, the version SHALL NOT be represented "
            "as a faithful instantiation of this trilogy's doctrine set. The correct posture is HOLD on status "
            "claims and Refusal (Terminal) where application would otherwise exceed jurisdiction.\n\n"
            "For enterprise readers: The trilogy is written to remain stable under institutional pressure. "
            "It prevents ethical language from becoming a mechanism mandate, an enforcement weapon, a "
            "reputational assurance device, or an inference license. Its value is lawful citability: clear "
            "meaning, bounded scope, and terminal refusal where scope is exceeded. Executives who must govern "
            "without letting ethical language inflate into mandate, enforcement posture, liability theater, or "
            "reputational weapons will find in this closure layer the stable language that resists capture "
            "while retaining terms narrow enough to be defensible. Architects who must build systems whose "
            "semantics do not silently drift across models, stacks, and deployment patterns will find the "
            "semantic constraint surface required to remain architecture-invariant: this doctrine remains "
            "stable across models, stacks, and deployment patterns precisely because it refuses to become "
            "a mechanism or an outcome claim."
        )
    }
]


def main():
    # Read bundle
    with open(BUNDLE_PATH, "r", encoding="utf-8") as f:
        bundle = json.load(f)

    artifacts = bundle.get("artifacts", [])
    target_index = None

    for i, artifact in enumerate(artifacts):
        if artifact.get("id") == TARGET_ID:
            target_index = i
            break

    if target_index is not None:
        # Replace sections and set curated
        artifacts[target_index]["sections"] = SECTIONS
        artifacts[target_index]["curated"] = True
    else:
        # Append new artifact
        artifacts.append({
            "id": TARGET_ID,
            "title": "Conservation of Intent — Volume III (Limits + Closure)",
            "curated": True,
            "sections": SECTIONS
        })

    bundle["artifacts"] = artifacts

    # Write back UTF-8 (no BOM)
    with open(BUNDLE_PATH, "w", encoding="utf-8") as f:
        json.dump(bundle, f, ensure_ascii=False, indent=2)

    print(f"Patched {TARGET_ID} — {len(SECTIONS)} sections, curated=True")


if __name__ == "__main__":
    main()
