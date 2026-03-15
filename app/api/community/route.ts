// app/api/community/route.ts
// GET /api/community — returns CommunitySubmission[] sorted by vote_count DESC.
import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  const { data, error } = await supabase
    .from("community_corpus_cache")
    .select("zenodo_id, doi, title, authors, abstract, affiliated_date, vote_count, community_rank, transformation_class, mcr_attached")
    .order("vote_count", { ascending: false })

  if (error) {
    return NextResponse.json([], { status: 200 })
  }

  const submissions = (data ?? []).map((r: any) => ({
    zenodoId: r.zenodo_id,
    doi: r.doi,
    title: r.title,
    authors: Array.isArray(r.authors) ? r.authors : [],
    abstract: r.abstract ?? "",
    affiliatedDate: r.affiliated_date ?? "",
    voteCount: r.vote_count ?? 0,
    communityRank: r.community_rank ?? 0,
    transformationClass: r.transformation_class ?? 'Undefined_Transformation',
    mcrAttached: r.mcr_attached ?? false,
  }))

  return NextResponse.json(submissions)
}
