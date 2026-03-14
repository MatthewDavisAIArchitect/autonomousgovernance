import { notFound } from "next/navigation"
import type { Metadata } from "next"
import ArtifactIdPill from "@/components/ui/ArtifactIdPill"
import GlossaryTooltip from "@/components/GlossaryTooltip"
import { GLOSSARY_TERMS as glossaryTerms } from "@/lib/glossary"
import { UFTAGP_ID_REGEX } from "@/lib/constants"
import bundleData from "@/data/corpus-bundle.json"

interface Props { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const artifact = (bundleData.artifacts as any[]).find((a) => a.id === id)
  if (!artifact) return {}
  return {
    title: `${artifact.title} — UFTAGP`,
    description: `${artifact.id} · Canonical doctrine volume. Canonical; non-prescriptive; classification-only.`,
    openGraph: { title: artifact.title, description: `Canonical doctrine volume. ${artifact.id}. UFTAGP Research Site.`, url: `https://autonomousgovernance.org/corpus/${artifact.id}`, type: "article" },
  }
}

export default async function CorpusDocumentPage({ params }: Props) {
  const { id } = await params
  if (!UFTAGP_ID_REGEX.test(id)) notFound()
  const artifact = (bundleData.artifacts as any[]).find((a) => a.id === id)
  if (!artifact) notFound()

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ScholarlyArticle",
    "headline": artifact.title,
    "author": { "@type": "Person", "name": "Matthew A. Davis" },
    "publisher": { "@type": "Organization", "name": "UFTAGP Research Site", "url": "https://autonomousgovernance.org" },
    "url": `https://autonomousgovernance.org/corpus/${artifact.id}`,
    "identifier": artifact.id,
    "version": artifact.version ?? "1.0",
    "description": "Canonical; non-prescriptive; classification-only doctrine volume.",
    "license": "https://autonomousgovernance.org/about",
    "isPartOf": { "@type": "Book", "name": "Conservation of Intent trilogy", "author": { "@type": "Person", "name": "Matthew A. Davis" } }
  }

  function renderWithTooltips(text: string) {
    const parts: React.ReactNode[] = []
    let remaining = text
    let key = 0
    for (const term of glossaryTerms) {
      const idx = remaining.toLowerCase().indexOf(term.term.toLowerCase())
      if (idx === -1) continue
      if (idx > 0) parts.push(<span key={key++}>{remaining.slice(0, idx)}</span>)
      parts.push(<GlossaryTooltip key={key++} term={term.term} definition={term.definition} artifactId={term.artifactId} section={term.section} />)
      remaining = remaining.slice(idx + term.term.length)
    }
    if (remaining) parts.push(<span key={key++}>{remaining}</span>)
    return parts.length > 0 ? parts : text
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-4xl mx-auto">
        <div className="flex items-baseline gap-4 mb-2">
          <ArtifactIdPill id={artifact.id} />
          <span className="font-mono text-xs text-mid-grey">{artifact.status}</span>
          {artifact.version && <span className="font-mono text-xs text-mid-grey">v{artifact.version}</span>}
        </div>
        <h1 className="font-serif text-2xl text-near-black mb-6 pb-4 border-b border-rule-grey">{artifact.title}</h1>
        <div className="flex gap-10">
          {artifact.sections?.length > 0 && (
            <aside className="w-40 shrink-0">
              <p className="font-sans text-xs text-mid-grey tracking-widest uppercase mb-3">Sections</p>
              <ul className="space-y-1">
                {artifact.sections.map((s: any, i: number) => (
                  <li key={i}><a href={`#section-${i}`} className="font-mono text-xs text-mid-grey hover:text-accent block py-0.5">{s.ref || s.heading?.slice(0, 20) || `Section ${i + 1}`}</a></li>
                ))}
              </ul>
            </aside>
          )}
          <div className="flex-1 min-w-0">
            {artifact.sections?.map((s: any, i: number) => (
              <div key={i} id={`section-${i}`} className="mb-8">
                {s.heading && <h2 className="font-serif text-lg text-near-black mb-3">{s.heading}</h2>}
                <p className="font-serif text-sm text-near-black leading-relaxed whitespace-pre-wrap">{renderWithTooltips(s.text ?? "")}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

