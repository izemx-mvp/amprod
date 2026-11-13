import React, { useMemo, useRef, useState } from 'react';
import {
  ArrowUpRight,
  Bot,
  Crown,
  LayoutDashboard,
  Menu,
  Package,
  PanelLeftClose,
  PanelLeftOpen,
  Scale,
  Send,
  Trophy,
  Wallet,
  TrendingUp,
  X,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { BRANDS } from '../data/brands';
import { brandFallbackImage } from '../data/images';
import { INITIAL_PRODUCTS } from '../data/products';
import { INITIAL_TRAINING_COURSES } from '../data/trainings';
import { INITIAL_CLAIMS, INITIAL_INVOICES, INITIAL_ORDERS, INITIAL_QUOTES } from '../data/operations';
import { INITIAL_LEADS_COSMETICS, INITIAL_LEADS_FORMATIONS, INITIAL_LEADS_HUILES, INITIAL_LEADS_REHAB } from '../data/leads';
import { EXTRA_LEADS } from '../data/mockExtras';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { BrandId, Claim, Invoice, LeadOrClient, Order, Product, Quote, TrainingCourse } from '../types';
import { formatCurrency } from '../utils/cn';
import { BrandLogo } from '../components/BrandLogo';
import {
  BRAND_CHART_COLORS,
  ChartLegend,
  ChartTooltip,
  activeDot,
  barCursor,
  formatCompact,
  gridProps,
  lineCursor,
  seriesDot,
  xAxisProps,
  yAxisProps,
} from '../components/ChartKit';

interface CeoHubPageProps {
  onNavigateToBrand?: (brandId: string) => void;
}

type SubsidiaryId = Exclude<BrandId, 'seo'>;
const SUBSIDIARIES: SubsidiaryId[] = ['cosmetics', 'rehab', 'huiles', 'formations'];
const shortName = (id: SubsidiaryId) => BRANDS[id].name.replace('AM PROD ', '');

/** Un article vendu par le groupe : produit d'une filiale ou formation de l'académie */
interface CatalogItem {
  id: string;
  brandId: SubsidiaryId;
  name: string;
  category: string;
  image: string;
  revenue: number;
  units: number;
  unitLabel: string;
  rating: number;
}

interface BrandStats {
  id: SubsidiaryId;
  revenue: number;
  units: number;
  catalogSize: number;
  avgRating: number;
  ordersCount: number;
  ordersValue: number;
  invoiced: number;
  paid: number;
  due: number;
  collectionRate: number;
  leadsCount: number;
  clientsCount: number;
  pendingQuotesValue: number;
  openClaims: number;
  topItem?: CatalogItem;
}

// Répartition indicative du chiffre d'affaires sur les 6 derniers mois (données de démonstration)
const TREND_MONTHS = ['Mai', 'Juin', 'Juil', 'Août', 'Sept', 'Oct'];
const TREND_WEIGHTS: Record<SubsidiaryId, number[]> = {
  cosmetics: [0.126, 0.143, 0.133, 0.164, 0.201, 0.233],
  rehab: [0.141, 0.152, 0.158, 0.165, 0.184, 0.2],
  huiles: [0.112, 0.128, 0.171, 0.158, 0.196, 0.235],
  formations: [0.158, 0.169, 0.124, 0.09, 0.203, 0.256],
};

const CLOSED_CLAIM_STATUSES = ['Résolue', 'Résolu', 'Refusée', 'Rejeté'];

type TabId = 'overview' | 'compare' | 'products' | 'assistant';
const TABS: { id: TabId; label: string; icon: React.ReactNode; badge: string; badgeClass: string }[] = [
  { id: 'overview', label: "Dashboard & Vue d'ensemble", icon: <LayoutDashboard className="w-4 h-4 shrink-0" />, badge: 'Live', badgeClass: 'text-orange-300 bg-orange-500/10 border-orange-500/30' },
  { id: 'compare', label: 'Comparatif des 4 marques', icon: <Scale className="w-4 h-4 shrink-0" />, badge: '4', badgeClass: 'text-emerald-300 bg-emerald-500/10 border-emerald-500/30' },
  { id: 'products', label: 'Meilleures ventes', icon: <Trophy className="w-4 h-4 shrink-0" />, badge: 'Podium', badgeClass: 'text-amber-300 bg-amber-500/10 border-amber-500/30' },
  { id: 'assistant', label: 'Assistant CEO', icon: <Bot className="w-4 h-4 shrink-0" />, badge: 'IA', badgeClass: 'text-indigo-300 bg-indigo-500/10 border-indigo-500/30' },
];

interface ChatMessage {
  from: 'user' | 'agent';
  lines: string[];
}

export const CeoHubPage: React.FC<CeoHubPageProps> = ({ onNavigateToBrand }) => {
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Mêmes données que les ERP des filiales (lecture seule) : les chiffres sont donc cohérents entre les écrans
  const [products] = useLocalStorage<Product[]>('am_erp_products', INITIAL_PRODUCTS);
  const [courses] = useLocalStorage<TrainingCourse[]>('am_erp_trainings', INITIAL_TRAINING_COURSES);
  const [orders] = useLocalStorage<Order[]>('am_erp_orders_v2', INITIAL_ORDERS);
  const [invoices] = useLocalStorage<Invoice[]>('am_erp_invoices_v2', INITIAL_INVOICES);
  const [quotes] = useLocalStorage<Quote[]>('am_erp_quotes_v2', INITIAL_QUOTES);
  const [claims] = useLocalStorage<Claim[]>('am_erp_claims', INITIAL_CLAIMS);
  const [leads] = useLocalStorage<LeadOrClient[]>('am_erp_leads', [
    ...INITIAL_LEADS_COSMETICS,
    ...INITIAL_LEADS_REHAB,
    ...INITIAL_LEADS_HUILES,
    ...INITIAL_LEADS_FORMATIONS,
    ...EXTRA_LEADS,
  ]);

  // Catalogue consolidé : produits des 3 filiales + formations de l'académie
  const catalog = useMemo<CatalogItem[]>(() => {
    const productItems: CatalogItem[] = products
      .filter((p) => SUBSIDIARIES.includes(p.brandId as SubsidiaryId))
      .map((p) => ({
        id: p.id,
        brandId: p.brandId as SubsidiaryId,
        name: p.name,
        category: p.category,
        image: p.image,
        revenue: p.revenueGenerated,
        units: p.salesLast30Days,
        unitLabel: 'ventes / 30 j',
        rating: p.rating,
      }));
    const courseItems: CatalogItem[] = courses.map((c) => ({
      id: c.id,
      brandId: 'formations',
      name: c.title,
      category: `Formation ${c.level}`,
      image: c.image,
      revenue: c.priceTotal * c.totalEnrolled,
      units: c.totalEnrolled,
      unitLabel: 'inscrits',
      rating: c.rating,
    }));
    return [...productItems, ...courseItems];
  }, [products, courses]);

  const stats = useMemo<BrandStats[]>(
    () =>
      SUBSIDIARIES.map((id) => {
        const items = catalog.filter((i) => i.brandId === id);
        const brandOrders = orders.filter((o) => o.brandId === id);
        const brandInvoices = invoices.filter((i) => i.brandId === id);
        const brandLeads = leads.filter((l) => l.brandId === id);
        const invoiced = brandInvoices.reduce((acc, i) => acc + i.amountTotal, 0);
        const paid = brandInvoices.reduce((acc, i) => acc + i.amountPaid, 0);
        return {
          id,
          revenue: items.reduce((acc, i) => acc + i.revenue, 0),
          units: items.reduce((acc, i) => acc + i.units, 0),
          catalogSize: items.length,
          avgRating: items.length ? items.reduce((acc, i) => acc + i.rating, 0) / items.length : 0,
          ordersCount: brandOrders.length,
          ordersValue: brandOrders.reduce((acc, o) => acc + o.totalTTC, 0),
          invoiced,
          paid,
          due: invoiced - paid,
          collectionRate: invoiced > 0 ? (paid / invoiced) * 100 : 0,
          leadsCount: brandLeads.filter((l) => !l.isClient).length,
          clientsCount: brandLeads.filter((l) => l.isClient).length,
          pendingQuotesValue: quotes
            .filter((q) => q.brandId === id && (q.status === 'Envoyé' || q.status === 'Brouillon'))
            .reduce((acc, q) => acc + q.totalHT, 0),
          openClaims: claims.filter((c) => c.brandId === id && !CLOSED_CLAIM_STATUSES.includes(c.status)).length,
          topItem: [...items].sort((a, b) => b.revenue - a.revenue)[0],
        };
      }),
    [catalog, orders, invoices, leads, quotes, claims]
  );

  const groupRevenue = stats.reduce((acc, s) => acc + s.revenue, 0);
  const groupPaid = stats.reduce((acc, s) => acc + s.paid, 0);
  const groupDue = stats.reduce((acc, s) => acc + s.due, 0);
  const groupInvoiced = stats.reduce((acc, s) => acc + s.invoiced, 0);
  const ranking = [...stats].sort((a, b) => b.revenue - a.revenue);
  const leader = ranking[0];
  const topItems = [...catalog].sort((a, b) => b.revenue - a.revenue);
  const bestSeller = topItems[0];
  const share = (value: number) => (groupRevenue > 0 ? (value / groupRevenue) * 100 : 0);

  const trendData = TREND_MONTHS.map((month, i) => {
    const row: Record<string, string | number> = { month };
    stats.forEach((s) => {
      row[s.id] = Math.round(s.revenue * TREND_WEIGHTS[s.id][i]);
    });
    return row;
  });

  // ------------------------------------------------------------------
  // Assistant CEO : réponses calculées à partir des données ci-dessus
  // ------------------------------------------------------------------
  const [chat, setChat] = useState<ChatMessage[]>([
    {
      from: 'agent',
      lines: [
        'Bonjour. Je compare vos 4 marques à partir des données des ERP.',
        "Demandez-moi par exemple le chiffre d'affaires par marque, la marque la plus performante, les produits les plus vendus ou les impayés.",
      ],
    },
  ]);
  const [draft, setDraft] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  const brandSummary = (s: BrandStats): string[] => [
    `${BRANDS[s.id].name} — chiffre d'affaires : ${formatCurrency(s.revenue)} (${share(s.revenue).toFixed(1)} % du groupe).`,
    `Meilleure vente : ${s.topItem ? `${s.topItem.name} (${formatCurrency(s.topItem.revenue)})` : 'aucune'}.`,
    `Facturé ${formatCurrency(s.invoiced)}, encaissé ${formatCurrency(s.paid)}, reste dû ${formatCurrency(s.due)}.`,
    `${s.leadsCount} leads, ${s.clientsCount} clients, ${s.openClaims} réclamation(s) ouverte(s).`,
  ];

  const answer = (question: string): string[] => {
    const q = question.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
    const has = (...words: string[]) => words.some((w) => q.includes(w));

    const mentioned = stats.find(
      (s) =>
        (s.id === 'cosmetics' && has('cosmeti', 'matiere')) ||
        (s.id === 'rehab' && has('rehab')) ||
        (s.id === 'huiles' && has('huile', 'argan')) ||
        (s.id === 'formations' && has('formation', 'academie'))
    );

    if (has('produit', 'vendu', 'best', 'top vente', 'meilleures ventes', 'article')) {
      return [
        'Les 5 meilleures ventes du groupe :',
        ...topItems.slice(0, 5).map(
          (item, i) => `${i + 1}. ${item.name} (${shortName(item.brandId)}) — ${formatCurrency(item.revenue)}, ${item.units} ${item.unitLabel}`
        ),
      ];
    }
    if (has('impaye', 'reste du', 'encaiss', 'paiement', 'facture', 'tresorerie', 'retard')) {
      return [
        `Encaissé : ${formatCurrency(groupPaid)} sur ${formatCurrency(groupInvoiced)} facturés. Reste dû : ${formatCurrency(groupDue)}.`,
        ...[...stats].sort((a, b) => b.due - a.due).map(
          (s) => `• ${shortName(s.id)} : ${formatCurrency(s.due)} à encaisser (${s.collectionRate.toFixed(0)} % déjà réglé)`
        ),
      ];
    }
    if (has('reclamation', 'sav', 'litige', 'plainte')) {
      return [
        'Réclamations ouvertes par marque :',
        ...[...stats].sort((a, b) => b.openClaims - a.openClaims).map((s) => `• ${shortName(s.id)} : ${s.openClaims}`),
      ];
    }
    if (has('lead', 'prospect', 'client', 'pipeline', 'devis')) {
      return [
        'Activité commerciale par marque :',
        ...stats.map(
          (s) => `• ${shortName(s.id)} : ${s.leadsCount} leads, ${s.clientsCount} clients, ${formatCurrency(s.pendingQuotesValue)} de devis en attente`
        ),
      ];
    }
    if (mentioned && !has('compar', 'classement', 'toutes', '4 marques', 'quatre')) {
      return brandSummary(mentioned);
    }
    if (has('performant', 'leader', 'meilleure marque', 'classement', 'premiere', 'numero 1', 'n°1', 'compar')) {
      return [
        `La marque la plus performante est ${BRANDS[leader.id].name} avec ${formatCurrency(leader.revenue)} (${share(leader.revenue).toFixed(1)} % du groupe).`,
        'Classement complet :',
        ...ranking.map((s, i) => `${i + 1}. ${shortName(s.id)} — ${formatCurrency(s.revenue)}`),
      ];
    }
    if (has('chiffre', 'ca ', 'revenu', 'total', 'combien')) {
      return [
        `Chiffre d'affaires du groupe : ${formatCurrency(groupRevenue)}.`,
        ...ranking.map((s) => `• ${shortName(s.id)} : ${formatCurrency(s.revenue)} (${share(s.revenue).toFixed(1)} %)`),
      ];
    }
    return [
      'Je peux répondre sur ces sujets :',
      "• le chiffre d'affaires par marque et au total",
      '• la marque la plus performante et le classement',
      '• les produits et formations les plus vendus',
      '• les encaissements et impayés',
      '• les leads, clients, devis et réclamations',
      'Vous pouvez aussi citer une marque pour obtenir sa fiche.',
    ];
  };

  const ask = (text: string) => {
    const question = text.trim();
    if (!question) return;
    setChat((prev) => [...prev, { from: 'user', lines: [question] }, { from: 'agent', lines: answer(question) }]);
    setDraft('');
    window.setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 50);
  };

  const SUGGESTIONS = [
    "Quel est le chiffre d'affaires par marque ?",
    'Quelle marque est la plus performante ?',
    'Quels sont les produits les plus vendus ?',
    'Où en sont les impayés ?',
    'Résume Rehab Bio',
  ];

  // ------------------------------------------------------------------
  // Comparatif : une ligne par indicateur, la meilleure valeur est signalée
  // ------------------------------------------------------------------
  const metricRows: {
    label: string;
    value: (s: BrandStats) => number;
    format: (v: number) => string;
    lowerIsBetter?: boolean;
  }[] = [
    { label: "Chiffre d'affaires", value: (s) => s.revenue, format: (v) => formatCurrency(v) },
    { label: 'Part du groupe', value: (s) => share(s.revenue), format: (v) => `${v.toFixed(1)} %` },
    { label: 'Références au catalogue', value: (s) => s.catalogSize, format: (v) => `${v}` },
    { label: 'Note moyenne clients', value: (s) => s.avgRating, format: (v) => `${v.toFixed(2)} / 5` },
    { label: 'Montant facturé', value: (s) => s.invoiced, format: (v) => formatCurrency(v) },
    { label: 'Montant encaissé', value: (s) => s.paid, format: (v) => formatCurrency(v) },
    { label: 'Reste à encaisser', value: (s) => s.due, format: (v) => formatCurrency(v), lowerIsBetter: true },
    { label: "Taux d'encaissement", value: (s) => s.collectionRate, format: (v) => `${v.toFixed(0)} %` },
    { label: 'Leads en cours', value: (s) => s.leadsCount, format: (v) => `${v}` },
    { label: 'Clients actifs', value: (s) => s.clientsCount, format: (v) => `${v}` },
    { label: 'Devis en attente', value: (s) => s.pendingQuotesValue, format: (v) => formatCurrency(v) },
    { label: 'Réclamations ouvertes', value: (s) => s.openClaims, format: (v) => `${v}`, lowerIsBetter: true },
  ];

  const card = 'rounded-xl bg-slate-900/60 border border-slate-800/90';

  return (
    <div className="w-full flex-1 flex flex-col" style={{ ['--brand-color' as any]: BRANDS.seo.primaryColor }}>
      {/* En-tête du cockpit */}
      <div className="w-full px-6 lg:px-8 py-4 border-b border-slate-800/80 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            aria-label={mobileSidebarOpen ? 'Fermer la navigation' : 'Ouvrir la navigation'}
            className="p-1.5 rounded-lg text-slate-200 md:hidden hover:bg-slate-900 border border-slate-800"
          >
            {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <BrandLogo brandId="seo" variant="icon" size="md" />
          <div>
            <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white">Cockpit de Direction — Groupe AM PROD</h1>
            <span className="text-[11px] px-2 py-0.5 rounded-md font-medium border border-indigo-500/20 bg-indigo-500/10 text-indigo-300 inline-block mt-0.5">
              Direction Générale • Comparatif des {SUBSIDIARIES.length} marques
            </span>
          </div>
        </div>
        <div className="px-3.5 py-1.5 rounded-xl bg-slate-900/60 border border-slate-800 lg:text-right self-start lg:self-center">
          <span className="text-[10px] uppercase tracking-wider text-slate-400 font-medium block">Chiffre d'affaires groupe</span>
          <span className="text-lg font-bold text-white tracking-tight">{formatCurrency(groupRevenue)}</span>
        </div>
      </div>

      {/* Espace de travail : barre latérale + contenu */}
      <div className="flex-1 w-full flex relative min-h-[calc(100vh-120px)]">
        {mobileSidebarOpen && (
          <div
            onClick={() => setMobileSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 z-30 md:hidden backdrop-blur-sm"
            aria-hidden="true"
          />
        )}

        <aside
          className={`fixed md:sticky top-0 md:top-[57px] h-screen md:h-[calc(100vh-57px)] z-40 md:z-30 bg-slate-950 border-r border-slate-800/80 p-3 flex flex-col justify-between shrink-0 transition-all duration-300 overflow-y-auto ${
            isSidebarCollapsed ? 'w-16' : 'w-72'
          } ${mobileSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'}`}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
              {!isSidebarCollapsed ? (
                <div className="flex items-center gap-2 px-1">
                  <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Navigation CEO</span>
                </div>
              ) : (
                <div className="w-full flex justify-center">
                  <span className="w-2 h-2 rounded-full bg-indigo-500" />
                </div>
              )}
              <button
                type="button"
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                className="hidden md:flex p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
                title={isSidebarCollapsed ? 'Agrandir le menu' : 'Réduire le menu'}
                aria-label={isSidebarCollapsed ? 'Agrandir le menu' : 'Réduire le menu'}
              >
                {isSidebarCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
              </button>
              <button
                type="button"
                onClick={() => setMobileSidebarOpen(false)}
                aria-label="Fermer la navigation"
                className="md:hidden p-1 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <nav className="space-y-1.5" aria-label="Navigation du cockpit CEO">
              {TABS.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => { setActiveTab(tab.id); setMobileSidebarOpen(false); }}
                    title={isSidebarCollapsed ? tab.label : undefined}
                    aria-current={isActive ? 'page' : undefined}
                    className={`w-full flex items-center ${
                      isSidebarCollapsed ? 'justify-center px-2 py-2.5' : 'justify-between px-3 py-2.5 text-left'
                    } rounded-lg text-xs font-medium transition-all border ${
                      isActive
                        ? 'bg-slate-900 text-white font-semibold border-indigo-500/40'
                        : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                    }`}
                  >
                    <span className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : 'gap-2.5 min-w-0 pr-2'}`}>
                      <span className={isActive ? 'text-indigo-300' : 'text-slate-400'}>{tab.icon}</span>
                      {!isSidebarCollapsed && <span className="leading-tight">{tab.label}</span>}
                    </span>
                    {!isSidebarCollapsed && (
                      <span className={`shrink-0 text-[10px] font-semibold px-1.5 py-0.5 rounded border ${tab.badgeClass}`}>{tab.badge}</span>
                    )}
                  </button>
                );
              })}
            </nav>

            {!isSidebarCollapsed && (
              <div className="pt-4 border-t border-slate-800/80">
                <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Marque n°1</span>
                    <span className="font-bold text-white">{shortName(leader.id)}</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${share(leader.revenue)}%`, backgroundColor: BRAND_CHART_COLORS[leader.id] }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
                    <span>Part du groupe</span>
                    <span className="font-bold text-slate-200">{share(leader.revenue).toFixed(1)} %</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>Reste à encaisser</span>
                    <span className="font-bold text-slate-200">{formatCurrency(groupDue)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-800/80">
            {!isSidebarCollapsed ? (
              <div className="flex items-center justify-between px-1">
                <span className="text-[10px] text-slate-400">AM PROD CEO Cockpit</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">v3.0</span>
              </div>
            ) : (
              <div className="text-center">
                <span className="text-[9px] font-mono text-emerald-400">v3.0</span>
              </div>
            )}
          </div>
        </aside>

        <div className="flex-1 min-w-0 p-6 lg:p-8 space-y-6 overflow-x-hidden">

      {/* ============================ VUE D'ENSEMBLE ============================ */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <div className={`${card} p-5 hover-lift`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400">Chiffre d'affaires groupe</span>
                <span className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-300">
                  <TrendingUp className="w-4 h-4" />
                </span>
              </div>
              <p className="mt-4 text-2xl font-bold text-white tracking-tight">{formatCurrency(groupRevenue)}</p>
              <span className="text-[11px] text-slate-400 mt-1 block">Cumul des 4 marques</span>
            </div>

            <div className={`${card} p-5 hover-lift`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400">Marque la plus performante</span>
                <span className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-300">
                  <Crown className="w-4 h-4" />
                </span>
              </div>
              <p className="mt-4 text-lg font-bold text-white tracking-tight leading-tight">{BRANDS[leader.id].name}</p>
              <span className="text-[11px] text-slate-400 mt-1 block">
                {formatCurrency(leader.revenue)} • {share(leader.revenue).toFixed(1)} % du groupe
              </span>
            </div>

            <div className={`${card} p-5 hover-lift`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400">Meilleure vente du groupe</span>
                <span className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-300">
                  <Package className="w-4 h-4" />
                </span>
              </div>
              <p className="mt-4 text-sm font-bold text-white leading-snug line-clamp-2">{bestSeller?.name ?? '—'}</p>
              {bestSeller && (
                <span className="text-[11px] text-slate-400 mt-1 block">
                  {shortName(bestSeller.brandId)} • {formatCurrency(bestSeller.revenue)}
                </span>
              )}
            </div>

            <div className={`${card} p-5 hover-lift`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400">Encaissements</span>
                <span className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-300">
                  <Wallet className="w-4 h-4" />
                </span>
              </div>
              <p className="mt-4 text-2xl font-bold text-white tracking-tight">{formatCurrency(groupPaid)}</p>
              <span className="text-[11px] text-slate-400 mt-1 block">Reste à encaisser : {formatCurrency(groupDue)}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* CA par marque */}
            <div className={`${card} lg:col-span-7 p-6 space-y-4`}>
              <div>
                <h2 className="text-sm font-semibold text-white">Chiffre d'affaires par marque</h2>
                <p className="text-xs text-slate-400">Produits vendus par les 3 filiales et formations de l'académie</p>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={stats.map((s) => ({ name: shortName(s.id), ca: s.revenue, color: BRAND_CHART_COLORS[s.id] }))}
                    margin={{ top: 24, right: 12, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid {...gridProps} />
                    <XAxis dataKey="name" {...xAxisProps} />
                    <YAxis {...yAxisProps} tickFormatter={formatCompact} />
                    <Tooltip
                      cursor={barCursor}
                      content={<ChartTooltip formatValue={(v) => formatCurrency(v)} seriesLabel={() => "Chiffre d'affaires"} />}
                    />
                    <Bar dataKey="ca" radius={[4, 4, 0, 0]} maxBarSize={28}>
                      {stats.map((s) => (
                        <Cell key={s.id} fill={BRAND_CHART_COLORS[s.id]} />
                      ))}
                      <LabelList
                        dataKey="ca"
                        position="top"
                        offset={8}
                        formatter={(v: number) => formatCompact(v)}
                        style={{ fill: '#cbd5e1', fontSize: 11, fontWeight: 600 }}
                      />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Classement */}
            <div className={`${card} lg:col-span-5 p-6 space-y-4`}>
              <div>
                <h2 className="text-sm font-semibold text-white">Classement des marques</h2>
                <p className="text-xs text-slate-400">Part de chaque marque dans le chiffre d'affaires du groupe</p>
              </div>
              <ol className="space-y-3">
                {ranking.map((s, i) => (
                  <li key={s.id}>
                    <button
                      type="button"
                      onClick={() => onNavigateToBrand?.(s.id)}
                      title={`Ouvrir l'ERP ${BRANDS[s.id].name}`}
                      className="group w-full text-left p-3 rounded-lg bg-slate-950/50 border border-slate-800/80 hover:border-slate-600 transition-colors space-y-2"
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-6 text-center text-xs font-bold ${i === 0 ? 'text-amber-300' : 'text-slate-500'}`}>{i + 1}</span>
                        <BrandLogo brandId={s.id} variant="icon" size="sm" />
                        <span className="flex-1 min-w-0 text-xs font-semibold text-slate-100 truncate">{BRANDS[s.id].name}</span>
                        <span className="text-xs font-bold text-white tabular-nums">{formatCurrency(s.revenue)}</span>
                        <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white transition-colors" />
                      </div>
                      <div className="flex items-center gap-2 pl-9">
                        <div className="flex-1 h-1.5 rounded-full bg-slate-800/70 overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${share(s.revenue)}%`, backgroundColor: BRAND_CHART_COLORS[s.id] }} />
                        </div>
                        <span className="w-12 text-right text-[11px] text-slate-400 tabular-nums">{share(s.revenue).toFixed(1)} %</span>
                      </div>
                    </button>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* Tendance */}
          <div className={`${card} p-6 space-y-4`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-sm font-semibold text-white">Évolution du chiffre d'affaires sur 6 mois</h2>
                <p className="text-xs text-slate-400">Répartition mensuelle indicative (données de démonstration)</p>
              </div>
              <ChartLegend items={SUBSIDIARIES.map((id) => ({ label: shortName(id), color: BRAND_CHART_COLORS[id] }))} />
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData} margin={{ top: 12, right: 16, left: 0, bottom: 0 }}>
                  <CartesianGrid {...gridProps} />
                  <XAxis dataKey="month" {...xAxisProps} padding={{ left: 16, right: 16 }} />
                  <YAxis {...yAxisProps} tickFormatter={formatCompact} />
                  <Tooltip cursor={lineCursor} content={<ChartTooltip formatValue={(v) => formatCurrency(v)} />} />
                  {SUBSIDIARIES.map((id) => (
                    <Line
                      key={id}
                      type="monotone"
                      dataKey={id}
                      name={shortName(id)}
                      stroke={BRAND_CHART_COLORS[id]}
                      strokeWidth={2}
                      strokeLinecap="round"
                      dot={seriesDot(BRAND_CHART_COLORS[id])}
                      activeDot={activeDot(BRAND_CHART_COLORS[id])}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Meilleure vente par marque */}
          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-white">Meilleure vente de chaque marque</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              {stats.map((s) => (
                <div key={s.id} className={`${card} overflow-hidden flex flex-col`}>
                  <div className="relative h-32 bg-slate-900">
                    {s.topItem && (
                      <img
                        src={s.topItem.image}
                        alt=""
                        loading="lazy"
                        onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = brandFallbackImage(s.id); }}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent" />
                    <span className="absolute top-2.5 left-2.5 flex items-center gap-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-full text-white bg-slate-950/75 border border-white/15 backdrop-blur-md">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: BRAND_CHART_COLORS[s.id] }} />
                      {shortName(s.id)}
                    </span>
                  </div>
                  <div className="p-4 space-y-2 flex-1 flex flex-col">
                    <h3 className="text-xs font-bold text-white leading-snug line-clamp-2">{s.topItem?.name ?? 'Aucune vente'}</h3>
                    {s.topItem && (
                      <div className="mt-auto pt-2 flex items-end justify-between border-t border-slate-800/80">
                        <div>
                          <span className="text-[10px] text-slate-400 block">Chiffre d'affaires</span>
                          <span className="text-sm font-bold text-white">{formatCurrency(s.topItem.revenue)}</span>
                        </div>
                        <span className="text-[11px] text-slate-300">{s.topItem.units} {s.topItem.unitLabel}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================ COMPARATIF ============================ */}
      {activeTab === 'compare' && (
        <div className={`${card} p-6 space-y-4`}>
          <div>
            <h2 className="text-sm font-semibold text-white">Comparatif des 4 marques</h2>
            <p className="text-xs text-slate-400">La meilleure valeur de chaque ligne porte la mention « Meilleur ».</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-xs">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="p-3 text-left font-semibold text-slate-400">Indicateur</th>
                  {stats.map((s) => (
                    <th key={s.id} className="p-3 text-right font-semibold text-slate-200">
                      <span className="inline-flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: BRAND_CHART_COLORS[s.id] }} />
                        {shortName(s.id)}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {metricRows.map((row) => {
                  const values = stats.map((s) => row.value(s));
                  const best = row.lowerIsBetter ? Math.min(...values) : Math.max(...values);
                  const allEqual = values.every((v) => v === values[0]);
                  return (
                    <tr key={row.label} className="border-b border-slate-800/60 hover:bg-slate-800/30">
                      <td className="p-3 text-slate-300">{row.label}</td>
                      {stats.map((s, i) => {
                        const isBest = !allEqual && values[i] === best;
                        return (
                          <td key={s.id} className="p-3 text-right tabular-nums">
                            <span className={isBest ? 'font-bold text-white' : 'text-slate-300'}>{row.format(values[i])}</span>
                            {isBest && (
                              <span className="ml-2 px-1.5 py-px rounded text-[10px] font-semibold text-emerald-300 bg-emerald-500/10 border border-emerald-500/25">
                                Meilleur
                              </span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
                <tr>
                  <td className="p-3 text-slate-400">Accès direct</td>
                  {stats.map((s) => (
                    <td key={s.id} className="p-3 text-right">
                      <button
                        type="button"
                        onClick={() => onNavigateToBrand?.(s.id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium border border-slate-700 text-slate-200 hover:text-white hover:border-slate-500 transition-colors"
                      >
                        Ouvrir l'ERP <ArrowUpRight className="w-3 h-3" />
                      </button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ============================ MEILLEURES VENTES ============================ */}
      {activeTab === 'products' && (
        <div className={`${card} p-6 space-y-4`}>
          <div>
            <h2 className="text-sm font-semibold text-white">Meilleures ventes des 4 marques</h2>
            <p className="text-xs text-slate-400">Produits et formations classés par chiffre d'affaires généré.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="p-3 text-left font-semibold w-10">#</th>
                  <th className="p-3 text-left font-semibold">Produit / formation</th>
                  <th className="p-3 text-left font-semibold">Marque</th>
                  <th className="p-3 text-right font-semibold">Volume</th>
                  <th className="p-3 text-right font-semibold">Chiffre d'affaires</th>
                  <th className="p-3 text-left font-semibold w-40">Part du groupe</th>
                </tr>
              </thead>
              <tbody>
                {topItems.slice(0, 12).map((item, i) => (
                  <tr key={item.id} className="border-b border-slate-800/60 hover:bg-slate-800/30">
                    <td className={`p-3 font-bold ${i < 3 ? 'text-amber-300' : 'text-slate-500'}`}>{i + 1}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt=""
                          loading="lazy"
                          onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = brandFallbackImage(item.brandId); }}
                          className="w-10 h-10 rounded-lg object-cover border border-slate-800 shrink-0"
                        />
                        <div className="min-w-0">
                          <span className="block font-semibold text-slate-100 line-clamp-1">{item.name}</span>
                          <span className="block text-[11px] text-slate-400">{item.category}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className="inline-flex items-center gap-2 text-slate-300 whitespace-nowrap">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: BRAND_CHART_COLORS[item.brandId] }} />
                        {shortName(item.brandId)}
                      </span>
                    </td>
                    <td className="p-3 text-right text-slate-300 tabular-nums whitespace-nowrap">{item.units} {item.unitLabel}</td>
                    <td className="p-3 text-right font-bold text-white tabular-nums whitespace-nowrap">{formatCurrency(item.revenue)}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 rounded-full bg-slate-800/70 overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${share(item.revenue)}%`, backgroundColor: BRAND_CHART_COLORS[item.brandId] }} />
                        </div>
                        <span className="w-10 text-right text-[11px] text-slate-400 tabular-nums">{share(item.revenue).toFixed(1)} %</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ============================ ASSISTANT CEO ============================ */}
      {activeTab === 'assistant' && (
        <div className={`${card} flex flex-col max-w-4xl`}>
          <div className="p-5 border-b border-slate-800 flex items-center gap-3">
            <span className="w-9 h-9 rounded-lg bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-300">
              <Bot className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-sm font-semibold text-white">Assistant CEO</h2>
              <p className="text-xs text-slate-400">Répond à partir des chiffres des 4 ERP : ventes, marques, encaissements, activité commerciale.</p>
            </div>
          </div>

          <div className="p-5 space-y-3 max-h-[420px] overflow-y-auto" aria-live="polite">
            {chat.map((m, i) => (
              <div key={i} className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed space-y-1 ${
                    m.from === 'user' ? 'bg-indigo-500 text-white rounded-br-md' : 'bg-slate-950/70 border border-slate-800 text-slate-200 rounded-bl-md'
                  }`}
                >
                  {m.lines.map((line, j) => (
                    <p key={j}>{line}</p>
                  ))}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          <div className="px-5 pb-3 flex flex-wrap gap-2">
            {SUGGESTIONS.map((sugg) => (
              <button
                key={sugg}
                type="button"
                onClick={() => ask(sugg)}
                className="px-2.5 py-1.5 rounded-full text-[11px] font-medium border border-slate-700 text-slate-300 hover:text-white hover:border-indigo-400 transition-colors"
              >
                {sugg}
              </button>
            ))}
          </div>

          <form
            onSubmit={(e) => { e.preventDefault(); ask(draft); }}
            className="p-4 border-t border-slate-800 flex items-center gap-2"
          >
            <input
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              aria-label="Votre question à l'assistant CEO"
              placeholder="Posez une question sur vos 4 marques..."
              className="flex-1 px-3.5 py-2.5 text-xs rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-400"
            />
            <button
              type="submit"
              disabled={!draft.trim()}
              className="px-3.5 py-2.5 rounded-lg text-xs font-semibold text-white bg-indigo-500 hover:bg-indigo-400 disabled:opacity-50 transition-colors flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              Envoyer
            </button>
          </form>
        </div>
      )}
        </div>
      </div>
    </div>
  );
};
