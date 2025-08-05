# 🧪 Guide de Test - Pharmacie du Centre Medical Victoir

## 🚀 Accès Application
- **URL**: http://localhost:5173
- **Responsive**: Testé sur desktop et tablette

---

## ✅ **TESTS À EFFECTUER**

### 1. 🎨 **INTERFACE GÉNÉRALE**
- [ ] Logo CMV affiché dans le header
- [ ] Toggle dark/light mode fonctionne (bouton soleil/lune)
- [ ] Navigation sidebar avec 6 pages
- [ ] Responsive design adaptatif
- [ ] Couleurs cohérentes en mode clair/sombre

### 2. 📊 **DASHBOARD**
- [ ] 4 métriques principales affichées
- [ ] Graphique en camembert (ventes par catégorie)
- [ ] Graphique évolution mensuelle
- [ ] Section alertes stock avec badges priorité
- [ ] Produits populaires avec prix/stock
- [ ] Dark mode compatible

### 3. 💰 **POINT DE VENTE (Caisse)**
- [ ] **Recherche produits** par nom/prix/code-barres
- [ ] **Onglet Populaires** : 8 produits en accès rapide
- [ ] **Onglet Recherche** : filtrage en temps réel
- [ ] **Onglet Catégories** : navigation par catégorie
- [ ] **Équivalences** : suggestions de produits similaires
- [ ] **Panier** : ajout/modification/suppression articles
- [ ] **Gestion quantités** : boutons +/- fonctionnels
- [ ] **Modes paiement** : Espèces/Carte/Sécu
- [ ] **Finalisation vente** : alert confirmation
- [ ] **Vider panier** : remise à zéro

### 4. 📦 **INVENTAIRE**
- [ ] **4 métriques** : Total produits, valeur, stock faible, expiration
- [ ] **Recherche** : filtrage par nom/fournisseur/catégorie
- [ ] **Filtres** : catégorie, tri (nom/stock/expiration/prix)
- [ ] **Filtres rapides** : stock faible uniquement, expiration proche
- [ ] **Table produits** : toutes les informations visibles
- [ ] **Statuts visuels** : stock critique/faible/moyen/bon
- [ ] **Alertes expiration** : badges colorés 30j/90j
- [ ] **Actions** : boutons édition/commande

### 5. 🎯 **FONCTIONNALITÉS MÉTIER**

#### **Gestion Stock**
- [ ] Identification produits stock faible (< 50)
- [ ] Calcul automatique des expirations (90 jours)
- [ ] Badges colorés pour urgence
- [ ] Tri par différents critères

#### **Point de Vente**
- [ ] Recherche multi-critères
- [ ] Calcul automatique des totaux
- [ ] Gestion des quantités
- [ ] Produits sur ordonnance identifiés

#### **Navigation**
- [ ] Routes fonctionnelles (/, /pos, /inventory)
- [ ] Pages "en développement" pour clients/analytics/settings
- [ ] Navigation cohérente

---

## 🧪 **SCÉNARIOS DE TEST**

### **Scénario 1 : Vente Complète**
1. Aller sur Point de Vente
2. Rechercher "Paracétamol"
3. Ajouter au panier
4. Modifier la quantité (+ et -)
5. Choisir mode paiement "Carte"
6. Finaliser la vente
7. Vérifier alert de confirmation

### **Scénario 2 : Gestion Stock**
1. Aller sur Inventaire
2. Filtrer par "Stock faible uniquement"
3. Trier par "Stock" croissant
4. Vérifier les badges colorés
5. Rechercher par fournisseur "Sanofi"

### **Scénario 3 : Navigation Complète**
1. Tester chaque page du menu
2. Vérifier le responsive (réduire fenêtre)
3. Toggle dark/light mode sur chaque page
4. Vérifier la cohérence visuelle

---

## 🎨 **DESIGN TOKENS (Dark Mode)**
- **Background** : Couleur de fond adaptative
- **Foreground** : Texte principal
- **Muted-foreground** : Texte secondaire
- **Primary** : Couleur d'accent (bleu)
- **Card** : Fond des cartes
- **Border** : Bordures
- **Accent** : Survol et états actifs

---

## 📋 **CHECKLIST FINAL**
- [ ] Toutes les fonctionnalités de base marchent
- [ ] Dark mode complet
- [ ] Logo affiché correctement
- [ ] Responsive design
- [ ] Navigation fluide
- [ ] Calculs automatiques corrects
- [ ] Interface intuitive et professionnelle

---

## 🚨 **Points d'Attention**
- Données mockées (pas de persistence après refresh)
- Pages Clients/Analytics/Settings en "développement"
- Optimisé pour usage tablette (Point de Vente)
- Performance : tous les composants React optimisés

---

*Application prête pour démonstration et développement ultérieur avec vraie base de données !* 