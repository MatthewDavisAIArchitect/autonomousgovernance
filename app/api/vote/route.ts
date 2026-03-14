// app/api/vote/route.ts
// ANTI-PATTERN GUARD: no DELETE route.
// ANTI-PATTERN GUARD: eligibility read from session cookie only.
import { NextRequest, NextResponse } from "next/server"
import { decryptSession, SESSION_COOKIE } from "@/lib/session"
import { submitVote } from "@/lib/voting/voteHandler"

export async function POST(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE)?.value
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const session = decryptSession(token)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  if (!session.eligible) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  const body = await req.json().catch(() => null)
  const zenodoId = body?.zenodoId as string | undefined
  if (!zenodoId) return NextResponse.json({ error: "zenodoId required" }, { status: 400 })

  const result = await submitVote(session.orcidHash, zenodoId)

  if (result.status === 409) return NextResponse.json({ error: "Already voted" }, { status: 409 })
  if (result.status !== 200) return NextResponse.json({ error: "Server error" }, { status: 500 })

  return NextResponse.json({ success: true, newVoteCount: result.newVoteCount })
}
