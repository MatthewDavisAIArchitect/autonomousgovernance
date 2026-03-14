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
- artifactRef: the artifact ID
- intentBasisRef: array of section references cited
- statedTransformation: the transformation as stated
- label: exactly one of "Conserving", "Non-Conserving", or "Refusal (Terminal)"
- finiteJustification: one paragraph justification citing specific sections
- refusalTrigger: null unless label is "Refusal (Terminal)", then a brief description

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
