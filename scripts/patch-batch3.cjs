// scripts/patch-batch3.cjs
// Writes all Batch 3 files directly to disk.
// Run from project root: node scripts/patch-batch3.cjs

const fs = require('fs')
const path = require('path')

const ROOT = path.resolve(__dirname, '..')
let written = 0
let failed = 0

function write(rel, content) {
  const abs = path.join(ROOT, rel)
  const dir = path.dirname(abs)
  try {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
    fs.writeFileSync(abs, content, { encoding: 'utf8' })
    console.log('  [WROTE] ' + rel)
    written++
  } catch (err) {
    console.log('  [FAIL]  ' + rel + ' — ' + err.message)
    failed++
  }
}

// ── lib/glossary.ts ───────────────────────────────────────────────────────────
write('lib/glossary.ts', `\
// lib/glossary.ts
// Sealed glossary terms — definitions are verbatim from the COI corpus Glossary (Back Matter).
// Source: Conservation of Intent, Volume I (Doctrine) — Matthew A. Davis, 2026.
// INV-03: do not add cross-references, editorial additions, or related terms.

export interface GlossaryTerm {
  term: string
  definition: string
  artifactId: string
  section: string
}

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    term: 'Intent (sealed)',
    definition:
      'Intent, within this trilogy, means authorized representations only. It is not a psychological interior, a hidden motive, an identity-derived property, a mental-state inference target, or a behavior-inferred attribution.',
    artifactId: 'UFTAGP-COI-001',
    section: 'S1',
  },
  {
    term: 'Intent-domain',
    definition:
      'The bounded meaning-domain induced by an admissible intent basis, including its explicit scope boundaries and binding non-claims.',
    artifactId: 'UFTAGP-COI-001',
    section: 'S2',
  },
  {
    term: 'Refusal (Terminal)',
    definition:
      'A sealed outcome issued when lawful classification cannot be stated within scope (due to missing prerequisites, scope exceedance, prohibited observables, unstated premises, or non-trace-representable paths). Refusal is terminal.',
    artifactId: 'UFTAGP-COI-001',
    section: 'S11.7',
  },
]

export const GLOSSARY_MAP: Record<string, GlossaryTerm> = Object.fromEntries(
  GLOSSARY_TERMS.map((t) => [t.term, t])
)

export const GLOSSARY_TERMS_SORTED: GlossaryTerm[] = [...GLOSSARY_TERMS].sort(
  (a, b) => a.term.localeCompare(b.term)
)
`)

// ── check-batch3.cjs (fixed version) ─────────────────────────────────────────
write('scripts/check-batch3.cjs', `\
// scripts/check-batch3.cjs
// Batch 3 exit state verification.
// Run from project root: node scripts/check-batch3.cjs

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

const ROOT = path.resolve(__dirname, '..')
let passed = 0
let failed = 0
let warnings = 0

function pass(label) {
  console.log('  \\x1b[32m[PASS]\\x1b[0m ' + label)
  passed++
}
function fail(label, detail) {
  console.log('  \\x1b[31m[FAIL]\\x1b[0m ' + label)
  if (detail) console.log('         ' + detail)
  failed++
}
function warn(label, detail) {
  console.log('  \\x1b[33m[WARN]\\x1b[0m ' + label)
  if (detail) console.log('         ' + detail)
  warnings++
}
function section(title) {
  console.log('\\n\\x1b[1m' + title + '\\x1b[0m')
  console.log('-'.repeat(title.length))
}
function readFile(rel) {
  const abs = path.join(ROOT, rel)
  if (!fs.existsSync(abs)) return null
  return fs.readFileSync(abs, 'utf8')
}
function codeOnly(content) {
  return content.split('\\n').filter(l => !l.trim().startsWith('//')).join('\\n')
}

// ── 1. Required file existence ────────────────────────────────────────────────
section('1. Required file existence')
const REQUIRED = [
  'lib/glossary.ts',
  'lib/constraints.ts',
  'app/page.tsx',
  'components/registry/ArtifactGrid.tsx',
  'components/registry/LiveCounters.tsx',
  'app/corpus/[id]/page.tsx',
  'components/GlossaryTooltip.tsx',
]
for (const f of REQUIRED) {
  fs.existsSync(path.join(ROOT, f)) ? pass(f) : fail(f, 'File not found')
}

// ── 2. INV-02 — Sealed color containment ─────────────────────────────────────
section('2. INV-02 — Sealed color containment (Batch 3 files only)')
const SEALED_COLORS = ['label-conserving', 'label-non-conserving', 'label-refusal']
const BATCH3_TSX = [
  'app/page.tsx',
  'components/registry/ArtifactGrid.tsx',
  'components/registry/LiveCounters.tsx',
  'app/corpus/[id]/page.tsx',
  'components/GlossaryTooltip.tsx',
]
for (const f of BATCH3_TSX) {
  const content = readFile(f)
  if (!content) continue
  const code = codeOnly(content)
  const found = SEALED_COLORS.filter(t => code.includes(t))
  found.length === 0 ? pass(f + ' — no sealed colors') : fail(f, 'Found: ' + found.join(', '))
}
const cl = readFile('components/ui/ClassificationLabel.tsx')
if (cl) {
  SEALED_COLORS.some(t => cl.includes(t))
    ? pass('components/ui/ClassificationLabel.tsx — sealed colors present (expected)')
    : warn('components/ui/ClassificationLabel.tsx', 'No sealed colors found — is this file complete?')
}

// ── 3. Anti-pattern checks ────────────────────────────────────────────────────
section('3. Anti-pattern checks')

const home = readFile('app/page.tsx')
if (home) {
  const buttons = (home.match(/<button/g) || []).length
  buttons === 0 ? pass('app/page.tsx — no <button elements') : fail('app/page.tsx', buttons + ' <button element(s) found')
}

const corpus = readFile('app/corpus/[id]/page.tsx')
if (corpus) {
  corpus.includes('readFileSync')
    ? fail('app/corpus/[id]/page.tsx', 'Contains fs.readFileSync')
    : pass('app/corpus/[id]/page.tsx — no fs.readFileSync')
  corpus.includes("from '@/data/corpus-bundle.json'")
    ? pass('app/corpus/[id]/page.tsx — static import confirmed')
    : fail('app/corpus/[id]/page.tsx', "Missing: import bundleData from '@/data/corpus-bundle.json'")
}

const grid = readFile('components/registry/ArtifactGrid.tsx')
if (grid) {
  const rounded = (grid.match(/rounded-(?!none)[a-z]*/g) || []).filter(c => c !== 'rounded-none')
  rounded.length === 0 ? pass('ArtifactGrid.tsx — no rounded corners') : fail('ArtifactGrid.tsx', 'Found: ' + [...new Set(rounded)].join(', '))
}

const counters = readFile('components/registry/LiveCounters.tsx')
if (counters) {
  const code = codeOnly(counters)
  const spinners = ['animate-spin', 'Spinner', 'loading-spinner'].filter(t => code.includes(t))
  spinners.length === 0 ? pass('LiveCounters.tsx — no spinner') : fail('LiveCounters.tsx', 'Found: ' + spinners.join(', '))
  counters.includes("'\\u2014'") || counters.includes('"\\u2014"') || counters.includes("'\\u2013'") || counters.includes('"\\u2013"') || counters.includes("'\\xe2\\x80\\x94'") || /['"]\u2014['"]/.test(counters) || /['"]\u2013['"]/.test(counters) || counters.includes("'—'") || counters.includes('"—"')
    ? pass('LiveCounters.tsx — loading placeholder is dash')
    : warn('LiveCounters.tsx', 'Loading placeholder may not be em dash — verify manually')
}

const tooltip = readFile('components/GlossaryTooltip.tsx')
if (tooltip) {
  const code = codeOnly(tooltip)
  const forbidden = ['see also', 'See also', 'related terms', 'Related terms'].filter(t => code.includes(t))
  forbidden.length === 0
    ? pass('GlossaryTooltip.tsx — no "see also" or "related terms" (INV-03)')
    : fail('GlossaryTooltip.tsx', 'Found in rendered output: ' + forbidden.join(', '))
}

// ── 4. Glossary verbatim integrity (INV-03) ───────────────────────────────────
section('4. INV-03 — Glossary verbatim integrity')
const glossary = readFile('lib/glossary.ts')
if (!glossary) {
  fail('lib/glossary.ts', 'File missing — cannot verify')
} else {
  const checks = [
    {
      term: 'Intent (sealed)',
      fragment: 'Intent, within this trilogy, means authorized representations only. It is not a psychological interior, a hidden motive, an identity-derived property, a mental-state inference target, or a behavior-inferred attribution.',
    },
    {
      term: 'Intent-domain',
      fragment: 'The bounded meaning-domain induced by an admissible intent basis, including its explicit scope boundaries and binding non-claims.',
    },
    {
      term: 'Refusal (Terminal)',
      fragment: 'A sealed outcome issued when lawful classification cannot be stated within scope (due to missing prerequisites, scope exceedance, prohibited observables, unstated premises, or non-trace-representable paths). Refusal is terminal.',
    },
  ]
  for (const { term, fragment } of checks) {
    glossary.includes(fragment)
      ? pass('"' + term + '" — verbatim confirmed')
      : fail('"' + term + '"', 'Definition not found verbatim — check for edits')
  }
  glossary.includes('UFTAGP-COI-001') ? pass('Artifact ID present') : fail('Artifact ID', 'UFTAGP-COI-001 not found')
}

// ── 5. Data files ─────────────────────────────────────────────────────────────
section('5. Data files')
const bundle = readFile('data/corpus-bundle.json')
if (bundle) {
  try {
    const parsed = JSON.parse(bundle)
    const count = (parsed.artifacts || []).length
    count === 4 ? pass('corpus-bundle.json — ' + count + ' artifacts') : warn('corpus-bundle.json', 'Expected 4, found ' + count)
    ;(parsed.artifacts || []).some(a => a.id === 'UFTAGP-COI-001')
      ? pass('corpus-bundle.json — UFTAGP-COI-001 present')
      : fail('corpus-bundle.json', 'UFTAGP-COI-001 not found')
  } catch { fail('corpus-bundle.json', 'JSON parse error') }
} else { fail('data/corpus-bundle.json', 'File not found') }
fs.existsSync(path.join(ROOT, 'data/registry-manifest.json')) ? pass('registry-manifest.json — present') : fail('registry-manifest.json', 'Not found')

// ── 6. INV-15 — Isolation ─────────────────────────────────────────────────────
section('6. INV-15 — UFTAGP codebase isolation')
const ISOLATION_FILES = [
  'lib/glossary.ts',
  'app/page.tsx',
  'components/registry/ArtifactGrid.tsx',
  'components/registry/LiveCounters.tsx',
  'app/corpus/[id]/page.tsx',
  'components/GlossaryTooltip.tsx',
]
const FORBIDDEN = ['spinegraph', 'SpineGraph', 'appaKUO', 'app2asv8']
for (const f of ISOLATION_FILES) {
  const content = readFile(f)
  if (!content) continue
  const found = FORBIDDEN.filter(t => content.includes(t))
  found.length === 0 ? pass(f + ' — no SpineGraph/COM refs') : fail(f, 'Found: ' + found.join(', '))
}

// ── 7. npm run build ──────────────────────────────────────────────────────────
section('7. npm run build')
console.log('  Running build...')
try {
  execSync('npm run build', { cwd: ROOT, stdio: 'pipe', timeout: 120000 })
  pass('npm run build — clean')
} catch (err) {
  fail('npm run build — FAILED')
  const out = ((err.stdout || '') + (err.stderr || '')).toString()
  out.split('\\n').slice(0, 20).forEach(l => console.log('    ' + l))
}

// ── Summary ───────────────────────────────────────────────────────────────────
section('Summary')
console.log('  Passed:   ' + passed)
console.log('  Failed:   ' + failed)
console.log('  Warnings: ' + warnings)
if (failed === 0) {
  console.log('\\n\\x1b[32m  Automated checks PASSED.\\x1b[0m')
} else {
  console.log('\\n\\x1b[31m  ' + failed + ' check(s) FAILED.\\x1b[0m')
}

console.log(\`
\\x1b[1mBROWSER CHECKS (manual)\\x1b[0m
---------------------------------------------------------
Run: npm run dev  (then open http://localhost:3000)

  [ ] Homepage loads at /
      - Project statement present (57 words, verbatim)
      - LiveCounters shows 3 numerals (may be 0 if DB empty)
      - ArtifactGrid shows artifact rows grouped by type
      - Below-fold: text links only, no buttons

  [ ] Corpus reader loads at /corpus/UFTAGP-COI-001
      - ArtifactIdPill in header
      - Section navigation sidebar visible
      - Body text renders

  [ ] GlossaryTooltip — hover a sealed term in corpus reader
      - Dotted underline visible
      - Tooltip appears on hover
      - Shows: term, verbatim definition, ArtifactIdPill, section ref
      - No extra content
      - Click locks open, second click closes

  [ ] LiveCounters — open browser console
      - No fetch errors to /api/stats

  [ ] No sealed colors on Batch 3 pages
---------------------------------------------------------
\`)

process.exit(failed > 0 ? 1 : 0)
`)

// ── app/corpus/[id]/page.tsx ──────────────────────────────────────────────────
write('app/corpus/[id]/page.tsx', `\
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
  return { title: artifact.id + ' \u2014 ' + artifact.title }
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
                    {section.heading || '\u00a7 ' + (i + 1)}
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
`)

// ── app/page.tsx ──────────────────────────────────────────────────────────────
write('app/page.tsx', `\
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
          institutional pressure. Its flagship output \u2014 the Conservation of Intent
          trilogy \u2014 defines what counts as conserving or violating an authorized
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
          Classify a transformation \u2192
        </Link>
        <Link href="/navigator" className="font-sans text-sm text-accent hover:underline underline-offset-2">
          Navigate the corpus \u2192
        </Link>
        <Link href="/contribute" className="font-sans text-sm text-accent hover:underline underline-offset-2">
          Contribute research \u2192
        </Link>
      </nav>

    </div>
  )
}
`)

// ── Summary ───────────────────────────────────────────────────────────────────
console.log('\nPatch complete')
console.log('  Written: ' + written)
console.log('  Failed:  ' + failed)
if (failed === 0) {
  console.log('\nNow run: node scripts/check-batch3.cjs')
} else {
  console.log('\nSome files could not be written. Check permissions.')
}
