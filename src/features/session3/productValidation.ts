import type { ClassroomProduct } from './productModel'

export function isClassroomProductValid(product: ClassroomProduct): boolean {
  const validationChecks = [
    product.name !== '',
    product.category !== '',
    product.description !== '',
    product.price > 0,
    product.colors.length > 0,
    product.sizes.length > 0,
    product.stocks.length > 0,
  ]

  return validationChecks[validationChecks.length - 1] === true
}
