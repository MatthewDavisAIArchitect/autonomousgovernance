// lib/voting/eligibility.ts
// Check Zenodo eligibility using raw ORCID iD at auth time.
// Must be called BEFORE hashing.
const ZENODO_COMMUNITY = "governance-physics"

export async function checkZenodoEligibility(rawOrcidId: string): Promise<boolean> {
  try {
    const url = "https://zenodo.org/api/records?communities=" + ZENODO_COMMUNITY + "&size=100"
    const res = await fetch(url, { headers: { Accept: "application/json" } })
    if (!res.ok) return false
    const data = await res.json()
    const hits = (data.hits?.hits ?? []) as Array<{ metadata: { creators?: Array<{ orcid?: string }> } }>
    return hits.some((record) =>
      (record.metadata.creators ?? []).some((c) => c.orcid === rawOrcidId)
    )
  } catch {
    return false
  }
}
