// lib/voting/voteHandler.ts
// ANTI-PATTERN GUARD: no DELETE route for votes.
// ANTI-PATTERN GUARD: vote_count updated by DB trigger only.
import { createClient } from "@supabase/supabase-js"

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export interface VoteResult {
  status: 200 | 401 | 403 | 409 | 500
  newVoteCount?: number
}

export async function submitVote(orcidHash: string, zenodoId: string): Promise<VoteResult> {
  const supabase = getServiceClient()
  const { error } = await supabase
    .from("submission_votes")
    .insert({ orcid_hash: orcidHash, zenodo_id: zenodoId })

  if (error) {
    if (error.code === "23505") return { status: 409 }
    return { status: 500 }
  }

  const { data } = await supabase
    .from("community_corpus_cache")
    .select("vote_count")
    .eq("zenodo_id", zenodoId)
    .single()

  return { status: 200, newVoteCount: data?.vote_count ?? 0 }
}
