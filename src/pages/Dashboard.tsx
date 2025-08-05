import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line, BarChart, Bar, Tooltip, Cell } from 'recharts'
import { 
  TrendingUp, 
  Users, 
  Package, 
  Clock, 
  AlertTriangle, 
  Pill 
} from 'lucide-react'
import { mockSales, mockProducts } from '@/data/mockData'

// Fonction pour formater les grands nombres
const formatNumber = (value: number) => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`
  }
  return value.toString()
}

// Couleurs pour les graphiques
const CHART_COLORS = {
  primary: '#0088FE',
  secondary: '#00C49F',
  tertiary: '#FFBB28',
  quaternary: '#FF8042',
  quinary: '#8884D8'
}

const calculateMetrics = () => {
  const today = new Date()
  const todaySales = mockSales.filter(sale => 
    sale.date.toDateString() === today.toDateString()
  )
  
  const dailySales = todaySales.reduce((sum, sale) => sum + sale.total, 0)
  const dailyCustomers = new Set(todaySales.map(sale => sale.customerId)).size
  
  const lowStockItems = mockProducts.filter(product => product.stock < 10).length
  const expiringItems = mockProducts.filter(product => 
    product.expiryDate && 
    (product.expiryDate.getTime() - today.getTime()) < (90 * 24 * 60 * 60 * 1000)
  ).length

  return {
    dailySales,
    dailyCustomers,
    lowStockItems,
    expiringItems
  }
}

const calculateSalesByCategory = () => {
  // Utiliser directement les valeurs réalistes définies
  const realisticValues = {
    'Antalgiques': 2850000,
    'Antibiotiques': 2420000,
    'Hygiène': 1980000,
    'Vitamines': 750000,
    'Autres': 520000
  }
  
  const allCategories = ['Antalgiques', 'Antibiotiques', 'Hygiène', 'Vitamines', 'Autres']
  
  return allCategories.map((category) => ({
    category,
    amount: realisticValues[category as keyof typeof realisticValues]
  }))
}

const calculateMonthlyTrend = () => {
  const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin']
  return months.map((month) => ({
    month,
    sales: Math.floor(Math.random() * 2000000) + 500000,
    profit: Math.floor(Math.random() * 800000) + 200000
  }))
}

export default function Dashboard() {
  const metrics = calculateMetrics()
  const salesByCategory = calculateSalesByCategory()
  const monthlyTrend = calculateMonthlyTrend()

  const stockAlerts = [
    { type: 'expiry', message: 'Clamoxyl 1g - Expiration dans 30 jours', priority: 'high' },
    { type: 'low_stock', message: 'Paracétamol 500mg - Stock faible (15 unités)', priority: 'medium' },
    { type: 'low_stock', message: 'Clamoxyl 1g - Stock faible (25 unités)', priority: 'high' }
  ]

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Tableau de bord</h1>
        <p className="text-muted-foreground mt-1 text-sm sm:text-base">Vue d'ensemble de votre pharmacie</p>
      </div>

      <Separator />

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        <Card className="min-h-[120px] sm:min-h-[140px]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Ventes du jour</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-xl lg:text-2xl font-bold">{formatNumber(metrics.dailySales)} FCFA</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              +12,5% vs hier
            </p>
          </CardContent>
        </Card>

        <Card className="min-h-[120px] sm:min-h-[140px]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Clients du jour</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-xl lg:text-2xl font-bold">{metrics.dailyCustomers}</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              +8,2% vs hier
            </p>
          </CardContent>
        </Card>

        <Card className="min-h-[120px] sm:min-h-[140px]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Stock faible</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-xl lg:text-2xl font-bold text-orange-600 dark:text-orange-400">{metrics.lowStockItems}</div>
            <p className="text-xs text-muted-foreground">
              Produits sous le seuil
            </p>
          </CardContent>
        </Card>

        <Card className="min-h-[120px] sm:min-h-[140px]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Expirations proches</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-xl lg:text-2xl font-bold text-red-600 dark:text-red-400">{metrics.expiringItems}</div>
            <p className="text-xs text-muted-foreground">
              Dans les 90 jours
            </p>
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Sales by Category */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Ventes par catégorie</CardTitle>
            <CardDescription className="text-sm">Répartition du chiffre d'affaires</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
              <BarChart data={salesByCategory}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="category" 
                  tick={{ fontSize: 10 }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis tickFormatter={formatNumber} />
                <Tooltip formatter={(value: number) => [`${value.toLocaleString()} FCFA`, 'Montant']} />
                <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                  {salesByCategory.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={Object.values(CHART_COLORS)[index % Object.keys(CHART_COLORS).length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Monthly Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Évolution mensuelle</CardTitle>
            <CardDescription className="text-sm">Ventes et profits des 6 derniers mois</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
              <LineChart data={monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={formatNumber} />
                <Tooltip formatter={(value: number) => [`${value.toLocaleString()} FCFA`, 'Montant']} />
                <Line type="monotone" dataKey="sales" stroke={CHART_COLORS.primary} strokeWidth={2} name="Ventes" />
                <Line type="monotone" dataKey="profit" stroke={CHART_COLORS.secondary} strokeWidth={2} name="Profits" />
              </LineChart>
            </ResponsiveContainer>
            {/* Légende personnalisée */}
            <div className="flex justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: CHART_COLORS.primary }}></div>
                <span className="text-xs text-muted-foreground">Ventes</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: CHART_COLORS.secondary }}></div>
                <span className="text-xs text-muted-foreground">Profits</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* Alerts and Popular Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Stock Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Alertes stock
            </CardTitle>
            <CardDescription className="text-sm">Actions requises</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4">
            {stockAlerts.map((alert, index) => (
              <div key={index}>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-muted/50 rounded-lg gap-2">
                  <div className="flex-1">
                    <p className="text-xs sm:text-sm font-medium">{alert.message}</p>
                  </div>
                  <Badge variant={alert.priority === 'high' ? 'destructive' : 'secondary'} className="self-start sm:self-auto">
                    {alert.priority === 'high' ? 'Urgent' : 'Moyen'}
                  </Badge>
                </div>
                {index < stockAlerts.length - 1 && <Separator className="mt-3 sm:mt-4" />}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <Pill className="h-5 w-5 text-primary" />
              Produits populaires
            </CardTitle>
            <CardDescription className="text-sm">Plus vendus cette semaine</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4">
            {mockProducts.slice(0, 5).map((product, index) => (
              <div key={product.id}>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0">
                  <div className="flex-1">
                    <p className="font-medium text-xs sm:text-sm">{product.name}</p>
                    <p className="text-xs text-muted-foreground">{product.category}</p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="font-semibold text-sm sm:text-base">{product.price.toLocaleString()} FCFA</p>
                    <p className="text-xs text-muted-foreground">Stock: {product.stock}</p>
                  </div>
                </div>
                {index < 4 && <Separator className="mt-3 sm:mt-4" />}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 