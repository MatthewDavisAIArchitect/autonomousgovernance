"use client"
// components/navigator/CitationSidebar.tsx
// ANTI-PATTERN GUARD: SSE stream must never be paused or buffered for sidebar.
// ANTI-PATTERN GUARD: Sidebar renders nothing when by-citation returns empty.
// Sidebar fetch is parallel to SSE stream — never stalls chat response.
import { useState, useEffect } from "react"
import type { CommunitySubmission } from "@/lib/types"

interface CitationSidebarProps {
  sectionRef: string | null
  onDismiss: () => void
}

export default function CitationSidebar({ sectionRef, onDismiss }: CitationSidebarProps) {
  const [submissions, setSubmissions] = useState<CommunitySubmission[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!sectionRef) {
      setSubmissions([])
      return
    }
    setLoading(true)
    fetch(`/api/community/by-citation?ref=${encodeURIComponent(sectionRef)}`)
      .then((r) => r.json())
      .then((d: CommunitySubmission[]) => {
        setSubmissions(Array.isArray(d) ? d : [])
      })
      .catch(() => setSubmissions([]))
      .finally(() => setLoading(false))
  }, [sectionRef])

  // Render nothing when by-citation returns empty — INV per continuity doc
  if (!sectionRef || (!loading && submissions.length === 0)) return null

  return (
    <div className="border-l border-rule-grey pl-4 w-64 shrink-0">
      <div className="flex items-baseline justify-between mb-3">
        <p className="font-sans text-xs font-medium text-mid-grey tracking-widest uppercase">
          Community — {sectionRef}
        </p>
        <button
          onClick={onDismiss}
          className="font-sans text-xs text-mid-grey hover:text-accent"
          aria-label="Dismiss sidebar"
        >
          ×
        </button>
      </div>

      {loading && (
        <p className="font-sans text-xs text-mid-grey">Loading...</p>
      )}

      {!loading && submissions.map((s) => (
        <div key={s.zenodoId} className="mb-3 pb-3 border-b border-rule-grey last:border-b-0">
          <p className="font-serif text-xs text-near-black leading-snug mb-1">{s.title}</p>
          <p className="font-sans text-xs text-mid-grey mb-1">
            {s.authors.join(", ")}
          </p>
          <div className="flex items-center justify-between">
            {s.doi && (
              <a
                href={"https://doi.org/" + s.doi}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs text-accent hover:underline"
              >
                {s.doi}
              </a>
            )}
            <span className="font-mono text-xs text-mid-grey">{s.voteCount}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
