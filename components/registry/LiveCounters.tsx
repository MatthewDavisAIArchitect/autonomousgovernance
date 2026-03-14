'use client'

// components/registry/LiveCounters.tsx
// Three counters: artifacts / invariants / classifications.
// ANTI-PATTERN GUARD: No spinner — loading state uses '—' placeholder.
// Polls /api/stats every 60 seconds.

import { useEffect, useState } from 'react'
import type { SiteStats } from '@/lib/types'

interface Counter {
  key: keyof Pick<SiteStats, 'artifacts' | 'invariants' | 'classifications'>
  label: string
}

const COUNTERS: Counter[] = [
  { key: 'artifacts',       label: 'Artifacts' },
  { key: 'invariants',      label: 'Invariants' },
  { key: 'classifications', label: 'Classifications' },
]

const POLL_INTERVAL_MS = 60_000

export default function LiveCounters() {
  const [stats, setStats] = useState<SiteStats | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval>
    let cancelled = false

    async function fetchStats() {
      try {
        const res = await fetch('/api/stats')
        if (!res.ok) throw new Error(`Stats fetch failed: ${res.status}`)
        const data: SiteStats = await res.json()
        if (!cancelled) {
          setStats(data)
          setError(false)
        }
      } catch {
        if (!cancelled) setError(true)
      }
    }

    fetchStats()
    intervalId = setInterval(fetchStats, POLL_INTERVAL_MS)

    return () => {
      cancelled = true
      clearInterval(intervalId)
    }
  }, [])

  return (
    <div
      className="flex divide-x divide-rule-grey border border-rule-grey w-full max-w-lg"
      role="region"
      aria-label="Site statistics"
    >
      {COUNTERS.map(({ key, label }) => (
        <div
          key={key}
          className="flex-1 flex flex-col items-center justify-center px-6 py-5"
        >
          {/* Numeral */}
          <span
            className="font-serif font-bold text-4xl text-near-black leading-none tabular-nums"
            aria-label={`${label}: ${stats ? stats[key] : 'loading'}`}
          >
            {stats ? stats[key] : '—'}
          </span>

          {/* Label */}
          <span className="font-sans text-xs text-mid-grey mt-2 tracking-wide">
            {label}
          </span>
        </div>
      ))}
    </div>
  )
}
