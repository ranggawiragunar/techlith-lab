// M04 — controlled mutant: precision limit is extended from three to four decimals.
export function m04HasAllowedPrecision(amount: number): boolean {
  const fractionalDigits = amount.toString().split('.')[1]?.length ?? 0
  return fractionalDigits <= 4
}
