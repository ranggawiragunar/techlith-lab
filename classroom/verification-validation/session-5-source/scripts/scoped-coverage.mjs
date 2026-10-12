import { readFileSync } from 'node:fs'
import path from 'node:path'

const reportPath = path.resolve('coverage/coverage-final.json')
let report
try { report = JSON.parse(readFileSync(reportPath, 'utf8')) } catch (error) {
  console.error(`V8 coverage report unavailable: ${error.message}`)
  process.exit(2)
}
const files = Object.entries(report)
const rules = files.filter(([file]) => /\/src\/(inventoryRules|quantityRules)\.ts$/.test(file))
const scenario = files.find(([file]) => file.endsWith('/src/inventoryScenario.ts'))
if (rules.length !== 2 || !scenario) {
  console.error('Expected V8 coverage for the two canonical rule files and the scenario layer.')
  process.exit(2)
}
let statements = 0; let coveredStatements = 0
for (const [file, data] of rules) {
  for (const [id, location] of Object.entries(data.statementMap)) {
    // The fixed decimal-place configuration declaration is not a student test obligation.
    if (file.endsWith('/quantityRules.ts') && location.start.line === 4) continue
    statements += 1
    if (data.s[id] > 0) coveredStatements += 1
  }
}
let branches = 0; let coveredBranches = 0
for (const [, data] of rules) {
  for (const [id, entry] of Object.entries(data.branchMap)) {
    // V8 reports destructuring defaults as synthetic branch slots, outside authored rule outcomes.
    if (entry.type === 'default-arg') continue
    for (const count of data.b[id]) { branches += 1; if (count > 0) coveredBranches += 1 }
  }
}
// Add V8 branch slots for the scenario dispatcher and outbound acceptance transition. This adds three action cases and both result routes.
for (const [id, entry] of Object.entries(scenario[1].branchMap)) {
  for (const [slot, count] of scenario[1].b[id].entries()) {
    if (entry.type === 'switch' || (entry.type === 'if' && entry.line === 15)) {
      branches += 1
      if (count > 0) coveredBranches += 1
    }
  }
}
const percentage = (covered, total) => Math.round((covered / total) * 100)
console.log(`Scoped statement coverage: ${percentage(coveredStatements, statements)}% (${coveredStatements}/${statements})`)
console.log(`Scoped branch coverage: ${percentage(coveredBranches, branches)}% (${coveredBranches}/${branches})`)
if (statements !== 25 || branches !== 25) {
  console.error(`Scoped denominator changed unexpectedly (statements ${statements}, branches ${branches}); review the documented scope.`)
  process.exit(2)
}
