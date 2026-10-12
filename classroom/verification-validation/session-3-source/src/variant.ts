export type MutantId = 'REFERENCE' | 'M01' | 'M02' | 'M03' | 'M04'

const runtime = globalThis as typeof globalThis & { process?: { env?: Record<string, string | undefined> } }
const requested = runtime.process?.env?.TECHLITH_MUTANT ?? 'REFERENCE'
const allowed: MutantId[] = ['REFERENCE', 'M01', 'M02', 'M03', 'M04']
if (!allowed.includes(requested as MutantId)) throw new Error(`Unknown mutation variant: ${requested}`)

export const activeVariant = requested as MutantId
