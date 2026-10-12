// M01 — controlled mutant: zero quantity can pass the positivity condition.
export function m01IsPositive(amount: number): boolean {
  return amount >= 0
}
