// app/corpus/[id]/page.tsx
// Dynamic corpus document reader.
// ANTI-PATTERN GUARD: corpus-bundle.json loaded via static import only.
// 404 if id fails UFTAGP_ID_REGEX or artifact not found in bundle.

import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import bundleData from '@/data/corpus-bundle.json'
import { UFTAGP_ID_REGEX } from '@/lib/constants'
import { GLOSSARY_MAP } from '@/lib/glossary'
import ArtifactIdPill from '@/components/ui/ArtifactIdPill'
import GlossaryTooltip from '@/components/GlossaryTooltip'

interface BundleSection { heading: string; body: string }
interface BundleArtifact { id: string; title: string; type: string; status: string; version: string; sections: BundleSection[] }
interface CorpusBundle { artifacts: BundleArtifact[] }

function annotateBody(text: string): React.ReactNode[] {
  const terms = Object.keys(GLOSSARY_MAP)
  if (terms.length === 0) return [text]
  const sorted = [...terms].sort((a, b) => b.length - a.length)
  let segments: Array<string | React.ReactNode> = [text]
  for (const termStr of sorted) {
    const next: Array<string | React.ReactNode> = []
    for (const seg of segments) {
      if (typeof seg !== 'string') { next.push(seg); continue }
      const parts = seg.split(termStr)
      for (let i = 0; i < parts.length; i++) {
        if (parts[i]) next.push(parts[i])
        if (i < parts.length - 1) {
          const t = GLOSSARY_MAP[termStr]
          next.push(
            <GlossaryTooltip
              key={termStr + '-' + i + '-' + Math.random()}
              term={t.term}
              definition={t.definition}
              artifactId={t.artifactId}
              section={t.section}
            />
          )
        }
      }
    }
    segments = next
  }
  return segments as React.ReactNode[]
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const bundle = bundleData as CorpusBundle
  const artifact = bundle.artifacts.find((a) => a.id === id)
  if (!artifact) return { title: 'Not Found' }
  return { title: artifact.id + ' — ' + artifact.title }
}

export default async function CorpusDocumentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (!UFTAGP_ID_REGEX.test(id)) notFound()
  const bundle = bundleData as CorpusBundle
  const artifact = bundle.artifacts.find((a) => a.id === id)
  if (!artifact) notFound()

  return (
    <div className="max-w-5xl mx-auto px-8 py-16">
      <header className="border-b border-rule-grey pb-8 mb-10">
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2 mb-3">
          <ArtifactIdPill id={artifact.id} />
          <span className="font-mono text-xs text-mid-grey">{artifact.type}</span>
          <span className="font-mono text-xs text-mid-grey">{artifact.status}</span>
          <span className="font-mono text-xs text-mid-grey">v{artifact.version}</span>
        </div>
        <h1 className="font-serif text-2xl text-near-black leading-snug">{artifact.title}</h1>
      </header>
      <div className="flex gap-12">
        {artifact.sections.length > 0 && (
          <nav className="hidden md:block w-48 shrink-0 self-start sticky top-8" aria-label="Document sections">
            <p className="font-sans text-xs font-medium text-mid-grey tracking-widest uppercase mb-3">Sections</p>
            <ol className="space-y-1">
              {artifact.sections.map((section, i) => (
                <li key={i}>
                  <a href={'#section-' + i} className="font-sans text-xs text-mid-grey hover:text-accent transition-colors block leading-snug py-0.5">
                    {section.heading || '§ ' + (i + 1)}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        )}
        <article className="flex-1 min-w-0">
          {artifact.sections.length === 0 && (
            <p className="font-sans text-sm text-mid-grey">No sections available.</p>
          )}
          {artifact.sections.map((section, i) => (
            <section key={i} id={'section-' + i} className="mb-10 scroll-mt-8">
              {section.heading && (
                <h2 className="font-serif text-lg text-near-black mb-3 pb-2 border-b border-rule-grey">
                  {section.heading}
                </h2>
              )}
              <p className="font-serif text-base text-near-black leading-[1.8]">
                {annotateBody(section.body)}
              </p>
            </section>
          ))}
        </article>
      </div>
    </div>
  )
}
