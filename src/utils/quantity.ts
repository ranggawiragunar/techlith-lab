const wholeQuantityUnits = new Set(['pc', 'pcs', 'piece', 'pieces', 'cone', 'cones', 'unit', 'units'])

export function allowsFractionalQuantity(unit: string): boolean {
  return !wholeQuantityUnits.has(unit.trim().toLocaleLowerCase())
}

export function normalizeQuantity(value: number): number {
  return Number(value.toFixed(3))
}
