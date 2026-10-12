import { mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const cwd = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const mutants = [
  ['M01', 'Zero may pass the positive-quantity boundary'],
  ['M02', 'Exact-stock may be rejected'],
  ['M03', 'Whole-number unit validation is bypassed'],
  ['M04', 'A fourth decimal place may be accepted'],
]
const args = process.argv.slice(2)
if (args.length === 1 && args[0] === '--list') {
  for (const [id, description] of mutants) console.log(`${id}: ${description}`)
  process.exit(0)
}
const selected = args.length === 2 && args[0] === '--mutant' ? mutants.find(([id]) => id === args[1]) : undefined
const summary = args.length === 1 && args[0] === '--summary'
if (!selected && !summary) {
  console.error('Usage: npm run mutation -- --list | --mutant M01|M02|M03|M04 | --summary')
  process.exit(2)
}

function execute([id]) {
  const tempDir = mkdtempSync(path.join(tmpdir(), 'techlith-session3-mutation-'))
  const reportPath = path.join(tempDir, 'vitest-results.json')
  try {
    const run = spawnSync(process.execPath, ['node_modules/vitest/vitest.mjs', 'run', 'tests', '--coverage.enabled=false', '--reporter=json', `--outputFile=${reportPath}`], {
      cwd, encoding: 'utf8', env: { ...process.env, TECHLITH_MUTANT: id },
    })
    if (run.stdout) process.stdout.write(run.stdout)
    if (run.stderr) process.stderr.write(run.stderr)
    if (run.error || run.status === null) throw new Error(run.error?.message ?? 'Vitest did not return an exit status.')
    let report
    try { report = JSON.parse(readFileSync(reportPath, 'utf8')) } catch { throw new Error(`Vitest did not write a readable JSON report (exit ${run.status}).`) }
    const files = report.testResults ?? []
    const assertions = files.flatMap((file) => file.assertionResults ?? [])
    if (!files.length || !assertions.length || files.some((file) => file.message && !file.assertionResults?.length)) {
      throw new Error(`No valid test assertions were reported for ${id}.`)
    }
    const failed = assertions.filter((test) => test.status !== 'passed').length
    const passed = assertions.length - failed
    if ((run.status === 0 && failed) || (run.status !== 0 && !failed) || ![0, 1].includes(run.status)) {
      throw new Error(`Vitest exit status ${run.status} disagrees with ${failed} failed assertion(s).`)
    }
    return { id, status: failed ? 'KILLED' : 'SURVIVED', passed, failed, total: assertions.length }
  } finally {
    rmSync(tempDir, { recursive: true, force: true })
  }
}

try {
  const results = summary ? mutants.map(execute) : [execute(selected)]
  for (const result of results) console.log(`${result.id} ${result.status} (${result.passed} PASS / ${result.failed} FAIL / ${result.total} total)`)
  if (summary) {
    const killed = results.filter((result) => result.status === 'KILLED').length
    console.log(`Mutation score: ${Math.round(killed / results.length * 100)}% (${killed}/${results.length})`)
  }
} catch (error) {
  console.error(`Mutation infrastructure error: ${error.message}`)
  process.exitCode = 2
}
