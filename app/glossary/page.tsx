// app/glossary/page.tsx
// ANTI-PATTERN GUARD: No cross-references — INV-03. No search for MVP.
import { GLOSSARY_TERMS_SORTED } from "@/lib/glossary"
import ArtifactIdPill from "@/components/ui/ArtifactIdPill"
import Link from "next/link"

export default function GlossaryPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="font-serif text-2xl text-near-black mb-2">Glossary</h1>
      <p className="font-sans text-sm text-mid-grey mb-8">
        Sealed terms. Definitions are verbatim from the COI corpus.
      </p>
      <div className="border-t border-rule-grey">
        {GLOSSARY_TERMS_SORTED.map((t) => (
          <div key={t.term} className="border-b border-rule-grey py-6">
            <p className="font-serif text-base font-bold text-near-black mb-2">{t.term}</p>
            <p className="font-serif text-sm text-near-black leading-relaxed mb-3">{t.definition}</p>
            <div className="flex items-center gap-2">
              <ArtifactIdPill id={t.artifactId} />
              <Link
                href={"/corpus/" + t.artifactId}
                className="font-mono text-xs text-mid-grey hover:text-accent"
              >
                {t.section}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
