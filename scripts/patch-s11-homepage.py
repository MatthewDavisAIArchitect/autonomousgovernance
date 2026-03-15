path = 'app/page.tsx'
content = """\
// app/page.tsx
import Link from 'next/link'
import LiveCounters from '@/components/registry/LiveCounters'

const ARTIFACTS = [
  {
    id: 'UFTAGP-COI-001',
    title: 'Conservation of Intent \u2014 Volume I: Axioms, Invariants + Admissibility',
    sections: 7,
    curated: True,
  },
  {
    id: 'UFTAGP-COI-002',
    title: 'Conservation of Intent \u2014 Volume II: Intent-Domain Ontology + Transformational Relations',
    sections: 5,
    curated: True,
  },
  {
    id: 'UFTAGP-COI-003',
    title: 'Conservation of Intent \u2014 Volume III: Interpretation Saturation and Limits',
    sections: 5,
    curated: True,
  },
  {
    id: 'UFTAGP-SPEC-001',
    title: 'Governing Specification',
    sections: 2,
    curated: False,
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
"""

# Build JSX separately to avoid triple-quote collision
L = '\u003c'
R = '\u003e'
n = '\n'

jsx = (
  f"export default function Home() {{{n}"
  f"  return ({n}"
  f"    {L}div className=\"max-w-4xl mx-auto\"{R}{n}"
  f"{n}"
  f"      {L}section className=\"border-b border-rule-grey pb-12 mb-12\"{R}{n}"
  f"        {L}p className=\"font-serif italic text-mid-grey text-base leading-relaxed max-w-2xl mb-4\"{R}{n}"
  f"          There is no field yet that formally studies the conservation of intent{n}"
  f"          under governance pressure. This project is building one.{n}"
  f"        {L}/p{R}{n}"
  f"        {L}p className=\"font-serif text-lg text-near-black leading-[1.75] max-w-2xl\"{R}{n}"
  f"          The Unified Field Theory of Autonomous Governance Project produces{n}"
  f"          doctrine that stabilizes the meaning of ethical interpretation under{n}"
  f"          institutional pressure. Its flagship output \u2014 the Conservation of Intent{n}"
  f"          trilogy \u2014 defines what counts as conserving or violating an authorized{n}"
  f"          intent-domain, without prescribing implementation, enforcement, or{n}"
  f"          outcome claims.{n}"
  f"        {L}/p{R}{n}"
  f"      {L}/section{R}{n}"
  f"{n}"
  f"      {L}section className=\"border-b border-rule-grey pb-12 mb-12\"{R}{n}"
  f"        {L}LiveCounters />{n}"
  f"      {L}/section{R}{n}"
  f"{n}"
  f"      {L}section className=\"border-b border-rule-grey pb-12 mb-12\"{R}{n}"
  f"        {L}h2 className=\"font-sans text-xs font-medium text-mid-grey tracking-widest uppercase mb-6\"{R}{n}"
  f"          Explore the Corpus{n}"
  f"        {L}/h2{R}{n}"
  f"        {L}div className=\"border-t border-rule-grey\"{R}{n}"
  f"          {{HOME_PATHS.map((path) => ({n}"
  f"            {L}Link{n}"
  f"              key={{path.key}}{n}"
  f"              href=\"/navigator\"{n}"
  f"              className=\"block border-b border-rule-grey py-5 group\"{n}"
  f"            {R}{n}"
  f"              {L}p className=\"font-serif text-base text-near-black group-hover:text-accent transition-colors\"{R}{n}"
  f"                {{path.label}}{n}"
  f"              {L}/p{R}{n}"
  f"              {L}p className=\"font-sans text-xs text-mid-grey mt-1\"{R}{{path.description}}{L}/p{R}{n}"
  f"            {L}/Link{R}{n}"
  f"          ))}}{n}"
  f"        {L}/div{R}{n}"
  f"        {L}Link{n}"
  f"          href=\"/navigator\"{n}"
  f"          className=\"font-sans text-sm text-accent hover:underline underline-offset-2 mt-6 inline-block\"{n}"
  f"        {R}{n}"
  f"          Explore all 5 paths \u2192{n}"
  f"        {L}/Link{R}{n}"
  f"      {L}/section{R}{n}"
  f"{n}"
  f"      {L}section className=\"border-b border-rule-grey pb-12 mb-12\"{R}{n}"
  f"        {L}h2 className=\"font-sans text-xs font-medium text-mid-grey tracking-widest uppercase mb-6\"{R}{n}"
  f"          Registered Artifacts{n}"
  f"        {L}/h2{R}{n}"
  f"        {L}div className=\"border-t border-rule-grey\"{R}{n}"
  f"          {{ARTIFACTS.map((a) => ({n}"
  f"            {L}Link{n}"
  f"              key={{a.id}}{n}"
  f"              href={{`/corpus/${{a.id}}`}}{n}"
  f"              className=\"flex flex-wrap items-baseline gap-x-4 gap-y-1 py-4 border-b border-rule-grey last:border-b-0 group\"{n}"
  f"            {R}{n}"
  f"              {L}span className=\"font-mono text-xs text-mid-grey\"{R}{{a.id}}{L}/span{R}{n}"
  f"              {L}span className=\"font-serif text-sm text-near-black flex-1 min-w-0 group-hover:text-accent transition-colors\"{R}{n}"
  f"                {{a.title}}{n}"
  f"              {L}/span{R}{n}"
  f"              {L}div className=\"flex items-center gap-3 ml-auto flex-shrink-0\"{R}{n}"
  f"                {L}span className=\"font-sans text-xs text-mid-grey\"{R}{n}"
  f"                  {{a.sections}} section{{a.sections !== 1 ? 's' : ''}}{n}"
  f"                {L}/span{R}{n}"
  f"                {{a.curated && ({n}"
  f"                  {L}span className=\"font-mono text-xs text-mid-grey border border-mid-grey px-2 py-0.5\"{R}{n}"
  f"                    curated{n}"
  f"                  {L}/span{R}{n}"
  f"                )}}{n}"
  f"              {L}/div{R}{n}"
  f"            {L}/Link{R}{n}"
  f"          ))}}{n}"
  f"        {L}/div{R}{n}"
  f"        {L}Link{n}"
  f"          href=\"/corpus\"{n}"
  f"          className=\"font-sans text-sm text-accent hover:underline underline-offset-2 mt-6 inline-block\"{n}"
  f"        {R}{n}"
  f"          Browse full corpus \u2192{n}"
  f"        {L}/Link{R}{n}"
  f"      {L}/section{R}{n}"
  f"{n}"
  f"      {L}section className=\"mb-16\"{R}{n}"
  f"        {L}h2 className=\"font-sans text-xs font-medium text-mid-grey tracking-widest uppercase mb-6\"{R}{n}"
  f"          How to Contribute{n}"
  f"        {L}/h2{R}{n}"
  f"        {L}ol className=\"space-y-4\"{R}{n}"
  f"          {L}li className=\"flex gap-4\"{R}{n}"
  f"            {L}span className=\"font-mono text-sm text-mid-grey shrink-0\"{R}\u2460{L}/span{R}{n}"
  f"            {L}span className=\"font-serif text-sm text-near-black\"{R}{n}"
  f"              Publish your research to{{' '}}{n}"
  f"              {L}a{n}"
  f"                href=\"https://zenodo.org\"{n}"
  f"                target=\"_blank\"{n}"
  f"                rel=\"noopener noreferrer\"{n}"
  f"                className=\"text-accent hover:underline underline-offset-2\"{n}"
  f"              {R}{n}"
  f"                Zenodo{n}"
  f"              {L}/a{R}{n}"
  f"            {L}/span{R}{n}"
  f"          {L}/li{R}{n}"
  f"          {L}li className=\"flex gap-4\"{R}{n}"
  f"            {L}span className=\"font-mono text-sm text-mid-grey shrink-0\"{R}\u2461{L}/span{R}{n}"
  f"            {L}span className=\"font-serif text-sm text-near-black\"{R}{n}"
  f"              Add keyword:{{' '}}{n}"
  f"              {L}span className=\"font-mono text-xs bg-id-bg px-1.5 py-0.5\"{R}{n}"
  f"                UFTAGP-Class:[your classification]{n}"
  f"              {L}/span{R}{n}"
  f"            {L}/span{R}{n}"
  f"          {L}/li{R}{n}"
  f"          {L}li className=\"flex gap-4\"{R}{n}"
  f"            {L}span className=\"font-mono text-sm text-mid-grey shrink-0\"{R}\u2462{L}/span{R}{n}"
  f"            {L}span className=\"font-serif text-sm text-near-black\"{R}{n}"
  f"              The daily ingest picks it up automatically \u2014 no account required{n}"
  f"            {L}/span{R}{n}"
  f"          {L}/li{R}{n}"
  f"        {L}/ol{R}{n}"
  f"        {L}Link{n}"
  f"          href=\"/contribute\"{n}"
  f"          className=\"font-sans text-sm text-accent hover:underline underline-offset-2 mt-6 inline-block\"{n}"
  f"        {R}{n}"
  f"          Read the full instructions \u2192{n}"
  f"        {L}/Link{R}{n}"
  f"      {L}/section{R}{n}"
  f"{n}"
  f"      {L}nav{n}"
  f"        className=\"border-t border-rule-grey pt-8 flex flex-wrap gap-x-10 gap-y-3\"{n}"
  f"        aria-label=\"Site navigation\"{n}"
  f"      {R}{n}"
  f"        {L}Link href=\"/classify\" className=\"font-sans text-sm text-accent hover:underline underline-offset-2\"{R}{n}"
  f"          Classify a transformation \u2192{n}"
  f"        {L}/Link{R}{n}"
  f"        {L}Link href=\"/navigator\" className=\"font-sans text-sm text-accent hover:underline underline-offset-2\"{R}{n}"
  f"          Navigate the corpus \u2192{n}"
  f"        {L}/Link{R}{n}"
  f"        {L}Link href=\"/contribute\" className=\"font-sans text-sm text-accent hover:underline underline-offset-2\"{R}{n}"
  f"          Contribute research \u2192{n}"
  f"        {L}/Link{R}{n}"
  f"      {L}/nav{R}{n}"
  f"{n}"
  f"    {L}/div{R}{n}"
  f"  ){n}"
  f"}}{n}"
)

open(path, 'w', encoding='utf-8').write(content + jsx)
print('WRITTEN')
raw = open(path, 'rb').read(3)
print('BOM:', 'FAIL' if raw == b'\xef\xbb\xbf' else 'OK')
c = open(path, encoding='utf-8').read()
print('hook:', 'OK' if 'conservation of intent' in c else 'FAIL')
print('reading paths:', 'OK' if 'HOME_PATHS' in c else 'FAIL')
print('artifacts:', 'OK' if 'UFTAGP-COI-001' in c else 'FAIL')
print('contribute:', 'OK' if 'How to Contribute' in c else 'FAIL')
print('no ArtifactGrid import:', 'OK' if 'ArtifactGrid' not in c else 'FAIL')
