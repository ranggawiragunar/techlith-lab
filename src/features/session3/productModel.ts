export interface ClassroomStockConfiguration {
  color: string
  size: string
  amount: number
}

export interface ClassroomProduct {
  name: string
  category: string
  description: string
  price: number
  colors: string[]
  sizes: string[]
  stocks: ClassroomStockConfiguration[]
}
