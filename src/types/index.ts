export type DeliveryOption = {
  id: string
  name: string
  code: string
  price: number
  priceDisplay: string
  deliveryTime: string
  description: string
  situations: string[]
  notes: string[]
  restrictions?: string
  coverage: string
  cities: string[]
  postalRanges?: [number, number][]
  keywords: string[]
}

export type CodeItem = {
  id: string
  code: string
  name: string
  category: string
  description: string
  whenToUse: string
  whenNotToUse: string
  related?: string
  keywords: string[]
}

export type Discount = {
  id: string
  name: string
  section: 'rule' | 'category' | 'series' | 'bed'
  value: string
  description: string
  note?: string
  requiresApproval: boolean
  examples: string[]
  keywords: string[]
}

export type ProductRule = {
  id: string
  name: string
  category: string
  description: string
  rules: string[]
  keywords: string[]
}

export type OrderProcedure = {
  id: string
  title: string
  description: string
  steps: string[]
  keywords: string[]
}

export type ReturnProcedure = {
  id: string
  title: string
  description: string
  steps: string[]
  keywords: string[]
}

export type SystemItem = {
  id: string
  name: string
  description: string
  usedFor: string[]
  keywords: string[]
}

export type Contact = {
  id: string
  name: string
  role: string
  department: string
  phone: string
  email: string
  keywords: string[]
}

export type UpdateItem = {
  id: string
  date: string
  category: string
  title: string
  description: string
  importance: 'low' | 'medium' | 'high'
  lastUpdated: string
}

export type SearchableItem = {
  type: 'delivery' | 'code' | 'discount' | 'product' | 'order' | 'return' | 'system' | 'contact' | 'update'
  id: string
  title: string
  subtitle?: string
  description?: string
  category?: string
  code?: string
  keywords: string[]
  url: string
}

export type FavoritesKey = `${SearchableItem['type']}:${string}`

export type AppData = {
  deliveryOptions: DeliveryOption[]
  codes: CodeItem[]
  discounts: Discount[]
  productRules: ProductRule[]
  orderProcedures: OrderProcedure[]
  returnProcedures: ReturnProcedure[]
  systems: SystemItem[]
  contacts: Contact[]
  updates: UpdateItem[]
}
