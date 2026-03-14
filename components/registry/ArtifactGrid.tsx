'use client'

// components/registry/ArtifactGrid.tsx
// Renders Artifact[] as card-rows grouped by ArtifactType with ruled separators.
// ANTI-PATTERN GUARD: No rounded corners — rounded-none throughout.
// Props: artifacts?: Artifact[], isLoading?: boolean
// When props are absent, fetches from /api/registry on mount.

import { useEffect, useState } from 'react'
import type { Artifact, ArtifactType } from '@/lib/types'
import ArtifactIdPill from '@/components/ui/ArtifactIdPill'

interface ArtifactGridProps {
  artifacts?: Artifact[]
  isLoading?: boolean
}

const TYPE_ORDER: ArtifactType[] = ['COI', 'SPEC', 'AXM', 'WP', 'ONT']

const TYPE_LABELS: Record<ArtifactType, string> = {
  COI: 'Conservation of Intent',
  SPEC: 'Specification',
  AXM: 'Axiom Set',
  WP: 'Working Paper',
  ONT: 'Ontology',
}

// ── Skeleton row (hard grey bars, no spinner) ────────────────────────────────
function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 py-4 border-b border-rule-grey">
      <div className="h-5 w-36 bg-rule-grey" />
      <div className="h-4 w-64 bg-rule-grey" />
      <div className="h-4 w-16 bg-rule-grey ml-auto" />
    </div>
  )
}

// ── Single artifact row ───────────────────────────────────────────────────────
function ArtifactRow({ artifact }: { artifact: Artifact }) {
  return (
    <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 py-4 border-b border-rule-grey last:border-b-0">

      {/* Artifact ID pill */}
      <ArtifactIdPill id={artifact.id} />

      {/* Title */}
      <span className="font-serif text-base text-near-black flex-1 min-w-0">
        {artifact.title}
      </span>

      {/* Type badge */}
      <span className="font-mono text-xs text-mid-grey whitespace-nowrap">
        {artifact.type}
      </span>

      {/* Status badge */}
      <span
        className={[
          'font-sans text-xs whitespace-nowrap',
          artifact.status === 'CANONICAL'
            ? 'text-near-black'
            : 'text-mid-grey',
        ].join(' ')}
      >
        {artifact.status}
      </span>

      {/* DOI link — only when present */}
      {artifact.zenodoDoi && (
        <a
          href={`https://doi.org/${artifact.zenodoDoi}`}
          target="_blank"
          rel="noopener noreferrer"
          className="font-sans text-xs text-accent hover:underline underline-offset-2 whitespace-nowrap"
        >
          {artifact.zenodoDoi}
        </a>
      )}

    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
export default function ArtifactGrid({ artifacts: propArtifacts, isLoading: propLoading }: ArtifactGridProps) {
  const [artifacts, setArtifacts] = useState<Artifact[]>(propArtifacts ?? [])
  const [loading, setLoading] = useState(propLoading ?? !propArtifacts)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // If artifacts were passed as props, skip fetch.
    if (propArtifacts !== undefined) {
      setArtifacts(propArtifacts)
      setLoading(propLoading ?? false)
      return
    }

    let cancelled = false

    async function fetchArtifacts() {
      try {
        const res = await fetch('/api/registry')
        if (!res.ok) throw new Error(`Registry fetch failed: ${res.status}`)
        const data = await res.json()
        if (!cancelled) {
          setArtifacts(data.artifacts ?? [])
          setLoading(false)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load artifacts')
          setLoading(false)
        }
      }
    }

    fetchArtifacts()
    return () => { cancelled = true }
  }, [propArtifacts, propLoading])

  // ── Loading state: skeleton rows, no spinner ────────────────────────────
  if (loading) {
    return (
      <div>
        {[...Array(4)].map((_, i) => (
          <SkeletonRow key={i} />
        ))}
      </div>
    )
  }

  // ── Error state ──────────────────────────────────────────────────────────
  if (error) {
    return (
      <p className="font-sans text-sm text-mid-grey py-4">
        {error}
      </p>
    )
  }

  // ── Empty state ──────────────────────────────────────────────────────────
  if (artifacts.length === 0) {
    return (
      <p className="font-sans text-sm text-mid-grey py-4">
        No artifacts registered yet.
      </p>
    )
  }

  // ── Group by ArtifactType in canonical order ──────────────────────────────
  const grouped = TYPE_ORDER.reduce<Record<string, Artifact[]>>((acc, type) => {
    const group = artifacts.filter((a) => a.type === type)
    if (group.length > 0) acc[type] = group
    return acc
  }, {})

  return (
    <div>
      {Object.entries(grouped).map(([type, group], groupIndex) => (
        <div key={type}>
          {/* Ruled group separator — not before first group */}
          {groupIndex > 0 && (
            <div className="border-t-2 border-near-black mt-6 mb-0" />
          )}

          {/* Group header */}
          <div className="flex items-baseline gap-3 pt-6 pb-2 border-b border-rule-grey">
            <span className="font-mono text-xs font-medium text-near-black tracking-wider uppercase">
              {type}
            </span>
            <span className="font-sans text-xs text-mid-grey">
              {TYPE_LABELS[type as ArtifactType]}
            </span>
            <span className="font-sans text-xs text-mid-grey ml-auto">
              {group.length} {group.length === 1 ? 'record' : 'records'}
            </span>
          </div>

          {/* Artifact rows */}
          {group.map((artifact) => (
            <ArtifactRow key={artifact.id} artifact={artifact} />
          ))}
        </div>
      ))}
    </div>
  )
}
