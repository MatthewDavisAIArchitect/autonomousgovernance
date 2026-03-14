// app/api/auth/orcid/login/route.ts
import { NextRequest, NextResponse } from "next/server"
import { getOrcidAuthUrl } from "@/lib/voting/orcidAuth"
import crypto from "crypto"

export async function GET(req: NextRequest) {
  const state = crypto.randomBytes(16).toString("hex")
  const url = getOrcidAuthUrl(state)
  return NextResponse.redirect(url)
}
