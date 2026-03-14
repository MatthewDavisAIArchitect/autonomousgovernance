// app/api/community/[id]/links/route.ts
// GET — returns { zenodoId, classificationCount }.
// classificationCount is COUNT(*) only — never individual records.
import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: zenodoId } = await params

  const { count } = await supabase
    .from("classification_records")
    .select("*", { count: "exact", head: true })
    .eq("zenodo_doi", zenodoId)

  return NextResponse.json(
    { zenodoId, classificationCount: count ?? 0 },
    { headers: { "Cache-Control": "max-age=300" } }
  )
}
