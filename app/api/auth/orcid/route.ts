// app/api/auth/orcid/route.ts
// ORCID OAuth callback.
// ANTI-PATTERN GUARD: raw ORCID iD hashed immediately, never stored.
import { NextRequest, NextResponse } from "next/server"
import { exchangeCodeForOrcid, hashOrcidId } from "@/lib/voting/orcidAuth"
import { checkZenodoEligibility } from "@/lib/voting/eligibility"
import { encryptSession, SESSION_COOKIE, SESSION_MAX_AGE } from "@/lib/session"
import { createClient } from "@supabase/supabase-js"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const code = searchParams.get("code")
  const error = searchParams.get("error")

  if (error || !code) {
    return NextResponse.redirect(new URL("/contribute?auth=failed", req.url))
  }

  const rawOrcidId = await exchangeCodeForOrcid(code)
  if (!rawOrcidId) {
    return NextResponse.redirect(new URL("/contribute?auth=failed", req.url))
  }

  // Check eligibility while raw iD available
  const eligible = await checkZenodoEligibility(rawOrcidId)

  // Hash immediately — raw iD discarded after this line
  const orcidHash = hashOrcidId(rawOrcidId)

  // Upsert member record ? first_seen preserved on conflict, last_active always updated
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  await supabase.rpc("upsert_member", { p_orcid_hash: orcidHash })
  const token = encryptSession({ orcidHash, eligible })

  const res = NextResponse.redirect(new URL("/contribute", req.url))
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  })
  return res
}
