// app/api/auth/session/route.ts
// Returns session metadata — eligible boolean only, never orcidHash.
import { NextRequest, NextResponse } from "next/server"
import { decryptSession, SESSION_COOKIE } from "@/lib/session"

export async function GET(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE)?.value
  if (!token) return NextResponse.json({ authenticated: false, eligible: false })
  const session = decryptSession(token)
  if (!session) return NextResponse.json({ authenticated: false, eligible: false })
  return NextResponse.json({ authenticated: true, eligible: session.eligible })
}
