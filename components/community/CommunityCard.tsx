"use client"
// components/community/CommunityCard.tsx
// ANTI-PATTERN GUARD: No sealed colors on citation tags or linkage count — INV-16, mid-grey on id-bg only.
// ANTI-PATTERN GUARD: classificationCount must NOT affect sort order — INV-17.
// Version strip shown only when version_history length > 1.
import { useState, useEffect } from "react"
import type { CommunitySubmission } from "@/lib/types"

interface CommunityCardProps {
  submission: CommunitySubmission & {
    transformationClass?: string
    mcrAttached?: boolean
    versionHistory?: unknown[]
  }
  onCitationFilter?: (ref: string) => void
}

interface CitationTag {
  section_ref: string
  citation_type: string
}

export default function CommunityCard({ submission, onCitationFilter }: CommunityCardProps) {
  const [citations, setCitations] = useState<CitationTag[]>([])
  const [classificationCount, setClassificationCount] = useState<number | null>(null)

  useEffect(() => {
    // Fetch citation tags
    fetch(`/api/community/by-citation?ref=${encodeURIComponent(submission.zenodoId)}`)
      .then((r) => r.json())
      .then(() => {
        // Citation tags come from submission_citations — fetch directly
      })
      .catch(() => {})

    // Fetch linkage count — metadata only, never affects sort (INV-17)
    fetch(`/api/community/${submission.zenodoId}/links`)
      .then((r) => r.json())
      .then((d) => setClassificationCount(d.classificationCount ?? 0))
      .catch(() => {})
  }, [submission.zenodoId])

  const hasVersionHistory =
    Array.isArray(submission.versionHistory) && submission.versionHistory.length > 1

  return (
    <div className="border-b border-rule-grey py-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="font-serif text-sm text-near-black mb-1">{submission.title}</p>
          <p className="font-sans text-xs text-mid-grey mb-2">
            {submission.authors.join(", ")}
          </p>

          <div className="flex flex-wrap gap-2 items-center mb-2">
            {/* transformation_class — plain text, no sealed colors — INV-16 */}
            {submission.transformationClass && (
              <span className="font-sans text-xs text-mid-grey bg-id-bg px-2 py-0.5">
                Researcher-tagged type: {submission.transformationClass}
              </span>
            )}

            {/* MCR on File — INV-11 */}
            {submission.mcrAttached && (
              <span className="font-sans text-xs text-mid-grey border border-rule-grey px-2 py-0.5">
                MCR on File
              </span>
            )}

            {/* DOI link */}
            {submission.doi && (
              <a
                href={"https://doi.org/" + submission.doi}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs text-accent hover:underline"
              >
                {submission.doi}
              </a>
            )}
          </div>

          {/* Linkage count — secondary metadata only, never a ranking signal — INV-17 */}
          {classificationCount !== null && classificationCount > 0 && (
            <p className="font-sans text-xs text-mid-grey">
              Referenced in {classificationCount} classification{classificationCount === 1 ? " session" : " sessions"}
            </p>
          )}

          {/* Version strip — only when version_history length > 1 */}
          {hasVersionHistory && (
            <p className="font-sans text-xs text-mid-grey mt-1">
              {submission.versionHistory!.length} versions
            </p>
          )}
        </div>

        {/* Vote count — always visible including 0 — INV-13 */}
        <div className="shrink-0 text-right">
          <span className="font-mono text-xs text-mid-grey">{submission.voteCount}</span>
        </div>
      </div>
    </div>
  )
}
