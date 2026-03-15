// app/api/cron/zenodo-ingest/route.ts
// Unified daily Vercel Cron (03:00 UTC).
// ANTI-PATTERN GUARD: MCR content NEVER downloaded or parsed — filename detection only.
// ANTI-PATTERN GUARD: transformation_class stored as-is — never validated against SEALED_LABELS.
// ANTI-PATTERN GUARD: app/api/cron/sync-citations/ is deleted — this route replaces it.
import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export const dynamic = "force-dynamic"

const ZENODO_COMMUNITY = process.env.ZENODO_COMMUNITY_ID ?? "governance-physics"
const BATCH_SIZE = 20
const BATCH_DELAY_MS = 500

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}

async function fetchZenodoCommunityIds(): Promise<string[]> {
  const url = `https://zenodo.org/api/records?communities=${ZENODO_COMMUNITY}&size=200&sort=mostrecent`
  const res = await fetch(url, { headers: { Accept: "application/json" } })
  if (!res.ok) return []
  const data = await res.json()
  return (data.hits?.hits ?? []).map((r: any) => String(r.id))
}

async function fetchZenodoRecord(id: string): Promise<any | null> {
  const res = await fetch(`https://zenodo.org/api/records/${id}`, {
    headers: { Accept: "application/json" },
  })
  if (!res.ok) return null
  return res.json()
}

function parseTransformationClass(keywords: string[]): string {
  const tag = keywords.find((k) => k.startsWith("UFTAGP-Class:"))
  if (!tag) return "Undefined_Transformation"
  return tag.replace("UFTAGP-Class:", "").trim() || "Undefined_Transformation"
}

function detectMcr(files: Array<{ key: string }>): boolean {
  return files.some((f) => /mcr|classification_record/i.test(f.key))
}

// Section ref patterns for citation detection
const CITATION_PATTERNS: Array<{ pattern: RegExp; type: string }> = [
  { pattern: /A[1-7]/g, type: "axiom" },
  { pattern: /I[1-7]/g, type: "invariant" },
  { pattern: /S\d+(?:\.\d+)*/g, type: "section" },
  { pattern: /UFTAGP-[A-Z]{2,4}-\d{3}/g, type: "artifact" },
]

function extractCitations(text: string): Array<{ ref: string; type: string }> {
  const found: Array<{ ref: string; type: string }> = []
  const seen = new Set<string>()
  for (const { pattern, type } of CITATION_PATTERNS) {
    const matches = text.matchAll(new RegExp(pattern.source, "g"))
    for (const m of matches) {
      const ref = m[0]
      if (!seen.has(ref)) {
        seen.add(ref)
        found.push({ ref, type })
      }
    }
  }
  return found
}

export async function GET(req: NextRequest) {
  // Auth check
  const auth = req.headers.get("authorization")
  if (auth !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const startTime = Date.now()
  const supabase = getServiceClient()
  let newRecords = 0
  let updatedCitations = 0

  // ── Pass 1: New record discovery ─────────────────────────────────────────
  const zenodoIds = await fetchZenodoCommunityIds()

  const { data: existing } = await supabase
    .from("community_corpus_cache")
    .select("zenodo_id")

  const existingSet = new Set((existing ?? []).map((r: any) => r.zenodo_id))
  const newIds = zenodoIds.filter((id) => !existingSet.has(id))

  for (let i = 0; i < newIds.length; i += BATCH_SIZE) {
    const batch = newIds.slice(i, i + BATCH_SIZE)
    for (const id of batch) {
      const record = await fetchZenodoRecord(id)
      if (!record) continue

      const keywords: string[] = record.metadata?.keywords ?? []
      const files: Array<{ key: string }> = record.files ?? []
      const authors = (record.metadata?.creators ?? []).map((c: any) => c.name ?? "")

      await supabase.from("community_corpus_cache").upsert({
        zenodo_id: id,
        doi: record.doi ?? "",
        title: record.metadata?.title ?? "",
        authors,
        abstract: record.metadata?.description ?? "",
        published_at: record.metadata?.publication_date ?? null,
        transformation_class: parseTransformationClass(keywords),
        mcr_attached: detectMcr(files),
        last_synced: new Date().toISOString(),
      })
      newRecords++
    }
    if (i + BATCH_SIZE < newIds.length) await sleep(BATCH_DELAY_MS)
  }

  // ── Pass 2: Citation detection (all records) ──────────────────────────────
  const { data: allRecords } = await supabase
    .from("community_corpus_cache")
    .select("zenodo_id, abstract")

  for (let i = 0; i < (allRecords ?? []).length; i += BATCH_SIZE) {
    const batch = (allRecords ?? []).slice(i, i + BATCH_SIZE)
    for (const record of batch) {
      const text = record.abstract ?? ""
      const citations = extractCitations(text)
      for (const { ref, type } of citations) {
        const { error } = await supabase
          .from("submission_citations")
          .upsert(
            { zenodo_id: record.zenodo_id, section_ref: ref, citation_type: type },
            { onConflict: "zenodo_id,section_ref" }
          )
        if (!error) updatedCitations++
      }
    }
    if (i + BATCH_SIZE < (allRecords ?? []).length) await sleep(BATCH_DELAY_MS)
  }

  const durationMs = Date.now() - startTime

  // CRITICAL_TIMEOUT_WARNING — v4 requirement
  if (durationMs > 50_000) {
    console.warn(
      `CRITICAL_TIMEOUT_WARNING: cron duration ${durationMs}ms exceeds 50s threshold - S3-09 cursor-based pagination must be deployed`
    )
  }

  console.log({ status: "ok", newRecords, updatedCitations, durationMs })
  return NextResponse.json({ status: "ok", newRecords, updatedCitations })
}
