// app/registry/page.tsx
// Community submissions registry. Sorted by vote_count DESC (INV-17).
// INV-13: zero-vote submissions always visible.
// INV-16: no ClassificationLabel, no sealed colors on community cards.
// INV-11: MCR on File badge states a fact only -- not a judgment.
import { CommunitySubmission } from '@/lib/types'

async function getSubmissions(): Promise<CommunitySubmission[]> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://autonomousgovernance.org'
  try {
    const res = await fetch(`${baseUrl}/api/community`, { next: { revalidate: 300 } })
    if (!res.ok) return []
    const data = await res.json()
    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
}

export default async function RegistryPage() {
  const submissions = await getSubmissions()

  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="font-serif text-2xl text-near-black mb-2">Community Registry</h1>
      <p className="font-sans text-sm text-mid-grey mb-8">
        {submissions.length === 0
          ? 'No submissions yet.'
          : `${submissions.length} submission${submissions.length !== 1 ? 's' : ''}, sorted by vote count.`}
      </p>

      {submissions.length === 0 ? (
        <p className="font-sans text-sm text-mid-grey py-6 border-t border-rule-grey">
          Submissions appear here after the daily ingest. Publish to{' '}
          <a href="https://zenodo.org" target="_blank" rel="noopener noreferrer" className="text-accent">
            Zenodo
          </a>{' '}
          and select the UFTAGP community to contribute.
        </p>
      ) : (
        <div className="border-t border-rule-grey">
          {submissions.map((s) => (
            <div key={s.zenodoId} className="border-b border-rule-grey py-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  
                    href={`https://doi.org/${s.doi}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-serif text-base text-near-black hover:text-accent"
                  >
                    {s.title}
                  </a>
                  <p className="font-sans text-xs text-mid-grey mt-1">
                    {Array.isArray(s.authors) ? s.authors.join(', ') : s.authors}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className="font-mono text-xs text-mid-grey">{s.voteCount} vote{s.voteCount !== 1 ? 's' : ''}</span>
                </div>
              </div>

              {s.abstract && (
                <p className="font-sans text-xs text-mid-grey mt-2 line-clamp-3">{s.abstract}</p>
              )}

              <div className="flex flex-wrap gap-2 mt-3 items-center">
                {/* INV-16: transformation_class as plain informational tag, never sealed colors */}
                <span className="font-mono text-xs text-mid-grey bg-id-bg px-2 py-0.5 rounded-none">
                  Researcher-tagged type: {s.transformationClass}
                </span>

                {/* INV-11: MCR on File -- states file detection fact only */}
                {s.mcrAttached && (
                  <span className="font-mono text-xs text-mid-grey border border-mid-grey bg-white px-2 py-0.5 rounded-none">
                    MCR on File
                  </span>
                )}
              </div>

              <div className="mt-2">
                
                  href={`https://doi.org/${s.doi}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs text-accent"
                >
                  {s.doi}
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
