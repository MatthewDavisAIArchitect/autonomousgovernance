// app/page.tsx
import Link from 'next/link'
import LiveCounters from '@/components/registry/LiveCounters'

const ARTIFACTS = [
  {
    id: 'UFTAGP-COI-001',
    title: 'Conservation of Intent — Volume I: Axioms, Invariants + Admissibility',
    sections: 7,
    curated: true,
  },
  {
    id: 'UFTAGP-COI-002',
    title: 'Conservation of Intent — Volume II: Intent-Domain Ontology + Transformational Relations',
    sections: 5,
    curated: true,
  },
  {
    id: 'UFTAGP-COI-003',
    title: 'Conservation of Intent — Volume III: Interpretation Saturation and Limits',
    sections: 5,
    curated: true,
  },
  {
    id: 'UFTAGP-SPEC-001',
    title: 'Governing Specification',
    sections: 2,
    curated: false,
  },
]

const HOME_PATHS = [
  {
    key: 'executive',
    label: 'Executive',
    description: 'Governance implications, mandate boundaries, citation posture',
  },
  {
    key: 'architect',
    label: 'Architect',
    description: 'Semantic constraint surfaces, invariant structure, admissibility logic',
  },
  {
    key: 'researcher',
    label: 'Researcher',
    description: 'Doctrinal lineage, axiom derivation, ontological scope',
  },
]
export default function Home() {
  return (
    <div className="max-w-4xl mx-auto">

      <section className="border-b border-rule-grey pb-12 mb-12">
        <p className="font-serif italic font-bold text-near-black text-base leading-relaxed max-w-2xl mb-4">
          There is no field yet that formally studies the conservation of intent
          under governance pressure. This project is building one.
        </p>
        <p className="font-serif text-lg text-near-black leading-[1.75] max-w-2xl">
          The Unified Field Theory of Autonomous Governance Project produces
          doctrine that stabilizes the meaning of ethical interpretation under
          institutional pressure. Its flagship output — the Conservation of Intent
          trilogy — defines what counts as conserving or violating an authorized
          intent-domain, without prescribing implementation, enforcement, or
          outcome claims.
        </p>
      </section>

      <section className="border-b border-rule-grey pb-12 mb-12">
        <LiveCounters />
      </section>

      <section className="border-b border-rule-grey pb-12 mb-12">
        <h2 className="font-sans text-xs font-medium text-mid-grey tracking-widest uppercase mb-6">
          Explore the Corpus
        </h2>
        <div className="border-t border-rule-grey">
          {HOME_PATHS.map((path) => (
            <Link
              key={path.key}
              href="/navigator"
              className="block border-b border-rule-grey py-5 group"
            >
              <p className="font-serif text-base text-near-black group-hover:text-accent transition-colors">
                {path.label}
              </p>
              <p className="font-sans text-xs text-mid-grey mt-1">{path.description}</p>
            </Link>
          ))}
        </div>
        <Link
          href="/navigator"
          className="font-sans text-sm text-accent hover:underline underline-offset-2 mt-6 inline-block"
        >
          Explore all 5 paths →
        </Link>
      </section>

      <section className="border-b border-rule-grey pb-12 mb-12">
        <h2 className="font-sans text-xs font-medium text-mid-grey tracking-widest uppercase mb-6">
          Registered Artifacts
        </h2>
        <div className="border-t border-rule-grey">
          {ARTIFACTS.map((a) => (
            <Link
              key={a.id}
              href={`/corpus/${a.id}`}
              className="flex flex-wrap items-baseline gap-x-4 gap-y-1 py-4 border-b border-rule-grey last:border-b-0 group"
            >
              <span className="font-mono text-xs text-mid-grey">{a.id}</span>
              <span className="font-serif text-sm text-near-black flex-1 min-w-0 group-hover:text-accent transition-colors">
                {a.title}
              </span>
              <div className="flex items-center gap-3 ml-auto flex-shrink-0">
                <span className="font-sans text-xs text-mid-grey">
                  {a.sections} section{a.sections !== 1 ? 's' : ''}
                </span>
                {a.curated && (
                  <span className="font-mono text-xs text-mid-grey border border-mid-grey px-2 py-0.5">
                    curated
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
        <Link
          href="/corpus"
          className="font-sans text-sm text-accent hover:underline underline-offset-2 mt-6 inline-block"
        >
          Browse full corpus →
        </Link>
      </section>

      <section className="mb-16">
        <h2 className="font-sans text-xs font-medium text-mid-grey tracking-widest uppercase mb-6">
          How to Contribute
        </h2>
        <ol className="space-y-4">
          <li className="flex gap-4">
            <span className="font-mono text-sm text-mid-grey shrink-0">①</span>
            <span className="font-serif text-sm text-near-black">
              Publish your research to{' '}
              <a
                href="https://zenodo.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline underline-offset-2"
              >
                Zenodo
              </a>
            </span>
          </li>
          <li className="flex gap-4">
            <span className="font-mono text-sm text-mid-grey shrink-0">②</span>
            <span className="font-serif text-sm text-near-black">
              Add keyword:{' '}
              <span className="font-mono text-xs bg-id-bg px-1.5 py-0.5">
                UFTAGP-Class:[your classification]
              </span>
            </span>
          </li>
          <li className="flex gap-4">
            <span className="font-mono text-sm text-mid-grey shrink-0">③</span>
            <span className="font-serif text-sm text-near-black">
              The daily ingest picks it up automatically — no account required
            </span>
          </li>
        </ol>
        <Link
          href="/contribute"
          className="font-sans text-sm text-accent hover:underline underline-offset-2 mt-6 inline-block"
        >
          Read the full instructions →
        </Link>
      </section>

      <nav
        className="border-t border-rule-grey pt-8 flex flex-wrap gap-x-10 gap-y-3"
        aria-label="Site navigation"
      >
        <Link href="/classify" className="font-sans text-sm text-accent hover:underline underline-offset-2">
          Classify a transformation →
        </Link>
        <Link href="/navigator" className="font-sans text-sm text-accent hover:underline underline-offset-2">
          Navigate the corpus →
        </Link>
        <Link href="/contribute" className="font-sans text-sm text-accent hover:underline underline-offset-2">
          Contribute research →
        </Link>
      </nav>

    </div>
  )
}
