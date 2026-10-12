import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const cwd = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const variants = ['M01', 'M02', 'M03', 'M04']
const baselineOnly = process.argv.includes('--baseline')
const results = []
for (const variant of variants) {
  const testPath = baselineOnly ? ['tests/baseline'] : []
  const run = spawnSync(process.execPath, ['node_modules/vitest/vitest.mjs', 'run', ...testPath, '--coverage.enabled=false'], {
    cwd, encoding: 'utf8', env: { ...process.env, TECHLITH_MUTANT: variant },
  })
  const output = `${run.stdout ?? ''}\n${run.stderr ?? ''}`
  if (run.error || run.status === null || !/Test Files\s+\d+/.test(output)) {
    console.error(`${variant}: infrastructure error\n${run.error?.message ?? output}`)
    process.exit(2)
  }
  if (run.status === 0) results.push([variant, 'SURVIVED'])
  else if (run.status === 1) results.push([variant, 'KILLED'])
  else { console.error(`${variant}: infrastructure exit ${run.status}\n${output}`); process.exit(2) }
}
for (const [id, status] of results) console.log(`${id.padEnd(4)} ${status}`)
const killed = results.filter(([, status]) => status === 'KILLED').length
console.log(`Mutation score: ${Math.round(killed / variants.length * 100)}% (${killed}/${variants.length})`)
