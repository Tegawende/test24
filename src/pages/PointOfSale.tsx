import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'
import { 
  Search, 
  Plus, 
  Minus, 
  Trash2, 
  ShoppingCart, 
  Filter,
  User
} from 'lucide-react'
import { mockProducts, popularProducts } from '@/data/mockData'
import { Product, Customer, SaleItem } from '@/types/pharmacy'

export default function PointOfSale() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [cart, setCart] = useState<SaleItem[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [activeTab, setActiveTab] = useState<string>('popular')

  const { toast } = useToast()

  // Filter products based on search and category
  const filteredProducts = (() => {
    let products = mockProducts
    
    // Filter by category
    if (selectedCategory !== 'all') {
      products = products.filter(product => product.category === selectedCategory)
    }
    
    // Filter by search term
    if (searchTerm) {
      products = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.barcode?.includes(searchTerm) ||
        product.price.toString().includes(searchTerm)
      )
    }
    
    return products
  })()

  // Get unique categories
  const categories = ['all', ...Array.from(new Set(mockProducts.map(p => p.category)))]

  // Auto-switch to "all" tab when searching or filtering
  useEffect(() => {
    if (searchTerm || selectedCategory !== 'all') {
      setActiveTab('all')
    }
  }, [searchTerm, selectedCategory])

  // Add product to cart
  const addToCart = (product: Product) => {
    setCart(currentCart => {
      const existingItem = currentCart.find(item => item.productId === product.id)
      
      if (existingItem) {
        return currentCart.map(item =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * item.unitPrice }
            : item
        )
      } else {
        return [...currentCart, {
          productId: product.id,
          product,
          quantity: 1,
          unitPrice: product.price,
          total: product.price
        }]
      }
    })
  }

  // Update cart item quantity
  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId)
      return
    }
    
    setCart(currentCart =>
      currentCart.map(item =>
        item.productId === productId
          ? { ...item, quantity: newQuantity, total: newQuantity * item.unitPrice }
          : item
      )
    )
  }

  // Remove from cart
  const removeFromCart = (productId: string) => {
    setCart(currentCart => currentCart.filter(item => item.productId !== productId))
  }

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + item.total, 0)
  const tax = 0 // No tax for medical products in France
  const total = subtotal + tax

  // Clear cart
  const clearCart = () => {
    setCart([])
    setSelectedCustomer(null)
  }

  // Process payment (mock)
  const processPayment = () => {
    toast({
      title: "Vente finalisée",
      description: `Vente de ${total.toLocaleString()} FCFA enregistrée avec succès.`,
    })
    clearCart()
  }

  // Get equivalents for a product
  const getEquivalents = (product: Product) => {
    return mockProducts.filter(p => product.equivalents.includes(p.id))
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Side - Product Selection */}
      <div className="flex-1 p-4 sm:p-6 overflow-auto">
        <div className="space-y-4 sm:space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Caisse</h1>
          </div>

          <Separator />

          {/* Search and Filters */}
          <div className="space-y-3 sm:space-y-4">
            <div className="space-y-2">
              <Label htmlFor="product-search" className="text-sm">Recherche produit</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 sm:h-5 sm:w-5" />
                <Input
                  id="product-search"
                  placeholder="Rechercher par nom, prix ou code-barres..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 sm:pl-10 h-10 sm:h-12 text-sm sm:text-lg"
                />
              </div>
            </div>

            {/* Category Filters */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm">
                <Filter className="h-4 w-4" />
                Filtres par catégorie
              </Label>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className="text-xs sm:text-sm"
                  >
                    {category === 'all' ? 'Tous' : category}
                    {category !== 'all' && (
                      <Badge variant="secondary" className="ml-1 sm:ml-2 text-xs">
                        {mockProducts.filter(p => p.category === category).length}
                      </Badge>
                    )}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="popular" className="text-xs sm:text-sm">Populaires</TabsTrigger>
              <TabsTrigger value="all" className="text-xs sm:text-sm">Tous les produits</TabsTrigger>
            </TabsList>

            {/* Popular Products */}
            <TabsContent value="popular" className="space-y-3 sm:space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                {popularProducts.map((product) => (
                  <Card 
                    key={product.id} 
                    className="cursor-pointer hover:bg-accent transition-colors"
                    onClick={() => addToCart(product)}
                  >
                    <CardContent className="p-3 sm:p-4">
                      <div className="space-y-2">
                        <h3 className="font-semibold text-xs sm:text-sm">{product.name}</h3>
                        <p className="text-xs text-muted-foreground">{product.category}</p>
                        <Separator />
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                          <span className="font-bold text-base sm:text-lg text-primary">{product.price.toLocaleString()} FCFA</span>
                          <Badge variant={product.prescription ? "destructive" : "secondary"} className="self-start sm:self-auto text-xs">
                            {product.prescription ? "Ordonnance" : "Libre"}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">Stock: {product.stock}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* All Products */}
            <TabsContent value="all" className="space-y-3">
              {filteredProducts.length > 0 ? (
                <div className="space-y-3">
                  {filteredProducts.map((product) => (
                    <Card key={product.id} className="cursor-pointer hover:bg-accent">
                      <CardContent className="p-3 sm:p-4">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-sm sm:text-base">{product.name}</h3>
                            <p className="text-xs sm:text-sm text-muted-foreground">{product.description}</p>
                            <div className="flex flex-wrap items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">{product.category}</Badge>
                              {product.prescription && (
                                <Badge variant="destructive" className="text-xs">Ordonnance</Badge>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col sm:text-right space-y-2">
                            <p className="font-bold text-lg sm:text-xl text-primary">{product.price.toLocaleString()} FCFA</p>
                            <Button onClick={() => addToCart(product)} size="sm" className="text-xs">
                              <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                              Ajouter
                            </Button>
                          </div>
                        </div>
                        
                        {/* Equivalents */}
                        {getEquivalents(product).length > 0 && (
                          <>
                            <Separator className="my-3" />
                            <div>
                              <p className="text-xs text-muted-foreground mb-2">Équivalents:</p>
                              <div className="flex gap-2 flex-wrap">
                                {getEquivalents(product).map((equiv) => (
                                  <Button
                                    key={equiv.id}
                                    variant="outline"
                                    size="sm"
                                    onClick={() => addToCart(equiv)}
                                    className="text-xs"
                                  >
                                    {equiv.name} - {equiv.price.toLocaleString()} FCFA
                                  </Button>
                                ))}
                              </div>
                            </div>
                          </>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8 text-sm">
                  {searchTerm || selectedCategory !== 'all' ? 'Aucun produit trouvé' : 'Tapez pour rechercher...'}
                </p>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Right Side - Cart & Checkout */}
      <div className="w-full lg:w-96 bg-card border-t lg:border-l lg:border-t-0 border-border flex flex-col min-h-[400px] lg:min-h-screen">
        {/* Customer Selection */}
        <div className="p-3 sm:p-4 border-b border-border">
          <div className="space-y-3">
            <Label className="font-semibold flex items-center gap-2 text-sm">
              <User className="h-4 w-4 sm:h-5 sm:w-5" />
              Client
            </Label>
            <Input
              placeholder="Rechercher un client..."
              className="w-full text-sm"
            />
            {selectedCustomer && (
              <>
                <Separator />
                <div className="p-3 bg-accent rounded-lg">
                  <p className="font-semibold text-sm">{selectedCustomer.name}</p>
                  <p className="text-xs text-muted-foreground">{selectedCustomer.phone}</p>
                  <Badge variant="outline" className="text-xs">{selectedCustomer.loyalty}</Badge>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Cart */}
        <div className="flex-1 p-3 sm:p-4 overflow-auto">
          <Label className="font-semibold mb-3 flex items-center gap-2 text-sm">
            <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
            Panier ({cart.length})
          </Label>
          
          <Separator className="my-3" />
          
          {cart.length === 0 ? (
            <p className="text-center text-muted-foreground py-8 text-sm">Panier vide</p>
          ) : (
            <div className="space-y-3">
              {cart.map((item, index) => (
                <div key={item.productId}>
                  <Card className="p-3">
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-medium text-xs sm:text-sm">{item.product.name}</h4>
                          <p className="text-xs text-muted-foreground">{item.product.category}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromCart(item.productId)}
                          className="h-6 w-6 p-0"
                        >
                          <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                      </div>
                      
                      <Separator />
                      
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            className="h-7 w-7 sm:h-8 sm:w-8 p-0"
                          >
                            <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                          <span className="w-6 sm:w-8 text-center font-medium text-sm">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            className="h-7 w-7 sm:h-8 sm:w-8 p-0"
                          >
                            <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                        </div>
                        <span className="font-semibold text-sm sm:text-base">{item.total.toLocaleString()} FCFA</span>
                      </div>
                    </div>
                  </Card>
                  {index < cart.length - 1 && <Separator className="my-3" />}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Checkout */}
        {cart.length > 0 && (
          <div className="p-3 sm:p-4 border-t border-border space-y-3 sm:space-y-4">
            {/* Totals */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Sous-total:</span>
                <span>{subtotal.toLocaleString()} FCFA</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>TVA:</span>
                <span>{tax.toLocaleString()} FCFA</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-base sm:text-lg">
                <span>Total:</span>
                <span>{total.toLocaleString()} FCFA</span>
              </div>
            </div>

            <Separator />

            {/* Action Buttons */}
            <div className="space-y-2">
              <Button onClick={processPayment} className="w-full h-10 sm:h-12 text-sm sm:text-lg font-semibold">
                <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                Finaliser la vente
              </Button>
              <Button variant="outline" onClick={clearCart} className="w-full text-sm">
                Vider le panier
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 