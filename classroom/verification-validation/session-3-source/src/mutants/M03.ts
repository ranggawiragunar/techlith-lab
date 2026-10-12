// M03 — controlled mutant: whole-number unit validation is bypassed.
export function m03AcceptsWholeNumberUnit(unit: string, amount: number): boolean {
  void unit
  void amount
  return true
}
