// app/page.tsx
import Link from 'next/link'
import LiveCounters from '@/components/registry/LiveCounters'
import ArtifactGrid from '@/components/registry/ArtifactGrid'

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto">

      <section className="border-b border-rule-grey pb-12 mb-12">
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

      <section className="mb-16">
        <h2 className="font-sans text-xs font-medium text-mid-grey tracking-widest uppercase mb-6">
          Registered Artifacts
        </h2>
        <ArtifactGrid />
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
