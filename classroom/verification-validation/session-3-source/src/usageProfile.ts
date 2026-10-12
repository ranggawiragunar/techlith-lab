import type { UsageProfileEntry } from './types'

// Classroom operational profile for prioritization exercises; not production telemetry.
export const usageProfile: readonly UsageProfileEntry[] = [
  { activity: 'View Inventory', frequencyPercent: 35 },
  { activity: 'Stock Inbound', frequencyPercent: 25 },
  { activity: 'Stock Outbound', frequencyPercent: 25 },
  { activity: 'Stock History', frequencyPercent: 10 },
  { activity: 'Archive / Restore', frequencyPercent: 5 },
]

export function usageProfileTotal(): number {
  return usageProfile.reduce((total, entry) => total + entry.frequencyPercent, 0)
}
