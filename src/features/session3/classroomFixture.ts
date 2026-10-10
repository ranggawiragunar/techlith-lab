import type { ClassroomItem } from './classroomModel'

export const CLASSROOM_BASELINE: readonly ClassroomItem[] = Object.freeze([
  Object.freeze({ code: 'ITM-001', name: 'Kain Katun', stock: 10, unit: 'meter' }),
  Object.freeze({ code: 'ITM-002', name: 'Benang Hitam', stock: 5, unit: 'roll' }),
  Object.freeze({ code: 'ITM-003', name: 'Resleting', stock: 100, unit: 'pcs' }),
])

export function createClassroomBaseline(): ClassroomItem[] {
  return CLASSROOM_BASELINE.map((item) => ({ ...item }))
}
