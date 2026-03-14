// app/api/community/by-citation/route.ts
// GET /api/community/by-citation?ref= — returns CommunitySubmission[] citing that ref.
// INV-17: sort is vote_count DESC — classificationCount never affects sort.
import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: NextRequest) {
  const ref = new URL(req.url).searchParams.get("ref")
  if (!ref) {
    return NextResponse.json([], {
      headers: { "Cache-Control": "max-age=300" },
    })
  }

  const { data: citations } = await supabase
    .from("submission_citations")
    .select("zenodo_id")
    .eq("section_ref", ref)

  if (!citations || citations.length === 0) {
    return NextResponse.json([], {
      headers: { "Cache-Control": "max-age=300" },
    })
  }

  const zenodoIds = citations.map((c: any) => c.zenodo_id)

  const { data } = await supabase
    .from("community_corpus_cache")
    .select("zenodo_id, doi, title, authors, abstract, affiliated_date, vote_count, community_rank")
    .in("zenodo_id", zenodoIds)
    .order("vote_count", { ascending: false })

  const submissions = (data ?? []).map((r: any) => ({
    zenodoId: r.zenodo_id,
    doi: r.doi,
    title: r.title,
    authors: Array.isArray(r.authors) ? r.authors : [],
    abstract: r.abstract ?? "",
    affiliatedDate: r.affiliated_date ?? "",
    voteCount: r.vote_count ?? 0,
    communityRank: r.community_rank ?? 0,
  }))

  return NextResponse.json(submissions, {
    headers: { "Cache-Control": "max-age=300" },
  })
}
