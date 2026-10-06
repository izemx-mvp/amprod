import React, { useState } from 'react';
import { 
  BarChart3, 
  Users, 
  ShoppingCart, 
  Package, 
  Sparkles, 
  ArrowUpRight, 
  CheckCircle2,
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';
import { BrandConfig, Product, Order, LeadOrClient } from '../types';
import { formatCurrency } from '../utils/cn';

interface ErpDashboardProps {
  brand: BrandConfig;
  products: Product[];
  orders: Order[];
  leads: LeadOrClient[];
  onOpenLead: (lead: LeadOrClient) => void;
  onOpenProduct: (product: Product) => void;
}

const SALES_TREND_DATA = [
  { month: 'Mai', ventes: 185000, commandes: 74 },
  { month: 'Juin', ventes: 210000, commandes: 88 },
  { month: 'Juil', ventes: 195000, commandes: 82 },
  { month: 'Août', ventes: 240000, commandes: 104 },
  { month: 'Sept', ventes: 295000, commandes: 128 },
  { month: 'Octobre', ventes: 342000, commandes: 146 },
];

export const ErpDashboard: React.FC<ErpDashboardProps> = ({
  brand,
  products,
  orders,
  leads,
  onOpenLead,
  onOpenProduct,
}) => {
  const brandProducts = products.filter(p => p.brandId === brand.id);
  const brandOrders = orders.filter(o => o.brandId === brand.id);
  const brandLeads = leads.filter(l => l.brandId === brand.id);

  const totalRevenue = brandProducts.reduce((acc, p) => acc + p.revenueGenerated, 0);
  const totalStockUnits = brandProducts.reduce((acc, p) => acc + p.stock, 0);
  const lowStockCount = brandProducts.filter(p => p.stock <= p.minStock).length;

  return (
    <div className="w-full space-y-6">
      
      {/* 1. ÉPURÉ : En-tête textuel SaaS haut de gamme (Pas de bannière massive unie) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              Vue d'Ensemble & Performance
            </h1>
            <span 
              className="text-[11px] px-2.5 py-0.5 rounded-md font-medium border"
              style={{
                borderColor: `${brand.primaryColor}40`,
                color: brand.primaryColor,
                backgroundColor: `${brand.primaryColor}12`
              }}
            >
              {brand.themeGreenName}
            </span>
          </div>
          <p className="text-xs text-slate-400">
            {brand.tagline} • Indicateurs de vente consolidés, pipeline de distribution et stocks en temps réel.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-2 rounded-xl bg-slate-900/60 border border-slate-800 text-right">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-medium block">
              Chiffre d'Affaires Période
            </span>
            <span className="text-lg font-bold text-white tracking-tight">
              {formatCurrency(totalRevenue || 289400)}
            </span>
          </div>
        </div>
      </div>

      {/* 2. GRILLES DE KPI ÉPURÉES (Style SaaS Touvis AI : Chiffres blancs, fond slate-900/60, bordure fine) */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1 : Commandes */}
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/90 flex flex-col justify-between hover-lift">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Commandes en cours</span>
            <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-brand-orange">
              <ShoppingCart className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <p className="text-2xl font-bold text-white tracking-tight">
              {brandOrders.length || 18}
            </p>
            <span className="text-xs font-medium text-emerald-400 flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" /> +12.4%
            </span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Flux logistique opérationnel</span>
        </div>

        {/* KPI 2 : Pipeline CRM */}
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/90 flex flex-col justify-between hover-lift">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Pipeline CRM / Leads</span>
            <div 
              className="w-8 h-8 rounded-lg border flex items-center justify-center"
              style={{
                borderColor: `${brand.primaryColor}30`,
                backgroundColor: `${brand.primaryColor}12`,
                color: brand.primaryColor
              }}
            >
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <p className="text-2xl font-bold text-white tracking-tight">
              {brandLeads.length || 12}
            </p>
            <span className="text-xs font-medium text-amber-400 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> 88% IA
            </span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Opportunités qualifiées</span>
        </div>

        {/* KPI 3 : Stock */}
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/90 flex flex-col justify-between hover-lift">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Unités en inventaire</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <p className="text-2xl font-bold text-white tracking-tight">
              {totalStockUnits.toLocaleString()}
            </p>
            {lowStockCount > 0 ? (
              <span className="text-xs font-medium text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md">
                {lowStockCount} bas
              </span>
            ) : (
              <span className="text-xs font-medium text-emerald-400">Optimal</span>
            )}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Seuils R&D synchronisés</span>
        </div>

        {/* KPI 4 : SLA */}
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/90 flex flex-col justify-between hover-lift">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Taux de Service & SLA</span>
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <p className="text-2xl font-bold text-white tracking-tight">
              99.2%
            </p>
            <span className="text-xs font-medium text-emerald-400">Conforme</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Expéditions certifiées</span>
        </div>

      </div>

      {/* 3. GRAPHIQUE PLEINE LARGEUR & TOP PRODUITS (S'étend à 100% de la largeur disponible) */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Graphique de Ventes (8 colonnes) */}
        <div className="lg:col-span-8 p-6 rounded-xl bg-slate-900/60 border border-slate-800/90 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-white tracking-wide">
                Évolution du Chiffre d'Affaires & Flux Commercial
              </h2>
              <p className="text-xs text-slate-400">
                Trajectoire semestrielle consolidée
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-orange-500/10 text-orange-400 border border-orange-500/20">
              +18.2% vs M-1
            </span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={SALES_TREND_DATA}>
                <defs>
                  <linearGradient id="colorSalesSaaS" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={brand.primaryColor} stopOpacity={0.25}/>
                    <stop offset="95%" stopColor={brand.primaryColor} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.25} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} stroke="#475569" />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={(val) => `${val / 1000}k`} stroke="#475569" />
                <Tooltip 
                  formatter={(val: number) => [formatCurrency(val), 'Chiffre d\'Affaires']}
                  contentStyle={{ 
                    backgroundColor: '#0f172a', 
                    borderRadius: '8px', 
                    borderColor: '#334155', 
                    color: '#f8fafc',
                    fontSize: '12px'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="ventes" 
                  stroke={brand.primaryColor} 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorSalesSaaS)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Produits Phares (4 colonnes) */}
        <div className="lg:col-span-4 p-6 rounded-xl bg-slate-900/60 border border-slate-800/90 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white tracking-wide">
              Catalogue Star
            </h2>
            <span className="text-xs text-slate-400">Clic pour fiche</span>
          </div>

          <div className="space-y-3">
            {brandProducts.map((prod) => (
              <div
                key={prod.id}
                onClick={() => onOpenProduct(prod)}
                className="p-3 rounded-lg bg-slate-950/50 border border-slate-800/80 hover:border-slate-700 cursor-pointer transition-all flex items-center gap-3 group"
              >
                <img 
                  src={prod.image} 
                  alt={prod.name} 
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&auto=format&fit=crop&q=80';
                  }}
                  className="w-11 h-11 rounded-lg object-cover border border-slate-800 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-semibold text-slate-200 truncate group-hover:text-brand-orange transition-colors">
                    {prod.name}
                  </h4>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                    <span>{formatCurrency(prod.price)}</span>
                    <span className="font-medium text-emerald-400">{prod.salesLast30Days} ventes</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 4. CRM RECENT LEADS (Étiré sur 100% de largeur) */}
      <div className="w-full p-6 rounded-xl bg-slate-900/60 border border-slate-800/90 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-white tracking-wide flex items-center gap-2">
              <Users className="w-4 h-4 text-brand-orange" />
              Contacts Référents & Opportunités Qualifiées
            </h2>
            <p className="text-xs text-slate-400">
              Accédez instantanément à la vue 360° avec timeline chronologique et données de facturation.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {brandLeads.map((lead) => (
            <div
              key={lead.id}
              onClick={() => onOpenLead(lead)}
              className="p-4 rounded-xl bg-slate-950/50 border border-slate-800/80 hover:border-slate-700 cursor-pointer transition-all space-y-3 group"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-slate-200 group-hover:text-brand-orange transition-colors">
                    {lead.name}
                  </h4>
                  <p className="text-[11px] text-slate-400 truncate">
                    {lead.company || lead.city}
                  </p>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  Score {lead.aiScore}%
                </span>
              </div>

              <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800/80">
                <span className="text-[11px] text-slate-400">{lead.status}</span>
                <span className="text-xs font-medium text-brand-orange flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  Fiche 360° <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
