import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { 
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer
} from 'recharts'
import { 
  Search, 
  Users, 
  Phone, 
  Mail, 
  MapPin
} from 'lucide-react'
import { mockCustomers, mockSales } from '@/data/mockData'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

// Enhanced customer data with purchase history
const enhancedCustomers = mockCustomers.map(customer => {
  const customerSales = mockSales.filter(sale => sale.customerId === customer.id)
  const totalPurchases = customerSales.reduce((sum, sale) => sum + sale.total, 0)
  const lastPurchase = customerSales.sort((a, b) => b.date.getTime() - a.date.getTime())[0]
  
  return {
    ...customer,
    purchaseHistory: customerSales,
    totalPurchases,
    lastPurchase: lastPurchase?.date,
    visitCount: customerSales.length
  }
})

// Customer analytics data
const customerAnalytics = {
  totalCustomers: enhancedCustomers.length,
  activeCustomers: enhancedCustomers.filter(c => c.lastPurchase && 
    (new Date().getTime() - c.lastPurchase.getTime()) / (1000 * 60 * 60 * 24) <= 30).length,
  averagePurchase: enhancedCustomers.reduce((sum, c) => sum + c.totalPurchases, 0) / enhancedCustomers.length,
  loyaltyDistribution: {
    gold: enhancedCustomers.filter(c => c.loyalty === 'gold').length,
    silver: enhancedCustomers.filter(c => c.loyalty === 'silver').length,
    bronze: enhancedCustomers.filter(c => c.loyalty === 'bronze').length
  }
}

const monthlyCustomerTrend = [
  { month: 'Jan', new: 45, active: 120 },
  { month: 'Fév', new: 38, active: 115 },
  { month: 'Mar', new: 52, active: 128 },
  { month: 'Avr', new: 41, active: 122 },
  { month: 'Mai', new: 48, active: 135 },
  { month: 'Juin', new: 55, active: 142 }
]

export default function Customers() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCustomer, setSelectedCustomer] = useState<(typeof enhancedCustomers)[0] | null>(null)

  // Filter customers based on search
  const filteredCustomers = enhancedCustomers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (customer.phone && customer.phone.includes(searchTerm)) ||
    (customer.email && customer.email.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const handleCustomerClick = (customer: typeof enhancedCustomers[0]) => {
    setSelectedCustomer(customer)
  }

  const handleBackToList = () => {
    setSelectedCustomer(null)
  }

  if (selectedCustomer) {
    return (
      <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
        {/* Customer Detail Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <Button variant="outline" onClick={handleBackToList} className="text-sm">
              ← Retour à la liste
            </Button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{selectedCustomer.name}</h1>
              <p className="text-muted-foreground mt-1 text-sm sm:text-base">Détails du client et historique d'achats</p>
            </div>
          </div>
          <Badge variant={
            selectedCustomer.loyalty === 'gold' ? 'default' : 
            selectedCustomer.loyalty === 'silver' ? 'secondary' : 'outline'
          } className="self-start sm:self-auto text-xs sm:text-sm">
            Membre {selectedCustomer.loyalty.toUpperCase()}
          </Badge>
        </div>

        <Separator />

        {/* Customer Info Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Users className="h-5 w-5" />
                Informations de contact
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm sm:text-base">{selectedCustomer.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs sm:text-sm">{selectedCustomer.email}</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                <span className="text-xs sm:text-sm">{selectedCustomer.address}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Résumé des achats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Total des achats :</span>
                <span className="font-semibold">{selectedCustomer.totalPurchases.toLocaleString()} FCFA</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Nombre de visites :</span>
                <span className="font-semibold">{selectedCustomer.visitCount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Dernière visite :</span>
                <span className="text-xs sm:text-sm">
                  {selectedCustomer.lastPurchase ? 
                    selectedCustomer.lastPurchase.toLocaleDateString('fr-FR') : 'Jamais'}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Informations médicales</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Groupe sanguin :</span>
                <span className="font-semibold">Non renseigné</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Allergies :</span>
                <span className="text-xs sm:text-sm">Aucune</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Médicaments en cours :</span>
                <span className="text-xs sm:text-sm">Aucun</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Separator />

        {/* Purchase History */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Historique des achats</CardTitle>
            <CardDescription className="text-sm">Détail de tous les achats effectués</CardDescription>
          </CardHeader>
          <CardContent>
            {selectedCustomer.purchaseHistory.length === 0 ? (
              <p className="text-center text-muted-foreground py-8 text-sm">Aucun achat enregistré</p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs sm:text-sm">Date</TableHead>
                      <TableHead className="text-xs sm:text-sm">Produits</TableHead>
                      <TableHead className="text-xs sm:text-sm">Total</TableHead>
                      <TableHead className="text-xs sm:text-sm">Statut</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedCustomer.purchaseHistory.map((sale, index) => (
                      <TableRow key={index}>
                        <TableCell className="text-xs sm:text-sm">
                          {sale.date.toLocaleDateString('fr-FR')}
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm">
                          {sale.items.length} produit(s)
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm font-semibold">
                          {sale.total.toLocaleString()} FCFA
                        </TableCell>
                        <TableCell>
                          <Badge variant="default" className="text-xs">Payé</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Clients</h1>
        <p className="text-muted-foreground mt-1 text-sm sm:text-base">Gestion et analyse de la clientèle</p>
      </div>

      <Separator />

      {/* Analytics Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        <Card className="min-h-[120px] sm:min-h-[140px]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Total Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-xl lg:text-2xl font-bold">{customerAnalytics.totalCustomers}</div>
            <p className="text-xs text-muted-foreground">Clients enregistrés</p>
          </CardContent>
        </Card>

        <Card className="min-h-[120px] sm:min-h-[140px]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Clients Actifs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-xl lg:text-2xl font-bold">{customerAnalytics.activeCustomers}</div>
            <p className="text-xs text-muted-foreground">Achats récents (30j)</p>
          </CardContent>
        </Card>

        <Card className="min-h-[120px] sm:min-h-[140px]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Panier Moyen</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-xl lg:text-2xl font-bold">{customerAnalytics.averagePurchase.toLocaleString()} FCFA</div>
            <p className="text-xs text-muted-foreground">Par client</p>
          </CardContent>
        </Card>

        <Card className="min-h-[120px] sm:min-h-[140px]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Fidélité</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-xl lg:text-2xl font-bold">{customerAnalytics.loyaltyDistribution.gold}</div>
            <p className="text-xs text-muted-foreground">Membres Gold</p>
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Évolution mensuelle</CardTitle>
            <CardDescription className="text-sm">Nouveaux clients vs clients actifs</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
              <LineChart data={monthlyCustomerTrend}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="month" />
                <YAxis />
                <Line type="monotone" dataKey="new" stroke="#0088FE" strokeWidth={2} name="Nouveaux" />
                <Line type="monotone" dataKey="active" stroke="#00C49F" strokeWidth={2} name="Actifs" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Répartition fidélité</CardTitle>
            <CardDescription className="text-sm">Distribution par niveau de fidélité</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Gold</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 sm:w-32 bg-yellow-200 dark:bg-yellow-800 h-2 rounded-full">
                    <div 
                      className="bg-yellow-500 h-2 rounded-full" 
                      style={{ width: `${(customerAnalytics.loyaltyDistribution.gold / customerAnalytics.totalCustomers) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold">{customerAnalytics.loyaltyDistribution.gold}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Silver</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 sm:w-32 bg-gray-200 dark:bg-gray-700 h-2 rounded-full">
                    <div 
                      className="bg-gray-500 h-2 rounded-full" 
                      style={{ width: `${(customerAnalytics.loyaltyDistribution.silver / customerAnalytics.totalCustomers) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold">{customerAnalytics.loyaltyDistribution.silver}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Bronze</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 sm:w-32 bg-orange-200 dark:bg-orange-800 h-2 rounded-full">
                    <div 
                      className="bg-orange-500 h-2 rounded-full" 
                      style={{ width: `${(customerAnalytics.loyaltyDistribution.bronze / customerAnalytics.totalCustomers) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold">{customerAnalytics.loyaltyDistribution.bronze}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* Customer List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Liste des clients</CardTitle>
          <CardDescription className="text-sm">Recherchez et gérez vos clients</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 sm:h-5 sm:w-5" />
            <Input
              placeholder="Rechercher par nom, téléphone ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 sm:pl-10 text-sm"
            />
          </div>

          {/* Customer Table */}
          {filteredCustomers.length === 0 ? (
            <p className="text-center text-muted-foreground py-8 text-sm">Aucun client trouvé</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs sm:text-sm">Client</TableHead>
                    <TableHead className="text-xs sm:text-sm">Contact</TableHead>
                    <TableHead className="text-xs sm:text-sm">Fidélité</TableHead>
                    <TableHead className="text-xs sm:text-sm">Achats</TableHead>
                    <TableHead className="text-xs sm:text-sm">Dernière visite</TableHead>
                    <TableHead className="text-xs sm:text-sm">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCustomers.map((customer) => (
                    <TableRow key={customer.id} className="cursor-pointer hover:bg-accent">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback className="text-xs sm:text-sm">
                              {customer.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold text-xs sm:text-sm">{customer.name}</p>
                            <p className="text-xs text-muted-foreground">{customer.address}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="text-xs sm:text-sm">{customer.phone}</p>
                          <p className="text-xs text-muted-foreground">{customer.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          customer.loyalty === 'gold' ? 'default' : 
                          customer.loyalty === 'silver' ? 'secondary' : 'outline'
                        } className="text-xs">
                          {customer.loyalty.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-center">
                          <p className="font-semibold text-xs sm:text-sm">{customer.totalPurchases.toLocaleString()} FCFA</p>
                          <p className="text-xs text-muted-foreground">{customer.visitCount} visites</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-xs sm:text-sm">
                          {customer.lastPurchase ? 
                            customer.lastPurchase.toLocaleDateString('fr-FR') : 'Jamais'}
                        </p>
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleCustomerClick(customer)}
                          className="text-xs"
                        >
                          Voir détails
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 