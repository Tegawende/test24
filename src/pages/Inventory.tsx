import { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import { useToast } from '@/components/ui/use-toast'
import * as XLSX from 'xlsx'
import { 
  Search, 
  Filter, 
  Plus, 
  Package, 
  AlertTriangle, 
  Calendar,
  Truck,
  Edit,
  Download
} from 'lucide-react'
import { mockProducts, categories } from '@/data/mockData'

export default function Inventory() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Tous')
  const [sortBy, setSortBy] = useState<'name' | 'stock' | 'expiry' | 'price'>('name')
  const [showLowStock, setShowLowStock] = useState(false)
  const [showExpiring, setShowExpiring] = useState(false)
  const [isAddProductOpen, setIsAddProductOpen] = useState(false)
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    stock: '',
    category: '',
    supplier: '',
    costPrice: '',
    description: '',
    prescription: false
  })

  const { toast } = useToast()

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = mockProducts.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.category.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesCategory = selectedCategory === 'Tous' || product.category === selectedCategory
      
      const matchesLowStock = !showLowStock || product.stock < 50
      
      const matchesExpiring = !showExpiring || (product.expiryDate && 
        Math.ceil((product.expiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) <= 90)
      
      return matchesSearch && matchesCategory && matchesLowStock && matchesExpiring
    })

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'stock':
          return a.stock - b.stock
        case 'expiry':
          if (!a.expiryDate && !b.expiryDate) return 0
          if (!a.expiryDate) return 1
          if (!b.expiryDate) return -1
          return a.expiryDate.getTime() - b.expiryDate.getTime()
        case 'price':
          return a.price - b.price
        default:
          return 0
      }
    })

    return filtered
  }, [searchTerm, selectedCategory, sortBy, showLowStock, showExpiring])

  // Calculate inventory stats
  const inventoryStats = useMemo(() => {
    const totalProducts = mockProducts.length
    const totalValue = mockProducts.reduce((sum, product) => sum + (product.price * product.stock), 0)
    const lowStockCount = mockProducts.filter(product => product.stock < 50).length
    const expiringCount = mockProducts.filter(product => {
      if (!product.expiryDate) return false
      const daysDiff = Math.ceil((product.expiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
      return daysDiff <= 90 && daysDiff > 0
    }).length

    return { totalProducts, totalValue, lowStockCount, expiringCount }
  }, [])

  const getStockStatus = (stock: number) => {
    if (stock <= 10) return { label: 'Critique', variant: 'destructive' as const, color: 'text-red-600 dark:text-red-400' }
    if (stock <= 30) return { label: 'Faible', variant: 'secondary' as const, color: 'text-orange-600 dark:text-orange-400' }
    if (stock <= 50) return { label: 'Moyen', variant: 'outline' as const, color: 'text-yellow-600 dark:text-yellow-400' }
    return { label: 'Bon', variant: 'default' as const, color: 'text-green-600 dark:text-green-400' }
  }

  const getExpiryStatus = (expiryDate?: Date) => {
    if (!expiryDate) return null
    
    const today = new Date()
    const daysDiff = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    
    if (daysDiff <= 0) return { label: 'Expiré', variant: 'destructive' as const }
    if (daysDiff <= 30) return { label: `${daysDiff}j`, variant: 'destructive' as const }
    if (daysDiff <= 90) return { label: `${daysDiff}j`, variant: 'secondary' as const }
    return { label: `${daysDiff}j`, variant: 'outline' as const }
  }

  const handleAddProduct = () => {
    // Simulate adding product
    console.log('Nouveau produit:', newProduct)
    
    toast({
      title: "Produit ajouté",
      description: `Le produit "${newProduct.name}" a été ajouté avec succès.`,
    })
    
    // Reset form
    setNewProduct({
      name: '',
      price: '',
      stock: '',
      category: '',
      supplier: '',
      costPrice: '',
      description: '',
      prescription: false
    })
    setIsAddProductOpen(false)
  }

  // Export Excel function
  const exportToExcel = () => {
    try {
      // Prepare data for Excel
      const excelData = filteredProducts.map(product => {
        const stockStatus = getStockStatus(product.stock)
        const daysToExpiry = product.expiryDate ? 
          Math.ceil((product.expiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : 
          'N/A'
        
        return {
          'Nom du Produit': product.name,
          'Description': product.description || '',
          'Catégorie': product.category,
          'Fournisseur': product.supplier,
          'Code-barres': product.barcode || '',
          'Prix de Vente (FCFA)': product.price,
          'Prix d\'Achat (FCFA)': product.costPrice,
          'Marge (%)': product.margin,
          'Stock Actuel': product.stock,
          'Statut Stock': stockStatus.label,
          'Date d\'Expiration': product.expiryDate ? product.expiryDate.toLocaleDateString('fr-FR') : 'N/A',
          'Jours avant Expiration': daysToExpiry,
          'Ordonnance Requise': product.prescription ? 'Oui' : 'Non'
        }
      })

      // Create workbook and worksheet
      const workbook = XLSX.utils.book_new()
      const worksheet = XLSX.utils.json_to_sheet(excelData)

      // Set column widths
      const columnWidths = [
        { wch: 25 }, // Nom du Produit
        { wch: 30 }, // Description
        { wch: 15 }, // Catégorie
        { wch: 20 }, // Fournisseur
        { wch: 15 }, // Code-barres
        { wch: 18 }, // Prix de Vente
        { wch: 18 }, // Prix d'Achat
        { wch: 12 }, // Marge
        { wch: 12 }, // Stock Actuel
        { wch: 15 }, // Statut Stock
        { wch: 18 }, // Date d'Expiration
        { wch: 20 }, // Jours avant Expiration
        { wch: 18 }, // Ordonnance Requise
      ]
      worksheet['!cols'] = columnWidths

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Inventaire')

      // Generate filename with current date
      const fileName = `inventaire_${new Date().toISOString().split('T')[0]}.xlsx`

      // Save file
      XLSX.writeFile(workbook, fileName)

      toast({
        title: "Export réussi",
        description: `Le fichier Excel "${fileName}" a été téléchargé avec succès.`,
      })
    } catch (error) {
      toast({
        title: "Erreur d'export",
        description: "Une erreur s'est produite lors de l'export Excel.",
        variant: "destructive",
      })
      console.error('Erreur export Excel:', error)
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Inventaire</h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">Gérez vos stocks et approvisionnements</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <Button variant="outline" onClick={exportToExcel} className="text-sm">
            <Download className="h-4 w-4 mr-2" />
            Exporter Excel
          </Button>
          <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
            <DialogTrigger asChild>
              <Button className="text-sm">
                <Plus className="h-4 w-4 mr-2" />
                Nouveau Produit
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-lg sm:text-xl">Ajouter un nouveau produit</DialogTitle>
                <DialogDescription className="text-sm">
                  Saisissez les informations du nouveau produit ci-dessous.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                  <Label htmlFor="name" className="text-sm sm:text-right">Nom</Label>
                  <Input
                    id="name"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                    className="col-span-1 sm:col-span-3"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                  <Label htmlFor="price" className="text-sm sm:text-right">Prix (FCFA)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                    className="col-span-1 sm:col-span-3"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                  <Label htmlFor="stock" className="text-sm sm:text-right">Stock</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                    className="col-span-1 sm:col-span-3"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                  <Label htmlFor="category" className="text-sm sm:text-right">Catégorie</Label>
                  <Select value={newProduct.category} onValueChange={(value) => setNewProduct({...newProduct, category: value})}>
                    <SelectTrigger className="col-span-1 sm:col-span-3">
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.filter(cat => cat !== 'Tous').map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                  <Label htmlFor="supplier" className="text-sm sm:text-right">Fournisseur</Label>
                  <Input
                    id="supplier"
                    value={newProduct.supplier}
                    onChange={(e) => setNewProduct({...newProduct, supplier: e.target.value})}
                    className="col-span-1 sm:col-span-3"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                  <Label htmlFor="costPrice" className="text-sm sm:text-right">Prix d'achat</Label>
                  <Input
                    id="costPrice"
                    type="number"
                    value={newProduct.costPrice}
                    onChange={(e) => setNewProduct({...newProduct, costPrice: e.target.value})}
                    className="col-span-1 sm:col-span-3"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                  <Label htmlFor="description" className="text-sm sm:text-right">Description</Label>
                  <Input
                    id="description"
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                    className="col-span-1 sm:col-span-3"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                  <Label htmlFor="prescription" className="text-sm sm:text-right">Ordonnance</Label>
                  <div className="col-span-1 sm:col-span-3 flex items-center space-x-2">
                    <Checkbox
                      id="prescription"
                      checked={newProduct.prescription}
                      onCheckedChange={(checked: boolean) => setNewProduct({...newProduct, prescription: !!checked})}
                    />
                    <Label htmlFor="prescription" className="text-xs sm:text-sm font-normal">
                      Ce produit nécessite une ordonnance médicale
                    </Label>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={handleAddProduct} className="text-sm">Ajouter le produit</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        <Card className="min-h-[120px] sm:min-h-[140px]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Total Produits</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-xl lg:text-2xl font-bold">{inventoryStats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">Références en stock</p>
          </CardContent>
        </Card>

        <Card className="min-h-[120px] sm:min-h-[140px]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Valeur Stock</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-xl lg:text-2xl font-bold">{inventoryStats.totalValue.toLocaleString()} FCFA</div>
            <p className="text-xs text-muted-foreground">Valeur totale</p>
          </CardContent>
        </Card>

        <Card className="min-h-[120px] sm:min-h-[140px]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Stock Faible</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-xl lg:text-2xl font-bold text-orange-600 dark:text-orange-400">{inventoryStats.lowStockCount}</div>
            <p className="text-xs text-muted-foreground">Produits à commander</p>
          </CardContent>
        </Card>

        <Card className="min-h-[120px] sm:min-h-[140px]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Expiration Proche</CardTitle>
            <Calendar className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-xl lg:text-2xl font-bold text-red-600 dark:text-red-400">{inventoryStats.expiringCount}</div>
            <p className="text-xs text-muted-foreground">Dans les 90 jours</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Filter className="h-5 w-5" />
            Filtres et Recherche
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 sm:h-5 sm:w-5" />
            <Input
              placeholder="Rechercher par nom, fournisseur, catégorie..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 sm:pl-10 text-sm"
            />
          </div>

          {/* Filter Controls */}
          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-4 items-start sm:items-center">
            {/* Category Filter */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
              <Label htmlFor="category-select" className="text-xs sm:text-sm font-medium">Catégorie:</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger id="category-select" className="w-full sm:w-[180px] text-xs sm:text-sm">
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sort */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
              <Label htmlFor="sort-select" className="text-xs sm:text-sm font-medium">Trier par:</Label>
              <Select value={sortBy} onValueChange={(value) => setSortBy(value as typeof sortBy)}>
                <SelectTrigger id="sort-select" className="w-full sm:w-[140px] text-xs sm:text-sm">
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Nom</SelectItem>
                  <SelectItem value="stock">Stock</SelectItem>
                  <SelectItem value="expiry">Expiration</SelectItem>
                  <SelectItem value="price">Prix</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Quick Filters */}
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                variant={showLowStock ? "default" : "outline"}
                size="sm"
                onClick={() => setShowLowStock(!showLowStock)}
                className="text-xs"
              >
                Stock faible uniquement
              </Button>
              <Button
                variant={showExpiring ? "default" : "outline"}
                size="sm"
                onClick={() => setShowExpiring(!showExpiring)}
                className="text-xs"
              >
                Expiration proche
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Produits ({filteredProducts.length})</CardTitle>
          <CardDescription className="text-sm">Liste de tous les produits en stock</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredProducts.length === 0 ? (
            <p className="text-center text-muted-foreground py-8 text-sm">Aucun produit trouvé</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs sm:text-sm">Produit</TableHead>
                    <TableHead className="text-xs sm:text-sm">Catégorie</TableHead>
                    <TableHead className="text-xs sm:text-sm">Fournisseur</TableHead>
                    <TableHead className="text-xs sm:text-sm">Prix Vente</TableHead>
                    <TableHead className="text-xs sm:text-sm">Prix Achat</TableHead>
                    <TableHead className="text-xs sm:text-sm">Marge</TableHead>
                    <TableHead className="text-xs sm:text-sm">Stock</TableHead>
                    <TableHead className="text-xs sm:text-sm">Expiration</TableHead>
                    <TableHead className="text-xs sm:text-sm">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => {
                    const stockStatus = getStockStatus(product.stock)
                    const expiryStatus = getExpiryStatus(product.expiryDate)
                    
                    return (
                      <TableRow key={product.id}>
                        <TableCell>
                          <div>
                            <p className="font-semibold text-xs sm:text-sm">{product.name}</p>
                            <p className="text-xs text-muted-foreground">{product.description}</p>
                            {product.prescription && (
                              <Badge variant="destructive" className="mt-1 text-xs">Ordonnance</Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">{product.category}</Badge>
                        </TableCell>
                        <TableCell>
                          <p className="font-medium text-xs sm:text-sm">{product.supplier}</p>
                          <p className="text-xs text-muted-foreground">{product.barcode || 'N/A'}</p>
                        </TableCell>
                        <TableCell>
                          <p className="font-medium text-xs sm:text-sm">{product.price.toLocaleString()} FCFA</p>
                        </TableCell>
                        <TableCell>
                          <p className="font-medium text-xs sm:text-sm">{product.costPrice.toLocaleString()} FCFA</p>
                        </TableCell>
                        <TableCell>
                          <p className="font-medium text-xs sm:text-sm">{product.margin}%</p>
                        </TableCell>
                        <TableCell>
                          <div className="text-center">
                            <p className={`font-bold text-sm sm:text-lg ${stockStatus.color}`}>
                              {product.stock}
                            </p>
                            <Badge variant={stockStatus.variant} className="text-xs">
                              {stockStatus.label}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          {expiryStatus ? (
                            <div className="text-center">
                              <p className="text-xs sm:text-sm">
                                {product.expiryDate?.toLocaleDateString('fr-FR')}
                              </p>
                              <Badge variant={expiryStatus.variant} className="text-xs">
                                {expiryStatus.label}
                              </Badge>
                            </div>
                          ) : (
                            <span className="text-muted-foreground text-xs">N/A</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1 sm:gap-2">
                            <Button variant="outline" size="sm" className="h-7 w-7 sm:h-8 sm:w-8 p-0">
                              <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                            <Button variant="outline" size="sm" className="h-7 w-7 sm:h-8 sm:w-8 p-0">
                              <Truck className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 