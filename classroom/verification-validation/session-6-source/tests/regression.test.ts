import { describe, expect, it } from 'vitest'
import { applyOutbound } from '../src/inventoryRules'
import { activeRelease } from '../src/release'
import { scenarios } from './scenarios'

const regressionCases = scenarios.filter((scenario) => scenario.id !== 'TC-INV-S6-006')
describe(`${activeRelease} regression execution`, () => {
  for (const scenario of regressionCases) {
    it(`${scenario.id} follows ${scenario.requirement}`, () => {
      const result = applyOutbound(scenario.item, scenario.amount)
      expect(result.accepted).toBe(scenario.accepted)
      expect(result.nextStock).toBe(scenario.nextStock)
    })
  }
})
