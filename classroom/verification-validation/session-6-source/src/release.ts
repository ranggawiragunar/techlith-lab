import { env } from 'node:process'
import type { ReleaseCandidate } from './types'

const candidate = env.TECHLITH_RELEASE
if (candidate !== 'RC1' && candidate !== 'RC2') {
  throw new Error('TECHLITH_RELEASE must be set to RC1 or RC2 by the named runner command.')
}
export const activeRelease: ReleaseCandidate = candidate
