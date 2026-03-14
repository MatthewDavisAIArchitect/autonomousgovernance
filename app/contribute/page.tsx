"use client"
// app/contribute/page.tsx
// ANTI-PATTERN GUARD: No submission form, no checklist, no file upload.
// ANTI-PATTERN GUARD: Badge is "MCR on File" — "Verified Logic" must not appear — INV-11.
// ANTI-PATTERN GUARD: transformation_class as plain text, not ClassificationLabel — INV-16.
// ANTI-PATTERN GUARD: Vote counts visible including 0 — INV-13.
import { useState, useEffect } from "react"
import type { CommunitySubmission } from "@/lib/types"

function VoteButton({ submission, eligible }: { submission: CommunitySubmission; eligible: boolean }) {
  const [count, setCount] = useState(submission.voteCount)
  const [voting, setVoting] = useState(false)

  async function vote() {
    if (!eligible || voting) return
    setVoting(true)
    try {
      const res = await fetch("/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ zenodoId: submission.zenodoId }),
      })
      if (res.ok) {
        const d = await res.json()
        setCount(d.newVoteCount)
      }
    } finally {
      setVoting(false)
    }
  }

  return (
    <div className="flex items-center gap-2 shrink-0">
      <span className="font-mono text-xs text-mid-grey">{count}</span>
      {eligible && (
        <button onClick={vote} disabled={voting} className="font-sans text-xs text-accent hover:underline disabled:opacity-40">
          {voting ? "..." : "vote"}
        </button>
      )}
    </div>
  )
}

export default function ContributePage() {
  const [submissions, setSubmissions] = useState<CommunitySubmission[]>([])
  const [eligible, setEligible] = useState(false)
  const [authLoading, setAuthLoading] = useState(true)

  useEffect(() => {
    fetch("/api/auth/session")
      .then((r) => r.json())
      .then((d) => { setEligible(d.eligible ?? false) })
      .catch(() => {})
      .finally(() => setAuthLoading(false))

    fetch("/api/community")
      .then((r) => r.json())
      .then((d) => { setSubmissions(Array.isArray(d) ? d : []) })
      .catch(() => {})
  }, [])

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="font-serif text-2xl text-near-black mb-8 pb-4 border-b border-rule-grey">Contribute</h1>

      <section className="mb-10">
        <h2 className="font-sans text-xs font-medium text-mid-grey tracking-widest uppercase mb-4">Silent Infrastructure</h2>
        <div className="font-serif text-sm text-near-black leading-relaxed space-y-3">
          <p>
            Publish your research to{" "}
            <a href="https://zenodo.org" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">Zenodo</a>
            {" "}and select the{" "}
            <a href="https://zenodo.org/communities/governance-physics" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">governance-physics</a>
            {" "}community during submission.
          </p>
          <p>
            Add the keyword <span className="font-mono text-xs bg-id-bg px-1 py-0.5">UFTAGP-Class:</span> to describe your
            work&#39;s classification relationship to the Conservation of Intent doctrine.
            Optionally attach a Minimal Classification Record as a supplementary file.
          </p>
          <p>Your submission will appear in the registry below within 24 hours after the daily ingest.</p>
        </div>
      </section>

      {!authLoading && (
        <section className="mb-10 border-t border-rule-grey pt-6">
          {eligible ? (
            <div className="flex items-center gap-4">
              <span className="font-sans text-xs text-mid-grey">Authenticated — eligible to vote</span>
              <a href="/api/auth/logout" className="font-sans text-xs text-mid-grey hover:text-accent">Sign out</a>
            </div>
          ) : (
            <a href="/api/auth/orcid/login" className="font-sans text-sm text-accent hover:underline">
              Authenticate with ORCID to vote →
            </a>
          )}
        </section>
      )}

      <section className="border-t border-rule-grey pt-6">
        <h2 className="font-sans text-xs font-medium text-mid-grey tracking-widest uppercase mb-4">Community Registry</h2>
        {submissions.length === 0 ? (
          <p className="font-serif text-sm text-mid-grey">No submissions yet.</p>
        ) : (
          <div className="border-t border-rule-grey">
            {submissions.map((s) => (
              <div key={s.zenodoId} className="border-b border-rule-grey py-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-serif text-sm text-near-black mb-1">{s.title}</p>
                    <p className="font-sans text-xs text-mid-grey mb-2">{s.authors.join(", ")}</p>
                    <div className="flex flex-wrap gap-2 items-center">
                      {s.communityRank && (
                        <span className="font-sans text-xs text-mid-grey bg-id-bg px-2 py-0.5">
                          Researcher-tagged type: {s.communityRank}
                        </span>
                      )}
                      {s.doi && (
                        <>
                          <span className="font-sans text-xs text-mid-grey border border-rule-grey px-2 py-0.5">MCR on File</span>
                          <a href={"https://doi.org/" + s.doi} target="_blank" rel="noopener noreferrer" className="font-mono text-xs text-accent hover:underline">
                            {s.doi}
                          </a>
                        </>
                      )}
                    </div>
                  </div>
                  <VoteButton submission={s} eligible={eligible} />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
