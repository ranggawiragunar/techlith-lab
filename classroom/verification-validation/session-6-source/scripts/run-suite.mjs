import { mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const [release, suite] = process.argv.slice(2)
const files = { acceptance: 'tests/execution.spec.ts', retest: 'tests/retest.spec.ts', regression: 'tests/regression.spec.ts' }
const expectedCounts = { acceptance: 6, retest: 1, regression: 5 }
if (!['RC1', 'RC2'].includes(release) || !(suite in files)) {
  console.error('Usage: node scripts/run-suite.mjs RC1|RC2 acceptance|retest|regression')
  process.exit(2)
}
const cwd = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const tempDir = mkdtempSync(path.join(tmpdir(), 'techlith-session6-'))
const reportPath = path.join(tempDir, 'vitest-results.json')
let result
try {
  result = spawnSync(process.execPath, [path.join(cwd, 'node_modules/vitest/vitest.mjs'), 'run', files[suite], '--reporter=json', `--outputFile=${reportPath}`], {
    cwd, encoding: 'utf8', env: { ...process.env, TECHLITH_RELEASE: release },
  })
  if (result.stdout) process.stdout.write(result.stdout)
  if (result.stderr) process.stderr.write(result.stderr)
  if (result.error || result.status === null) throw new Error(result.error?.message ?? 'Vitest process did not return an exit status.')
  let report
  try { report = JSON.parse(readFileSync(reportPath, 'utf8')) } catch { throw new Error(`Vitest did not write a readable JSON result; exit ${result.status}.`) }
  const testResults = report.testResults ?? []
  const assertions = testResults.flatMap((fileResult) => fileResult.assertionResults ?? [])
  if (testResults.length !== 1 || assertions.length !== expectedCounts[suite] || testResults.some((fileResult) => fileResult.message && !fileResult.assertionResults?.length)) {
    throw new Error(`Infrastructure/configuration error: expected ${expectedCounts[suite]} executed cases, observed ${assertions.length}.`)
  }
  const failed = assertions.filter((test) => test.status !== 'passed')
  const passed = assertions.length - failed.length
  for (const test of assertions) {
    const id = test.fullName.match(/TC-INV-S6-\d{3}/)?.[0] ?? test.fullName
    console.log(`${id} ${test.status === 'passed' ? 'PASS' : 'FAIL'}`)
  }
  console.log(`${release} ${suite}: ${passed} PASS / ${failed.length} FAIL / ${assertions.length} total`)
  if ((result.status === 0 && failed.length > 0) || (result.status !== 0 && failed.length === 0)) {
    throw new Error(`Vitest exit status ${result.status} disagrees with JSON assertion results.`)
  }
  process.exitCode = failed.length > 0 ? 1 : 0
} catch (error) {
  console.error(`Suite infrastructure error: ${error.message}`)
  process.exitCode = 2
} finally {
  rmSync(tempDir, { recursive: true, force: true })
}
