import { describe, expect, it } from 'vitest'
import { applyOutbound } from '../src/inventoryRules'
import { activeRelease } from '../src/release'
import { scenarios } from './scenarios'

const retestCase = scenarios.find((scenario) => scenario.id === 'TC-INV-S6-002')!
describe(`${activeRelease} focused retest`, () => {
  it(`${retestCase.id} follows ${retestCase.requirement}`, () => {
    const result = applyOutbound(retestCase.item, retestCase.amount)
    expect(result.accepted).toBe(false)
    expect(result.nextStock).toBe(retestCase.item.stock)
  })
})
