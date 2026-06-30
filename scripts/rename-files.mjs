// ============================================================================
// FireHub — rename source deliverables to clear, consistent names.
// ----------------------------------------------------------------------------
//   node scripts/rename-files.mjs --check   # dry run: show plan, flag problems
//   node scripts/rename-files.mjs           # apply renames, write rename-log.csv
//   node scripts/rename-files.mjs --undo    # revert using rename-log.csv
// ----------------------------------------------------------------------------
// FULLY REVERSIBLE. Every applied rename is recorded in rename-log.csv (old,new).
// The map lives in rename-map.mjs. After renaming, run freeze-classification.mjs
// then build-catalog.mjs so category/country stay correct on the new names.
// ============================================================================
import { readdirSync, renameSync, writeFileSync, readFileSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { MAP } from './rename-map.mjs'

const HERE = dirname(fileURLToPath(import.meta.url))
const ROOT = join(HERE, '..')
const SRC = join(ROOT, 'GAC deliverables')
const LOG = join(ROOT, 'rename-log.csv')
const mode = process.argv[2]

function plan() {
  const onDisk = readdirSync(SRC, { withFileTypes: true }).filter((d) => d.isFile()).map((d) => d.name)
  const onDiskSet = new Set(onDisk)
  const mapped = onDisk.filter((n) => MAP[n])
  const unmapped = onDisk.filter((n) => !MAP[n])
  const missing = Object.keys(MAP).filter((n) => !onDiskSet.has(n))
  const targetCount = {}
  for (const n of mapped) targetCount[MAP[n]] = (targetCount[MAP[n]] || 0) + 1
  const collisions = Object.entries(targetCount).filter(([, c]) => c > 1).map(([t]) => t)
  return { onDisk, mapped, unmapped, missing, collisions }
}

if (mode === '--undo') {
  if (!existsSync(LOG)) { console.error('No rename-log.csv found — nothing to undo.'); process.exit(1) }
  const rows = readFileSync(LOG, 'utf8').trim().split(/\r?\n/).slice(1)
    .map((line) => line.match(/^"(.*)","(.*)"$/)).filter(Boolean).map((m) => [m[1], m[2]])
  let done = 0
  for (const [oldN, newN] of rows.reverse()) {
    const from = join(SRC, newN), to = join(SRC, oldN)
    if (existsSync(from)) { renameSync(from, to); done++ }
    else console.warn('  skip (not found):', newN)
  }
  console.log(`Reverted ${done}/${rows.length} files to original names.`)
  process.exit(0)
}

const p = plan()
console.log(`On disk: ${p.onDisk.length} | mapped: ${p.mapped.length} | unmapped: ${p.unmapped.length} | map keys missing on disk: ${p.missing.length}`)
if (p.unmapped.length) { console.log('\nUNMAPPED (left as-is):'); p.unmapped.forEach((n) => console.log('  • ' + n)) }
if (p.missing.length) { console.log('\nMAP KEYS NOT FOUND ON DISK:'); p.missing.forEach((n) => console.log('  • ' + n)) }
if (p.collisions.length) { console.log('\nTARGET-NAME COLLISIONS:'); p.collisions.forEach((n) => console.log('  • ' + n)) }

if (mode === '--check') {
  console.log('\nDry run only. Sample of planned renames:')
  p.mapped.slice(0, 8).forEach((n) => console.log(`  ${n}\n    -> ${MAP[n]}`))
  process.exit(0)
}

if (p.collisions.length) { console.error('\nAborting: target-name collisions must be resolved first.'); process.exit(1) }

const logRows = ['"old","new"']
let renamed = 0
for (const oldN of p.mapped) {
  const newN = MAP[oldN]
  if (newN === oldN) continue
  const from = join(SRC, oldN), to = join(SRC, newN)
  if (existsSync(to)) { console.warn('  skip (target exists):', newN); continue }
  renameSync(from, to)
  logRows.push(`"${oldN}","${newN}"`)
  renamed++
}
writeFileSync(LOG, logRows.join('\n') + '\n', 'utf8')
console.log(`\nRenamed ${renamed} files. Log written to rename-log.csv (run with --undo to revert).`)
if (p.unmapped.length) console.log(`Left ${p.unmapped.length} unmapped file(s) untouched.`)
