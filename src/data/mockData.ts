import { Product, Customer, Sale } from '../types/pharmacy'

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Paracétamol 500mg',
    price: 1750,
    stock: 150,
    category: 'Antalgiques',
    barcode: '3401579887145',
    equivalents: ['2', '3'],
    expiryDate: new Date('2025-12-31'),
    supplier: 'Sanofi',
    popularity: 95,
    costPrice: 1050,
    margin: 40,
    description: 'Médicament contre la douleur et la fièvre',
    dosage: '500mg',
    activeIngredient: 'Paracétamol',
    prescription: false
  },
  {
    id: '2',
    name: 'Doliprane 1000mg',
    price: 2100,
    stock: 85,
    category: 'Antalgiques',
    barcode: '3401552991254',
    equivalents: ['1', '3'],
    expiryDate: new Date('2025-08-15'),
    supplier: 'Sanofi',
    popularity: 88,
    costPrice: 1260,
    margin: 40,
    description: 'Antalgique et antipyrétique',
    dosage: '1000mg',
    activeIngredient: 'Paracétamol',
    prescription: false
  },
  {
    id: '3',
    name: 'Efferalgan 500mg',
    price: 1900,
    stock: 120,
    category: 'Antalgiques',
    barcode: '3401560023456',
    equivalents: ['1', '2'],
    expiryDate: new Date('2025-10-20'),
    supplier: 'UPSA',
    popularity: 75,
    costPrice: 1140,
    margin: 40,
    description: 'Antalgique effervescent',
    dosage: '500mg',
    activeIngredient: 'Paracétamol',
    prescription: false
  },
  {
    id: '4',
    name: 'Amoxicilline 1g',
    price: 4450,
    stock: 45,
    category: 'Antibiotiques',
    barcode: '3401579102456',
    equivalents: ['5'],
    expiryDate: new Date('2025-06-30'),
    supplier: 'Biogaran',
    popularity: 65,
    costPrice: 2670,
    margin: 40,
    description: 'Antibiotique à large spectre',
    dosage: '1g',
    activeIngredient: 'Amoxicilline',
    prescription: true
  },
  {
    id: '5',
    name: 'Clamoxyl 1g',
    price: 4750,
    stock: 32,
    category: 'Antibiotiques',
    barcode: '3401552334567',
    equivalents: ['4'],
    expiryDate: new Date('2025-09-15'),
    supplier: 'GSK',
    popularity: 55,
    costPrice: 2850,
    margin: 40,
    description: 'Antibiotique amoxicilline',
    dosage: '1g',
    activeIngredient: 'Amoxicilline',
    prescription: true
  },
  {
    id: '6',
    name: 'Aspirine 500mg',
    price: 1450,
    stock: 200,
    category: 'Antalgiques',
    barcode: '3401579445678',
    equivalents: [],
    expiryDate: new Date('2026-03-10'),
    supplier: 'Bayer',
    popularity: 70,
    costPrice: 870,
    margin: 40,
    description: 'Anti-inflammatoire non stéroïdien',
    dosage: '500mg',
    activeIngredient: 'Acide acétylsalicylique',
    prescription: false
  },
  {
    id: '7',
    name: 'Serum physiologique',
    price: 750,
    stock: 300,
    category: 'Hygiène',
    barcode: '3401560123789',
    equivalents: [],
    expiryDate: new Date('2026-12-31'),
    supplier: 'Gilbert',
    popularity: 85,
    costPrice: 450,
    margin: 40,
    description: 'Solution saline stérile',
    dosage: '5ml x 20',
    activeIngredient: 'Chlorure de sodium',
    prescription: false
  },
  {
    id: '8',
    name: 'Smecta',
    price: 3100,
    stock: 78,
    category: 'Gastro-entérologie',
    barcode: '3401579667890',
    equivalents: [],
    expiryDate: new Date('2025-11-20'),
    supplier: 'Ipsen',
    popularity: 60,
    costPrice: 1860,
    margin: 40,
    description: 'Traitement symptomatique de la diarrhée',
    dosage: '3g',
    activeIngredient: 'Diosmectite',
    prescription: false
  },
  {
    id: '9',
    name: 'Vitamine D3',
    price: 6250,
    stock: 65,
    category: 'Vitamines',
    barcode: '3401552778901',
    equivalents: [],
    expiryDate: new Date('2025-07-15'),
    supplier: 'Crinex',
    popularity: 45,
    costPrice: 3750,
    margin: 40,
    description: 'Supplément vitaminique',
    dosage: '100000 UI',
    activeIngredient: 'Cholécalciférol',
    prescription: false
  },
  {
    id: '10',
    name: 'Ventoline',
    price: 7900,
    stock: 25,
    category: 'Pneumologie',
    barcode: '3401579889012',
    equivalents: [],
    expiryDate: new Date('2025-05-30'),
    supplier: 'GSK',
    popularity: 40,
    costPrice: 4740,
    margin: 40,
    description: 'Bronchodilatateur',
    dosage: '100μg/dose',
    activeIngredient: 'Salbutamol',
    prescription: true
  }
]

export const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'Fatou Ouédraogo',
    phone: '0123456789',
    email: 'fatou.ouedraogo@email.com',
    address: '123 Avenue de la Nation, Secteur 15, Ouagadougou',
    dateOfBirth: new Date('1980-05-15'),
    allergies: ['Pénicilline'],
    prescriptions: ['Hypertension'],
    lastVisit: new Date('2024-01-20'),
    totalPurchases: 225250,
    loyalty: 'gold'
  },
  {
    id: '2',
    name: 'Moussa Konaté',
    phone: '0198765432',
    email: 'moussa.konate@email.com',
    address: '456 Rue du Commerce, Zone 4, Bobo-Dioulasso',
    dateOfBirth: new Date('1975-09-22'),
    allergies: [],
    prescriptions: ['Diabète type 2'],
    lastVisit: new Date('2024-01-18'),
    totalPurchases: 140150,
    loyalty: 'silver'
  },
  {
    id: '3',
    name: 'Aminata Sawadogo',
    phone: '0156785112',
    email: 'aminata.sawadogo@email.com',
    address: '789 Boulevard de l\'Indépendance, Koudougou',
    dateOfBirth: new Date('1992-12-03'),
    allergies: ['Aspirine'],
    prescriptions: [],
    lastVisit: new Date('2024-01-15'),
    totalPurchases: 62900,
    loyalty: 'bronze'
  }
]

export const mockSales: Sale[] = [
  {
    id: '1',
    date: new Date('2024-01-20T10:30:00'),
    customerId: '1',
    customerName: 'Fatou Ouédraogo',
    items: [
      {
        productId: '1',
        product: mockProducts[0],
        quantity: 2,
        unitPrice: 1750,
        total: 3500
      },
      {
        productId: '4',
        product: mockProducts[3],
        quantity: 1,
        unitPrice: 4450,
        total: 4450
      }
    ],
    subtotal: 7950,
    tax: 0.00,
    total: 7950,
    paymentMethod: 'card',
    cashierId: 'cashier1'
  },
  {
    id: '2',
    date: new Date('2024-01-20T14:15:00'),
    customerId: '2',
    customerName: 'Moussa Konaté',
    items: [
      {
        productId: '7',
        product: mockProducts[6],
        quantity: 3,
        unitPrice: 750,
        total: 2250
      }
    ],
    subtotal: 2250,
    tax: 0.00,
    total: 2250,
    paymentMethod: 'cash',
    cashierId: 'cashier1'
  }
]

// Popular products for quick access
export const popularProducts = mockProducts
  .sort((a, b) => b.popularity - a.popularity)
  .slice(0, 8)

// Categories for filtering
export const categories = [
  'Tous',
  'Antalgiques',
  'Antibiotiques',
  'Hygiène',
  'Gastro-entérologie',
  'Vitamines',
  'Pneumologie'
] 