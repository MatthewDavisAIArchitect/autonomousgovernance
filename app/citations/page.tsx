"use client"
import { useState, useEffect } from "react"
import type { Artifact } from "@/lib/types"
import ArtifactIdPill from "@/components/ui/ArtifactIdPill"
import { generateCitation, checkProhibitedUse, type CitationFormat } from "@/lib/citations"

export default function CitationsPage() {
  const [artifacts, setArtifacts] = useState<Artifact[]>([])
  const [selectedId, setSelectedId] = useState("")
  const [format, setFormat] = useState<CitationFormat>("chicago")
  const [intendedUse, setIntendedUse] = useState("")
  const [citation, setCitation] = useState<string | null>(null)
  const [refusal, setRefusal] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

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

  function handleGenerate() {
    setCitation(null)
    setRefusal(null)
    setCopied(false)
    if (intendedUse.trim()) {
      const prohibited = checkProhibitedUse(intendedUse)
      if (prohibited) {
        setRefusal(`Refusal (Terminal). Intended use matches prohibited citation form: "${prohibited}". Citation cannot be generated for uses that import mandate, mechanism, outcome, scope laundering, or refusal dilution. This doctrine is canonical; non-prescriptive; classification-only.`)
        return
      }
    }
    const artifact = artifacts.find((a) => a.id === selectedId)
    if (!artifact) return
    setCitation(generateCitation(artifact, format))
  }

  function handleCopy() {
    if (!citation) return
    navigator.clipboard.writeText(citation).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="font-serif text-2xl text-near-black mb-2">Citation Builder</h1>
      <p className="font-sans text-sm text-mid-grey mb-8">
        Generate qualified citations for UFTAGP artifacts. Citations include required jurisdiction qualifiers.
      </p>
      <div className="border-t border-rule-grey pt-6 space-y-6">
        <div>
          <label className="font-sans text-xs text-mid-grey tracking-widest uppercase block mb-2">Artifact</label>
          <select
            value={selectedId}
            onChange={(e) => { setSelectedId(e.target.value); setCitation(null); setRefusal(null) }}
            className="w-full font-mono text-xs text-near-black border border-rule-grey bg-off-white px-3 py-2 rounded-none focus:outline-none focus:border-accent"
          >
            {artifacts.map((a) => (
              <option key={a.id} value={a.id}>{a.id} — {a.title}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="font-sans text-xs text-mid-grey tracking-widest uppercase block mb-2">Format</label>
          <div className="flex gap-4">
            {(["chicago", "apa", "bibtex"] as CitationFormat[]).map((f) => (
              <label key={f} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="format"
                  value={f}
                  checked={format === f}
                  onChange={() => { setFormat(f); setCitation(null); setRefusal(null) }}
                  className="accent-accent"
                />
                <span className="font-mono text-xs text-near-black">{f.toUpperCase()}</span>
              </label>
            ))}
          </div>
        </div>
        <div>
          <label className="font-sans text-xs text-mid-grey tracking-widest uppercase block mb-2">
            Intended use <span className="normal-case">(optional — checked against prohibited citation forms)</span>
          </label>
          <textarea
            value={intendedUse}
            onChange={(e) => { setIntendedUse(e.target.value); setCitation(null); setRefusal(null) }}
            rows={3}
            placeholder="Describe how you intend to cite this artifact..."
            className="w-full font-serif text-sm text-near-black border border-rule-grey bg-off-white px-3 py-2 rounded-none focus:outline-none focus:border-accent resize-none"
          />
        </div>
        <button
          onClick={handleGenerate}
          disabled={!selectedId}
          className="font-sans text-sm text-off-white bg-near-black px-4 py-2 rounded-none hover:bg-accent transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Generate citation
        </button>
        {refusal && (
          <div className="border border-rule-grey p-4">
            <p className="font-sans text-xs text-mid-grey tracking-widest uppercase mb-2">Refusal (Terminal)</p>
            <p className="font-serif text-sm text-near-black leading-relaxed">{refusal}</p>
          </div>
        )}
        {citation && (
          <div className="border border-rule-grey p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <p className="font-sans text-xs text-mid-grey tracking-widest uppercase">{format.toUpperCase()} citation</p>
                <ArtifactIdPill id={selectedId} />
              </div>
              <button onClick={handleCopy} className="font-mono text-xs text-mid-grey hover:text-accent transition-colors">
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
            <pre className="font-mono text-xs text-near-black leading-relaxed whitespace-pre-wrap break-words">{citation}</pre>
            <p className="font-sans text-xs text-mid-grey mt-4 border-t border-rule-grey pt-3">
              Required qualifiers: Canonical · Non-prescriptive · Classification-only · Binding non-claims remain binding.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
