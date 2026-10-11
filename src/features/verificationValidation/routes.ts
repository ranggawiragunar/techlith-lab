import { verificationValidationCourse } from './courseConfig'

export const verificationValidationRoutes = {
  basePath: verificationValidationCourse.baseRoute,
  nestedPath: verificationValidationCourse.baseRoute.slice('/admin/'.length),
} as const
