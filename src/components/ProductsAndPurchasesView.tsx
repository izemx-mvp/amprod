import React, { useState } from 'react';
import { 
  Package, 
  ShoppingCart, 
  Building2, 
  Search,
  Plus,
  Edit2,
  Trash2,
  Copy,
  ChevronLeft,
  ChevronRight,
  X,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ExternalLink,
  Eye
} from 'lucide-react';
import { 
  BrandConfig, 
  Product, 
  PurchaseSupplier, 
  PurchaseOrder 
} from '../types';
import { formatCurrency, formatDate } from '../utils/cn';

interface ProductsAndPurchasesViewProps {
  viewMode: 'products' | 'achats' | 'fournisseurs';
  brand: BrandConfig;
  products: Product[];
  onOpenProduct: (product: Product) => void;
  onUpdateProducts?: (products: Product[]) => void;
  suppliers: PurchaseSupplier[];
  onUpdateSuppliers?: (suppliers: PurchaseSupplier[]) => void;
  purchaseOrders: PurchaseOrder[];
}

export const ProductsAndPurchasesView: React.FC<ProductsAndPurchasesViewProps> = ({
  viewMode,
  brand,
  products,
  onOpenProduct,
  onUpdateProducts,
  suppliers,
  onUpdateSuppliers,
  purchaseOrders,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [stockFilter, setStockFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;

  // Modals state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<PurchaseSupplier | null>(null);

  // State for Purchase Order Detail Modal
  const [selectedPODetail, setSelectedPODetail] = useState<PurchaseOrder | null>(null);

  // Form state for Product
  const [productForm, setProductForm] = useState({
    name: '',
    sku: '',
    category: 'Matières Premières',
    price: 500,
    cost: 250,
    stock: 100,
    minStock: 20,
    image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&auto=format&fit=crop&q=80',
    description: '',
    composition: '',
  });

  // Form state for Supplier
  const [supplierForm, setSupplierForm] = useState({
    name: '',
    category: 'Ingrédients Cosmétiques',
    country: 'Maroc',
    contactName: '',
    email: '',
    phone: '+212 5 22 XX XX XX',
    leadTimeDays: 7,
    reliabilityScore: 95,
  });

  // Base datasets filtered by active brand
  const brandProducts = products.filter(p => p.brandId === brand.id);
  const brandSuppliers = suppliers.filter(s => s.brandId === brand.id);
  const brandPOs = purchaseOrders.filter(po => po.brandId === brand.id);

  // 1. FILTERED PRODUCTS
  const filteredProducts = brandProducts.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = categoryFilter === 'ALL' || p.category === categoryFilter;
    const matchStock = stockFilter === 'ALL' || p.status === stockFilter;
    return matchSearch && matchCat && matchStock;
  });

  const totalProductPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE) || 1;
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // 2. FILTERED SUPPLIERS
  const filteredSuppliers = brandSuppliers.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.country.toLowerCase().includes(searchTerm.toLowerCase());
    return matchSearch;
  });

  const totalSupplierPages = Math.ceil(filteredSuppliers.length / ITEMS_PER_PAGE) || 1;
  const paginatedSuppliers = filteredSuppliers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // ==========================================
  // PRODUCT CRUD HANDLERS
  // ==========================================
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      sku: `${brand.id.toUpperCase().substring(0, 3)}-${Date.now().toString().slice(-4)}`,
      category: brand.id === 'cosmetics' ? 'Acides & Actifs' : brand.id === 'rehab' ? 'Soins Capillaires Bio' : 'Huiles Nobles',
      price: 250,
      cost: 100,
      stock: 80,
      minStock: 20,
      image: brand.id === 'cosmetics' 
        ? 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&auto=format&fit=crop&q=80'
        : brand.id === 'rehab'
        ? 'https://images.unsplash.com/photo-1607006314180-a22675681e84?w=800&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1608248597359-009c958469d4?w=800&auto=format&fit=crop&q=80',
      description: '',
      composition: '',
    });
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (p: Product) => {
    setEditingProduct(p);
    setProductForm({
      name: p.name,
      sku: p.sku,
      category: p.category,
      price: p.price,
      cost: p.cost,
      stock: p.stock,
      minStock: p.minStock,
      image: p.image,
      description: p.description,
      composition: p.composition || '',
    });
    setIsProductModalOpen(true);
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('Supprimer définitivement ce produit du catalogue ?')) {
      const updated = products.filter(p => p.id !== id);
      onUpdateProducts?.(updated);
    }
  };

  const handleDuplicateProduct = (p: Product) => {
    const duplicated: Product = {
      ...p,
      id: `prod-${Date.now()}`,
      sku: `${p.sku}-CPY`,
      name: `${p.name} (Copie)`,
      salesLast30Days: 0,
      revenueGenerated: 0,
    };
    const updated = [duplicated, ...products];
    onUpdateProducts?.(updated);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name.trim()) return;

    const statusVal = productForm.stock === 0 
      ? 'Rupture' 
      : productForm.stock <= productForm.minStock 
      ? 'Stock faible' 
      : 'En stock';

    if (editingProduct) {
      const updated = products.map(p => {
        if (p.id === editingProduct.id) {
          return {
            ...p,
            ...productForm,
            status: statusVal as any,
          };
        }
        return p;
      });
      onUpdateProducts?.(updated);
    } else {
      const newProd: Product = {
        id: `prod-${Date.now()}`,
        brandId: brand.id,
        sku: productForm.sku,
        name: productForm.name,
        category: productForm.category,
        price: Number(productForm.price),
        cost: Number(productForm.cost),
        stock: Number(productForm.stock),
        minStock: Number(productForm.minStock),
        salesLast30Days: 0,
        revenueGenerated: 0,
        rating: 5.0,
        reviewsCount: 1,
        description: productForm.description,
        composition: productForm.composition,
        image: productForm.image || 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&auto=format&fit=crop&q=80',
        status: statusVal as any,
      };
      const updated = [newProd, ...products];
      onUpdateProducts?.(updated);
    }

    setIsProductModalOpen(false);
  };

  // ==========================================
  // SUPPLIER CRUD HANDLERS
  // ==========================================
  const handleOpenAddSupplier = () => {
    setEditingSupplier(null);
    setSupplierForm({
      name: '',
      category: 'Matières Premières',
      country: 'Maroc',
      contactName: '',
      email: '',
      phone: '+212 5 22',
      leadTimeDays: 7,
      reliabilityScore: 95,
    });
    setIsSupplierModalOpen(true);
  };

  const handleOpenEditSupplier = (s: PurchaseSupplier) => {
    setEditingSupplier(s);
    setSupplierForm({
      name: s.name,
      category: s.category,
      country: s.country,
      contactName: s.contactName,
      email: s.email,
      phone: s.phone,
      leadTimeDays: s.leadTimeDays,
      reliabilityScore: s.reliabilityScore,
    });
    setIsSupplierModalOpen(true);
  };

  const handleDeleteSupplier = (id: string) => {
    if (confirm('Supprimer ce fournisseur partenaire ?')) {
      const updated = suppliers.filter(s => s.id !== id);
      onUpdateSuppliers?.(updated);
    }
  };

  const handleDuplicateSupplier = (s: PurchaseSupplier) => {
    const duplicated: PurchaseSupplier = {
      ...s,
      id: `sup-${Date.now()}`,
      name: `${s.name} (Copie)`,
      email: `copie.${s.email}`,
    };
    const updated = [duplicated, ...suppliers];
    onUpdateSuppliers?.(updated);
  };

  const handleSaveSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supplierForm.name.trim()) return;

    if (editingSupplier) {
      const updated = suppliers.map(s => {
        if (s.id === editingSupplier.id) {
          return {
            ...s,
            ...supplierForm,
          };
        }
        return s;
      });
      onUpdateSuppliers?.(updated);
    } else {
      const newSup: PurchaseSupplier = {
        id: `sup-${Date.now()}`,
        brandId: brand.id,
        name: supplierForm.name,
        category: supplierForm.category,
        country: supplierForm.country,
        contactName: supplierForm.contactName,
        email: supplierForm.email,
        phone: supplierForm.phone,
        leadTimeDays: Number(supplierForm.leadTimeDays),
        reliabilityScore: Number(supplierForm.reliabilityScore),
      };
      const updated = [newSup, ...suppliers];
      onUpdateSuppliers?.(updated);
    }

    setIsSupplierModalOpen(false);
  };

  const productCategories = Array.from(new Set(brandProducts.map(p => p.category)));

  return (
    <div className="w-full space-y-6">
      
      {/* 1. CATALOGUE PRODUITS */}
      {viewMode === 'products' && (
        <div className="w-full p-6 rounded-xl bg-slate-900/60 border border-slate-800/90 space-y-5 hover-lift">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <Package className="w-4 h-4 text-brand-orange" />
                Catalogue & Stocks — {brand.name}
              </h2>
              <p className="text-xs text-slate-400">
                Gestion des références, contrôle des stocks et fiches techniques certifiées.
              </p>
            </div>

            {/* Filter and Add Bar */}
            <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
              {/* Search */}
              <div className="relative flex-1 sm:w-60">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Rechercher produit, SKU..."
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-400 focus:outline-none focus:border-slate-700"
                />
              </div>

              {/* Category filter */}
              <select
                value={categoryFilter}
                onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
                className="pl-3 pr-8 py-1.5 text-xs rounded-lg bg-slate-950 border border-slate-800 text-slate-300 focus:outline-none cursor-pointer"
              >
                <option value="ALL">Toutes catégories</option>
                {productCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              {/* Stock status filter */}
              <select
                value={stockFilter}
                onChange={(e) => { setStockFilter(e.target.value); setCurrentPage(1); }}
                className="pl-3 pr-8 py-1.5 text-xs rounded-lg bg-slate-950 border border-slate-800 text-slate-300 focus:outline-none cursor-pointer"
              >
                <option value="ALL">Tous les stocks</option>
                <option value="En stock">En stock</option>
                <option value="Stock faible">Stock faible</option>
                <option value="Rupture">Rupture</option>
              </select>

              {/* + Nouveau produit Button */}
              <button
                type="button"
                onClick={handleOpenAddProduct}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-brand-orange hover:bg-brand-orange-hover transition-colors flex items-center gap-1.5 shadow-sm shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Nouveau produit</span>
              </button>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedProducts.length > 0 ? (
              paginatedProducts.map((p) => (
                <div
                  key={p.id}
                  className="group rounded-xl border border-slate-800 bg-slate-950/60 overflow-hidden hover:border-slate-700 transition-all flex flex-col justify-between hover-lift"
                >
                  <div>
                    {/* Image with fallbacks */}
                    <div 
                      onClick={() => onOpenProduct(p)}
                      className="relative h-48 overflow-hidden border-b border-slate-800 cursor-pointer"
                    >
                      <img 
                        src={p.image} 
                        alt={p.name} 
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&auto=format&fit=crop&q=80';
                        }}
                        className="object-cover w-full h-48 rounded-lg group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-2.5 left-2.5">
                        <span className="text-[10px] px-2 py-0.5 rounded font-medium bg-slate-950/80 text-slate-300 border border-slate-800 backdrop-blur-sm">
                          {p.category}
                        </span>
                      </div>
                      <div className="absolute top-2.5 right-2.5">
                        <span className={`text-[10px] px-2 py-0.5 rounded font-medium border backdrop-blur-sm ${
                          p.stock === 0 ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' :
                          p.stock <= p.minStock ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' :
                          'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        }`}>
                          {p.status}
                        </span>
                      </div>
                    </div>

                    <div className="p-4 space-y-2.5">
                      <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                        <span>{p.sku}</span>
                        <span className="text-brand-orange font-sans font-medium">★ {p.rating} / 5</span>
                      </div>
                      <h3 
                        onClick={() => onOpenProduct(p)}
                        className="text-xs font-semibold text-white line-clamp-1 group-hover:text-brand-orange transition-colors cursor-pointer"
                      >
                        {p.name}
                      </h3>
                      <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                        {p.description}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 pt-0 space-y-3">
                    <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Prix HT</span>
                        <span className="font-semibold text-white">{formatCurrency(p.price)}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block">Stock Dispo</span>
                        <span className="font-semibold text-emerald-400">{p.stock} unités</span>
                      </div>
                    </div>

                    {/* Action Toolbar on Card */}
                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                      <button
                        type="button"
                        onClick={() => onOpenProduct(p)}
                        className="text-[11px] font-medium text-brand-orange hover:underline inline-flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" /> Fiche complète
                      </button>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleDuplicateProduct(p)}
                          className="p-1 rounded text-slate-400 hover:text-sky-400 hover:bg-sky-500/10 transition-colors"
                          title="Dupliquer le produit"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenEditProduct(p)}
                          className="p-1 rounded text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 transition-colors"
                          title="Modifier le produit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteProduct(p.id)}
                          className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          title="Supprimer le produit"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full p-10 text-center text-slate-400">
                Aucun produit ne correspond à vos filtres.
              </div>
            )}
          </div>

          {/* Product Pagination */}
          <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/60">
            <span>
              Affichage de {filteredProducts.length > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0} à {Math.min(currentPage * ITEMS_PER_PAGE, filteredProducts.length)} sur {filteredProducts.length} références
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className="p-1.5 rounded-lg border border-slate-800 text-slate-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-900"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-2 font-medium text-slate-200">
                Page {currentPage} sur {totalProductPages}
              </span>
              <button
                type="button"
                disabled={currentPage >= totalProductPages}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalProductPages))}
                className="p-1.5 rounded-lg border border-slate-800 text-slate-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-900"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. ACHATS */}
      {viewMode === 'achats' && (
        <div className="w-full p-6 rounded-xl bg-slate-900/60 border border-slate-800/90 space-y-4 hover-lift">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-brand-orange" />
                Bons de Commande Fournisseurs & Approvisionnement ({brandPOs.length})
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Cliquez sur n'importe quel bon d'achat pour consulter la fiche de réception et le certificat de contrôle qualité.
              </p>
            </div>
          </div>

          <div className="w-full overflow-x-auto rounded-lg border border-slate-800/80">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] border-b border-slate-800">
                <tr>
                  <th className="p-3.5">N° Bon d'Achat</th>
                  <th className="p-3.5">Fournisseur</th>
                  <th className="p-3.5">Date</th>
                  <th className="p-3.5">Livraison Estimée</th>
                  <th className="p-3.5">Matières Commandées</th>
                  <th className="p-3.5">Montant Total</th>
                  <th className="p-3.5">Statut Qualité</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {brandPOs.map((po) => (
                  <tr 
                    key={po.id} 
                    onClick={() => setSelectedPODetail(po)}
                    className="hover:bg-slate-800/40 cursor-pointer transition-colors"
                  >
                    <td className="p-3.5 font-semibold font-mono text-white">{po.poNumber}</td>
                    <td className="p-3.5 font-medium">{po.supplierName}</td>
                    <td className="p-3.5 text-slate-400">{formatDate(po.date)}</td>
                    <td className="p-3.5 text-slate-400">{formatDate(po.expectedDate)}</td>
                    <td className="p-3.5 text-slate-300">{po.itemsSummary}</td>
                    <td className="p-3.5 font-semibold text-white">{formatCurrency(po.totalAmount)}</td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {po.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setSelectedPODetail(po)}
                        className="px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-800 text-slate-200 border border-slate-700 hover:bg-teal-600 hover:text-white transition-colors inline-flex items-center gap-1 shadow-xs"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Détails</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. FOURNISSEURS */}
      {viewMode === 'fournisseurs' && (
        <div className="w-full p-6 rounded-xl bg-slate-900/60 border border-slate-800/90 space-y-4 hover-lift">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <Building2 className="w-4 h-4 text-brand-orange" />
                Répertoire Fournisseurs Partenaires — {brand.name}
              </h2>
              <p className="text-xs text-slate-400">
                Gestion des approvisionnements, scoring de fiabilité et contrats d'achats.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-60">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Rechercher fournisseur..."
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-400 focus:outline-none"
                />
              </div>

              <button
                type="button"
                onClick={handleOpenAddSupplier}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-brand-orange hover:bg-brand-orange-hover transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Nouveau fournisseur</span>
              </button>
            </div>
          </div>

          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedSuppliers.length > 0 ? (
              paginatedSuppliers.map((sup) => (
                <div key={sup.id} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3 flex flex-col justify-between hover-lift">
                  <div>
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xs font-semibold text-white">{sup.name}</h3>
                        <p className="text-[11px] text-slate-400">{sup.category} • {sup.country}</p>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        Fiabilité : {sup.reliabilityScore}%
                      </span>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800/80 text-xs space-y-1.5 mt-3">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Contact :</span>
                        <span className="text-slate-200 font-medium">{sup.contactName}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Délai moyen :</span>
                        <span className="text-brand-orange font-medium">{sup.leadTimeDays} jours</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Email :</span>
                        <span className="font-mono text-[11px] text-slate-300 truncate max-w-[150px]">{sup.email}</span>
                      </div>
                    </div>
                  </div>

                  {/* Supplier Actions */}
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-end gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleDuplicateSupplier(sup)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-sky-400 hover:bg-sky-500/10 transition-colors"
                      title="Dupliquer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenEditSupplier(sup)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 transition-colors"
                      title="Modifier"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteSupplier(sup.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full p-8 text-center text-slate-400">
                Aucun fournisseur trouvé.
              </div>
            )}
          </div>

          {/* Supplier Pagination */}
          <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/60">
            <span>
              Affichage de {filteredSuppliers.length > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0} à {Math.min(currentPage * ITEMS_PER_PAGE, filteredSuppliers.length)} sur {filteredSuppliers.length} fournisseurs
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className="p-1.5 rounded-lg border border-slate-800 text-slate-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-900"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-2 font-medium text-slate-200">
                Page {currentPage} sur {totalSupplierPages}
              </span>
              <button
                type="button"
                disabled={currentPage >= totalSupplierPages}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalSupplierPages))}
                className="p-1.5 rounded-lg border border-slate-800 text-slate-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-900"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CRÉATION / MODIFICATION PRODUIT */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div className="my-auto w-full max-w-xl bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-800/80 flex items-center justify-between shrink-0 bg-slate-900/60">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Package className="w-4 h-4 text-brand-orange" />
                {editingProduct ? `Modifier la référence — ${editingProduct.sku}` : 'Nouveau Produit / Matière Première'}
              </h3>
              <button 
                onClick={() => setIsProductModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-6 space-y-4 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-xs font-medium text-slate-300 block mb-1">
                    Nom du Produit / Ingrédient *
                  </label>
                  <input
                    type="text"
                    required
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-slate-700"
                    placeholder="Ex: Acide Glycolique 70% (Fût 25L)"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">
                    Référence SKU *
                  </label>
                  <input
                    type="text"
                    required
                    value={productForm.sku}
                    onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-slate-700 font-mono"
                    placeholder="Ex: AM-RAW-GLY70"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">
                    Catégorie
                  </label>
                  <input
                    type="text"
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-slate-700"
                    placeholder="Ex: Acides & Actifs, Soins Capillaires Bio..."
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">
                    Prix de Vente HT (MAD) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-slate-700"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">
                    Coût de Revient HT (MAD)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={productForm.cost}
                    onChange={(e) => setProductForm({ ...productForm, cost: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-slate-700"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">
                    Stock Initial (unités)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-slate-700"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">
                    Seuil Minimum d'Alerte
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={productForm.minStock}
                    onChange={(e) => setProductForm({ ...productForm, minStock: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-slate-700"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-medium text-slate-300 block mb-1">
                    URL de l'image (Aperçu)
                  </label>
                  <input
                    type="url"
                    value={productForm.image}
                    onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-slate-700"
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-medium text-slate-300 block mb-1">
                    Description & Applications
                  </label>
                  <textarea
                    rows={2}
                    value={productForm.description}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-slate-700"
                    placeholder="Spécifications techniques, méthode d'application..."
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-medium text-slate-300 block mb-1">
                    Composition INCI / Certifications
                  </label>
                  <input
                    type="text"
                    value={productForm.composition}
                    onChange={(e) => setProductForm({ ...productForm, composition: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-slate-700"
                    placeholder="Ex: Pureté > 99%, conforme Cosmos Organic..."
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-brand-orange hover:bg-brand-orange-hover transition-colors shadow-sm"
                >
                  {editingProduct ? 'Enregistrer les modifications' : 'Ajouter au catalogue'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL CRÉATION / MODIFICATION FOURNISSEUR */}
      {isSupplierModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div className="my-auto w-full max-w-lg bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-800/80 flex items-center justify-between shrink-0 bg-slate-900/60">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Building2 className="w-4 h-4 text-brand-orange" />
                {editingSupplier ? `Modifier — ${editingSupplier.name}` : 'Nouveau Fournisseur Partenaire'}
              </h3>
              <button 
                onClick={() => setIsSupplierModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveSupplier} className="p-6 space-y-4 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-xs font-medium text-slate-300 block mb-1">
                    Raison Sociale / Entreprise *
                  </label>
                  <input
                    type="text"
                    required
                    value={supplierForm.name}
                    onChange={(e) => setSupplierForm({ ...supplierForm, name: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-slate-700"
                    placeholder="Ex: Atlas Chimie Industrielle"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">
                    Catégorie
                  </label>
                  <input
                    type="text"
                    value={supplierForm.category}
                    onChange={(e) => setSupplierForm({ ...supplierForm, category: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-slate-700"
                    placeholder="Matières Premières, Flaconnage..."
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">
                    Pays d'Origine
                  </label>
                  <input
                    type="text"
                    value={supplierForm.country}
                    onChange={(e) => setSupplierForm({ ...supplierForm, country: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-slate-700"
                    placeholder="Maroc, France, Espagne..."
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">
                    Nom du Contact
                  </label>
                  <input
                    type="text"
                    value={supplierForm.contactName}
                    onChange={(e) => setSupplierForm({ ...supplierForm, contactName: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-slate-700"
                    placeholder="Ex: M. Rachid Benjelloun"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">
                    Email Commercial
                  </label>
                  <input
                    type="email"
                    value={supplierForm.email}
                    onChange={(e) => setSupplierForm({ ...supplierForm, email: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-slate-700"
                    placeholder="contact@fournisseur.com"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">
                    Téléphone
                  </label>
                  <input
                    type="text"
                    value={supplierForm.phone}
                    onChange={(e) => setSupplierForm({ ...supplierForm, phone: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-slate-700"
                    placeholder="+212 5 22 XX XX XX"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">
                    Délai Moyen (jours)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={supplierForm.leadTimeDays}
                    onChange={(e) => setSupplierForm({ ...supplierForm, leadTimeDays: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-slate-700"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-medium text-slate-300 block mb-1">
                    Score de Fiabilité (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={supplierForm.reliabilityScore}
                    onChange={(e) => setSupplierForm({ ...supplierForm, reliabilityScore: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-slate-700"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsSupplierModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-brand-orange hover:bg-brand-orange-hover transition-colors shadow-sm"
                >
                  {editingSupplier ? 'Enregistrer' : 'Ajouter le fournisseur'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODALE DE VUE DÉTAILLÉE : BON DE COMMANDE FOURNISSEUR / ACHAT */}
      {selectedPODetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in overflow-y-auto">
          <div className="my-auto w-full max-w-xl bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-800/80 flex items-center justify-between shrink-0 bg-slate-900/60">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-brand-orange" />
                <h3 className="text-sm font-bold text-white">
                  Détail du Bon d'Achat — {selectedPODetail.poNumber}
                </h3>
              </div>
              <button
                onClick={() => setSelectedPODetail(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-5 overflow-y-auto flex-1 text-xs">
              <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                <div>
                  <span className="text-slate-400 block mb-0.5">Fournisseur Partenaire</span>
                  <p className="font-bold text-white text-sm">{selectedPODetail.supplierName}</p>
                  <p className="text-slate-400 text-[11px] mt-0.5">Marque bénéficiaire : {brand.name}</p>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 block mb-0.5">Statut Qualité Réception</span>
                  <span className="inline-block px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {selectedPODetail.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-lg bg-slate-950/40 border border-slate-800/80">
                  <span className="text-slate-400 text-[11px] block">Date de Commande</span>
                  <p className="font-semibold text-white mt-1">{formatDate(selectedPODetail.date)}</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-950/40 border border-slate-800/80">
                  <span className="text-slate-400 text-[11px] block">Livraison Estimée</span>
                  <p className="font-semibold text-sky-400 mt-1">{formatDate(selectedPODetail.expectedDate)}</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-950/40 border border-slate-800/80">
                  <span className="text-slate-400 text-[11px] block">Contrôle BPF ISO 22716</span>
                  <p className="font-semibold text-emerald-400 mt-1 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Conforme
                  </p>
                </div>
              </div>

              {/* Items Summary Box */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                <h4 className="font-semibold text-slate-300 text-xs uppercase tracking-wider">
                  Matières Premières & Composants Achetés
                </h4>
                <p className="text-white text-xs bg-slate-900/80 p-3 rounded-lg border border-slate-800 leading-relaxed font-mono">
                  {selectedPODetail.itemsSummary}
                </p>
                <p className="text-[11px] text-slate-400 italic">
                  Certificat d'analyse physico-chimique et fiche de données de sécurité (FDS) archivés au laboratoire.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400">Montant Total Facturé HT :</span>
                <span className="text-base font-bold text-emerald-400 font-mono">
                  {formatCurrency(selectedPODetail.totalAmount)}
                </span>
              </div>
            </div>

            <div className="px-6 py-3 bg-slate-950/70 border-t border-slate-800 flex justify-end shrink-0">
              <button
                onClick={() => setSelectedPODetail(null)}
                className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
