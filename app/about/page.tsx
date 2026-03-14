// app/about/page.tsx
// ANTI-PATTERN GUARD: No outcome claims — INV-01, INV-12.
// ANTI-PATTERN GUARD: Contact is plain email link only.
// TODO: Replace positioning statement with verbatim v1.4 text from UFTAGP-SPEC-001.
import type { Metadata } from "next"

export const metadata: Metadata = { title: "About — UFTAGP" }

async function getCommunityCount(): Promise<number> {
  try {
    const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
    const res = await fetch(base + "/api/stats", { cache: "no-store" })
    if (!res.ok) return 0
    const d = await res.json()
    return d.members ?? 0
  } catch {
    return 0
  }
}

export default async function AboutPage() {
  const communityCount = await getCommunityCount()

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="font-serif text-2xl text-near-black mb-8 pb-4 border-b border-rule-grey">About</h1>

      <section className="mb-10">
        <div className="font-serif text-base text-near-black leading-[1.8] space-y-4">
          <p>
            The Unified Field Theory of Autonomous Governance Project produces doctrine
            that stabilizes the meaning of ethical interpretation under institutional pressure.
            Its work is classification-only, non-prescriptive, and architecture-invariant.
          </p>
          <p>
            The project&#39;s flagship output — the Conservation of Intent trilogy — defines
            what counts as conserving or violating an authorized intent-domain, without
            prescribing implementation, enforcement, or outcome claims.
          </p>
          <p>
            This doctrine is designed to remain citable without becoming coercive,
            and usable without being captured.
          </p>
        </div>
      </section>

      <section className="border-t border-rule-grey pt-6 mb-10">
        <p className="font-sans text-sm text-mid-grey">
          Community members:{" "}
          <span className="font-serif font-bold text-near-black">{communityCount}</span>
        </p>
      </section>

      <section className="border-t border-rule-grey pt-6 mb-10">
        <a href="/classify" className="font-sans text-sm text-accent hover:underline">
          Try the Classification Engine →
        </a>
      </section>

      <section className="border-t border-rule-grey pt-6">
        <p className="font-sans text-sm text-mid-grey mb-1">Contact</p>
        <a href="mailto:matthew@autonomousgovernance.org" className="font-serif text-sm text-accent hover:underline">
          matthew@autonomousgovernance.org
        </a>
      </section>
    </div>
  )
}
