const fs = require('fs')
const p = 'app/contribute/page.tsx'
let c = fs.readFileSync(p, 'utf8')
c = c.replace(/s\.zenodoDoi/g, 's.doi')
c = c.replace('{s.authors}', '{s.authors.join(", ")}')
fs.writeFileSync(p, c, 'utf8')
console.log('done')
