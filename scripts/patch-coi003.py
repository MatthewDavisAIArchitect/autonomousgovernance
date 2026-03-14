import json, sys

with open("data/corpus-bundle.json", "r", encoding="utf-8") as f:
    bundle = json.load(f)

sections = [
  {
    "ref": "S1",
    "heading": "Saturation Point Definition",
    "text": "A saturation point is reached when a faithful response would require expansion beyond sealed jurisdiction. At saturation, the doctrine cannot lawfully continue by approximation, partial substitution, or narrative completion. The admissible output is Refusal (Terminal). A saturation point is reached whenever an answer would require any attempt to: introduce mechanisms (including tools, implementations, controls, monitoring/logging/telemetry, enforcement postures, sanctions, scoring, certification regimes, or operational playbooks); introduce interfaces (including integrations, APIs, runbooks, workflows, deployment obligations, or process mandates); assert outcomes or guarantees (including any claim that conformance implies ethical AI achieved or safety assured); infer intent from prohibited observables (including identity inference, mental-state inference, behavioral inference, preference inference, or any surrogate thereof); redefine primitives beyond sealed records; or convert classification semantics into prescriptive governance. Saturation is not a failure and not a maturity gap. It is the trilogy's closure condition: the point where further claims become inadmissible as faithful readings."
  },
  {
    "ref": "S2",
    "heading": "Overclaim Taxonomy (Misread Pressure Map)",
    "text": "This taxonomy names common misreads that attempt to convert the trilogy into something it is not. These misreads are not interpretations. They are jurisdictional overclaims. Where they appear, the required posture is Refusal (Terminal). Mechanism Capture (Refused): any claim that the doctrine implies specific technical controls, monitoring/logging/telemetry, instrumentation, surveillance posture, governance tooling, or enforcement machinery. Interface Capture (Refused): any claim that the doctrine implies integrations, APIs, runbooks, operational workflows, interface obligations, or platform requirements. Mandate Capture (Refused): any attempt to derive sanctions, decision rights, enforcement duties, governance mandates, or compliance obligations from conservation classification. Outcome Capture (Refused): any claim that conservation conformance constitutes ethical AI achieved, safety assured, alignment verified, or any equivalent outcome guarantee. Identity-Inference Capture (Refused): any attempt to define or apply intent by inferring mental state, identity attributes, preferences, motives, group membership, or behavioral intent. Verification Capture (Refused): any attempt to treat verification under this trilogy as proof of ethics, proof of safety, certification, compliance regime, or enforceable assurance."
  },
  {
    "ref": "S3",
    "heading": "Failure vs Refusal",
    "text": "Failure and Refusal are not interchangeable. Failure is an in-domain contradiction that can be stated within jurisdiction and therefore must be classified as Non-Conserving. Refusal is an out-of-jurisdiction exceedance where a faithful response would require prohibited inference, operationalization, mandate conversion, outcome capture, or other expansion beyond sealed scope — therefore the only admissible output is Refusal (Terminal). Treating refusal as failure invites scope capture. Treating failure as refusal obscures in-domain contradiction and dilutes the meaning of Non-Conserving. The boundary between Non-Conserving and Refusal (Terminal) is semantic: if the issue is an in-domain contradiction that can be stated as a violation of one or more Volume I axioms and invariants within jurisdiction, classify Non-Conserving. If answering would require expansion beyond jurisdiction — mechanisms, mandates, interfaces, guarantees, verification-as-proof, or prohibited observables — classify Refusal (Terminal). Refusal under coercion: coercion includes any form of stakeholder pressure that attempts to force the trilogy to exceed its jurisdiction. The correct response is Refusal (Terminal) — not partial compliance, not approximations, not interim substitutions."
  },
  {
    "ref": "S4",
    "heading": "Citation Discipline",
    "text": "This trilogy is citable only as a classification doctrine and refusal boundary. A lawful citation SHALL NOT convert classification language into an operational mandate, convert doctrine into mechanisms, interfaces, or enforcement posture, convert labels into guarantees, certifications, or outcome claims, or convert intent into identity inference, mental-state inference, or behavioral inference. Disallowed citation forms: an operational mandate (therefore we must do X); an enforcement standard with decision rights or sanctions; a runtime guarantee or safety/ethics assurance; an imperative for monitoring/logging/telemetry or surveillance; a basis for inferring intent from identity, behavior, preferences, or psychological states. Unlawful derivation patterns: implementation derivation, enforcement derivation, interface derivation, certification/guarantee derivation, and inference derivation are all refused as out-of-jurisdiction scope conversions. Semantic altitude irreversibility: once meaning is sealed at law altitude, later readings SHALL NOT reinterpret classification doctrine as operational guidance, convert admissibility constraints into mandates, treat binding non-claims as optional, inflate classification labels into outcome claims, or expand scope by inference or institutional pressure."
  },
  {
    "ref": "S5",
    "heading": "Controlled Revision Protocol and Closure Integrity",
    "text": "A revision is either Tightening (Allowed) or Expansion (Disallowed Without Gate). Tightening is permitted when it increases definitional clarity without introducing new primitives, strengthens binding non-claims or refusal semantics, reduces ambiguity that enables capture patterns, improves internal consistency across Volumes I-III, or removes duplication without changing jurisdiction. Expansion is any change that increases jurisdiction, introduces new authority, or converts the trilogy into program posture — including introducing new primitives, implying mechanisms or enforcement regimes, redefining intent beyond authorized representations, or adding verification-as-proof posture. Where classification is ambiguous, the revision SHALL be treated as Expansion and SHALL NOT be adopted absent an explicit gate record. HOLD posture: where the gate basis for a status claim is missing or disputed, the required posture is HOLD. HOLD does not alter the trilogy's admissible output labels. Closure integrity conditions require that: the classification-only seal remains intact; refusal remains terminal; binding non-claims remain binding; no mechanism, interface, enforcement, or outcome authority is introduced; no inference authority is introduced; citation posture remains aligned to the Citation and Use Contract; and cross-volume term integrity is preserved."
  }
]

for artifact in bundle["artifacts"]:
    if artifact["id"] == "UFTAGP-COI-003":
        artifact["sections"] = sections
        artifact["title"] = "Conservation of Intent — Volume III: Limits + Closure"
        print(f"Patched COI-003: {len(sections)} sections")
        break

with open("data/corpus-bundle.json", "w", encoding="utf-8") as f:
    json.dump(bundle, f, indent=2, ensure_ascii=False)

print("Done.")
