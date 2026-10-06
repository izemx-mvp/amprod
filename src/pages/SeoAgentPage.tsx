import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Activity, 
  AlertTriangle, 
  ArrowUpRight, 
  Zap, 
  Globe,
  Sparkles,
  TrendingUp,
  Award,
  ShoppingBag,
  Search,
  Gauge,
  ExternalLink,
  X,
  MessageSquare,
  ChevronRight,
  Maximize2,
  Calendar,
  Layers,
  ArrowRight,
  Plus,
  CheckCircle2,
  Sliders,
  History,
  Check,
  Power,
  BarChart2,
  ShieldAlert,
  Link2,
  Filter,
  FileText,
  Clock,
  Menu,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  LineChart,
  Line,
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend 
} from 'recharts';
import { SeoMetric } from '../types';
import { BRANDS } from '../data/brands';
import { AIDisclaimer } from '../components/FooterAndDisclaimers';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { INITIAL_SEO_METRICS } from '../data/seoAndSettings';
import { BrandLogo } from '../components/BrandLogo';
import { formatCurrency, formatDate } from '../utils/cn';

interface SeoAgentPageProps {
  onNavigateToBrand?: (brandId: string) => void;
}

interface ChatHistoryItem {
  id: string;
  sender: 'admin' | 'ai';
  text: string;
  timestamp: string;
}

export interface ManagedBrandItem {
  id: string;
  name: string;
  brandId: string;
  sector: string;
  primaryDomain: string;
  sitemapUrl: string;
  seoScore: number;
  organicTrafficMonthly: number;
  indexedPages: number;
  errors404: number;
  avgPageLoadSeconds: number;
  isMonitoringActive: boolean;
  primaryColor: string;
  gscConnected: boolean;
  ga4Connected: boolean;
  ga4MeasurementId?: string;
  customAlertsThreshold: {
    minSeoScore: number;
    maxErrors404: number;
    trafficDropPercent: number;
  };
  lastAuditDate: string;
}

export interface SeoActionLog {
  id: string;
  date: string;
  brandName: string;
  brandId: string;
  actionType: 'Audit Technique' | 'Correction 404' | 'Optimisation Core Web Vitals' | 'Indexation Sitemap' | 'Cannibalisation Mots-Clés';
  description: string;
  impactScore: string;
  status: 'Appliqué' | 'En cours' | 'Vérifié Google';
  author: string;
}

interface TopProductItem {
  brandId: 'cosmetics' | 'rehab' | 'huiles' | 'formations';
  brandName: string;
  badgeLabel: string;
  productName: string;
  category: string;
  image: string;
  monthlyVolume: string;
  monthlyRevenue: number;
  topKeyword: string;
  googleRank: number;
  organicClicks: number;
  ctr: string;
  authorityScore: number;
}

// 1. DATA: INITIAL CONNECTED MANAGED BRANDS
const INITIAL_MANAGED_BRANDS: ManagedBrandItem[] = [
  {
    id: 'mb-cosm',
    brandId: 'cosmetics',
    name: 'AM PROD Cosmétiques',
    sector: 'Dermo-Cosmétique Haut Standing & R&D',
    primaryDomain: 'amprod-cosmetics.com',
    sitemapUrl: 'https://amprod-cosmetics.com/sitemap_index.xml',
    seoScore: 92,
    organicTrafficMonthly: 48500,
    indexedPages: 1420,
    errors404: 3,
    avgPageLoadSeconds: 1.15,
    isMonitoringActive: true,
    primaryColor: '#10b981',
    gscConnected: true,
    ga4Connected: true,
    ga4MeasurementId: 'G-AMCOSM992',
    customAlertsThreshold: {
      minSeoScore: 85,
      maxErrors404: 5,
      trafficDropPercent: 10
    },
    lastAuditDate: '2026-10-06'
  },
  {
    id: 'mb-rehab',
    brandId: 'rehab',
    name: 'Rehab Bio',
    sector: 'Cosmétique Botanique & Soins Naturels Certifiés',
    primaryDomain: 'rehabbio.ma',
    sitemapUrl: 'https://rehabbio.ma/sitemap.xml',
    seoScore: 88,
    organicTrafficMonthly: 31200,
    indexedPages: 860,
    errors404: 1,
    avgPageLoadSeconds: 0.98,
    isMonitoringActive: true,
    primaryColor: '#84cc16',
    gscConnected: true,
    ga4Connected: true,
    ga4MeasurementId: 'G-REHAB771',
    customAlertsThreshold: {
      minSeoScore: 80,
      maxErrors404: 3,
      trafficDropPercent: 12
    },
    lastAuditDate: '2026-10-05'
  },
  {
    id: 'mb-huiles',
    brandId: 'huiles',
    name: 'AM PROD Huiles Végétales',
    sector: 'Matières Premières Nobles & Export B2B International',
    primaryDomain: 'amprod-huiles.com',
    sitemapUrl: 'https://amprod-huiles.com/sitemap.xml',
    seoScore: 95,
    organicTrafficMonthly: 84300,
    indexedPages: 2100,
    errors404: 0,
    avgPageLoadSeconds: 0.92,
    isMonitoringActive: true,
    primaryColor: '#16a34a',
    gscConnected: true,
    ga4Connected: true,
    ga4MeasurementId: 'G-AMHUILE440',
    customAlertsThreshold: {
      minSeoScore: 90,
      maxErrors404: 2,
      trafficDropPercent: 8
    },
    lastAuditDate: '2026-10-06'
  },
  {
    id: 'mb-form',
    brandId: 'formations',
    name: 'AM PROD Formations',
    sector: 'Académie Cosmétique Professionnelle BPF & Norme ISO',
    primaryDomain: 'academie-amprod.ma',
    sitemapUrl: 'https://academie-amprod.ma/sitemap.xml',
    seoScore: 90,
    organicTrafficMonthly: 22800,
    indexedPages: 640,
    errors404: 2,
    avgPageLoadSeconds: 1.05,
    isMonitoringActive: true,
    primaryColor: '#0284c7',
    gscConnected: true,
    ga4Connected: true,
    ga4MeasurementId: 'G-AMFORM112',
    customAlertsThreshold: {
      minSeoScore: 85,
      maxErrors404: 4,
      trafficDropPercent: 15
    },
    lastAuditDate: '2026-10-04'
  }
];

// 2. DATA: INITIAL SEO ACTION LOGS
const INITIAL_ACTION_LOGS: SeoActionLog[] = [
  {
    id: 'log-1',
    date: '2026-10-06T14:30:00Z',
    brandName: 'AM PROD Cosmétiques',
    brandId: 'cosmetics',
    actionType: 'Audit Technique',
    description: 'Audit Core Web Vitals : LCP mesuré à 1.15s, CLS à 0.02. Score mobile vert validé sur Search Console.',
    impactScore: '+2.4 pts vitesse',
    status: 'Vérifié Google',
    author: 'Agent SEO IA (Atlas)'
  },
  {
    id: 'log-2',
    date: '2026-10-05T16:15:00Z',
    brandName: 'AM PROD Cosmétiques',
    brandId: 'cosmetics',
    actionType: 'Correction 404',
    description: 'Déploiement de 3 redirections 301 permanentes suite à la migration de l\'URL du Sérum Niacinamide 10%.',
    impactScore: 'Zéro perte de jus',
    status: 'Appliqué',
    author: 'Yassine Alami'
  },
  {
    id: 'log-3',
    date: '2026-10-04T11:00:00Z',
    brandName: 'AM PROD Huiles Végétales',
    brandId: 'huiles',
    actionType: 'Cannibalisation Mots-Clés',
    description: 'Mise en place de balises canoniques strictes entre la fiche Vrac Huile d\'Argan et le conditionnement 500ml.',
    impactScore: 'Indexation unifiée',
    status: 'Vérifié Google',
    author: 'Agent SEO IA (Atlas)'
  },
  {
    id: 'log-4',
    date: '2026-10-02T09:45:00Z',
    brandName: 'Rehab Bio',
    brandId: 'rehab',
    actionType: 'Indexation Sitemap',
    description: 'Soumission d\'un sitemap XML rafraîchi avec 860 fiches produits cosmétiques bio conformes Schema.org Product.',
    impactScore: '+48 pages indexées',
    status: 'Appliqué',
    author: 'Salma Cherkaoui'
  },
  {
    id: 'log-5',
    date: '2026-10-01T15:20:00Z',
    brandName: 'AM PROD Formations',
    brandId: 'formations',
    actionType: 'Optimisation Core Web Vitals',
    description: 'Ajout des données structurées Course, EducationEvent et FAQ sur les pages Masterclass pour affichage en Rich Snippets.',
    impactScore: '+18.4% CTR',
    status: 'Vérifié Google',
    author: 'Agent SEO IA (Atlas)'
  },
  {
    id: 'log-6',
    date: '2026-09-28T10:30:00Z',
    brandName: 'Rehab Bio',
    brandId: 'rehab',
    actionType: 'Optimisation Core Web Vitals',
    description: 'Conversion intégrale des galeries d\'images au format WebP nouvelle génération et lazy loading natif.',
    impactScore: '-0.35s chargement',
    status: 'Appliqué',
    author: 'Support Technique'
  }
];

// 3. DATA: TOP PRODUCT OF THE MONTH PER BRAND
const TOP_PRODUCTS_MONTH: TopProductItem[] = [
  {
    brandId: 'cosmetics',
    brandName: 'AM PROD Cosmétiques',
    badgeLabel: 'N°1 Ventes Laboratoire',
    productName: 'Sérum Éclat Niacinamide 10% + Zinc PCA 30ml',
    category: 'Sérums Haute Efficacité & R&D',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80',
    monthlyVolume: '1 420 unités vendues',
    monthlyRevenue: 397600,
    topKeyword: 'sérum niacinamide éclat maroc',
    googleRank: 1,
    organicClicks: 4850,
    ctr: '18.2%',
    authorityScore: 94
  },
  {
    brandId: 'rehab',
    brandName: 'Rehab Bio',
    badgeLabel: 'Bestseller Cosmétique Bio',
    productName: 'Shampooing Purifiant Romarin & Ortie Bio 250ml',
    category: 'Soins Capillaires Biologiques',
    image: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=800&auto=format&fit=crop&q=80',
    monthlyVolume: '2 150 unités vendues',
    monthlyRevenue: 279500,
    topKeyword: 'shampooing bio sans sulfate maroc',
    googleRank: 2,
    organicClicks: 3600,
    ctr: '14.5%',
    authorityScore: 89
  },
  {
    brandId: 'huiles',
    brandName: 'AM PROD Huiles Végétales',
    badgeLabel: 'Top Export Vrac & Fûts',
    productName: 'Huile Vierge Extra Pépins de Figue de Barbarie Bio 1L',
    category: 'Matières Premières & Export B2B',
    image: 'https://images.unsplash.com/photo-1608248597359-55365e64817a?w=800&auto=format&fit=crop&q=80',
    monthlyVolume: '84 fûts & flacons pro',
    monthlyRevenue: 672000,
    topKeyword: 'pure argan & barbary oil supplier',
    googleRank: 1,
    organicClicks: 8200,
    ctr: '12.8%',
    authorityScore: 96
  },
  {
    brandId: 'formations',
    brandName: 'AM PROD Formations',
    badgeLabel: 'Cursus Phare Académie',
    productName: 'Masterclass Formulation Émulsions, Sérums & Soins',
    category: 'Certifications BPF & Laboratoire',
    image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&auto=format&fit=crop&q=80',
    monthlyVolume: '57 apprenants certifiés',
    monthlyRevenue: 485000,
    topKeyword: 'formation formulation cosmetique casablanca',
    googleRank: 1,
    organicClicks: 2940,
    ctr: '21.4%',
    authorityScore: 91
  }
];

// 4. DATA: HISTORICAL SEO SCORES OVER 6 MONTHS
const SEO_SCORE_HISTORY = [
  { month: 'Mai', cosmetics: 84, rehab: 76, huiles: 88, formations: 82, global: 82.5 },
  { month: 'Juin', cosmetics: 86, rehab: 79, huiles: 90, formations: 84, global: 84.7 },
  { month: 'Juil', cosmetics: 87, rehab: 82, huiles: 91, formations: 85, global: 86.2 },
  { month: 'Août', cosmetics: 89, rehab: 84, huiles: 93, formations: 87, global: 88.2 },
  { month: 'Sept', cosmetics: 91, rehab: 86, huiles: 94, formations: 89, global: 90.0 },
  { month: 'Octobre', cosmetics: 92, rehab: 88, huiles: 95, formations: 90, global: 91.2 },
];

export const SeoAgentPage: React.FC<SeoAgentPageProps> = ({ onNavigateToBrand }) => {
  // Navigation Sub-tab in SEO Agent Space (driven by sidebar)
  const [activeTab, setActiveTab] = useState<'overview' | 'brands' | 'comparateur' | 'journal'>('overview');

  // Sidebar responsive & collapse state
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Managed Brands & Persistence
  const [managedBrands, setManagedBrands] = useLocalStorage<ManagedBrandItem[]>('am_seo_connected_brands', INITIAL_MANAGED_BRANDS);
  
  // Action Logs & Persistence
  const [actionLogs, setActionLogs] = useLocalStorage<SeoActionLog[]>('am_seo_action_logs', INITIAL_ACTION_LOGS);

  // Status message toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal: Add / Configure New Brand
  const [isAddBrandModalOpen, setIsAddBrandModalOpen] = useState(false);
  const [newBrandForm, setNewBrandForm] = useState({
    name: '',
    brandId: '',
    sector: 'Cosmétique & Soins Spécialisés',
    primaryDomain: '',
    sitemapUrl: '',
    primaryColor: '#6366f1',
    gscConnected: true,
    ga4MeasurementId: 'G-NEWBRAND100',
    minSeoScore: 85,
    maxErrors404: 5,
    trafficDropPercent: 10
  });

  // Floating Chatbot State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatHistory, setChatHistory] = useLocalStorage<ChatHistoryItem[]>('am_seo_chat_history', [
    {
      id: 'c-1',
      sender: 'ai',
      text: 'Bonjour Monsieur le Directeur. Je suis votre Agent SEO & Superviseur IA Groupe AM PROD. J\'analyse en temps réel les performances web, les indexations Google et les signaux de trafic de vos 4 filiales. Posez-moi vos questions stratégiques !',
      timestamp: '09:00',
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isChatOpen) {
      scrollToBottom();
    }
  }, [chatHistory, isChatOpen]);

  // Handler: Toggle Brand Monitoring Status
  const handleToggleMonitoring = (id: string, brandName: string) => {
    setManagedBrands(prev => prev.map(b => {
      if (b.id === id) {
        const nextState = !b.isMonitoringActive;
        setToastMessage(nextState 
          ? `Monitoring activé en temps réel pour ${brandName}.` 
          : `Monitoring mis en pause pour ${brandName}.`
        );
        setTimeout(() => setToastMessage(null), 3000);
        return { ...b, isMonitoringActive: nextState };
      }
      return b;
    }));
  };

  // Handler: Add New Brand Submission
  const handleAddBrandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBrandForm.name.trim() || !newBrandForm.primaryDomain.trim()) return;

    const brandKey = newBrandForm.brandId.trim().toLowerCase() || `brand-${Date.now()}`;
    const newBrandItem: ManagedBrandItem = {
      id: `mb-${Date.now()}`,
      brandId: brandKey,
      name: newBrandForm.name.trim(),
      sector: newBrandForm.sector,
      primaryDomain: newBrandForm.primaryDomain.trim().replace(/^https?:\/\//, ''),
      sitemapUrl: newBrandForm.sitemapUrl.trim() || `https://${newBrandForm.primaryDomain.trim().replace(/^https?:\/\//, '')}/sitemap.xml`,
      seoScore: Math.floor(Math.random() * 10) + 85,
      organicTrafficMonthly: Math.floor(Math.random() * 25000) + 15000,
      indexedPages: Math.floor(Math.random() * 800) + 400,
      errors404: 0,
      avgPageLoadSeconds: 1.08,
      isMonitoringActive: true,
      primaryColor: newBrandForm.primaryColor,
      gscConnected: newBrandForm.gscConnected,
      ga4Connected: true,
      ga4MeasurementId: newBrandForm.ga4MeasurementId,
      customAlertsThreshold: {
        minSeoScore: Number(newBrandForm.minSeoScore),
        maxErrors404: Number(newBrandForm.maxErrors404),
        trafficDropPercent: Number(newBrandForm.trafficDropPercent)
      },
      lastAuditDate: new Date().toISOString().split('T')[0]
    };

    setManagedBrands(prev => [...prev, newBrandItem]);

    // Also log in action log
    const newLog: SeoActionLog = {
      id: `log-${Date.now()}`,
      date: new Date().toISOString(),
      brandName: newBrandItem.name,
      brandId: brandKey,
      actionType: 'Audit Technique',
      description: `Intégration et raccordement Search Console du domaine ${newBrandItem.primaryDomain}.`,
      impactScore: 'Monitoring initialisé',
      status: 'Appliqué',
      author: 'Administrateur Groupe'
    };
    setActionLogs(prev => [newLog, ...prev]);

    setIsAddBrandModalOpen(false);
    setToastMessage(`Nouvelle marque « ${newBrandItem.name} » connectée avec succès au centre de supervision !`);
    setTimeout(() => setToastMessage(null), 4000);

    setNewBrandForm({
      name: '',
      brandId: '',
      sector: 'Cosmétique & Soins Spécialisés',
      primaryDomain: '',
      sitemapUrl: '',
      primaryColor: '#6366f1',
      gscConnected: true,
      ga4MeasurementId: 'G-NEWBRAND100',
      minSeoScore: 85,
      maxErrors404: 5,
      trafficDropPercent: 10
    });
  };

  // Handler: Send Message in Chatbot
  const handleSendMessage = (e?: React.FormEvent, customText?: string) => {
    if (e) e.preventDefault();
    const userText = (customText || chatInput).trim();
    if (!userText) return;

    const newAdminMsg: ChatHistoryItem = {
      id: `chat-${Date.now()}`,
      sender: 'admin',
      text: userText,
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    };

    setChatHistory(prev => [...prev, newAdminMsg]);
    if (!customText) setChatInput('');

    setTimeout(() => {
      let aiResponse = `Synthèse consolidée du Groupe AM PROD : Nos marques connectées cumulent actuellement ${managedBrands.reduce((acc, m) => acc + m.organicTrafficMonthly, 0).toLocaleString()} visites organiques mensuelles et ${managedBrands.reduce((acc, m) => acc + m.indexedPages, 0).toLocaleString()} pages indexées.`;

      const lower = userText.toLowerCase();
      if (lower.includes('baisse') || lower.includes('alerte') || lower.includes('drop')) {
        aiResponse = `⚠️ Alerte prioritaire : Sur AM PROD Cosmétiques, la page « Sérum Éclat Niacinamide » a subi un recul de 12% suite à la modification d'URL. Sur AM PROD Huiles Végétales, une cannibalisation entre la fiche Vrac et le flacon 500ml est en cours de correction.`;
      } else if (lower.includes('cosmetique') || lower.includes('cosmétique')) {
        aiResponse = `AM PROD Cosmétiques : Score SEO 92/100, 1 420 pages indexées, 3 erreurs 404. Le mot-clé « fabricant dermo cosmetique maroc » est en Top 2 Google et le Sérum Niacinamide génère 397 600 MAD de CA.`;
      } else if (lower.includes('formation') || lower.includes('formations')) {
        aiResponse = `AM PROD Formations : Trafic en hausse de +14.9%. La Masterclass Formulation est n°1 sur « formation formulation cosmetique casablanca » avec un taux de clic organique de 21.4%.`;
      } else if (lower.includes('huile') || lower.includes('argan')) {
        aiResponse = `AM PROD Huiles Végétales : Leader absolu en SEO B2B international (Score 95/100, +31.7%). Position n°1 sur « pure argan oil wholesale supplier » avec 84 300 visites mensuelles.`;
      } else if (lower.includes('rehab') || lower.includes('bio')) {
        aiResponse = `Rehab Bio : Score SEO 88/100, temps de chargement éclair de 0.98s. Le Shampooing Romarin & Ortie Bio cumule 2 150 ventes ce mois-ci.`;
      } else if (lower.includes('top') || lower.includes('meilleur') || lower.includes('produit')) {
        aiResponse = `Top Produits du mois : 
1. Huile Figue de Barbarie 1L (Huiles) : 672 000 MAD
2. Masterclass Formulation (Formations) : 485 000 MAD
3. Sérum Niacinamide 10% (Cosmétiques) : 397 600 MAD
4. Shampooing Purifiant Ortie (Rehab Bio) : 279 500 MAD`;
      } else if (lower.includes('leader') || lower.includes('classement')) {
        aiResponse = `🏆 Marque leader actuelle : AM PROD Huiles Végétales occupe la 1ère place avec un score SEO d'excellence de 95/100, 84 300 visites et 88 mots-clés en Top 3 Google !`;
      }

      const newAiMsg: ChatHistoryItem = {
        id: `chat-${Date.now() + 1}`,
        sender: 'ai',
        text: aiResponse,
        timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
      };

      setChatHistory(prev => [...prev, newAiMsg]);
    }, 700);
  };

  // Group Aggregated Stats
  const activeMonitoredBrands = managedBrands.filter(b => b.isMonitoringActive);
  const globalSeoScore = Math.round(
    managedBrands.reduce((acc, m) => acc + m.seoScore, 0) / (managedBrands.length || 1)
  );
  const totalOrganicTraffic = managedBrands.reduce((acc, m) => acc + m.organicTrafficMonthly, 0);
  const totalIndexedPages = managedBrands.reduce((acc, m) => acc + m.indexedPages, 0);
  const total404Errors = managedBrands.reduce((acc, m) => acc + m.errors404, 0);

  // Leader Brand
  const leaderBrand = [...managedBrands].sort((a, b) => b.seoScore - a.seoScore)[0] || managedBrands[0];

  return (
    <div className="w-full space-y-6 pb-20">
      
      {/* TOAST CONFIRMATION NOTIFICATION */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 p-4 rounded-xl bg-slate-900 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-3 shadow-2xl animate-in fade-in slide-in-from-top-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="font-semibold text-white">{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-white p-1 ml-2"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* TOP HEADER ÉPURÉ AGENT CEO AVEC BOUTON MOBILE TOGGLE */}
      <div className="px-6 py-4 border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {/* Mobile Sidebar Hamburger Toggle */}
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="p-1.5 rounded-lg text-slate-400 md:hidden hover:bg-slate-900 border border-slate-800"
            title="Menu de navigation"
          >
            {mobileSidebarOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
          </button>

          <BrandLogo brandId="seo" variant="icon" size="md" />
          <div>
            <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
              Agent CEO Central & Supervision Groupe
            </h1>
            <span className="text-[11px] px-2 py-0.5 rounded-md font-medium border border-indigo-500/20 bg-indigo-500/10 text-indigo-400 inline-block mt-0.5">
              Direction Générale • {activeMonitoredBrands.length} / {managedBrands.length} Marques & Domaines Actifs
            </span>
          </div>
        </div>

        {/* Global SEO Score & Disclaimer */}
        <div className="flex items-center gap-3 self-end lg:self-center">
          <div className="px-3.5 py-1.5 rounded-xl bg-slate-900/60 border border-slate-800 text-right">
            <span className="text-[9px] uppercase tracking-wider text-slate-400 font-medium block">
              Score SEO Moyen Groupe
            </span>
            <span className="text-lg font-bold text-white tracking-tight font-mono">
              {globalSeoScore} <span className="text-xs text-slate-400 font-normal">/ 100</span>
            </span>
          </div>
          <AIDisclaimer variant="badge" />
        </div>
      </div>

      {/* WORKSPACE AVEC SIDEBAR LATÉRALE & CONTENU DYNAMIQUE */}
      <div className="flex-1 w-full flex relative min-h-[calc(100vh-120px)]">
        
        {/* BACKDROP MOBILE */}
        {mobileSidebarOpen && (
          <div 
            onClick={() => setMobileSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 z-30 md:hidden backdrop-blur-xs"
          />
        )}

        {/* SIDEBAR NAVIGATION STRUCTURÉE AGENT CEO */}
        <aside className={`
          fixed md:sticky top-0 md:top-[65px] h-screen md:h-[calc(100vh-65px)] z-40 md:z-30 bg-slate-950 border-r border-slate-800/80 p-3 flex flex-col justify-between shrink-0 transition-all duration-300 overflow-y-auto
          ${isSidebarCollapsed ? 'w-16' : 'w-72'}
          ${mobileSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'}
        `}>
          <div className="space-y-4">
            
            {/* Header Sidebar / Collapse Toggle */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
              {!isSidebarCollapsed ? (
                <div className="flex items-center gap-2 px-1">
                  <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Navigation CEO
                  </span>
                </div>
              ) : (
                <div className="w-full flex justify-center">
                  <span className="w-2 h-2 rounded-full bg-indigo-500" />
                </div>
              )}

              {/* Desktop Collapse Toggle */}
              <button
                type="button"
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                className="hidden md:flex p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
                title={isSidebarCollapsed ? "Agrandir le menu" : "Réduire le menu"}
              >
                {isSidebarCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
              </button>

              {/* Mobile Close Button */}
              <button 
                onClick={() => setMobileSidebarOpen(false)} 
                className="md:hidden p-1 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Navigation Menu Links */}
            <nav className="space-y-1.5">
              
              {/* 1. Dashboard & Vue d'ensemble */}
              <button
                onClick={() => {
                  setActiveTab('overview');
                  setMobileSidebarOpen(false);
                }}
                title={isSidebarCollapsed ? "Dashboard & Vue d'ensemble" : undefined}
                className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center px-2 py-2.5' : 'justify-between px-3 py-2.5 text-left'} rounded-lg text-xs font-medium transition-all ${
                  activeTab === 'overview'
                    ? 'bg-slate-900 text-white font-semibold border border-indigo-500/30 shadow-xs'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <span className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : 'gap-2.5 min-w-0 pr-2'}`}>
                  <BarChart2 className={`w-4 h-4 shrink-0 ${activeTab === 'overview' ? 'text-brand-orange' : 'text-slate-400'}`} />
                  {!isSidebarCollapsed && <span className="whitespace-normal break-words leading-tight">Dashboard & Vue d'ensemble</span>}
                </span>
                {!isSidebarCollapsed && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded font-mono font-semibold bg-brand-orange/10 text-brand-orange border border-brand-orange/20 shrink-0">
                    Live
                  </span>
                )}
              </button>

              {/* 2. Gestion des Marques & Supervision */}
              <button
                onClick={() => {
                  setActiveTab('brands');
                  setMobileSidebarOpen(false);
                }}
                title={isSidebarCollapsed ? "Gestion des Marques & Supervision" : undefined}
                className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center px-2 py-2.5' : 'justify-between px-3 py-2.5 text-left'} rounded-lg text-xs font-medium transition-all ${
                  activeTab === 'brands'
                    ? 'bg-slate-900 text-white font-semibold border border-indigo-500/30 shadow-xs'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <span className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : 'gap-2.5 min-w-0 pr-2'}`}>
                  <Layers className={`w-4 h-4 shrink-0 ${activeTab === 'brands' ? 'text-emerald-400' : 'text-slate-400'}`} />
                  {!isSidebarCollapsed && <span className="whitespace-normal break-words leading-tight">Gestion des Marques & Supervision</span>}
                </span>
                {!isSidebarCollapsed && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                    {managedBrands.length}
                  </span>
                )}
              </button>

              {/* 3. Comparateur Croisé */}
              <button
                onClick={() => {
                  setActiveTab('comparateur');
                  setMobileSidebarOpen(false);
                }}
                title={isSidebarCollapsed ? "Comparateur Croisé" : undefined}
                className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center px-2 py-2.5' : 'justify-between px-3 py-2.5 text-left'} rounded-lg text-xs font-medium transition-all ${
                  activeTab === 'comparateur'
                    ? 'bg-slate-900 text-white font-semibold border border-indigo-500/30 shadow-xs'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <span className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : 'gap-2.5 min-w-0 pr-2'}`}>
                  <Award className={`w-4 h-4 shrink-0 ${activeTab === 'comparateur' ? 'text-amber-400' : 'text-slate-400'}`} />
                  {!isSidebarCollapsed && <span className="whitespace-normal break-words leading-tight">Comparateur Croisé</span>}
                </span>
                {!isSidebarCollapsed && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded font-mono font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
                    Podium
                  </span>
                )}
              </button>

              {/* 4. Journal des Actions & Audits */}
              <button
                onClick={() => {
                  setActiveTab('journal');
                  setMobileSidebarOpen(false);
                }}
                title={isSidebarCollapsed ? "Journal des Actions & Audits" : undefined}
                className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center px-2 py-2.5' : 'justify-between px-3 py-2.5 text-left'} rounded-lg text-xs font-medium transition-all ${
                  activeTab === 'journal'
                    ? 'bg-slate-900 text-white font-semibold border border-indigo-500/30 shadow-xs'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <span className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : 'gap-2.5 min-w-0 pr-2'}`}>
                  <History className={`w-4 h-4 shrink-0 ${activeTab === 'journal' ? 'text-indigo-400' : 'text-slate-400'}`} />
                  {!isSidebarCollapsed && <span className="whitespace-normal break-words leading-tight">Journal des Actions & Audits</span>}
                </span>
                {!isSidebarCollapsed && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded font-mono font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shrink-0">
                    {actionLogs.length}
                  </span>
                )}
              </button>

            </nav>

            {/* Quick Mini Info Widget in Sidebar (when expanded) */}
            {!isSidebarCollapsed && (
              <div className="pt-4 border-t border-slate-800/80">
                <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Marques actives</span>
                    <span className="font-mono font-bold text-white">
                      {activeMonitoredBrands.length} / {managedBrands.length}
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-indigo-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${(activeMonitoredBrands.length / (managedBrands.length || 1)) * 100}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
                    <span>Erreurs 404 globales</span>
                    <span className={`font-mono font-bold ${total404Errors > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {total404Errors}
                    </span>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Sidebar Footer info */}
          <div className="pt-3 border-t border-slate-800/80">
            {!isSidebarCollapsed ? (
              <div className="flex items-center justify-between px-1">
                <span className="text-[10px] text-slate-400">AM PROD CEO Cockpit</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
                  v2.6
                </span>
              </div>
            ) : (
              <div className="text-center">
                <span className="text-[9px] font-mono text-emerald-400">v2.6</span>
              </div>
            )}
          </div>
        </aside>

        {/* CONTENU PRINCIPAL DYNAMIQUE EN FONCTION DE LA VUE CHOISIE DANS LA SIDEBAR */}
        <div className="flex-1 p-6 lg:p-8 space-y-6 overflow-x-hidden">

      {/* ============================================================ */}
      {/* SECTION 1 : VUE D'ENSEMBLE & STRATÉGIE */}
      {/* ============================================================ */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          
          {/* KPI Grid Globale */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/90 hover-lift space-y-1">
              <span className="text-xs font-medium text-slate-400">Audience Organique Globale</span>
              <p className="text-2xl font-bold text-indigo-400 mt-2 font-mono">
                {totalOrganicTraffic.toLocaleString()}
              </p>
              <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-0.5 mt-1">
                <ArrowUpRight className="w-3.5 h-3.5" /> +22.8% de croissance
              </span>
              <span className="text-[10px] text-slate-400 block pt-1">Visites SEO mensuelles consolidées</span>
            </div>

            <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/90 hover-lift space-y-1">
              <span className="text-xs font-medium text-slate-400">Pages Indexées Google</span>
              <p className="text-2xl font-bold text-white mt-2 font-mono">
                {totalIndexedPages.toLocaleString()}
              </p>
              <span className="text-[11px] text-sky-400 font-medium block mt-1">
                {managedBrands.length} domaines e-commerce & académie
              </span>
              <span className="text-[10px] text-slate-400 block pt-1">Couverture de crawl sitemaps : 99.4%</span>
            </div>

            <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/90 hover-lift space-y-1">
              <span className="text-xs font-medium text-slate-400">Erreurs 404 Détectées</span>
              <p className={`text-2xl font-bold mt-2 font-mono ${total404Errors > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                {total404Errors} liens
              </p>
              <span className="text-[11px] text-slate-400 mt-1 block">
                Redirections 301 automatisées en cours
              </span>
              <span className="text-[10px] text-emerald-400 block pt-1">Santé technique préservée</span>
            </div>

            <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/90 hover-lift space-y-1">
              <span className="text-xs font-medium text-slate-400">Temps Moyen de Chargement</span>
              <p className="text-2xl font-bold text-emerald-400 mt-2 font-mono">
                1.02s
              </p>
              <span className="text-[11px] text-emerald-400 font-medium block mt-1">
                Score A Core Web Vitals
              </span>
              <span className="text-[10px] text-slate-400 block pt-1">CDN Edge compressé</span>
            </div>
          </div>

          {/* Graphique Comparatif Rapide */}
          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/90 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Globe className="w-4 h-4 text-emerald-400" />
                  Répartition du Trafic Organique par Filiale
                </h3>
                <p className="text-[11px] text-slate-400">
                  Volume de visites acquises via les requêtes Google Search
                </p>
              </div>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Total : {totalOrganicTraffic.toLocaleString()}
              </span>
            </div>

            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={managedBrands.map(b => ({
                    name: b.name.replace('AM PROD ', ''),
                    trafic: b.organicTrafficMonthly,
                    score: b.seoScore
                  }))}
                  margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 11 }} />
                  <YAxis 
                    stroke="#64748b" 
                    tick={{ fontSize: 10 }}
                    tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                  />
                  <Tooltip 
                    cursor={{ fill: 'rgba(99, 102, 241, 0.08)' }}
                    formatter={(value: any) => [`${Number(value).toLocaleString()} visites`, 'Trafic Organique']}
                    contentStyle={{ 
                      backgroundColor: '#0f172a', 
                      borderColor: '#334155', 
                      borderRadius: '0.5rem', 
                      fontSize: '12px', 
                      color: '#ffffff',
                      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5)',
                      padding: '8px 12px'
                    }}
                    itemStyle={{ color: '#818cf8', fontWeight: 600 }}
                    labelStyle={{ color: '#cbd5e1', fontWeight: 700, marginBottom: '4px' }}
                  />
                  <Bar dataKey="trafic" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* SECTION : MEILLEUR PRODUIT DU MOIS PAR MARQUE */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-400" />
                  <h2 className="text-base font-bold text-white">
                    Meilleur Produit & Formation du Mois par Marque
                  </h2>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Bestsellers d'octobre 2026 : Volume généré, chiffre d'affaires et performances SEO associées.
                </p>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20 font-semibold hidden sm:inline-block">
                ★ Palmarès Mensuel
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              {TOP_PRODUCTS_MONTH.map((item) => {
                const brandConfig = BRANDS[item.brandId];
                return (
                  <div 
                    key={item.brandId}
                    className="rounded-xl bg-slate-900/60 border border-slate-800/90 overflow-hidden flex flex-col hover-lift shadow-sm group"
                  >
                    {/* Image Container with Badges */}
                    <div className="relative h-48 w-full bg-slate-950 overflow-hidden rounded-t-xl">
                      <img 
                        src={item.image} 
                        alt={item.productName} 
                        className="object-cover w-full h-48 rounded-lg group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent pointer-events-none" />
                      
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                        <span 
                          className="text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider text-white shadow-sm border border-white/20"
                          style={{ backgroundColor: brandConfig.primaryColor }}
                        >
                          {brandConfig.name.split(' ')[0]}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/90 text-white font-bold shadow-sm backdrop-blur-md">
                          {item.badgeLabel}
                        </span>
                      </div>

                      <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white">
                        <span className="text-xs font-mono font-bold text-brand-orange bg-slate-950/80 px-2 py-0.5 rounded border border-slate-800">
                          {formatCurrency(item.monthlyRevenue)}
                        </span>
                        <span className="text-[11px] font-semibold text-slate-200 bg-slate-950/80 px-2 py-0.5 rounded border border-slate-800">
                          {item.monthlyVolume}
                        </span>
                      </div>
                    </div>

                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block">
                          {item.category}
                        </span>
                        <h3 className="text-xs font-bold text-white mt-0.5 line-clamp-2 leading-snug">
                          {item.productName}
                        </h3>
                      </div>

                      <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80 space-y-1.5 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-slate-400">Position Google</span>
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                            # {item.googleRank} Google
                          </span>
                        </div>

                        <div className="text-[11px] text-slate-300 truncate">
                          <span className="text-slate-500">Requête : </span>
                          <span className="text-indigo-400 font-mono">« {item.topKeyword} »</span>
                        </div>

                        <div className="grid grid-cols-2 gap-1 pt-1 border-t border-slate-800/60 text-[10px]">
                          <div>
                            <span className="text-slate-400 block">Clics SEO</span>
                            <span className="font-semibold text-white font-mono">{item.organicClicks.toLocaleString()}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-slate-400 block">CTR</span>
                            <span className="font-semibold text-emerald-400 font-mono">{item.ctr}</span>
                          </div>
                        </div>
                      </div>

                      {onNavigateToBrand && (
                        <button
                          onClick={() => onNavigateToBrand(item.brandId)}
                          className="w-full py-2 px-3 rounded-lg text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 hover:text-white transition-colors flex items-center justify-center gap-1.5"
                        >
                          <span>Accéder à l'ERP {brandConfig.name.split(' ')[0]}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* ============================================================ */}
      {/* SECTION 2 : GESTION DES MARQUES & SUPERVISION WEB */}
      {/* ============================================================ */}
      {activeTab === 'brands' && (
        <div className="space-y-6">
          
          {/* Top Bar with Add Brand Button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-slate-900/60 border border-slate-800/90">
            <div>
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-emerald-400" />
                <h2 className="text-base font-bold text-white">
                  Supervision & Gestion des Filiales Connectées
                </h2>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  {managedBrands.length} marques
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Contrôle centralisé du crawling Google, activation / suspension du monitoring et accès direct aux ERP.
              </p>
            </div>

            <button
              onClick={() => setIsAddBrandModalOpen(true)}
              className="px-4 py-2.5 rounded-lg text-xs font-semibold text-white bg-brand-orange hover:bg-brand-orange-hover transition-colors flex items-center gap-2 shadow-sm self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              + Ajouter une marque
            </button>
          </div>

          {/* TABLEAU DES MARQUES CONNECTÉES (A. VUE D'ENSEMBLE & LISTE) */}
          <div className="w-full rounded-xl bg-slate-900/60 border border-slate-800/90 overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Tableau Matriciel des Filiales
              </h3>
              <span className="text-[11px] text-slate-400">
                Statut et alertes synchronisés avec Google Search Console & Analytics
              </span>
            </div>

            <div className="w-full overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="p-4">Marque & Domaine</th>
                    <th className="p-4">Statut Monitoring</th>
                    <th className="p-4">Score SEO</th>
                    <th className="p-4">Trafic Mensuel</th>
                    <th className="p-4">Pages Indexées</th>
                    <th className="p-4">Erreurs 404</th>
                    <th className="p-4">Temps Page</th>
                    <th className="p-4 text-right">Action ERP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {managedBrands.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-800/40 transition-colors">
                      {/* Marque & Domaine */}
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <BrandLogo brandId={b.brandId} variant="icon" size="sm" />
                          <div>
                            <span className="font-semibold text-white block">
                              {b.name}
                            </span>
                            <a 
                              href={`https://${b.primaryDomain}`} 
                              target="_blank" 
                              rel="noreferrer" 
                              className="text-[11px] text-indigo-400 hover:underline flex items-center gap-1 font-mono mt-0.5"
                            >
                              <span>{b.primaryDomain}</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          </div>
                        </div>
                      </td>

                      {/* Toggle de Statut Monitoring */}
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleToggleMonitoring(b.id, b.name)}
                            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                              b.isMonitoringActive ? 'bg-emerald-500' : 'bg-slate-800'
                            }`}
                            title={b.isMonitoringActive ? 'Désactiver monitoring' : 'Activer monitoring'}
                          >
                            <span
                              className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                                b.isMonitoringActive ? 'translate-x-4' : 'translate-x-0'
                              }`}
                            />
                          </button>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                            b.isMonitoringActive 
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                              : 'bg-slate-800 text-slate-400 border-slate-700'
                          }`}>
                            {b.isMonitoringActive ? 'Actif' : 'En pause'}
                          </span>
                        </div>
                      </td>

                      {/* Score SEO */}
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-white text-sm">
                            {b.seoScore}/100
                          </span>
                          <div className="w-16 bg-slate-950 rounded-full h-1.5 overflow-hidden hidden sm:block">
                            <div 
                              className="h-full rounded-full bg-emerald-500" 
                              style={{ width: `${b.seoScore}%` }} 
                            />
                          </div>
                        </div>
                      </td>

                      {/* Trafic Mensuel */}
                      <td className="p-4 font-mono font-semibold text-slate-200">
                        {b.organicTrafficMonthly.toLocaleString()}
                      </td>

                      {/* Pages Indexées */}
                      <td className="p-4 font-mono text-slate-300">
                        {b.indexedPages.toLocaleString()}
                      </td>

                      {/* Erreurs 404 */}
                      <td className="p-4 font-mono">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          b.errors404 === 0 
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}>
                          {b.errors404} {b.errors404 <= 1 ? 'erreur' : 'erreurs'}
                        </span>
                      </td>

                      {/* Temps Page */}
                      <td className="p-4 font-mono text-emerald-400 font-semibold">
                        {b.avgPageLoadSeconds}s
                      </td>

                      {/* Action Directe : Basculer vers ERP */}
                      <td className="p-4 text-right">
                        {onNavigateToBrand && (
                          <button
                            onClick={() => onNavigateToBrand(b.brandId)}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 hover:bg-indigo-500/20 hover:text-white transition-colors inline-flex items-center gap-1.5 shadow-xs"
                          >
                            <span>Ouvrir ERP</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* GRILLE DÉTAILLÉE DES CONFIGURATIONS PAR MARQUE */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {managedBrands.map((b) => (
              <div 
                key={b.id}
                className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/90 space-y-3.5 hover-lift"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <BrandLogo brandId={b.brandId} variant="icon" size="sm" />
                    <div>
                      <h4 className="text-xs font-bold text-white">{b.name}</h4>
                      <p className="text-[11px] text-slate-400">{b.sector}</p>
                    </div>
                  </div>

                  <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-semibold ${
                    b.isMonitoringActive 
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}>
                    {b.isMonitoringActive ? '● MONITORING ON' : '○ SUSPENDU'}
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between text-slate-400">
                    <span>Sitemap XML :</span>
                    <span className="text-indigo-400 truncate max-w-[200px]">{b.sitemapUrl}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Google Analytics 4 :</span>
                    <span className="text-emerald-400">{b.ga4MeasurementId || 'Connecté'}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Dernier Crawl :</span>
                    <span className="text-slate-300">{formatDate(b.lastAuditDate)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800/80">
                  <span className="text-[11px] text-slate-400">
                    Seuil alerte : Score &lt; {b.customAlertsThreshold.minSeoScore}
                  </span>
                  {onNavigateToBrand && (
                    <button
                      onClick={() => onNavigateToBrand(b.brandId)}
                      className="text-xs font-semibold text-brand-orange hover:underline inline-flex items-center gap-1"
                    >
                      <span>Tableau de bord ERP</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* ============================================================ */}
      {/* SECTION 3 : COMPARATEUR CROISÉ CROSS-MARQUES */}
      {/* ============================================================ */}
      {activeTab === 'comparateur' && (
        <div className="space-y-6">
          
          {/* Header Comparateur */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                Comparateur Croisé & Classement Dynamique
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Superposition des 4 marques côte à côte : Évolution des scores sur 6 mois, volume de requêtes et podium en direct.
              </p>
            </div>
            <span className="text-xs font-mono px-3 py-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-semibold self-start sm:self-auto">
              🏆 Marque N°1 : {leaderBrand.name}
            </span>
          </div>

          {/* PODIUM DYNAMIQUE DES MARQUES LEADERS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...managedBrands]
              .sort((a, b) => b.seoScore - a.seoScore)
              .map((b, index) => {
                const isFirst = index === 0;
                const isSecond = index === 1;
                const isThird = index === 2;

                return (
                  <div
                    key={b.id}
                    className={`p-5 rounded-xl border space-y-3 relative overflow-hidden transition-all ${
                      isFirst 
                        ? 'bg-amber-500/10 border-amber-500/30 shadow-lg shadow-amber-500/5' 
                        : isSecond 
                        ? 'bg-slate-900/80 border-slate-700' 
                        : isThird 
                        ? 'bg-slate-900/60 border-slate-800' 
                        : 'bg-slate-900/40 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono ${
                        isFirst 
                          ? 'bg-amber-400 text-slate-950' 
                          : isSecond 
                          ? 'bg-slate-300 text-slate-950' 
                          : isThird 
                          ? 'bg-amber-700 text-white' 
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        RANG #{index + 1}
                      </span>
                      <span className="text-xs font-bold text-white font-mono">
                        {b.seoScore}/100
                      </span>
                    </div>

                    <div className="flex items-center gap-2.5 pt-1">
                      <BrandLogo brandId={b.brandId} variant="icon" size="sm" />
                      <div>
                        <h4 className="text-xs font-bold text-white truncate max-w-[150px]">
                          {b.name}
                        </h4>
                        <span className="text-[10px] text-slate-400 block font-mono">
                          {b.primaryDomain}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80 text-[11px] font-mono">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Trafic SEO</span>
                        <span className="font-semibold text-white">{(b.organicTrafficMonthly / 1000).toFixed(1)}k</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block">Index Google</span>
                        <span className="font-semibold text-indigo-400">{b.indexedPages}</span>
                      </div>
                    </div>

                    {isFirst && (
                      <div className="text-[10px] font-bold text-amber-300 bg-amber-500/20 px-2.5 py-1 rounded-md text-center mt-1">
                        ★ Leader Absolu du Groupe
                      </div>
                    )}
                  </div>
                );
              })}
          </div>

          {/* SUPERPOSITION GRAPHIQUE 6 MOIS (Mai - Octobre 2026) */}
          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/90 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-brand-orange" />
                  Superposition des Performances SEO des 4 Marques (6 Mois)
                </h3>
                <p className="text-[11px] text-slate-400">
                  Progression comparée des scores de santé technique et d'autorité de domaine
                </p>
              </div>
              <span className="text-[10px] px-2.5 py-1 rounded bg-slate-800 text-slate-300 font-mono">
                Historique Consolidé
              </span>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={SEO_SCORE_HISTORY}
                  margin={{ top: 15, right: 15, left: -15, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 11 }} />
                  <YAxis domain={[70, 100]} stroke="#64748b" tick={{ fontSize: 10 }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#0f172a', 
                      borderColor: '#334155', 
                      borderRadius: '0.5rem', 
                      fontSize: '12px', 
                      color: '#ffffff',
                      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5)',
                      padding: '8px 12px'
                    }}
                    labelStyle={{ color: '#cbd5e1', fontWeight: 700, marginBottom: '4px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Line type="monotone" dataKey="cosmetics" name="AM PROD Cosmétiques" stroke="#10b981" strokeWidth={2.5} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="rehab" name="Rehab Bio" stroke="#84cc16" strokeWidth={2.5} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="huiles" name="Huiles Végétales" stroke="#16a34a" strokeWidth={2.5} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="formations" name="AM PROD Formations" stroke="#0284c7" strokeWidth={2.5} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      )}

      {/* ============================================================ */}
      {/* SECTION 4 : JOURNAL DES ACTIONS & HISTORIQUE */}
      {/* ============================================================ */}
      {activeTab === 'journal' && (
        <div className="space-y-6">
          
          {/* Header Journal */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <History className="w-5 h-5 text-indigo-400" />
                Journal des Actions & Historique d'Audits
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Traçabilité complète des interventions techniques : Redirections 301, optimisations Core Web Vitals, détections de cannibalisation et audits.
              </p>
            </div>
            <span className="text-xs font-mono px-3 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300">
              {actionLogs.length} événements récents
            </span>
          </div>

          {/* Table of Action Logs */}
          <div className="w-full rounded-xl bg-slate-900/60 border border-slate-800/90 overflow-hidden shadow-sm">
            <div className="w-full overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="p-4">Date & Heure</th>
                    <th className="p-4">Marque Concernée</th>
                    <th className="p-4">Nature de l'Intervention</th>
                    <th className="p-4">Détails & Modifications</th>
                    <th className="p-4">Impact Estimé</th>
                    <th className="p-4">Statut</th>
                    <th className="p-4 text-right">Intervenant</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {actionLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-4 text-slate-400 font-mono text-[11px] whitespace-nowrap">
                        {formatDate(log.date)}
                      </td>
                      <td className="p-4 font-semibold text-white whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <BrandLogo brandId={log.brandId} variant="icon" size="sm" />
                          <span>{log.brandName}</span>
                        </div>
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                          log.actionType === 'Audit Technique' 
                            ? 'bg-sky-500/10 text-sky-400 border-sky-500/20' 
                            : log.actionType === 'Correction 404'
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                            : log.actionType === 'Optimisation Core Web Vitals'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                        }`}>
                          {log.actionType}
                        </span>
                      </td>
                      <td className="p-4 text-slate-300 text-xs max-w-md leading-relaxed">
                        {log.description}
                      </td>
                      <td className="p-4 font-mono font-semibold text-emerald-400 whitespace-nowrap">
                        {log.impactScore}
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {log.status}
                        </span>
                      </td>
                      <td className="p-4 text-right font-mono text-[11px] text-slate-400 whitespace-nowrap">
                        {log.author}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

        </div> {/* FIN CONTENU PRINCIPAL DYNAMIQUE DE LA SIDEBAR */}
      </div> {/* FIN WORKSPACE AVEC SIDEBAR */}

      {/* ============================================================ */}
      {/* MODAL : B. AJOUT ET CONFIGURATION D'UNE NOUVELLE MARQUE */}
      {/* ============================================================ */}
      {isAddBrandModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in">
          <div className="my-auto w-full max-w-xl bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-800/80 flex items-center justify-between shrink-0 bg-slate-900/60">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-brand-orange" />
                <h3 className="text-sm font-bold text-white">
                  Ajout et Configuration d'une Nouvelle Marque
                </h3>
              </div>
              <button
                onClick={() => setIsAddBrandModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddBrandSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-xs font-medium text-slate-300 block mb-1">
                    Nom Officiel de la Marque *
                  </label>
                  <input
                    type="text"
                    required
                    value={newBrandForm.name}
                    onChange={(e) => setNewBrandForm({ ...newBrandForm, name: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-slate-700"
                    placeholder="Ex: AM PROD Parfums d'Orient"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">
                    Domaine Principal *
                  </label>
                  <input
                    type="text"
                    required
                    value={newBrandForm.primaryDomain}
                    onChange={(e) => setNewBrandForm({ ...newBrandForm, primaryDomain: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-slate-700"
                    placeholder="amprod-parfums.com"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">
                    Sitemap XML Central
                  </label>
                  <input
                    type="text"
                    value={newBrandForm.sitemapUrl}
                    onChange={(e) => setNewBrandForm({ ...newBrandForm, sitemapUrl: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-slate-700"
                    placeholder="https://domaine.com/sitemap.xml"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">
                    Secteur d'Activité
                  </label>
                  <select
                    value={newBrandForm.sector}
                    onChange={(e) => setNewBrandForm({ ...newBrandForm, sector: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-slate-700"
                  >
                    <option value="Cosmétique & Soins Spécialisés">Cosmétique & Soins Spécialisés</option>
                    <option value="Parfumerie & Huiles Essentielles">Parfumerie & Huiles Essentielles</option>
                    <option value="Compléments Alimentaires Bio">Compléments Alimentaires Bio</option>
                    <option value="Packaging & Équipements Pro">Packaging & Équipements Pro</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">
                    Couleur d'Identité
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={newBrandForm.primaryColor}
                      onChange={(e) => setNewBrandForm({ ...newBrandForm, primaryColor: e.target.value })}
                      className="h-8 w-12 rounded cursor-pointer bg-slate-950 border border-slate-800 p-0.5"
                    />
                    <span className="text-xs font-mono text-slate-400">{newBrandForm.primaryColor}</span>
                  </div>
                </div>

                {/* API Configuration */}
                <div className="sm:col-span-2 pt-2 border-t border-slate-800 space-y-3">
                  <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    <Link2 className="w-3.5 h-3.5 text-indigo-400" />
                    Connexions API Tierces Google
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">
                        Google Search Console
                      </label>
                      <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-950 border border-slate-800">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span className="text-slate-300 font-medium">OAuth2 Prêt</span>
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">
                        Google Analytics 4 Measurement ID
                      </label>
                      <input
                        type="text"
                        value={newBrandForm.ga4MeasurementId}
                        onChange={(e) => setNewBrandForm({ ...newBrandForm, ga4MeasurementId: e.target.value })}
                        className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-950 border border-slate-800 text-white font-mono"
                        placeholder="G-XXXXXXXXXX"
                      />
                    </div>
                  </div>
                </div>

                {/* Alert Thresholds */}
                <div className="sm:col-span-2 pt-2 border-t border-slate-800 space-y-3">
                  <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                    Seuils d'Alerte Personnalisés
                  </span>

                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">Score SEO Min.</label>
                      <input
                        type="number"
                        min="50"
                        max="100"
                        value={newBrandForm.minSeoScore}
                        onChange={(e) => setNewBrandForm({ ...newBrandForm, minSeoScore: Number(e.target.value) })}
                        className="w-full px-2 py-1 text-xs rounded bg-slate-950 border border-slate-800 text-white text-center font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">Max 404 Tolérées</label>
                      <input
                        type="number"
                        min="0"
                        max="20"
                        value={newBrandForm.maxErrors404}
                        onChange={(e) => setNewBrandForm({ ...newBrandForm, maxErrors404: Number(e.target.value) })}
                        className="w-full px-2 py-1 text-xs rounded bg-slate-950 border border-slate-800 text-white text-center font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">Baisse Trafic (%)</label>
                      <input
                        type="number"
                        min="5"
                        max="50"
                        value={newBrandForm.trafficDropPercent}
                        onChange={(e) => setNewBrandForm({ ...newBrandForm, trafficDropPercent: Number(e.target.value) })}
                        className="w-full px-2 py-1 text-xs rounded bg-slate-950 border border-slate-800 text-white text-center font-mono"
                      />
                    </div>
                  </div>
                </div>

              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddBrandModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-brand-orange hover:bg-brand-orange-hover transition-colors shadow-sm"
                >
                  Raccorder et Activer la Marque
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* CHATBOT FLOTTANT EN BAS À DROITE (STYLE INTERCOM / WIDGET) */}
      {/* ============================================================ */}
      
      {/* BOUTON FLOTTANT DÉCLENCHEUR */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className={`relative p-4 rounded-full shadow-2xl transition-all duration-300 flex items-center justify-center group ${
            isChatOpen 
              ? 'bg-slate-800 text-white hover:bg-slate-700' 
              : 'bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 text-white hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(99,102,241,0.5)]'
          }`}
          title={isChatOpen ? "Fermer l'Assistant SEO" : "Discuter avec l'Agent SEO Central"}
        >
          {!isChatOpen && (
            <span className="animate-ping absolute inset-0 rounded-full bg-indigo-500 opacity-30" />
          )}

          {isChatOpen ? (
            <X className="w-6 h-6 relative z-10" />
          ) : (
            <div className="relative z-10 flex items-center gap-1.5">
              <Bot className="w-6 h-6" />
              <span className="hidden sm:inline-block text-xs font-bold pl-1 pr-1">
                Agent CEO IA
              </span>
            </div>
          )}
        </button>
      </div>

      {/* FENÊTRE FLOTTANTE DE CHAT (POPOVER) */}
      {isChatOpen && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-50 w-[420px] max-w-[calc(100vw-2rem)] h-[560px] max-h-[calc(100vh-7rem)] rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-slate-800 shadow-[0_25px_60px_rgba(0,0,0,0.6)] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          
          <div className="p-4 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center font-bold shadow-md relative">
                <Bot className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-slate-950" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                  Agent CEO Central
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 font-mono font-semibold">
                    GROUPE
                  </span>
                </h3>
                <p className="text-[10px] text-slate-400">
                  Superviseur IA Direction Générale • {managedBrands.length} Filiales Connectées
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsChatOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Réduire"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="px-3.5 py-2 bg-slate-950/50 border-b border-slate-800/80 space-y-2">
            <AIDisclaimer variant="compact" />
            
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
              {[
                { label: '📊 Synthèse', query: 'Synthèse globale du groupe' },
                { label: '⚠️ Alertes', query: 'Avez-vous détecté des alertes de baisse de trafic ?' },
                { label: '🏆 Leader', query: 'Quelle est la marque leader ?' },
                { label: '🛒 Top Produits', query: 'Quels sont les meilleurs produits du mois ?' },
              ].map(chip => (
                <button
                  key={chip.label}
                  type="button"
                  onClick={() => handleSendMessage(undefined, chip.query)}
                  className="px-2 py-1 rounded-md text-[10px] font-medium bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 shrink-0 transition-colors"
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-950/40">
            {chatHistory.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'admin' ? 'items-end' : 'items-start'}`}
              >
                <div className="text-[10px] text-slate-400 mb-0.5">
                  {msg.sender === 'admin' ? 'Vous (Admin)' : 'Agent SEO IA'} • {msg.timestamp}
                </div>
                <div
                  className={`max-w-[88%] rounded-xl px-3.5 py-2.5 text-xs leading-relaxed ${
                    msg.sender === 'admin'
                      ? 'bg-brand-orange text-white shadow-xs'
                      : 'bg-slate-900 text-slate-200 border border-slate-800 shadow-xs'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-800 bg-slate-950 flex items-center gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Interroger l'IA sur le parc de marques..."
              className="flex-1 text-xs px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-colors"
            />
            <button
              type="submit"
              className="p-2 rounded-lg text-white bg-indigo-600 hover:bg-indigo-500 transition-colors shadow-sm"
              title="Envoyer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}

    </div>
  );
};
