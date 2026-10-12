import { verificationValidationCourse } from './courseConfig'

const sessionPaths = {
  1: `${verificationValidationCourse.baseRoute}/session-1`,
  2: `${verificationValidationCourse.baseRoute}/session-2`,
  3: `${verificationValidationCourse.baseRoute}/session-3`,
} as const

const sessionNestedPaths = {
  1: sessionPaths[1].slice('/admin/'.length),
  2: sessionPaths[2].slice('/admin/'.length),
  3: sessionPaths[3].slice('/admin/'.length),
} as const

export const verificationValidationRoutes = {
  basePath: verificationValidationCourse.baseRoute,
  nestedPath: verificationValidationCourse.baseRoute.slice('/admin/'.length),
  sessionPaths,
  sessionNestedPaths,
} as const

export function getVerificationValidationSessionPath(sessionNumber: number): string | undefined {
  return sessionPaths[sessionNumber as keyof typeof sessionPaths]
}
