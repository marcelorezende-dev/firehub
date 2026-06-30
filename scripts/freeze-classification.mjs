// ============================================================================
// FireHub — freeze classification onto the renamed files.
// ----------------------------------------------------------------------------
//   node scripts/freeze-classification.mjs
// ----------------------------------------------------------------------------
// The catalogue classifier is filename-based. Renaming the files to clean
// English titles would have re-bucketed them, so we LOCK each file's category
// and country by running its ORIGINAL name through the rules and storing the
// result against its NEW name in classification.json. build-catalog.mjs reads
// that file and prefers it over the rules (rules still apply to any future
// file not listed here).
// ============================================================================
import { writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { MAP } from './rename-map.mjs'
import { categoryOf, countriesOf } from './classify.mjs'

const HERE = dirname(fileURLToPath(import.meta.url))
const OUT = join(HERE, 'classification.json')

const out = {}
for (const [oldName, newName] of Object.entries(MAP)) {
  out[newName] = { category: categoryOf(oldName), countries: countriesOf(oldName) }
}

writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n', 'utf8')

const byCat = {}
for (const v of Object.values(out)) byCat[v.category] = (byCat[v.category] || 0) + 1
console.log(`Froze classification for ${Object.keys(out).length} files -> scripts/classification.json`)
for (const [c, n] of Object.entries(byCat).sort((a, b) => b[1] - a[1])) console.log(`  ${String(n).padStart(3)}  ${c}`)
