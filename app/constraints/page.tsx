"use client"
// app/constraints/page.tsx
// 15 binding constraints, filterable by 6 categories.
import { useState } from "react"
import { CONSTRAINTS, CONSTRAINT_CATEGORIES, type ConstraintCategory } from "@/lib/constraints"
import ArtifactIdPill from "@/components/ui/ArtifactIdPill"
import Link from "next/link"

export default function ConstraintsPage() {
  const [active, setActive] = useState<ConstraintCategory | "All">("All")
  const filtered = active === "All" ? CONSTRAINTS : CONSTRAINTS.filter((c) => c.category === active)

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="font-serif text-2xl text-near-black mb-2">Constraints Ledger</h1>
      <p className="font-sans text-sm text-mid-grey mb-6">
        {CONSTRAINTS.length} binding constraints. Source: UFTAGP-SPEC-001.
      </p>
      <div className="flex flex-wrap gap-2 mb-8">
        {(["All", ...CONSTRAINT_CATEGORIES] as Array<"All" | ConstraintCategory>).map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={"font-sans text-xs px-3 py-1 border rounded-none transition-colors " +
              (active === cat ? "border-near-black text-near-black" : "border-rule-grey text-mid-grey hover:border-near-black")}
          >
            {cat}
          </button>
        ))}
      </div>
      <div className="border-t border-rule-grey">
        {filtered.map((c) => (
          <div key={c.id} className="border-b border-rule-grey py-5">
            <div className="flex items-baseline gap-3 mb-2">
              <span className="font-mono text-xs text-near-black">{c.id}</span>
              <span className="font-sans text-xs text-mid-grey border border-rule-grey px-2 py-0.5">{c.category}</span>
              <span className="font-serif text-sm font-bold text-near-black">{c.label}</span>
            </div>
            <p className="font-serif text-sm text-near-black leading-relaxed mb-3">{c.statement}</p>
            <div className="flex items-center gap-2">
              <ArtifactIdPill id={c.artifactId} />
              <Link
                href={"/corpus/" + c.artifactId + "#section-" + c.sourceSection}
                className="font-mono text-xs text-accent hover:underline underline-offset-2"
              >
                {c.sourceSection}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
