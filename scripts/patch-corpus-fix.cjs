const fs = require('fs')
const p = 'app/corpus/[id]/page.tsx'
let c = fs.readFileSync(p, 'utf8')

// Fix BundleSection: body -> text
c = c.replace('  heading: string\n  body: string', '  ref: string\n  heading: string\n  text: string')

// Fix BundleArtifact: remove type/status/version, add optional fields
c = c.replace(
  'interface BundleArtifact { id: string; title: string; type: string; status: string; version: string; sections: BundleSection[] }',
  'interface BundleArtifact { id: string; title: string; type?: string; status?: string; version?: string; sections: BundleSection[] }'
)

// Fix section body reference -> text
c = c.replace(/section\.body/g, 'section.text')

// Fix as CorpusBundle cast — use unknown first
c = c.replace(/bundleData as CorpusBundle/g, 'bundleData as unknown as CorpusBundle')

fs.writeFileSync(p, c, 'utf8')
console.log('done')
