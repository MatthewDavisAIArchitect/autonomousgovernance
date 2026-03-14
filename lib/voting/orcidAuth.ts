// lib/voting/orcidAuth.ts
// ORCID OAuth helpers.
// ANTI-PATTERN GUARD: raw ORCID iD is hashed immediately and never stored.
import crypto from "crypto"

const ORCID_BASE = process.env.NODE_ENV === "production"
  ? "https://orcid.org"
  : "https://sandbox.orcid.org"

export function getOrcidAuthUrl(state: string): string {
  const params = new URLSearchParams({
    client_id: process.env.ORCID_CLIENT_ID!,
    response_type: "code",
    scope: "/authenticate",
    redirect_uri: process.env.ORCID_REDIRECT_URI!,
    state,
  })
  return ORCID_BASE + "/oauth/authorize?" + params.toString()
}

export async function exchangeCodeForOrcid(code: string): Promise<string | null> {
  const res = await fetch(ORCID_BASE + "/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded", Accept: "application/json" },
    body: new URLSearchParams({
      client_id: process.env.ORCID_CLIENT_ID!,
      client_secret: process.env.ORCID_CLIENT_SECRET!,
      grant_type: "authorization_code",
      code,
      redirect_uri: process.env.ORCID_REDIRECT_URI!,
    }),
  })
  if (!res.ok) return null
  const data = await res.json()
  return (data.orcid as string) ?? null
}

export function hashOrcidId(rawId: string): string {
  const secret = process.env.SESSION_SECRET!
  return crypto.createHmac("sha256", secret).update(rawId).digest("hex")
}
