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
  console.log('  \x1b[32m[PASS]\x1b[0m ' + label)
  passed++
}
function fail(label, detail) {
  console.log('  \x1b[31m[FAIL]\x1b[0m ' + label)
  if (detail) console.log('         ' + detail)
  failed++
}
function warn(label, detail) {
  console.log('  \x1b[33m[WARN]\x1b[0m ' + label)
  if (detail) console.log('         ' + detail)
  warnings++
}
function section(title) {
  console.log('\n\x1b[1m' + title + '\x1b[0m')
  console.log('-'.repeat(title.length))
}
function readFile(rel) {
  const abs = path.join(ROOT, rel)
  if (!fs.existsSync(abs)) return null
  return fs.readFileSync(abs, 'utf8')
}
function codeOnly(content) {
  return content.split('\n').filter(l => !l.trim().startsWith('//')).join('\n')
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
  counters.includes("'\u2014'") || counters.includes('"\u2014"') || counters.includes("'\u2013'") || counters.includes('"\u2013"') || counters.includes("'\xe2\x80\x94'") || /['"]—['"]/.test(counters) || /['"]–['"]/.test(counters) || counters.includes("'—'") || counters.includes('"—"')
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
  out.split('\n').slice(0, 20).forEach(l => console.log('    ' + l))
}

// ── Summary ───────────────────────────────────────────────────────────────────
section('Summary')
console.log('  Passed:   ' + passed)
console.log('  Failed:   ' + failed)
console.log('  Warnings: ' + warnings)
if (failed === 0) {
  console.log('\n\x1b[32m  Automated checks PASSED.\x1b[0m')
} else {
  console.log('\n\x1b[31m  ' + failed + ' check(s) FAILED.\x1b[0m')
}

console.log(`
\x1b[1mBROWSER CHECKS (manual)\x1b[0m
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
`)

process.exit(failed > 0 ? 1 : 0)
