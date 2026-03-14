// app/api/navigate/route.ts
// AMENDED for Batch 4k: citation index injected in system prompt.
import { NextRequest } from "next/server"
import Anthropic from "@anthropic-ai/sdk"
import bundleData from "@/data/corpus-bundle.json"
import { PATH_CONTEXT_PREFIXES } from "@/lib/constants"
import { ReadingPath } from "@/lib/types"
import { createClient } from "@supabase/supabase-js"

const client = new Anthropic()

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

async function fetchCitationIndex(): Promise<Record<string, string[]>> {
  try {
    const supabase = getServiceClient()
    const { data } = await supabase.from("submission_citations").select("section_ref, zenodo_id")
    const index: Record<string, string[]> = {}
    for (const row of (data ?? [])) {
      if (!index[row.section_ref]) index[row.section_ref] = []
      index[row.section_ref].push(row.zenodo_id)
    }
    return index
  } catch {
    return {}
  }
}

function buildCorpusText(path: ReadingPath): string {
  const prioritySections = PATH_CONTEXT_PREFIXES[path] || []
  return (bundleData.artifacts as any[]).map((artifact: any) => {
    const sections = (artifact.sections as any[])
    const priority = sections.filter((s: any) =>
      prioritySections.some((p: string) => s.heading.includes(p) || s.ref.includes(p))
    )
    const rest = sections.filter((s: any) => !priority.includes(s))
    const ordered = [...priority, ...rest]
    const sectionText = ordered.map((s: any) => "[" + s.ref + "] " + s.heading + "\n" + (s.text ?? "")).join("\n\n")
    return "=== " + artifact.id + ": " + artifact.title + " ===\n" + sectionText
  }).join("\n\n")
}

export async function POST(request: NextRequest) {
  const { message, path, history } = await request.json()

  const corpusText = buildCorpusText(path as ReadingPath)
  const citationIndex = await fetchCitationIndex()
  const citationIndexJson = JSON.stringify(citationIndex)

  const corpusTokens = Math.round(corpusText.length / 4)
  const citationTokens = Math.round(citationIndexJson.length / 4)
  console.log("[navigate] tokens: corpus=" + corpusTokens + " citations=" + citationTokens)
  if (citationTokens > 5_000) {
    console.warn("[navigate] ALERT: citation index tokens " + citationTokens + " > 5000")
  }

  const systemLines = [
    "You are the corpus navigation instrument for the Unified Field Theory of Autonomous Governance Project (UFTAGP).",
    "Site jurisdiction: UFTAGP Posture B. This site derives authority from its instrument design, not from external institutional endorsement.",
    "You have access to the full UFTAGP corpus below. Answer questions by citing artifact ID and section reference.",
    "If a question exceeds what the corpus authorizes, state that the corpus does not address this - do not improvise.",
    "Do not make claims beyond what the corpus explicitly states.",
    "",
    "COMMUNITY CITATION INDEX (section_ref -> [zenodo_ids]):",
    citationIndexJson,
    "",
    "CORPUS:",
    corpusText,
  ]
  const systemPrompt = systemLines.join("\n")

  const messages = [...history, { role: "user" as const, content: message }]

  const stream = await client.messages.stream({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1000,
    system: systemPrompt,
    messages,
  })

  const encoder = new TextEncoder()
  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        if (chunk.type === "content_block_delta" && chunk.delta.type === "text_delta") {
          controller.enqueue(encoder.encode("data: " + JSON.stringify({ type: "token", text: chunk.delta.text }) + "\n\n"))
        }
      }
      controller.enqueue(encoder.encode("data: " + JSON.stringify({ type: "done" }) + "\n\n"))
      controller.close()
    },
  })

  return new Response(readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  })
}
