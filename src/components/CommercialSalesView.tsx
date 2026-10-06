import React, { useState } from 'react';
import { 
  Users, 
  FileText, 
  ShoppingCart, 
  Truck, 
  CreditCard, 
  AlertOctagon, 
  Search, 
  Sparkles, 
  Eye,
  Plus,
  Edit2,
  Trash2,
  Copy,
  ChevronLeft,
  ChevronRight,
  X,
  Building2,
  CheckCircle2,
  Filter
} from 'lucide-react';
import { 
  BrandConfig, 
  LeadOrClient, 
  Quote, 
  Order, 
  LogisticsShipment, 
  Invoice, 
  Claim 
} from '../types';
import { AIDisclaimer } from './FooterAndDisclaimers';
import { formatCurrency, formatDate } from '../utils/cn';

import { Calendar, Tag, ArrowRight, Download, Printer, GripVertical, Check } from 'lucide-react';

interface CommercialSalesViewProps {
  subView: 'leads' | 'clients' | 'devis' | 'commandes' | 'logistique' | 'paiements' | 'reclamations';
  brand: BrandConfig;
  leads: LeadOrClient[];
  onOpenLead: (lead: LeadOrClient) => void;
  onUpdateLeads?: (leads: LeadOrClient[]) => void;
  quotes: Quote[];
  orders: Order[];
  logistics: LogisticsShipment[];
  invoices: Invoice[];
  claims: Claim[];
  onUpdateClaims?: (claims: Claim[]) => void;
}

export const CommercialSalesView: React.FC<CommercialSalesViewProps> = ({
  subView,
  brand,
  leads,
  onOpenLead,
  onUpdateLeads,
  quotes,
  orders,
  logistics,
  invoices,
  claims,
  onUpdateClaims,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;

  // Modal State for Add / Edit Lead / Client
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<LeadOrClient | null>(null);

  // State for Invoice PDF Modal / Drawer
  const [selectedInvoicePDF, setSelectedInvoicePDF] = useState<Invoice | null>(null);

  // State for Quote PDF Modal / Drawer
  const [selectedQuotePDF, setSelectedQuotePDF] = useState<Quote | null>(null);

  // States for Detailed View Modals / Drawers (Quotes, Orders, Logistics)
  const [selectedQuoteDetail, setSelectedQuoteDetail] = useState<Quote | null>(null);
  const [selectedOrderDetail, setSelectedOrderDetail] = useState<Order | null>(null);
  const [selectedLogisticsDetail, setSelectedLogisticsDetail] = useState<LogisticsShipment | null>(null);

  // Drag and Drop States for Claims Kanban
  const [draggedClaimId, setDraggedClaimId] = useState<string | null>(null);
  const [dragOverCol, setDragOverCol] = useState<string | null>(null);

  // Modal State for New Claim
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
  const [claimFormData, setClaimFormData] = useState({
    claimNumber: '',
    clientName: '',
    subject: '',
    priority: 'Moyenne' as const,
    status: 'En attente' as const,
    dateCreated: new Date().toISOString().split('T')[0],
    category: 'Produit défectueux' as const,
    resolutionNotes: ''
  });

  const normalizeClaimStatus = (status: string): 'En attente' | 'Ouverte' | 'Résolue' | 'Refusée' => {
    if (status === 'Ouverte' || status === "En cours d'analyse") return 'Ouverte';
    if (status === 'Résolue' || status === 'Résolu') return 'Résolue';
    if (status === 'Refusée' || status === 'Rejeté') return 'Refusée';
    return 'En attente';
  };

  const handleUpdateClaimStatus = (claimId: string, newStatus: 'En attente' | 'Ouverte' | 'Résolue' | 'Refusée') => {
    const updated = claims.map(c => c.id === claimId ? { ...c, status: newStatus } : c);
    if (onUpdateClaims) {
      onUpdateClaims(updated);
    }
  };

  const handleDeleteClaim = (claimId: string) => {
    const updated = claims.filter(c => c.id !== claimId);
    if (onUpdateClaims) {
      onUpdateClaims(updated);
    }
  };

  const handleCreateClaim = (e: React.FormEvent) => {
    e.preventDefault();
    if (!claimFormData.clientName.trim() || !claimFormData.subject.trim()) return;

    const newClaim: Claim = {
      id: `clm-${Date.now()}`,
      brandId: brand.id,
      claimNumber: claimFormData.claimNumber.trim() || `REC-2026-0${Math.floor(Math.random() * 800) + 100}`,
      clientName: claimFormData.clientName.trim(),
      subject: claimFormData.subject.trim(),
      priority: claimFormData.priority as any,
      status: claimFormData.status as any,
      dateCreated: claimFormData.dateCreated || new Date().toISOString().split('T')[0],
      category: claimFormData.category as any,
      resolutionNotes: claimFormData.resolutionNotes.trim()
    };
    const updated = [newClaim, ...claims];
    if (onUpdateClaims) {
      onUpdateClaims(updated);
    }
    setIsClaimModalOpen(false);
    setClaimFormData({
      claimNumber: '',
      clientName: '',
      subject: '',
      priority: 'Moyenne',
      status: 'En attente',
      dateCreated: new Date().toISOString().split('T')[0],
      category: 'Produit défectueux',
      resolutionNotes: ''
    });
  };

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    city: '',
    country: 'Maroc',
    status: 'Nouveau',
    aiScore: 85,
    aiRationale: 'Intérêt élevé détecté par le système',
    source: 'Site Web',
    totalOrdersValue: 0,
    activeOrdersCount: 0,
  });

  const isClientView = subView === 'clients';

  // Filter contacts by brand and type
  const brandContacts = leads
    .filter(l => l.brandId === brand.id)
    .filter(l => isClientView ? l.isClient : !l.isClient);

  // Apply search and status filter
  const filteredContacts = brandContacts
    .filter(l => {
      const matchSearch = l.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (l.company && l.company.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (l.city && l.city.toLowerCase().includes(searchTerm.toLowerCase())) ||
        l.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = statusFilter === 'ALL' || l.status === statusFilter;
      return matchSearch && matchStatus;
    });

  // Pagination calculation
  const totalPages = Math.ceil(filteredContacts.length / ITEMS_PER_PAGE) || 1;
  const paginatedContacts = filteredContacts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Quotes, Orders, Invoices, Claims for other subviews
  const brandQuotes = quotes.filter(q => q.brandId === brand.id);
  const brandOrders = orders.filter(o => o.brandId === brand.id);
  const brandInvoices = invoices.filter(i => i.brandId === brand.id);
  const brandClaims = claims.filter(c => c.brandId === brand.id);

  // Handle open Add Modal
  const handleOpenAddModal = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      email: '',
      phone: '+212 6',
      company: '',
      city: 'Casablanca',
      country: 'Maroc',
      status: isClientView ? 'Actif' : 'Nouveau',
      aiScore: 85,
      aiRationale: isClientView ? 'Client régulier certifié' : 'Lead formulatoire qualifié',
      source: 'Direct Web',
      totalOrdersValue: isClientView ? 15000 : 0,
      activeOrdersCount: isClientView ? 1 : 0,
    });
    setIsModalOpen(true);
  };

  // Handle open Edit Modal
  const handleOpenEditModal = (item: LeadOrClient) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      email: item.email,
      phone: item.phone,
      company: item.company || '',
      city: item.city,
      country: item.country,
      status: item.status,
      aiScore: item.aiScore,
      aiRationale: item.aiRationale,
      source: item.source,
      totalOrdersValue: item.totalOrdersValue,
      activeOrdersCount: item.activeOrdersCount,
    });
    setIsModalOpen(true);
  };

  // Handle Delete
  const handleDelete = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) {
      const updated = leads.filter(l => l.id !== id);
      onUpdateLeads?.(updated);
    }
  };

  // Handle Duplicate
  const handleDuplicate = (item: LeadOrClient) => {
    const duplicated: LeadOrClient = {
      ...item,
      id: `${isClientView ? 'cli' : 'lead'}-${Date.now()}`,
      name: `${item.name} (Copie)`,
      email: `copie.${item.email}`,
    };
    const updated = [duplicated, ...leads];
    onUpdateLeads?.(updated);
  };

  // Handle Save (Create or Update)
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingItem) {
      // Update existing
      const updated = leads.map(l => {
        if (l.id === editingItem.id) {
          return {
            ...l,
            ...formData,
            source: formData.source as any,
          };
        }
        return l;
      });
      onUpdateLeads?.(updated);
    } else {
      // Add new
      const newItem: LeadOrClient = {
        id: `${isClientView ? 'cli' : 'lead'}-${Date.now()}`,
        brandId: brand.id,
        isClient: isClientView,
        name: formData.name,
        email: formData.email || `contact@${formData.company.toLowerCase().replace(/\s+/g, '') || 'client'}.com`,
        phone: formData.phone,
        company: formData.company,
        city: formData.city,
        country: formData.country,
        status: formData.status as any,
        aiScore: Number(formData.aiScore),
        aiRationale: formData.aiRationale,
        source: (formData.source as any) || 'Site Web',
        totalOrdersValue: Number(formData.totalOrdersValue),
        totalPaid: isClientView ? Number(formData.totalOrdersValue) : 0,
        activeOrdersCount: Number(formData.activeOrdersCount),
        pendingQuotesCount: 0,
        openClaimsCount: 0,
        lastContact: new Date().toISOString(),
        assignedTo: 'Direction Commerciale',
        notes: '',
        timeline: [],
      };
      const updated = [newItem, ...leads];
      onUpdateLeads?.(updated);
    }

    setIsModalOpen(false);
  };

  // Unique statuses for filter dropdown
  const uniqueStatuses = Array.from(new Set(brandContacts.map(c => c.status)));

  return (
    <div className="w-full space-y-6">
      
      {/* 1. LEADS / CRM OU CLIENTS TABLE PLEINE LARGEUR AVEC CRUD */}
      {(subView === 'leads' || subView === 'clients') && (
        <div className="w-full p-6 rounded-xl bg-slate-900/60 border border-slate-800/90 space-y-4 hover-lift">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-brand-orange" />
                {isClientView ? 'Annuaire Clients & Comptes Partenaires' : 'Pipeline CRM & Prospects Qualifiés'}
              </h2>
              <p className="text-xs text-slate-400">
                {isClientView 
                  ? 'Gestion complète des clients avec historique, modification et duplication instantanée.' 
                  : 'Scoring prédictif IA, relances et qualification complète des leads.'}
              </p>
            </div>

            {/* Actions Bar: Search, Filter, Add */}
            <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Rechercher nom, société, ville..."
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-400 focus:outline-none focus:border-slate-700"
                />
              </div>

              {/* Status filter */}
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                  className="pl-3 pr-8 py-1.5 text-xs rounded-lg bg-slate-950 border border-slate-800 text-slate-300 focus:outline-none cursor-pointer"
                >
                  <option value="ALL">Tous les statuts</option>
                  {uniqueStatuses.map(st => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>

              {/* + Nouveau Button */}
              <button
                type="button"
                onClick={handleOpenAddModal}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-brand-orange hover:bg-brand-orange-hover transition-colors flex items-center gap-1.5 shadow-sm shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isClientView ? '+ Nouveau client' : '+ Nouveau lead'}</span>
              </button>
            </div>
          </div>

          <AIDisclaimer variant="subtle" />

          {/* Table pleine largeur */}
          <div className="w-full overflow-x-auto rounded-lg border border-slate-800/80">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 uppercase font-medium text-[10px] tracking-wider">
                <tr>
                  <th className="p-3.5">Contact & Entreprise</th>
                  <th className="p-3.5">Statut Actuel</th>
                  <th className="p-3.5">Score IA</th>
                  <th className="p-3.5">Ville / Source</th>
                  <th className="p-3.5">{isClientView ? 'Commandes & CA' : 'Valeur Estimée'}</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {paginatedContacts.length > 0 ? (
                  paginatedContacts.map((contact) => (
                    <tr 
                      key={contact.id}
                      className="hover:bg-slate-800/40 cursor-pointer transition-colors"
                      onClick={() => onOpenLead(contact)}
                    >
                      <td className="p-3.5">
                        <div className="font-semibold text-white flex items-center gap-2">
                          {contact.name}
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 font-mono">
                            {contact.id}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {contact.company || 'Particulier'} • {contact.email}
                        </div>
                      </td>
                      <td className="p-3.5">
                        <span className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-orange-500/10 text-orange-400 border border-orange-500/20">
                          {contact.status}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <div className="flex items-center gap-1.5 font-semibold text-amber-400">
                          <Sparkles className="w-3.5 h-3.5 text-brand-orange" />
                          {contact.aiScore}%
                        </div>
                        <span className="text-[10px] text-slate-400 block truncate max-w-[150px]">
                          {contact.aiRationale}
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-400">
                        <div>{contact.city}, {contact.country}</div>
                        <span className="text-[10px] text-slate-400">Source : {contact.source}</span>
                      </td>
                      <td className="p-3.5 font-medium text-slate-200">
                        <div>{formatCurrency(contact.totalOrdersValue)}</div>
                        <span className="text-[10px] text-slate-400">{contact.activeOrdersCount} commande(s)</span>
                      </td>
                      <td className="p-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Fiche 360 */}
                          <button
                            type="button"
                            onClick={() => onOpenLead(contact)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-brand-orange hover:bg-orange-500/10 transition-colors"
                            title="Fiche 360°"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {/* Dupliquer */}
                          <button
                            type="button"
                            onClick={() => handleDuplicate(contact)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-sky-400 hover:bg-sky-500/10 transition-colors"
                            title="Dupliquer"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>

                          {/* Modifier */}
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(contact)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 transition-colors"
                            title="Modifier"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          {/* Supprimer */}
                          <button
                            type="button"
                            onClick={() => handleDelete(contact.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                            title="Supprimer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-400">
                      Aucun contact trouvé pour cette recherche.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center justify-between text-xs text-slate-400 pt-2">
            <span>
              Affichage de {filteredContacts.length > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0} à {Math.min(currentPage * ITEMS_PER_PAGE, filteredContacts.length)} sur {filteredContacts.length} entrées
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
                Page {currentPage} sur {totalPages}
              </span>
              <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                className="p-1.5 rounded-lg border border-slate-800 text-slate-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-900"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. DEVIS */}
      {subView === 'devis' && (
        <div className="w-full p-6 rounded-xl bg-slate-900/60 border border-slate-800/90 space-y-4 hover-lift">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-brand-orange" />
                Devis Commerciaux & Propositions Tarifaires ({brandQuotes.length})
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Cliquez sur n'importe quelle ligne pour voir la fiche détaillée ou sur "Aperçu PDF" pour générer le devis officiel.
              </p>
            </div>
          </div>

          <div className="w-full overflow-x-auto rounded-lg border border-slate-800/80">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] border-b border-slate-800">
                <tr>
                  <th className="p-3.5">N° Devis</th>
                  <th className="p-3.5">Client / Prospect</th>
                  <th className="p-3.5">Date Émission</th>
                  <th className="p-3.5">Validité</th>
                  <th className="p-3.5">Montant HT</th>
                  <th className="p-3.5">Total TTC</th>
                  <th className="p-3.5">Statut</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {brandQuotes.map((q) => (
                  <tr 
                    key={q.id} 
                    onClick={() => setSelectedQuoteDetail(q)}
                    className="hover:bg-slate-800/40 cursor-pointer transition-colors"
                  >
                    <td className="p-3.5 font-semibold font-mono text-white">{q.quoteNumber}</td>
                    <td className="p-3.5 font-medium">{q.clientName}</td>
                    <td className="p-3.5 text-slate-400">{formatDate(q.date)}</td>
                    <td className="p-3.5 text-slate-400">{formatDate(q.validUntil)}</td>
                    <td className="p-3.5 font-semibold text-white">{formatCurrency(q.totalHT)}</td>
                    <td className="p-3.5 font-semibold text-emerald-400">{formatCurrency(q.totalTTC || (q.totalHT * 1.2))}</td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-medium border ${
                        q.status === 'Accepté' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-sky-500/10 text-sky-400 border-sky-500/20'
                      }`}>
                        {q.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedQuoteDetail(q)}
                          className="px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 hover:text-white transition-colors inline-flex items-center gap-1 shadow-xs"
                          title="Voir fiche détaillée"
                        >
                          <Eye className="w-3.5 h-3.5 text-sky-400" />
                          <span>Détails</span>
                        </button>
                        <button
                          onClick={() => setSelectedQuotePDF(q)}
                          className="px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-800 text-slate-200 border border-slate-700 hover:bg-indigo-600 hover:text-white hover:border-indigo-500 transition-colors inline-flex items-center gap-1 shadow-xs"
                          title="Aperçu PDF officiel"
                        >
                          <FileText className="w-3.5 h-3.5 text-brand-orange" />
                          <span>Aperçu PDF</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. COMMANDES */}
      {subView === 'commandes' && (
        <div className="w-full p-6 rounded-xl bg-slate-900/60 border border-slate-800/90 space-y-4 hover-lift">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-brand-orange" />
                Commandes Clients en Traitement ({brandOrders.length})
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Cliquez sur n'importe quelle ligne pour ouvrir le tiroir détaillé des articles et des étapes logistiques.
              </p>
            </div>
          </div>
          <div className="w-full overflow-x-auto rounded-lg border border-slate-800/80">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] border-b border-slate-800">
                <tr>
                  <th className="p-3.5">N° Commande</th>
                  <th className="p-3.5">Client</th>
                  <th className="p-3.5">Date</th>
                  <th className="p-3.5">Total TTC</th>
                  <th className="p-3.5">Paiement</th>
                  <th className="p-3.5">Livraison</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {brandOrders.map((o) => (
                  <tr 
                    key={o.id} 
                    onClick={() => setSelectedOrderDetail(o)}
                    className="hover:bg-slate-800/40 cursor-pointer transition-colors"
                  >
                    <td className="p-3.5 font-semibold font-mono text-white">{o.orderNumber}</td>
                    <td className="p-3.5 font-medium">{o.clientName}</td>
                    <td className="p-3.5 text-slate-400">{formatDate(o.date)}</td>
                    <td className="p-3.5 font-semibold text-white">{formatCurrency(o.totalTTC)}</td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {o.paymentStatus}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-orange-500/10 text-orange-400 border border-orange-500/20">
                        {o.logisticsStatus}
                      </span>
                    </td>
                    <td className="p-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setSelectedOrderDetail(o)}
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

      {/* 4. LOGISTIQUE */}
      {subView === 'logistique' && (
        <div className="w-full p-6 rounded-xl bg-slate-900/60 border border-slate-800/90 space-y-4 hover-lift">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <Truck className="w-4 h-4 text-brand-orange" />
                Suivi Expéditions & Logistique ({logistics.length})
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Cliquez sur n'importe quel colis pour ouvrir la fiche de traçabilité et les scans d'acheminement.
              </p>
            </div>
          </div>
          <div className="w-full overflow-x-auto rounded-lg border border-slate-800/80">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] border-b border-slate-800">
                <tr>
                  <th className="p-3.5">N° Suivi / Tracking</th>
                  <th className="p-3.5">Transporteur</th>
                  <th className="p-3.5">Destinataire</th>
                  <th className="p-3.5">Destination</th>
                  <th className="p-3.5">Date Expédition</th>
                  <th className="p-3.5">Statut Livraison</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {logistics.map((l) => (
                  <tr 
                    key={l.id} 
                    onClick={() => setSelectedLogisticsDetail(l)}
                    className="hover:bg-slate-800/40 cursor-pointer transition-colors"
                  >
                    <td className="p-3.5 font-mono font-semibold text-brand-orange">{l.trackingNumber}</td>
                    <td className="p-3.5 font-medium">{l.carrier}</td>
                    <td className="p-3.5">{l.clientName}</td>
                    <td className="p-3.5 text-slate-400">{l.destination}</td>
                    <td className="p-3.5 text-slate-400">{formatDate(l.dateShipped)}</td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {l.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setSelectedLogisticsDetail(l)}
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

      {/* 5. FACTURES & PAIEMENTS AVEC APERÇU PDF */}
      {subView === 'paiements' && (
        <div className="w-full p-6 rounded-xl bg-slate-900/60 border border-slate-800/90 space-y-4 hover-lift">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-brand-orange" />
                Paiements & Facturation B2B ({brandInvoices.length} Factures)
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Consultez le registre des factures émises et cliquez sur "Aperçu PDF" pour visualiser ou imprimer la facture officielle.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Total Encaissé : {formatCurrency(brandInvoices.reduce((acc, i) => acc + (i.amountPaid || 0), 0))}
              </span>
            </div>
          </div>

          <div className="w-full overflow-x-auto rounded-lg border border-slate-800/80">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] border-b border-slate-800">
                <tr>
                  <th className="p-3.5">N° Facture</th>
                  <th className="p-3.5">Client</th>
                  <th className="p-3.5">Date</th>
                  <th className="p-3.5">Échéance</th>
                  <th className="p-3.5">Montant Total</th>
                  <th className="p-3.5">Montant Payé</th>
                  <th className="p-3.5">Reste Dû</th>
                  <th className="p-3.5">Mode</th>
                  <th className="p-3.5">Statut Paiement</th>
                  <th className="p-3.5 text-right">Facture PDF</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {brandInvoices.map((inv) => (
                  <tr 
                    key={inv.id} 
                    onClick={() => setSelectedInvoicePDF(inv)}
                    className="hover:bg-slate-800/40 cursor-pointer transition-colors group"
                  >
                    <td className="p-3.5 font-semibold font-mono text-white flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{inv.invoiceNumber}</span>
                    </td>
                    <td className="p-3.5 font-medium">{inv.clientName}</td>
                    <td className="p-3.5 text-slate-400">{formatDate(inv.date)}</td>
                    <td className="p-3.5 text-slate-400">{formatDate(inv.dueDate)}</td>
                    <td className="p-3.5 font-semibold text-white">{formatCurrency(inv.amountTotal)}</td>
                    <td className="p-3.5 font-semibold text-emerald-400">{formatCurrency(inv.amountPaid || 0)}</td>
                    <td className="p-3.5 font-semibold text-amber-400">{formatCurrency(inv.remainingDue || 0)}</td>
                    <td className="p-3.5 text-slate-400">{inv.paymentMethod}</td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-medium border ${
                        inv.status === 'Payée' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      }`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedInvoicePDF(inv);
                        }}
                        className="px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-800 text-slate-200 border border-slate-700 hover:bg-indigo-600 hover:text-white hover:border-indigo-500 transition-colors inline-flex items-center gap-1 shadow-xs"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Aperçu PDF</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 6. RÉCLAMATIONS — VUE KANBAN 4 COLONNES */}
      {subView === 'reclamations' && (
        <div className="w-full space-y-5">
          {/* Top Bar Kanban */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-slate-900/60 border border-slate-800/90">
            <div>
              <div className="flex items-center gap-2">
                <AlertOctagon className="w-5 h-5 text-rose-400" />
                <h2 className="text-base font-bold text-white">
                  Tableau Kanban — Réclamations & SAV
                </h2>
                <span className="text-[11px] px-2 py-0.5 rounded font-mono font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                  {brandClaims.length} tickets
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Suivi agile des litiges, réclamations clients et non-conformités pour {brand.name}.
              </p>
            </div>

            <button
              onClick={() => {
                setClaimFormData({
                  claimNumber: `REC-2026-0${Math.floor(Math.random() * 800) + 100}`,
                  clientName: '',
                  subject: '',
                  priority: 'Moyenne',
                  status: 'En attente',
                  dateCreated: new Date().toISOString().split('T')[0],
                  category: 'Produit défectueux',
                  resolutionNotes: ''
                });
                setIsClaimModalOpen(true);
              }}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-brand-orange hover:bg-brand-orange-hover transition-colors flex items-center gap-2 shadow-sm self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              + Nouvelle réclamation
            </button>
          </div>

          {/* Kanban Columns Grid with Interactive Drag & Drop */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-start">
            {[
              {
                id: 'En attente' as const,
                label: 'En attente',
                desc: 'Tickets nouvellement créés',
                headerBg: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
                dotColor: 'bg-amber-400',
                dropZoneBg: 'border-amber-500/50 bg-amber-500/5'
              },
              {
                id: 'Ouverte' as const,
                label: 'Ouverte',
                desc: 'En cours de traitement SAV',
                headerBg: 'bg-sky-500/10 text-sky-300 border-sky-500/20',
                dotColor: 'bg-sky-400',
                dropZoneBg: 'border-sky-500/50 bg-sky-500/5'
              },
              {
                id: 'Résolue' as const,
                label: 'Résolue',
                desc: 'Problème réglé avec succès',
                headerBg: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
                dotColor: 'bg-emerald-400',
                dropZoneBg: 'border-emerald-500/50 bg-emerald-500/5'
              },
              {
                id: 'Refusée' as const,
                label: 'Refusée',
                desc: 'Rejetée ou non fondée',
                headerBg: 'bg-rose-500/10 text-rose-300 border-rose-500/20',
                dotColor: 'bg-rose-400',
                dropZoneBg: 'border-rose-500/50 bg-rose-500/5'
              }
            ].map(col => {
              const colClaims = brandClaims.filter(c => normalizeClaimStatus(c.status) === col.id);
              const isOverThisCol = dragOverCol === col.id;

              return (
                <div 
                  key={col.id} 
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = 'move';
                    if (dragOverCol !== col.id) setDragOverCol(col.id);
                  }}
                  onDragLeave={(e) => {
                    // Prevent flickering when hovering children
                    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                      setDragOverCol(null);
                    }
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragOverCol(null);
                    const claimId = e.dataTransfer.getData('text/plain') || draggedClaimId;
                    if (claimId) {
                      handleUpdateClaimStatus(claimId, col.id);
                      setDraggedClaimId(null);
                    }
                  }}
                  className={`rounded-xl border transition-all duration-200 p-3.5 space-y-3 flex flex-col min-h-[520px] ${
                    isOverThisCol 
                      ? `${col.dropZoneBg} border-2 border-dashed shadow-lg scale-[1.01]` 
                      : 'bg-slate-900/50 border-slate-800/80'
                  }`}
                >
                  {/* Column Header */}
                  <div className={`p-2.5 rounded-lg border flex items-center justify-between ${col.headerBg}`}>
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${col.dotColor}`} />
                      <span className="font-semibold text-xs text-white">{col.label}</span>
                    </div>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-950/60 text-slate-200 border border-slate-800 font-mono">
                      {colClaims.length}
                    </span>
                  </div>

                  {/* Cards List */}
                  <div className="space-y-3 flex-1 overflow-y-auto">
                    {colClaims.length === 0 ? (
                      <div className={`h-36 flex flex-col items-center justify-center text-center p-4 border border-dashed rounded-lg text-xs transition-colors ${
                        isOverThisCol ? 'border-indigo-500/60 text-indigo-300 bg-indigo-500/5' : 'border-slate-800 text-slate-500'
                      }`}>
                        <AlertOctagon className="w-5 h-5 mb-1.5 opacity-40" />
                        <span>{isOverThisCol ? 'Déposer le ticket ici' : `Aucun ticket ${col.label.toLowerCase()}`}</span>
                        <span className="text-[10px] text-slate-400 mt-1">Glissez un ticket pour modifier</span>
                      </div>
                    ) : (
                      colClaims.map(claim => {
                        const isBeingDragged = draggedClaimId === claim.id;
                        return (
                          <div
                            key={claim.id}
                            draggable
                            onDragStart={(e) => {
                              setDraggedClaimId(claim.id);
                              e.dataTransfer.setData('text/plain', claim.id);
                              e.dataTransfer.effectAllowed = 'move';
                            }}
                            onDragEnd={() => {
                              setDraggedClaimId(null);
                              setDragOverCol(null);
                            }}
                            className={`p-3.5 rounded-xl bg-slate-950/80 border transition-all space-y-2.5 shadow-sm group cursor-grab active:cursor-grabbing hover-lift select-none ${
                              isBeingDragged 
                                ? 'opacity-40 border-indigo-500 border-dashed scale-95' 
                                : 'border-slate-800 hover:border-indigo-500/50'
                            }`}
                          >
                            {/* Card Header: Claim Number & Priority + Drag Handle */}
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-1.5">
                                <GripVertical className="w-3.5 h-3.5 text-slate-400 opacity-60 group-hover:opacity-100 transition-opacity" />
                                <span className="font-mono text-xs font-bold text-rose-400">
                                  {claim.claimNumber}
                                </span>
                              </div>

                              <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                                claim.priority === 'Urgente'
                                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                                  : claim.priority === 'Haute'
                                  ? 'bg-orange-500/20 text-orange-300 border-orange-500/40'
                                  : claim.priority === 'Moyenne'
                                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                                  : 'bg-slate-800 text-slate-300 border-slate-700'
                              }`}>
                                {claim.priority}
                              </span>
                            </div>

                            {/* Client & Date */}
                            <div>
                              <h4 className="text-xs font-semibold text-white flex items-center gap-1.5 truncate">
                                <Users className="w-3 h-3 text-slate-400 shrink-0" />
                                {claim.clientName}
                              </h4>
                              <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5 font-mono">
                                <Calendar className="w-3 h-3" />
                                {formatDate(claim.dateCreated)}
                              </span>
                            </div>

                            {/* Subject Summary */}
                            <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/50 p-2 rounded-lg border border-slate-800/60 line-clamp-3">
                              {claim.subject}
                            </p>

                            {/* Category Tag if available */}
                            <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                              <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800">
                                {claim.category}
                              </span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteClaim(claim.id);
                                }}
                                className="text-slate-400 hover:text-rose-400 p-1 rounded transition-colors opacity-60 group-hover:opacity-100"
                                title="Supprimer ce ticket"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            {/* Column / Status Switcher + Drag Hint */}
                            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-1">
                              <span className="text-[10px] text-slate-400 italic flex items-center gap-1">
                                <GripVertical className="w-3 h-3 text-slate-400" /> Glisser pour déplacer
                              </span>
                              <select
                                value={normalizeClaimStatus(claim.status)}
                                onChange={(e) => handleUpdateClaimStatus(claim.id, e.target.value as any)}
                                className="text-[11px] px-2 py-1 rounded-md bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none focus:border-slate-500 cursor-pointer"
                              >
                                <option value="En attente">En attente</option>
                                <option value="Ouverte">Ouverte</option>
                                <option value="Résolue">Résolue</option>
                                <option value="Refusée">Refusée</option>
                              </select>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MODAL CRÉATION / MODIFICATION CONTACT (LEAD OU CLIENT) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div className="my-auto w-full max-w-xl bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-800/80 flex items-center justify-between shrink-0 bg-slate-900/60">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-brand-orange" />
                {editingItem 
                  ? `Modifier ${isClientView ? 'le client' : 'le lead'} — ${editingItem.name}`
                  : `Nouveau ${isClientView ? 'Client' : 'Lead'}`
                }
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">
                    Nom & Prénom *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-slate-700"
                    placeholder="Ex: Yasmine Alaoui"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">
                    Entreprise / Enseigne
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-slate-700"
                    placeholder="Ex: Laboratoires Atlas Bio"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-slate-700"
                    placeholder="contact@entreprise.com"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">
                    Téléphone / WhatsApp
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-slate-700"
                    placeholder="+212 6 XX XX XX XX"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">
                    Ville
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-slate-700"
                    placeholder="Casablanca, Marrakech..."
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">
                    Statut Actuel
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-slate-700"
                  >
                    {isClientView ? (
                      <>
                        <option value="Actif">Actif</option>
                        <option value="En cours">En cours</option>
                        <option value="Partenaire Clé">Partenaire Clé</option>
                        <option value="Compte Bloqué">Compte Bloqué</option>
                      </>
                    ) : (
                      <>
                        <option value="Nouveau">Nouveau</option>
                        <option value="Qualifié">Qualifié</option>
                        <option value="Proposition envoyée">Proposition envoyée</option>
                        <option value="Négociation">Négociation</option>
                        <option value="Gagné">Gagné</option>
                        <option value="Perdu">Perdu</option>
                      </>
                    )}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">
                    Score IA (0 - 100%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.aiScore}
                    onChange={(e) => setFormData({ ...formData, aiScore: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-slate-700"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">
                    {isClientView ? 'CA Cumulé (MAD)' : 'Valeur Estimée (MAD)'}
                  </label>
                  <input
                    type="number"
                    value={formData.totalOrdersValue}
                    onChange={(e) => setFormData({ ...formData, totalOrdersValue: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-slate-700"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">
                  Analyse & Justification IA
                </label>
                <input
                  type="text"
                  value={formData.aiRationale}
                  onChange={(e) => setFormData({ ...formData, aiRationale: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-slate-700"
                  placeholder="Ex: Forte intention de réapprovisionnement en gros volumes"
                />
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-brand-orange hover:bg-brand-orange-hover transition-colors shadow-sm"
                >
                  {editingItem ? 'Enregistrer les modifications' : 'Créer le contact'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL CRÉATION NOUVELLE RÉCLAMATION KANBAN */}
      {isClaimModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div className="my-auto w-full max-w-lg bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-800/80 flex items-center justify-between shrink-0 bg-slate-900/60">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <AlertOctagon className="w-4 h-4 text-rose-400" />
                Nouvelle Réclamation / SAV — {brand.name}
              </h3>
              <button
                onClick={() => setIsClaimModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateClaim} className="p-6 space-y-4 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">
                    N° Réclamation
                  </label>
                  <input
                    type="text"
                    required
                    value={claimFormData.claimNumber}
                    onChange={(e) => setClaimFormData({ ...claimFormData, claimNumber: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-slate-700"
                    placeholder="REC-2026-015"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">
                    Date de Réception
                  </label>
                  <input
                    type="date"
                    required
                    value={claimFormData.dateCreated}
                    onChange={(e) => setClaimFormData({ ...claimFormData, dateCreated: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-slate-700"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-medium text-slate-300 block mb-1">
                    Client ou Candidat Concerné *
                  </label>
                  <input
                    type="text"
                    required
                    value={claimFormData.clientName}
                    onChange={(e) => setClaimFormData({ ...claimFormData, clientName: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-slate-700"
                    placeholder="Nom du client, institut ou candidat..."
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">
                    Niveau de Priorité
                  </label>
                  <select
                    value={claimFormData.priority}
                    onChange={(e) => setClaimFormData({ ...claimFormData, priority: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-slate-700"
                  >
                    <option value="Faible">Faible</option>
                    <option value="Moyenne">Moyenne</option>
                    <option value="Haute">Haute</option>
                    <option value="Urgente">Urgente</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">
                    Colonne Kanban Initiale
                  </label>
                  <select
                    value={claimFormData.status}
                    onChange={(e) => setClaimFormData({ ...claimFormData, status: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-slate-700"
                  >
                    <option value="En attente">En attente (Nouveau)</option>
                    <option value="Ouverte">Ouverte (En cours)</option>
                    <option value="Résolue">Résolue</option>
                    <option value="Refusée">Refusée</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-medium text-slate-300 block mb-1">
                    Catégorie du Litige
                  </label>
                  <select
                    value={claimFormData.category}
                    onChange={(e) => setClaimFormData({ ...claimFormData, category: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-slate-700"
                  >
                    <option value="Produit défectueux">Produit défectueux</option>
                    <option value="Retard livraison">Retard livraison</option>
                    <option value="Colis endommagé">Colis endommagé</option>
                    <option value="Erreur commande">Erreur commande</option>
                    <option value="Autre">Autre</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-medium text-slate-300 block mb-1">
                    Sujet & Résumé du Problème *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={claimFormData.subject}
                    onChange={(e) => setClaimFormData({ ...claimFormData, subject: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-slate-700 leading-relaxed"
                    placeholder="Description précise de l'incident signalé par le client..."
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-medium text-slate-300 block mb-1">
                    Mesure Corrective / Notes de Résolution (Optionnel)
                  </label>
                  <input
                    type="text"
                    value={claimFormData.resolutionNotes}
                    onChange={(e) => setClaimFormData({ ...claimFormData, resolutionNotes: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-slate-700"
                    placeholder="Ex: Remplacement express envoyé par Chronopost..."
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsClaimModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-brand-orange hover:bg-brand-orange-hover transition-colors shadow-sm"
                >
                  Ajouter au tableau Kanban
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODALE D'APERÇU FACTURE PDF PROFESSIONNELLE */}
      {/* ============================================================ */}
      {selectedInvoicePDF && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in overflow-y-auto">
          <div className="my-auto w-full max-w-2xl bg-white text-slate-900 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-300 flex flex-col max-h-[90vh]">
            
            {/* Action Bar (Top dark toolbar) */}
            <div className="px-6 py-3 bg-slate-950 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-brand-orange" />
                <span className="text-xs font-bold font-mono tracking-wider">
                  FACTURE OFFICIELLE • {selectedInvoicePDF.invoiceNumber}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium inline-flex items-center gap-1 transition-colors"
                  title="Imprimer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Imprimer</span>
                </button>
                <button
                  onClick={() => {
                    alert(`Téléchargement du document PDF « ${selectedInvoicePDF.invoiceNumber}.pdf » initialisé.`);
                  }}
                  className="px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold inline-flex items-center gap-1 transition-colors shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Télécharger PDF</span>
                </button>
                <button
                  onClick={() => setSelectedInvoicePDF(null)}
                  className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ml-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Document Body (Clean Professional White Paper A4 look) */}
            <div className="p-8 space-y-6 bg-white text-slate-800">
              
              {/* Header: Brand Logo & Invoice Reference */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b-2 border-slate-100">
                <div>
                  <div className="flex items-center gap-2.5">
                    <span 
                      className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white shadow-sm text-sm"
                      style={{ backgroundColor: brand.primaryColor }}
                    >
                      {brand.name.substring(0, 2).toUpperCase()}
                    </span>
                    <div>
                      <h2 className="text-base font-black text-slate-900 tracking-tight">
                        {brand.name}
                      </h2>
                      <p className="text-[11px] text-slate-500 font-medium">
                        {brand.sector}
                      </p>
                    </div>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-3 space-y-0.5">
                    <p>Groupe AM PROD SARL AU • R.C. 54219 Casablanca</p>
                    <p>Angle Bd Zerktouni & Bd d'Anfa, Casablanca, Maroc</p>
                    <p>I.F. 45892104 • Patente 36981205 • ICE 002938491000088</p>
                  </div>
                </div>

                <div className="sm:text-right">
                  <span 
                    className="inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider text-white mb-2 shadow-xs"
                    style={{ backgroundColor: brand.primaryColor }}
                  >
                    FACTURE B2B
                  </span>
                  <p className="text-xl font-mono font-bold text-slate-900">
                    {selectedInvoicePDF.invoiceNumber}
                  </p>
                  <div className="text-xs text-slate-500 space-y-0.5 mt-2">
                    <p><strong className="text-slate-700">Date d'émission :</strong> {formatDate(selectedInvoicePDF.date)}</p>
                    <p><strong className="text-slate-700">Date d'échéance :</strong> {formatDate(selectedInvoicePDF.dueDate)}</p>
                    <p><strong className="text-slate-700">Règlement :</strong> {selectedInvoicePDF.paymentMethod}</p>
                  </div>
                </div>
              </div>

              {/* Client & Billing Info Box */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
                    Facturé à :
                  </span>
                  <h4 className="text-sm font-bold text-slate-900">
                    {selectedInvoicePDF.clientName}
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5">Compte Client B2B Certifié</p>
                  <p className="text-xs text-slate-600">Casablanca & Région, Maroc</p>
                </div>
                <div className="sm:text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
                    Statut du Document :
                  </span>
                  <span className={`inline-block px-2.5 py-0.5 rounded text-xs font-bold border ${
                    selectedInvoicePDF.status === 'Payée'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                      : 'bg-amber-50 text-amber-700 border-amber-300'
                  }`}>
                    {selectedInvoicePDF.status === 'Payée' ? '✓ RÉGLÉE EN TOTALITÉ' : '⏳ ACOMPTE REÇU / EN COURS'}
                  </span>
                </div>
              </div>

              {/* Line Items Table */}
              <div className="overflow-hidden rounded-xl border border-slate-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-600 uppercase text-[10px] font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3">Désignation des Prestations / Produits</th>
                      <th className="p-3 text-center">Qté</th>
                      <th className="p-3 text-right">P.U. HT</th>
                      <th className="p-3 text-right">Total HT</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    <tr>
                      <td className="p-3">
                        <span className="font-semibold text-slate-900 block">
                          Fourniture Cosmétique & Lot de Production Certifié
                        </span>
                        <span className="text-[11px] text-slate-500">
                          Référence commande liée sous BPF ISO 22716
                        </span>
                      </td>
                      <td className="p-3 text-center font-mono">1</td>
                      <td className="p-3 text-right font-mono font-medium">
                        {formatCurrency(selectedInvoicePDF.amountTotal / 1.2)}
                      </td>
                      <td className="p-3 text-right font-mono font-bold text-slate-900">
                        {formatCurrency(selectedInvoicePDF.amountTotal / 1.2)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Financial Calculation Summary */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pt-2">
                <div className="text-xs text-slate-500 max-w-xs space-y-1">
                  <p className="font-semibold text-slate-700">Conditions de règlement :</p>
                  <p>Paiement par {selectedInvoicePDF.paymentMethod}. En cas de retard, une pénalité égale à 3 fois le taux d'intérêt légal sera appliquée.</p>
                  <p className="text-[11px] text-slate-400">Banque : Attijariwafa Bank Casablanca • RIB : 007 780 0001234567890123 45</p>
                </div>

                <div className="w-full sm:w-64 space-y-2 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Total HT :</span>
                    <span className="font-mono font-medium">{formatCurrency(selectedInvoicePDF.amountTotal / 1.2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>TVA (20%) :</span>
                    <span className="font-mono font-medium">{formatCurrency(selectedInvoicePDF.amountTotal - (selectedInvoicePDF.amountTotal / 1.2))}</span>
                  </div>
                  <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-sm text-slate-900">
                    <span>Total TTC :</span>
                    <span className="font-mono" style={{ color: brand.primaryColor }}>
                      {formatCurrency(selectedInvoicePDF.amountTotal)}
                    </span>
                  </div>
                  <div className="flex justify-between text-emerald-700 font-semibold pt-1">
                    <span>Montant Encaissé :</span>
                    <span className="font-mono">{formatCurrency(selectedInvoicePDF.amountPaid || 0)}</span>
                  </div>
                  <div className="flex justify-between text-amber-700 font-bold pt-1 border-t border-slate-200">
                    <span>Reste à Payer :</span>
                    <span className="font-mono">{formatCurrency(selectedInvoicePDF.remainingDue || 0)}</span>
                  </div>
                </div>
              </div>

              {/* Stamp & Signature */}
              <div className="pt-6 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                <div>
                  <p className="font-semibold text-slate-700">Pour le client :</p>
                  <p className="italic text-[11px] text-slate-400 mt-1">Mention « Bon pour accord »</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-slate-700">Direction Générale {brand.name} :</p>
                  <div className="mt-2 inline-block p-2 rounded-lg border-2 border-emerald-600 text-emerald-700 font-bold uppercase tracking-wider text-[10px] rotate-[-3deg] shadow-xs">
                    ★ FACTURE VALIDÉE & ENREGISTRÉE ★
                  </div>
                </div>
              </div>

            </div>

            {/* Bottom Modal Close */}
            <div className="px-6 py-3 bg-slate-100 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedInvoicePDF(null)}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-xs"
              >
                Fermer l'Aperçu
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODALE D'APERÇU DEVIS PDF PROFESSIONNELLE */}
      {/* ============================================================ */}
      {selectedQuotePDF && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in overflow-y-auto">
          <div className="my-auto w-full max-w-2xl bg-white text-slate-900 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-300 flex flex-col max-h-[90vh]">
            
            {/* Action Bar (Top dark toolbar) */}
            <div className="px-6 py-3 bg-slate-950 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-brand-orange" />
                <span className="text-xs font-bold font-mono tracking-wider">
                  DEVIS COMMERCIAL OFFICIEL • {selectedQuotePDF.quoteNumber}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium inline-flex items-center gap-1 transition-colors"
                  title="Imprimer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Imprimer</span>
                </button>
                <button
                  onClick={() => {
                    alert(`Téléchargement du document « ${selectedQuotePDF.quoteNumber}.pdf » initialisé avec succès !`);
                  }}
                  className="px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold inline-flex items-center gap-1 transition-colors shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Télécharger PDF</span>
                </button>
                <button
                  onClick={() => setSelectedQuotePDF(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ml-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Document Content (A4 Styled Sheet) */}
            <div className="p-6 sm:p-10 space-y-6 overflow-y-auto flex-1 text-slate-800">
              
              {/* Header: Company Legal & Brand */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b border-slate-200">
                <div>
                  <div className="flex items-center gap-2.5">
                    <span 
                      className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-white text-sm shadow-xs"
                      style={{ backgroundColor: brand.primaryColor }}
                    >
                      {brand.name.substring(0, 2).toUpperCase()}
                    </span>
                    <div>
                      <h2 className="text-base font-black text-slate-900 tracking-tight">
                        {brand.name}
                      </h2>
                      <p className="text-[11px] text-slate-500 font-medium">
                        {brand.sector}
                      </p>
                    </div>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-3 space-y-0.5">
                    <p>Groupe AM PROD SARL AU • R.C. 54219 Casablanca</p>
                    <p>Angle Bd Zerktouni & Bd d'Anfa, Casablanca, Maroc</p>
                    <p>I.F. 45892104 • Patente 36981205 • ICE 002938491000088</p>
                  </div>
                </div>

                <div className="sm:text-right">
                  <span 
                    className="inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider text-white mb-2 shadow-xs"
                    style={{ backgroundColor: brand.primaryColor }}
                  >
                    PROPOSITION / DEVIS B2B
                  </span>
                  <p className="text-xl font-mono font-bold text-slate-900">
                    {selectedQuotePDF.quoteNumber}
                  </p>
                  <div className="text-xs text-slate-500 space-y-0.5 mt-2">
                    <p><strong className="text-slate-700">Date d'émission :</strong> {formatDate(selectedQuotePDF.date)}</p>
                    <p><strong className="text-slate-700">Validité jusqu'au :</strong> {formatDate(selectedQuotePDF.validUntil)}</p>
                    <p><strong className="text-slate-700">Réf. dossier :</strong> DEV-MAR-{brand.id.toUpperCase()}-2026</p>
                  </div>
                </div>
              </div>

              {/* Client & Prospect Info Box */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
                    Émis à l'attention de :
                  </span>
                  <h4 className="text-sm font-bold text-slate-900">
                    {selectedQuotePDF.clientName}
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5">Compte Professionnel B2B & Distribution</p>
                  <p className="text-xs text-slate-600">Casablanca & Régions, Maroc</p>
                </div>
                <div className="sm:text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
                    Statut de la Proposition :
                  </span>
                  <span className={`inline-block px-2.5 py-0.5 rounded text-xs font-bold border ${
                    selectedQuotePDF.status === 'Accepté'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                      : 'bg-sky-50 text-sky-700 border-sky-300'
                  }`}>
                    {selectedQuotePDF.status === 'Accepté' ? '✓ OFFRE ACCEPTEE' : '⏳ EN COURS DE VALIDATION'}
                  </span>
                </div>
              </div>

              {/* Line Items Table */}
              <div className="overflow-hidden rounded-xl border border-slate-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-600 uppercase text-[10px] font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3">Désignation des Produits & Formulations</th>
                      <th className="p-3 text-center">Qté</th>
                      <th className="p-3 text-right">P.U. HT</th>
                      <th className="p-3 text-right">Total HT</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    <tr>
                      <td className="p-3">
                        <span className="font-semibold text-slate-900 block">
                          Lot de Formulation & Conditionnement B2B — {brand.name}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          Production selon cahier des charges certifié ISO 22716 BPF avec dossier cosmétique DIP
                        </span>
                      </td>
                      <td className="p-3 text-center font-mono">{selectedQuotePDF.itemsCount || 1}</td>
                      <td className="p-3 text-right font-mono font-medium">
                        {formatCurrency(selectedQuotePDF.totalHT)}
                      </td>
                      <td className="p-3 text-right font-mono font-bold text-slate-900">
                        {formatCurrency(selectedQuotePDF.totalHT)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Financial Calculation Summary */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pt-2">
                <div className="text-xs text-slate-500 max-w-xs space-y-1">
                  <p className="font-semibold text-slate-700">Conditions de l'offre :</p>
                  <p>Validité de la présente offre : 30 jours calendaires à date d'émission.</p>
                  <p>Acompte de 30% requis à la commande pour lancement de production en laboratoire, solde à la livraison.</p>
                  <p className="text-[11px] text-slate-400">Banque : Attijariwafa Bank • RIB : 007 780 0001234567890123 45</p>
                </div>

                <div className="w-full sm:w-64 space-y-2 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Sous-total HT :</span>
                    <span className="font-mono font-medium">{formatCurrency(selectedQuotePDF.totalHT)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>TVA légale (20%) :</span>
                    <span className="font-mono font-medium">{formatCurrency(selectedQuotePDF.totalHT * 0.2)}</span>
                  </div>
                  <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-sm text-slate-900">
                    <span>Total Estimé TTC :</span>
                    <span className="font-mono" style={{ color: brand.primaryColor }}>
                      {formatCurrency(selectedQuotePDF.totalTTC || (selectedQuotePDF.totalHT * 1.2))}
                    </span>
                  </div>
                </div>
              </div>

              {/* Stamp & Signature */}
              <div className="pt-6 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                <div>
                  <p className="font-semibold text-slate-700">Bon pour Accord & Commande :</p>
                  <p className="italic text-[11px] text-slate-400 mt-1">Date, cachet commercial et signature du client</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-slate-700">Direction Commerciale {brand.name} :</p>
                  <div className="mt-2 inline-block p-2 rounded-lg border-2 border-indigo-600 text-indigo-700 font-bold uppercase tracking-wider text-[10px] rotate-[-2deg] shadow-xs">
                    ★ DEVIS OFFICIEL APPROUVÉ ★
                  </div>
                </div>
              </div>

            </div>

            {/* Bottom Modal Close */}
            <div className="px-6 py-3 bg-slate-100 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedQuotePDF(null)}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-xs"
              >
                Fermer l'Aperçu
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODALE DE VUE DÉTAILLÉE : DEVIS COMMERCIAL */}
      {/* ============================================================ */}
      {selectedQuoteDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in overflow-y-auto">
          <div className="my-auto w-full max-w-xl bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-800/80 flex items-center justify-between shrink-0 bg-slate-900/60">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-brand-orange" />
                <h3 className="text-sm font-bold text-white">
                  Fiche Détaillée — Devis {selectedQuoteDetail.quoteNumber}
                </h3>
              </div>
              <button
                onClick={() => setSelectedQuoteDetail(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-5 overflow-y-auto flex-1 text-xs">
              <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                <div>
                  <span className="text-slate-400 block mb-0.5">Client destinataire</span>
                  <p className="font-bold text-white text-sm">{selectedQuoteDetail.clientName}</p>
                  <p className="text-slate-400 text-[11px] mt-0.5">Marque : {brand.name}</p>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 block mb-0.5">Statut commercial</span>
                  <span className={`inline-block px-2.5 py-1 rounded-md text-xs font-semibold border ${
                    selectedQuoteDetail.status === 'Accepté' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-sky-500/10 text-sky-400 border-sky-500/20'
                  }`}>
                    {selectedQuoteDetail.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-lg bg-slate-950/40 border border-slate-800/80">
                  <span className="text-slate-400 text-[11px] block">Date d'émission</span>
                  <p className="font-semibold text-white mt-1">{formatDate(selectedQuoteDetail.date)}</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-950/40 border border-slate-800/80">
                  <span className="text-slate-400 text-[11px] block">Validité jusqu'au</span>
                  <p className="font-semibold text-amber-400 mt-1">{formatDate(selectedQuoteDetail.validUntil)}</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-950/40 border border-slate-800/80">
                  <span className="text-slate-400 text-[11px] block">Articles inclus</span>
                  <p className="font-semibold text-white mt-1">{selectedQuoteDetail.itemsCount || 1} référence(s)</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                <h4 className="font-semibold text-white text-xs uppercase tracking-wider text-slate-300">
                  Ventilation Financière
                </h4>
                <div className="flex justify-between text-slate-300 pt-1">
                  <span>Montant Total HT :</span>
                  <span className="font-mono font-bold text-white">{formatCurrency(selectedQuoteDetail.totalHT)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>TVA estimée (20%) :</span>
                  <span className="font-mono">{formatCurrency(selectedQuoteDetail.totalHT * 0.2)}</span>
                </div>
                <div className="flex justify-between text-emerald-400 font-bold pt-2 border-t border-slate-800 text-sm">
                  <span>Montant Total TTC :</span>
                  <span className="font-mono">{formatCurrency(selectedQuoteDetail.totalTTC || (selectedQuoteDetail.totalHT * 1.2))}</span>
                </div>
              </div>
            </div>

            <div className="px-6 py-3 bg-slate-950/70 border-t border-slate-800 flex justify-between items-center shrink-0">
              <button
                onClick={() => {
                  const q = selectedQuoteDetail;
                  setSelectedQuoteDetail(null);
                  setSelectedQuotePDF(q);
                }}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Générer Aperçu PDF</span>
              </button>
              <button
                onClick={() => setSelectedQuoteDetail(null)}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODALE DE VUE DÉTAILLÉE : COMMANDE CLIENT */}
      {/* ============================================================ */}
      {selectedOrderDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in overflow-y-auto">
          <div className="my-auto w-full max-w-xl bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-800/80 flex items-center justify-between shrink-0 bg-slate-900/60">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-brand-orange" />
                <h3 className="text-sm font-bold text-white">
                  Détail de Commande — {selectedOrderDetail.orderNumber}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrderDetail(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-5 overflow-y-auto flex-1 text-xs">
              <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                <div>
                  <span className="text-slate-400 block mb-0.5">Client Acheteur</span>
                  <p className="font-bold text-white text-sm">{selectedOrderDetail.clientName}</p>
                  <p className="text-slate-400 text-[11px] mt-0.5">{selectedOrderDetail.clientEmail}</p>
                </div>
                <div className="text-right space-y-1">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Paiement :</span>
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {selectedOrderDetail.paymentStatus}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Expédition :</span>
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-medium bg-orange-500/10 text-orange-400 border border-orange-500/20">
                      {selectedOrderDetail.logisticsStatus}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-lg bg-slate-950/40 border border-slate-800/80">
                  <span className="text-slate-400 text-[11px] block">Date de Commande</span>
                  <p className="font-semibold text-white mt-1">{formatDate(selectedOrderDetail.date)}</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-950/40 border border-slate-800/80">
                  <span className="text-slate-400 text-[11px] block">Transporteur</span>
                  <p className="font-semibold text-white mt-1">{selectedOrderDetail.carrier}</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-950/40 border border-slate-800/80">
                  <span className="text-slate-400 text-[11px] block">N° Tracking</span>
                  <p className="font-mono font-semibold text-brand-orange mt-1 truncate">{selectedOrderDetail.trackingNumber}</p>
                </div>
              </div>

              {/* Workflow Stepper */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
                <h4 className="font-semibold text-slate-300 text-xs uppercase tracking-wider">
                  Étapes de Préparation & Contrôle Qualité
                </h4>
                <div className="space-y-2 text-[11px]">
                  <div className="flex items-center gap-2 text-emerald-400 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Commande enregistrée & stock réservé</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-400 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Conditionnement & contrôle conformité ISO 22716</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300 font-medium">
                    <span className="w-3.5 h-3.5 rounded-full border border-orange-400 flex items-center justify-center text-[9px] text-orange-400">•</span>
                    <span>Colisage & remise au transporteur {selectedOrderDetail.carrier}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400">Total Réglé TTC :</span>
                <span className="text-base font-bold text-emerald-400 font-mono">
                  {formatCurrency(selectedOrderDetail.totalTTC)}
                </span>
              </div>
            </div>

            <div className="px-6 py-3 bg-slate-950/70 border-t border-slate-800 flex justify-end shrink-0">
              <button
                onClick={() => setSelectedOrderDetail(null)}
                className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODALE DE VUE DÉTAILLÉE : LOGISTIQUE ET SUIVI */}
      {/* ============================================================ */}
      {selectedLogisticsDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in overflow-y-auto">
          <div className="my-auto w-full max-w-xl bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-800/80 flex items-center justify-between shrink-0 bg-slate-900/60">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-brand-orange" />
                <h3 className="text-sm font-bold text-white">
                  Suivi d'Expédition — {selectedLogisticsDetail.trackingNumber}
                </h3>
              </div>
              <button
                onClick={() => setSelectedLogisticsDetail(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-5 overflow-y-auto flex-1 text-xs">
              <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                <div>
                  <span className="text-slate-400 block mb-0.5">Destinataire</span>
                  <p className="font-bold text-white text-sm">{selectedLogisticsDetail.clientName}</p>
                  <p className="text-slate-400 text-[11px] mt-0.5">Destination : {selectedLogisticsDetail.destination}</p>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 block mb-0.5">Statut Livraison</span>
                  <span className="inline-block px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {selectedLogisticsDetail.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-lg bg-slate-950/40 border border-slate-800/80">
                  <span className="text-slate-400 text-[11px] block">Transporteur</span>
                  <p className="font-semibold text-white mt-1">{selectedLogisticsDetail.carrier}</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-950/40 border border-slate-800/80">
                  <span className="text-slate-400 text-[11px] block">Date Expédition</span>
                  <p className="font-semibold text-white mt-1">{formatDate(selectedLogisticsDetail.dateShipped)}</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-950/40 border border-slate-800/80">
                  <span className="text-slate-400 text-[11px] block">Livraison Estimée</span>
                  <p className="font-semibold text-sky-400 mt-1">{formatDate(selectedLogisticsDetail.estimatedDelivery)}</p>
                </div>
              </div>

              {/* Traçabilité Hubs Timeline */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
                <h4 className="font-semibold text-slate-300 text-xs uppercase tracking-wider">
                  Journal d'Acheminement & Scans
                </h4>
                <div className="space-y-3 pl-2 border-l-2 border-slate-800 text-[11px]">
                  <div className="relative pl-3">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 absolute -left-[17px] top-1"></span>
                    <p className="font-semibold text-white">Prise en charge Hub Logistique Casablanca</p>
                    <p className="text-slate-400 text-[10px]">{formatDate(selectedLogisticsDetail.dateShipped)} — 09:15</p>
                  </div>
                  <div className="relative pl-3">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 absolute -left-[17px] top-1"></span>
                    <p className="font-semibold text-white">Tri effectué & départ vers plateforme régionale</p>
                    <p className="text-slate-400 text-[10px]">{formatDate(selectedLogisticsDetail.dateShipped)} — 14:30</p>
                  </div>
                  <div className="relative pl-3">
                    <span className="w-2 h-2 rounded-full bg-sky-400 absolute -left-[17px] top-1"></span>
                    <p className="font-semibold text-sky-300">En cours d'acheminement vers {selectedLogisticsDetail.destination}</p>
                    <p className="text-slate-400 text-[10px]">Livraison estimée : {formatDate(selectedLogisticsDetail.estimatedDelivery)}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-3 bg-slate-950/70 border-t border-slate-800 flex justify-end shrink-0">
              <button
                onClick={() => setSelectedLogisticsDetail(null)}
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
