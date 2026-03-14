"use client"
// app/classify/page.tsx
// ANTI-PATTERN GUARD: No retry button after Refusal (Terminal) — INV-06.
// ANTI-PATTERN GUARD: Loading state uses text, not spinner.
import { useState, useEffect } from "react"
import type { Artifact, MinimalClassificationRecord } from "@/lib/types"
import ArtifactIdPill from "@/components/ui/ArtifactIdPill"
import ClassificationLabel from "@/components/ui/ClassificationLabel"

export default function ClassifyPage() {
  const [artifacts, setArtifacts] = useState<Artifact[]>([])
  const [selectedId, setSelectedId] = useState("")
  const [transformation, setTransformation] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<MinimalClassificationRecord | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/registry")
      .then((r) => r.json())
      .then((d) => {
        const canonical = (d.artifacts ?? []).filter((a: Artifact) => a.status === "CANONICAL")
        setArtifacts(canonical)
        if (canonical.length > 0) setSelectedId(canonical[0].id)
      })
      .catch(() => {})
  }, [])

  async function handleClassify() {
    if (!transformation.trim() || !selectedId) return
    setLoading(true)
    setResult(null)
    setError(null)
    try {
      const res = await fetch("/api/classify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transformation, artifactId: selectedId }),
      })
      if (!res.ok) throw new Error("Classification failed")
      setResult(await res.json())
    } catch (err) {
      setError(err instanceof Error ? err.message : "Classification failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="font-serif text-2xl text-near-black mb-8 pb-4 border-b border-rule-grey">
        Classification Engine
      </h1>
      <div className="flex gap-10">

        {/* Left panel */}
        <div className="w-80 shrink-0">
          <div className="mb-4">
            <label className="font-sans text-xs text-mid-grey tracking-widest uppercase block mb-2">
              Artifact
            </label>
            <select
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              disabled={loading}
              className="w-full font-mono text-xs text-near-black border border-rule-grey bg-off-white px-3 py-2 rounded-none focus:outline-none focus:border-accent"
            >
              {artifacts.map((a) => (
                <option key={a.id} value={a.id}>{a.id}</option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="font-sans text-xs text-mid-grey tracking-widest uppercase block mb-2">
              Stated Transformation
            </label>
            <textarea
              value={transformation}
              onChange={(e) => setTransformation(e.target.value)}
              disabled={loading}
              rows={6}
              placeholder="Describe the transformation being evaluated..."
              className="w-full font-serif text-sm text-near-black border border-rule-grey bg-off-white px-3 py-2 rounded-none focus:outline-none focus:border-accent resize-none"
            />
          </div>

          <button
            onClick={handleClassify}
            disabled={loading || !transformation.trim() || !selectedId}
            className="w-full font-sans text-sm text-off-white bg-near-black px-4 py-2 rounded-none hover:bg-accent transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? "Classifying..." : "Classify"}
          </button>
        </div>

        {/* Right panel */}
        <div className="flex-1 min-w-0">
          {error && <p className="font-sans text-sm text-mid-grey">{error}</p>}

          {result && (
            <div className="border border-rule-grey p-6">
              <div className="mb-4">
                <ClassificationLabel label={result.label} />
              </div>
              <div className="space-y-4">
                <div>
                  <p className="font-sans text-xs text-mid-grey tracking-widest uppercase mb-1">Artifact</p>
                  <ArtifactIdPill id={result.artifactRef} />
                </div>
                <div>
                  <p className="font-sans text-xs text-mid-grey tracking-widest uppercase mb-1">Stated Transformation</p>
                  <p className="font-serif text-sm text-near-black leading-relaxed">{result.statedTransformation}</p>
                </div>
                <div>
                  <p className="font-sans text-xs text-mid-grey tracking-widest uppercase mb-1">Justification</p>
                  <p className="font-serif text-sm text-near-black leading-relaxed">{result.finiteJustification}</p>
                </div>
                {/* No retry button after Refusal (Terminal) — INV-06 */}
                {result.label === "Refusal (Terminal)" && result.refusalTrigger && (
                  <div className="border-t border-rule-grey pt-4">
                    <p className="font-sans text-xs text-mid-grey tracking-widest uppercase mb-1">Refusal Trigger</p>
                    <p className="font-serif text-sm text-near-black leading-relaxed">{result.refusalTrigger}</p>
                    <p className="font-serif text-xs text-mid-grey mt-3">
                      Refusal is terminal. Classification cannot proceed within the doctrine&#39;s jurisdiction.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {!result && !error && !loading && (
            <p className="font-serif text-sm text-mid-grey">
              Select an artifact and describe the transformation to classify.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
