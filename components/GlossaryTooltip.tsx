'use client'

// components/GlossaryTooltip.tsx
// Sealed term tooltip component.
// ANTI-PATTERN GUARD: No 'see also', no related terms, no editorial additions.
// INV-03: Tooltip shows exactly: term heading, verbatim definition, ArtifactIdPill, section ref.
// Hover → shows. Click → locks open. Second click → closes.

import { useState, useRef, useEffect, useCallback } from 'react'
import ArtifactIdPill from '@/components/ui/ArtifactIdPill'

interface GlossaryTooltipProps {
  term: string
  definition: string
  artifactId: string
  section: string
}

export default function GlossaryTooltip({
  term,
  definition,
  artifactId,
  section,
}: GlossaryTooltipProps) {
  const [hovered, setHovered]   = useState(false)
  const [locked, setLocked]     = useState(false)
  const containerRef = useRef<HTMLSpanElement>(null)

  const visible = hovered || locked

  // Close on outside click when locked.
  const handleOutsideClick = useCallback(
    (e: MouseEvent) => {
      if (locked && containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setLocked(false)
      }
    },
    [locked]
  )

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [handleOutsideClick])

  // Escape key closes when locked.
  useEffect(() => {
    if (!locked) return
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setLocked(false)
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [locked])

  function handleClick() {
    // Toggle lock state.
    setLocked((prev) => !prev)
  }

  return (
    <span
      ref={containerRef}
      className="relative inline-block"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Term with dotted underline */}
      <button
        type="button"
        onClick={handleClick}
        className={[
          'font-inherit text-inherit leading-inherit',
          'border-b border-dotted cursor-pointer',
          locked
            ? 'border-accent text-accent'
            : 'border-mid-grey text-near-black',
          // No background, no rounded corners.
          'bg-transparent p-0',
        ].join(' ')}
        aria-expanded={visible}
        aria-describedby={visible ? `tooltip-${term.replace(/\s+/g, '-')}` : undefined}
      >
        {term}
      </button>

      {/* Tooltip — conditionally rendered */}
      {visible && (
        <span
          id={`tooltip-${term.replace(/\s+/g, '-')}`}
          role="tooltip"
          className={[
            // Positioning: above the term, left-aligned.
            'absolute bottom-full left-0 mb-2 z-50',
            // Max-width enforced — no overflow.
            'w-72 max-w-[min(18rem,calc(100vw-2rem))]',
            // Hard border, off-white background, no rounded corners.
            'border border-near-black bg-off-white',
            'p-4',
            // Shadow for layering clarity.
            'shadow-md',
          ].join(' ')}
        >
          {/* Term heading */}
          <p className="font-serif text-sm font-bold text-near-black mb-2 leading-snug">
            {term}
          </p>

          {/* Verbatim definition — INV-03 */}
          <p className="font-serif text-xs text-near-black leading-relaxed mb-3">
            {definition}
          </p>

          {/* Source: ArtifactIdPill + section ref */}
          {/* INV-03: No 'see also', no related terms, nothing else. */}
          <div className="flex items-center gap-2 pt-2 border-t border-rule-grey">
            <ArtifactIdPill id={artifactId} />
            <span className="font-mono text-xs text-mid-grey">{section}</span>
          </div>
        </span>
      )}
    </span>
  )
}
