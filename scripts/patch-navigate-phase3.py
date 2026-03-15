"""
patch-navigate-phase3.py
Phase 3 — rewrite buildCorpusText in app/api/navigate/route.ts
- Replaces PATH_CONTEXT_PREFIXES import with PATH_SECTIONS
- Hard-filters corpus sections to PATH_SECTIONS[path] only
- Adds system prompt instruction: name correct path and decline if question
  requires sections outside the reading path
Governing Spec: UFTAGP-SPEC-001 v1.6
Pattern: writes complete file — no regex replacement on TypeScript.
"""

import os

TARGET = os.path.join("app", "api", "navigate", "route.ts")

CONTENT = """\
// app/api/navigate/route.ts
// AMENDED for Batch 4k: citation index injected in system prompt.
// AMENDED: Anthropic prompt caching on system prompt to reduce latency.
// AMENDED Phase 3: PATH_SECTIONS hard-filter — corpus truncated to reading path only.
export const dynamic = "force-dynamic"

import { NextRequest } from "next/server"
import Anthropic from "@anthropic-ai/sdk"
import bundleData from "@/data/corpus-bundle.json"
import { PATH_SECTIONS } from "@/lib/constants"
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
  const allowedSections = PATH_SECTIONS[path] ?? []
  const researcherPath = path === "researcher"

  return (bundleData.artifacts as any[])
    .map((artifact: any) => {
      const artifactKey = (artifact.id as string).replace("UFTAGP-", "")
      const sections = artifact.sections as any[]

      const filtered = researcherPath
        ? sections
        : sections.filter((s: any) =>
            allowedSections.includes(`${artifactKey}:${s.ref}`)
          )

      if (filtered.length === 0) return null

      const sectionText = filtered
        .map((s: any) => "[" + s.ref + "] " + s.heading + "\\n" + (s.text ?? ""))
        .join("\\n\\n")
      return "=== " + artifact.id + ": " + artifact.title + " ===\\n" + sectionText
    })
    .filter(Boolean)
    .join("\\n\\n")
}

export async function POST(request: NextRequest) {
  try {
    const { message, path, history } = await request.json()

    const corpusText = buildCorpusText(path as ReadingPath)
    const citationIndex = await fetchCitationIndex()
    const citationIndexJson = JSON.stringify(citationIndex)

    const systemText = [
      "You are the corpus navigation instrument for the Unified Field Theory of Autonomous Governance Project (UFTAGP).",
      "Site jurisdiction: UFTAGP Posture B. This site derives authority from its instrument design, not from external institutional endorsement.",
      "You have access to the UFTAGP corpus sections assigned to the current reading path below. Answer questions by citing artifact ID and section reference.",
      "Reading path: " + path + ". If a question requires corpus sections outside this reading path, name the correct path (executive / architect / researcher / misread / axiom) and decline to approximate rather than answering from outside the path.",
      "If a question exceeds what the corpus authorizes, state that the corpus does not address this - do not improvise.",
      "Do not make claims beyond what the corpus explicitly states.",
      "",
      "COMMUNITY CITATION INDEX (section_ref -> [zenodo_ids]):",
      citationIndexJson,
      "",
      "CORPUS:",
      corpusText,
    ].join("\\n")

    const messages = [...history, { role: "user" as const, content: message }]

    const stream = await client.messages.stream({
      model: "claude-sonnet-4-5",
      max_tokens: 1000,
      system: [
        {
          type: "text",
          text: systemText,
          cache_control: { type: "ephemeral" },
        },
      ] as any,
      messages,
    })

    const encoder = new TextEncoder()
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            if (chunk.type === "content_block_delta" && chunk.delta.type === "text_delta") {
              controller.enqueue(encoder.encode("data: " + JSON.stringify({ type: "token", text: chunk.delta.text }) + "\\n\\n"))
            }
          }
          controller.enqueue(encoder.encode("data: " + JSON.stringify({ type: "done" }) + "\\n\\n"))
        } catch (e) {
          controller.enqueue(encoder.encode("data: " + JSON.stringify({ type: "error", text: String(e) }) + "\\n\\n"))
        } finally {
          controller.close()
        }
      },
    })

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    })
  } catch (e) {
    console.error("[navigate] error:", e)
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
"""


def main():
    with open(TARGET, "w", encoding="utf-8") as f:
        f.write(CONTENT)
    print(f"Patched {TARGET} — PATH_SECTIONS hard-filter + path instruction ({len(CONTENT.splitlines())} lines)")


if __name__ == "__main__":
    main()
