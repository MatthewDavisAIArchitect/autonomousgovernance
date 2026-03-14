const fs = require('fs')
const p = 'app/corpus/[id]/page.tsx'
let c = fs.readFileSync(p, 'utf8')
c = c.replace('interface BundleSection { heading: string; body: string }', 'interface BundleSection { ref: string; heading: string; text: string }')
fs.writeFileSync(p, c, 'utf8')
console.log('done')
