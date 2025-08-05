export interface Product {
  id: string
  name: string
  price: number
  stock: number
  category: string
  barcode?: string
  equivalents: string[]
  expiryDate?: Date
  supplier: string
  popularity: number
  costPrice: number
  margin: number
  description?: string
  dosage?: string
  activeIngredient?: string
  prescription: boolean
}

export interface SaleItem {
  productId: string
  product: Product
  quantity: number
  unitPrice: number
  total: number
}

export interface Sale {
  id: string
  date: Date
  customerId?: string
  customerName?: string
  items: SaleItem[]
  subtotal: number
  tax: number
  total: number
  paymentMethod: 'cash' | 'card' | 'insurance'
  cashierId: string
}

export interface Customer {
  id: string
  name: string
  phone?: string
  email?: string
  address?: string
  dateOfBirth?: Date
  allergies: string[]
  prescriptions: string[]
  lastVisit?: Date
  totalPurchases: number
  loyalty: 'bronze' | 'silver' | 'gold'
}

export interface InventoryAlert {
  id: string
  type: 'low_stock' | 'expired' | 'expiring_soon'
  productId: string
  message: string
  priority: 'low' | 'medium' | 'high'
  date: Date
}

export interface DashboardMetrics {
  dailySales: number
  dailyCustomers: number
  lowStockItems: number
  expiringItems: number
  topSellingProducts: Array<{
    product: Product
    quantity: number
    revenue: number
  }>
  salesByCategory: Array<{
    category: string
    amount: number
    percentage: number
  }>
  monthlyTrend: Array<{
    month: string
    sales: number
    profit: number
  }>
} 