import { describe, expect, it } from 'vitest'
import { applyOutbound } from '../src/inventoryRules'
import { activeRelease } from '../src/release'
import { scenarios } from './scenarios'

describe(`${activeRelease} acceptance execution`, () => {
  for (const scenario of scenarios) {
    it(`${scenario.id} follows ${scenario.requirement}`, () => {
      const result = applyOutbound(scenario.item, scenario.amount)
      expect(result.accepted).toBe(scenario.accepted)
      expect(result.nextStock).toBe(scenario.nextStock)
      if (!scenario.accepted) expect(result.previousStock).toBe(result.nextStock)
      if (scenario.accepted) expect(result.previousStock - result.amount).toBe(result.nextStock)
    })
  }
})
