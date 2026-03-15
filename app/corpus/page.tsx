import Link from 'next/link'
import ArtifactIdPill from '@/components/ui/ArtifactIdPill'
import { Artifact } from '@/lib/types'

async function getArtifacts(): Promise<Artifact[]> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://autonomousgovernance.org'
  try {
    const res = await fetch(`${baseUrl}/api/registry`, { next: { revalidate: 3600 } })
    if (!res.ok) return []
    const data = await res.json()
    return data.artifacts ?? []
  } catch {
    return []
  }
}

export default async function CorpusIndexPage() {
  const artifacts = await getArtifacts()

  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="font-serif text-2xl text-near-black mb-2">Corpus</h1>
      <p className="font-sans text-sm text-mid-grey mb-8">
        {artifacts.length} artifact{artifacts.length !== 1 ? 's' : ''} in the canonical registry.
      </p>
      <div className="border-t border-rule-grey">
        {artifacts.length === 0 && (
          <p className="font-sans text-sm text-mid-grey py-6">No artifacts registered yet.</p>
        )}
        {artifacts.map((artifact) => (
          <div key={artifact.id} className="border-b border-rule-grey py-4 flex items-baseline gap-4">
            <ArtifactIdPill id={artifact.id} />
            <div className="flex-1 min-w-0">
              <Link href={`/corpus/${artifact.id}`} className="font-serif text-base text-near-black hover:text-accent">
                {artifact.title}
              </Link>
              <div className="flex gap-3 mt-1">
                <span className="font-mono text-xs text-mid-grey">{artifact.type}</span>
                <span className="font-mono text-xs text-mid-grey">{artifact.status}</span>
                {artifact.version && (
                  <span className="font-mono text-xs text-mid-grey">v{artifact.version}</span>
                )}
                {artifact.zenodoDoi && (
                  <a href={`https://doi.org/${artifact.zenodoDoi}`} target="_blank" rel="noopener noreferrer" className="font-mono text-xs text-accent">
                    {artifact.zenodoDoi}
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}

