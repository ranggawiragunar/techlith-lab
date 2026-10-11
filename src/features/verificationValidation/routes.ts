import { verificationValidationCourse } from './courseConfig'

export const verificationValidationRoutes = {
  basePath: verificationValidationCourse.baseRoute,
  nestedPath: verificationValidationCourse.baseRoute.slice('/admin/'.length),
  session1Path: `${verificationValidationCourse.baseRoute}/session-1`,
  session1NestedPath: `${verificationValidationCourse.baseRoute.slice('/admin/'.length)}/session-1`,
} as const
