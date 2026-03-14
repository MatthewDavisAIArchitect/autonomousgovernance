import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@supabase/supabase-js";
import bundleData from "@/data/corpus-bundle.json";
import { SEALED_LABELS, UFTAGP_ID_REGEX } from "@/lib/constants";
import { ClassificationLabel } from "@/lib/types";

const client = new Anthropic();
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  const { transformation, artifactId, zenodoDoi } = await request.json();

  if (!transformation || !artifactId) {
    return NextResponse.json({ error: "transformation and artifactId are required" }, { status: 400 });
  }

  if (!UFTAGP_ID_REGEX.test(artifactId)) {
    return NextResponse.json({ error: "Invalid artifact ID format" }, { status: 400 });
  }

  const artifact = (bundleData.artifacts as any[]).find((a: any) => a.id === artifactId);
  if (!artifact) {
    return NextResponse.json({ error: "Artifact not found" }, { status: 404 });
  }

  const artifactContext = artifact.sections
    .map((s: any) => `[${s.ref}] ${s.heading}\n${s.text}`)
    .join("\n\n");

  const systemPrompt = `You are the Classification Engine for the UFTAGP research site.
You classify transformations of intent based solely on the artifact context provided.
You must return ONLY a JSON object with these exact fields:
- artifactRef: always exactly "${artifactId}"
- intentBasisRef: array of section references cited
- statedTransformation: the transformation as stated
- label: exactly one of "Conserving", "Non-Conserving", or "Refusal (Terminal)"
- finiteJustification: one paragraph justification citing specific sections
- refusalTrigger: null unless label is "Refusal (Terminal)", then a brief description

SEALED REFUSAL RULE (binding — overrides all other classification):
The following five citation forms are PROHIBITED. When a transformation matches any of them,
you MUST return label "Refusal (Terminal)" — NOT "Non-Conserving". Classification cannot
proceed when scope would be exceeded. Refusal is terminal.

1. MANDATE CAPTURE: The transformation asserts this doctrine requires, mandates, or implies
   operational obligations — monitoring, auditing, enforcement, compliance programs, or
   implementation requirements. → Refusal (Terminal). refusalTrigger: "Mandate capture: transformation imports operational obligation not authorized by doctrine."

2. MECHANISM CAPTURE: The transformation converts doctrinal semantics into specific system
   design patterns, controls, interfaces, runtime guardrails, cryptographic schemes,
   instrumentation, telemetry, or governance machinery. → Refusal (Terminal). refusalTrigger: "Mechanism capture: transformation converts classification semantics into implementation requirement."

3. OUTCOME CAPTURE: The transformation treats a Conserving label as implying ethical
   achievement, safety, alignment, compliance sufficiency, reduced liability, or any
   guaranteed outcome. → Refusal (Terminal). refusalTrigger: "Outcome capture: transformation inflates classification label into outcome assurance."

4. SCOPE LAUNDERING: The transformation expands the doctrine's jurisdiction by inference,
   convenience, urgency, or narrative substitution — including extending doctrine to cover
   behavioral monitoring, identity inference, or domains not explicitly stated. → Refusal (Terminal). refusalTrigger: "Scope laundering: transformation expands doctrine jurisdiction beyond authorized representations."

5. REFUSAL DILUTION: The transformation reframes Refusal (Terminal) as provisional,
   negotiable, deferrable, a maturity gap, a best-effort state, or temporary noncompliance.
   → Refusal (Terminal). refusalTrigger: "Refusal dilution: transformation reframes terminal refusal as negotiable or partial."

ARTIFACT CONTEXT:
${artifactContext}`;

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1000,
    system: systemPrompt,
    messages: [{ role: "user", content: `Classify this transformation: ${transformation}` }],
  });

  const text = response.content[0].type === "text" ? response.content[0].text : "";
  let record: any;
  try {
    const clean = text.replace(/```json|```/g, "").trim();
    record = JSON.parse(clean);
  } catch {
    return NextResponse.json({ error: "Engine returned unparseable response" }, { status: 500 });
  }

  // Always use the validated input artifactId — never trust LLM-generated ID
  record.artifactRef = artifactId;

  if (!SEALED_LABELS.includes(record.label as ClassificationLabel)) {
    return NextResponse.json({ error: "Engine returned non-sealed label - classification rejected" }, { status: 422 });
  }

  const { data: logData } = await supabase
    .from("classification_records")
    .insert({
      artifact_ref: artifactId,
      transformation_text: transformation,
      label: record.label,
      justification_summary: record.finiteJustification,
      refusal_trigger: record.refusalTrigger,
    })
    .select("id")
    .single();

  if (zenodoDoi && logData?.id) {
    const { data: community } = await supabase
      .from("community_corpus_cache")
      .select("zenodo_id")
      .eq("doi", zenodoDoi)
      .single();
    if (community) {
      await supabase.from("classification_submission_links").insert({
        classification_id: logData.id,
        zenodo_id: community.zenodo_id,
      });
    }
  }

  return NextResponse.json(record);
}
