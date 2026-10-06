import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Bell, 
  Users, 
  FileText, 
  ShoppingCart, 
  Truck, 
  CreditCard, 
  AlertOctagon, 
  Package, 
  ShoppingBag, 
  Building2, 
  Bot, 
  MessageSquare, 
  BookOpen, 
  Sun, 
  Moon, 
  LogOut, 
  Menu, 
  X,
  GraduationCap,
  Calendar,
  RotateCcw,
  BarChart2,
  Sparkles,
  Search,
  ChevronDown,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';

import { BRANDS } from '../data/brands';
import { BrandId, LeadOrClient, Product, TrainingCourse, TrainingReview, EmailTemplate } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useTheme } from '../hooks/useTheme';

import { INITIAL_LEADS_COSMETICS, INITIAL_LEADS_REHAB, INITIAL_LEADS_HUILES, INITIAL_LEADS_FORMATIONS } from '../data/leads';
import { INITIAL_PRODUCTS } from '../data/products';
import { INITIAL_TRAINING_COURSES, INITIAL_TRAINING_REVIEWS, INITIAL_EMAIL_TEMPLATES } from '../data/trainings';
import { INITIAL_QUOTES, INITIAL_ORDERS, INITIAL_LOGISTICS, INITIAL_INVOICES, INITIAL_CLAIMS, INITIAL_SUPPLIERS, INITIAL_PURCHASE_ORDERS } from '../data/operations';
import { INITIAL_CHATBOT_CONFIGS, INITIAL_CONVERSATIONS } from '../data/customerService';
import { INITIAL_KNOWLEDGE_DOCS, INITIAL_FAQS } from '../data/seoAndSettings';

import { BrandLogo } from '../components/BrandLogo';
import { ErpDashboard } from '../components/ErpDashboard';
import { Lead360Modal } from '../components/Lead360Modal';
import { ProductDetailDrawer } from '../components/ProductDetailDrawer';
import { CustomerServiceModule } from '../components/CustomerServiceModule';
import { KnowledgeSettings } from '../components/KnowledgeSettings';
import { CommercialSalesView } from '../components/CommercialSalesView';
import { ProductsAndPurchasesView } from '../components/ProductsAndPurchasesView';
import { FormationsErpModule } from '../components/FormationsErpModule';
import { FooterInstitutional } from '../components/FooterAndDisclaimers';
import { AnimatedBackground } from '../components/AnimatedBackground';

export const ErpLayout: React.FC = () => {
  const { brandId } = useParams<{ brandId: string }>();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const validBrandId = (brandId && brandId in BRANDS ? brandId : 'cosmetics') as BrandId;
  const brand = BRANDS[validBrandId];
  const isFormations = validBrandId === 'formations';

  const [currentMenu, setCurrentMenu] = useState<string>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');

  // Sidebar collapsible state
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Accordion collapsible sections state
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    general: true,
    commercial: true,
    catalogue: true,
    service: true,
    settings: true,
    pedagogie: true,
    finance: true,
  });

  const toggleSection = (sectionKey: string) => {
    setOpenSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  };

  const [leads, setLeads] = useLocalStorage<LeadOrClient[]>('am_erp_leads', [
    ...INITIAL_LEADS_COSMETICS,
    ...INITIAL_LEADS_REHAB,
    ...INITIAL_LEADS_HUILES,
    ...INITIAL_LEADS_FORMATIONS
  ]);

  const [products, setProducts] = useLocalStorage<Product[]>('am_erp_products', INITIAL_PRODUCTS);
  const [courses, setCourses] = useLocalStorage<TrainingCourse[]>('am_erp_trainings', INITIAL_TRAINING_COURSES);
  const [reviews, setReviews] = useLocalStorage<TrainingReview[]>('am_erp_training_reviews', INITIAL_TRAINING_REVIEWS);
  const [emailTemplates, setEmailTemplates] = useLocalStorage<EmailTemplate[]>('am_erp_email_templates', INITIAL_EMAIL_TEMPLATES);
  const [quotes] = useLocalStorage('am_erp_quotes', INITIAL_QUOTES);
  const [orders] = useLocalStorage('am_erp_orders', INITIAL_ORDERS);
  const [logistics] = useLocalStorage('am_erp_logistics', INITIAL_LOGISTICS);
  const [invoices] = useLocalStorage('am_erp_invoices', INITIAL_INVOICES);
  const [claims, setClaims] = useLocalStorage('am_erp_claims', INITIAL_CLAIMS);
  const [suppliers, setSuppliers] = useLocalStorage('am_erp_suppliers', INITIAL_SUPPLIERS);
  const [purchaseOrders] = useLocalStorage('am_erp_pos', INITIAL_PURCHASE_ORDERS);

  const [chatbotConfigs, setChatbotConfigs] = useLocalStorage('am_chatbot_configs', INITIAL_CHATBOT_CONFIGS);
  const [conversations, setConversations] = useLocalStorage('am_conversations', INITIAL_CONVERSATIONS);
  const [docs, setDocs] = useLocalStorage('am_knowledge_docs', INITIAL_KNOWLEDGE_DOCS);
  const [faqs, setFaqs] = useLocalStorage('am_knowledge_faqs', INITIAL_FAQS);

  // Ensure valid working avatar for Dr. Kenza Benjelloun across localStorage
  React.useEffect(() => {
    const kenza = conversations.find(c => c.id === 'conv-1');
    if (kenza && (!kenza.avatar || kenza.avatar.includes('photo-1594824813583'))) {
      setConversations(conversations.map(c => 
        c.id === 'conv-1' 
          ? { ...c, avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80' } 
          : c
      ));
    }
  }, [conversations, setConversations]);

  const [selected360Lead, setSelected360Lead] = useState<LeadOrClient | null>(null);
  const [is360ModalOpen, setIs360ModalOpen] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductDrawerOpen, setIsProductDrawerOpen] = useState(false);

  const handleOpenLead = (lead: LeadOrClient) => {
    setSelected360Lead(lead);
    setIs360ModalOpen(true);
  };

  const handleUpdateLead = (updated: LeadOrClient) => {
    setLeads(prev => prev.map(l => l.id === updated.id ? updated : l));
    setSelected360Lead(updated);
  };

  const handleOpenProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsProductDrawerOpen(true);
  };

  const handleUpdateStock = (productId: string, newStock: number) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        const newStatus = newStock === 0 ? 'Rupture' : newStock <= p.minStock ? 'Stock faible' : 'En stock';
        return { ...p, stock: newStock, status: newStatus as any };
      }
      return p;
    }));
  };

  // Helper for rendering nav button
  const renderNavButton = (id: string, label: string, icon: React.ReactNode, badge?: React.ReactNode) => {
    const isActive = currentMenu === id;
    return (
      <button
        key={id}
        onClick={() => { setCurrentMenu(id); setMobileMenuOpen(false); }}
        title={isSidebarCollapsed ? label : undefined}
        className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center px-2 py-2.5' : 'justify-between px-3 py-2'} rounded-lg text-xs font-medium transition-all ${
          isActive
            ? 'bg-slate-900 text-white font-semibold border border-slate-800 shadow-xs'
            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
        }`}
      >
        <span className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : 'gap-2.5'}`}>
          <span className={`${isActive ? 'text-white' : 'text-slate-400'}`}>
            {icon}
          </span>
          {!isSidebarCollapsed && <span className="truncate">{label}</span>}
        </span>
        {!isSidebarCollapsed && badge && <span>{badge}</span>}
      </button>
    );
  };

  // Helper for accordion section title
  const renderSectionHeader = (key: string, title: string) => {
    if (isSidebarCollapsed) {
      return <div className="h-px bg-slate-800/80 my-2 mx-1" />;
    }
    const isOpen = openSections[key] !== false;
    return (
      <button
        type="button"
        onClick={() => toggleSection(key)}
        className="w-full flex items-center justify-between px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:text-slate-300 transition-colors select-none"
      >
        <span>{title}</span>
        <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-0' : '-rotate-90'}`} />
      </button>
    );
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-slate-950 text-slate-100 selection:bg-orange-500 selection:text-white">
      
      {/* HEADER SUPÉRIEUR GLOBAL SAAS (Pleine largeur, Barre de recherche globale, actions rapides, profil à droite) */}
      <header className="w-full px-6 py-3 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40 flex items-center justify-between gap-4">
        
        {/* Brand identity & mobile toggler */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-lg text-slate-400 md:hidden hover:bg-slate-900"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link to="/" className="flex items-center gap-2 group">
            <BrandLogo brandId={validBrandId} variant="compact" size="md" />
            <span 
              className="hidden sm:inline-block text-[10px] px-2 py-0.5 rounded font-semibold border ml-1"
              style={{ 
                borderColor: `${brand.primaryColor}40`, 
                color: brand.primaryColor,
                backgroundColor: `${brand.primaryColor}15`
              }}
            >
              ERP
            </span>
          </Link>
        </div>

        {/* Global Search Bar (Style Touvis AI SaaS) */}
        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              placeholder="Recherche globale (leads, commandes, stocks, fiches)..."
              className="w-full pl-8 pr-4 py-1.5 text-xs rounded-lg bg-slate-900/80 border border-slate-800 text-slate-200 placeholder-slate-400 focus:outline-none focus:border-slate-700 transition-colors"
            />
          </div>
        </div>

        {/* Right Actions & Admin Profile */}
        <div className="flex items-center gap-3">
          
          <Link
            to="/seo"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-500/20 transition-colors"
          >
            <BrandLogo brandId="seo" variant="icon" size="sm" />
            <span className="hidden sm:inline font-semibold">Hub Agent CEO</span>
          </Link>

          <div className="h-4 w-px bg-slate-800" />

          {/* User profile right-aligned */}
          <div className="flex items-center gap-2 pl-1">
            <div 
              className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs text-white border border-slate-700 shrink-0" 
              style={{ backgroundColor: brand.primaryColor }}
            >
              {brand.loginRole.charAt(0)}
            </div>
            <div className="hidden lg:block text-left">
              <span className="text-[11px] font-semibold text-slate-200 block leading-tight">
                {brand.loginRole}
              </span>
              <span className="text-[10px] text-slate-400 block leading-tight">
                AM PROD Active
              </span>
            </div>
          </div>

          <button
            onClick={() => navigate('/')}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
            title="Quitter"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* FULL WIDTH LAYOUT: SIDEBAR (Fixe à gauche & indépendante) + WORKSPACE (Pleine largeur) */}
      <div className="flex-1 w-full flex relative">
        
        {/* SIDEBAR NAVIGATION (Fixe à gauche, fond opaque sans interférence avec l'anim, scroll indépendant) */}
        <aside className={`
          fixed md:sticky top-0 md:top-[57px] h-screen md:h-[calc(100vh-57px)] z-30 bg-slate-950 border-r border-slate-800/80 p-3 flex flex-col justify-between shrink-0 transition-all duration-300 overflow-y-auto
          ${isSidebarCollapsed ? 'w-16' : 'w-64'}
          ${mobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'}
        `}>
          <div className="space-y-4">
            
            {/* Header / Collapse Toggle on desktop */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
              {!isSidebarCollapsed ? (
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-1">
                  Menu Principal
                </span>
              ) : (
                <div className="w-full flex justify-center">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: brand.primaryColor }} />
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
              <button onClick={() => setMobileMenuOpen(false)} className="md:hidden p-1 text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* BRAND NAVIGATION WITH ACCORDIONS */}
            {!isFormations ? (
              <div className="space-y-3">
                
                {/* 1. Pilotage & Direction */}
                <div className="space-y-1">
                  {renderSectionHeader('general', 'Pilotage')}
                  {(isSidebarCollapsed || openSections.general !== false) && (
                    <div className="space-y-0.5">
                      {renderNavButton('dashboard', 'Dashboard', <LayoutDashboard className="w-4 h-4" />)}
                      {renderNavButton(
                        'alertes', 
                        'Alertes', 
                        <Bell className="w-4 h-4 text-brand-orange" />,
                        <span className="px-1.5 py-0.2 rounded text-[10px] bg-orange-500/20 text-orange-400 border border-orange-500/30">2</span>
                      )}
                    </div>
                  )}
                </div>

                {/* 2. Commercial & Ventes (Accordéon) */}
                <div className="space-y-1">
                  {renderSectionHeader('commercial', 'Commercial & Ventes')}
                  {(isSidebarCollapsed || openSections.commercial !== false) && (
                    <div className="space-y-0.5">
                      {renderNavButton('leads', 'Leads / CRM', <Users className="w-4 h-4" />)}
                      {renderNavButton('clients', 'Clients', <Building2 className="w-4 h-4" />)}
                      {renderNavButton('devis', 'Devis', <FileText className="w-4 h-4" />)}
                      {renderNavButton('commandes', 'Commandes', <ShoppingCart className="w-4 h-4" />)}
                      {renderNavButton('logistique', 'Logistique', <Truck className="w-4 h-4 text-brand-orange" />)}
                      {renderNavButton('paiements', 'Paiements & Factures', <CreditCard className="w-4 h-4" />)}
                      {renderNavButton('reclamations', 'Réclamations', <AlertOctagon className="w-4 h-4 text-rose-400" />)}
                    </div>
                  )}
                </div>

                {/* 3. Catalogue & Approvisionnement (Accordéon) */}
                <div className="space-y-1">
                  {renderSectionHeader('catalogue', 'Catalogue & Appro')}
                  {(isSidebarCollapsed || openSections.catalogue !== false) && (
                    <div className="space-y-0.5">
                      {renderNavButton('produits', 'Produits', <Package className="w-4 h-4" />)}
                      {renderNavButton('achats', 'Achats', <ShoppingBag className="w-4 h-4" />)}
                      {renderNavButton('fournisseurs', 'Fournisseurs', <Building2 className="w-4 h-4" />)}
                    </div>
                  )}
                </div>

                {/* 4. Service Client & IA (Accordéon) */}
                <div className="space-y-1">
                  {renderSectionHeader('service', 'Service Client IA')}
                  {(isSidebarCollapsed || openSections.service !== false) && (
                    <div className="space-y-0.5">
                      {renderNavButton('assistant_ia', 'Assistant IA', <Bot className="w-4 h-4" />)}
                      {renderNavButton('conversations', 'Conversations', <MessageSquare className="w-4 h-4" />)}
                    </div>
                  )}
                </div>

                {/* 5. Paramètres & Système */}
                <div className="space-y-1">
                  {renderSectionHeader('settings', 'Paramètres')}
                  {(isSidebarCollapsed || openSections.settings !== false) && (
                    <div className="space-y-0.5">
                      {renderNavButton('settings_ia', 'Paramètres IA', <BookOpen className="w-4 h-4" />)}
                    </div>
                  )}
                </div>

              </div>
            ) : (
              /* FORMATIONS SPECIFIC ACCORDIONS */
              <div className="space-y-3">
                
                {/* 1. Direction & Performance */}
                <div className="space-y-1">
                  {renderSectionHeader('general', 'Direction')}
                  {(isSidebarCollapsed || openSections.general !== false) && (
                    <div className="space-y-0.5">
                      {renderNavButton('dashboard', 'Dashboard', <LayoutDashboard className="w-4 h-4" />)}
                      {renderNavButton('analytics', 'Analytics', <BarChart2 className="w-4 h-4" />)}
                    </div>
                  )}
                </div>

                {/* 2. Candidatures & Pédagogie (Accordéon) */}
                <div className="space-y-1">
                  {renderSectionHeader('pedagogie', 'Candidats & Cours')}
                  {(isSidebarCollapsed || openSections.pedagogie !== false) && (
                    <div className="space-y-0.5">
                      {renderNavButton('leads', 'Leads & Candidats', <Users className="w-4 h-4" />)}
                      {renderNavButton('formations', 'Formations', <GraduationCap className="w-4 h-4" />)}
                      {renderNavButton('calendrier', 'Calendrier', <Calendar className="w-4 h-4" />)}
                      {renderNavButton('relance', 'Relance Candidats', <RotateCcw className="w-4 h-4" />)}
                    </div>
                  )}
                </div>

                {/* 3. Finance & Qualité (Accordéon) */}
                <div className="space-y-1">
                  {renderSectionHeader('finance', 'Finance & SAV')}
                  {(isSidebarCollapsed || openSections.finance !== false) && (
                    <div className="space-y-0.5">
                      {renderNavButton('paiements', 'Paiements Fractionnés', <CreditCard className="w-4 h-4" />)}
                      {renderNavButton('reclamations', 'Réclamations / SAV', <AlertOctagon className="w-4 h-4 text-rose-400" />)}
                      {renderNavButton('avis', 'Avis Après Formations', <Sparkles className="w-4 h-4 text-amber-400" />)}
                    </div>
                  )}
                </div>

                {/* 4. Service Client & IA Sofia */}
                <div className="space-y-1">
                  {renderSectionHeader('service', 'Support & IA')}
                  {(isSidebarCollapsed || openSections.service !== false) && (
                    <div className="space-y-0.5">
                      {renderNavButton('assistant_ia', 'Assistant IA', <Bot className="w-4 h-4" />)}
                      {renderNavButton('conversations', 'Conversations', <MessageSquare className="w-4 h-4" />)}
                      {renderNavButton('settings_ia', 'Paramètres IA', <BookOpen className="w-4 h-4" />)}
                    </div>
                  )}
                </div>

              </div>
            )}

          </div>

          {/* Bottom brand indicator */}
          <div className={`p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 ${isSidebarCollapsed ? 'text-center' : ''}`}>
            {isSidebarCollapsed ? (
              <span className="font-bold text-xs" style={{ color: brand.primaryColor }}>
                {brand.name.substring(0, 2).toUpperCase()}
              </span>
            ) : (
              <>
                <span className="text-[10px] uppercase block text-slate-400">Espace actif</span>
                <span className="font-medium text-slate-200 truncate block">{brand.name}</span>
              </>
            )}
          </div>
        </aside>

        {/* CONTENU PRINCIPAL PLEINE LARGEUR (Fond animé géométrique UNIQUEMENT ici) */}
        <main className="relative flex-1 w-full min-w-0 p-6 lg:p-8 overflow-y-auto">
          
          {/* Animated Background applies exclusively inside this main content area */}
          <AnimatedBackground variant={brand.id} opacity={0.3} fixed={false} />

          {/* Formations Sub-views routing */}
          {isFormations && ['dashboard', 'leads', 'formations', 'calendrier', 'relance', 'paiements', 'analytics', 'avis', 'conversations', 'settings_ia'].includes(currentMenu) && (
            <FormationsErpModule
              brand={brand}
              courses={courses}
              onUpdateCourses={setCourses}
              leads={leads}
              onUpdateLeads={setLeads}
              invoices={invoices}
              onOpenLead={handleOpenLead}
              activeSubView={currentMenu as any}
              reviews={reviews}
              onUpdateReviews={setReviews}
              emailTemplates={emailTemplates}
              onUpdateEmailTemplates={setEmailTemplates}
              conversations={conversations}
              onUpdateConversations={setConversations}
            />
          )}

          {/* Non-Formations Dashboard */}
          {!isFormations && currentMenu === 'dashboard' && (
            <ErpDashboard
              brand={brand}
              products={products}
              orders={orders}
              leads={leads}
              onOpenLead={handleOpenLead}
              onOpenProduct={handleOpenProduct}
            />
          )}

          {/* Alertes Opérationnelles */}
          {currentMenu === 'alertes' && (
            <div className="w-full p-6 rounded-xl bg-slate-900/60 border border-slate-800/90 space-y-4 hover-lift">
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <Bell className="w-4 h-4 text-brand-orange" /> Alertes Opérationnelles & Logistique
              </h2>
              <div className="space-y-3">
                <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-start gap-3">
                  <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">STOCK</span>
                  <div>
                    <h4 className="font-semibold text-white">Alerte Réapprovisionnement</h4>
                    <p className="mt-0.5 text-amber-300/80">Le produit « Émulsion Hydratante Barrière » approche de son seuil critique de 60 unités.</p>
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-sky-500/10 border border-sky-500/20 text-xs text-sky-300 flex items-start gap-3">
                  <span className="px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 font-bold">IA BOT</span>
                  <div>
                    <h4 className="font-semibold text-white">Transfert WhatsApp en attente</h4>
                    <p className="mt-0.5 text-sky-300/80">Karim Tazi demande un échange avec un conseiller humain pour devis sur-mesure.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Commercial Sub-views & Reclamations (Toutes marques) */}
          {((!isFormations && ['leads', 'clients', 'devis', 'commandes', 'logistique', 'paiements'].includes(currentMenu)) || currentMenu === 'reclamations') && (
            <CommercialSalesView
              subView={currentMenu as any}
              brand={brand}
              leads={leads}
              onOpenLead={handleOpenLead}
              onUpdateLeads={setLeads}
              quotes={quotes}
              orders={orders}
              logistics={logistics}
              invoices={invoices}
              claims={claims}
              onUpdateClaims={setClaims}
            />
          )}

          {/* Products Catalogue */}
          {!isFormations && currentMenu === 'produits' && (
            <ProductsAndPurchasesView
              viewMode="products"
              brand={brand}
              products={products}
              onOpenProduct={handleOpenProduct}
              onUpdateProducts={setProducts}
              suppliers={suppliers}
              onUpdateSuppliers={setSuppliers}
              purchaseOrders={purchaseOrders}
            />
          )}

          {/* Achats & Fournisseurs */}
          {!isFormations && (currentMenu === 'achats' || currentMenu === 'fournisseurs') && (
            <ProductsAndPurchasesView
              viewMode={currentMenu as any}
              brand={brand}
              products={products}
              onOpenProduct={handleOpenProduct}
              onUpdateProducts={setProducts}
              suppliers={suppliers}
              onUpdateSuppliers={setSuppliers}
              purchaseOrders={purchaseOrders}
            />
          )}

          {/* Customer Service for Non-Formations brands */}
          {!isFormations && (currentMenu === 'assistant_ia' || currentMenu === 'conversations') && (
            <CustomerServiceModule
              key={`${brand.id}-${currentMenu}`}
              brand={brand}
              chatbotConfig={chatbotConfigs[brand.id]}
              onUpdateChatbotConfig={(newConfig) => {
                setChatbotConfigs({ ...chatbotConfigs, [brand.id]: newConfig });
              }}
              conversations={conversations}
              onUpdateConversations={setConversations}
              initialTab={currentMenu === 'assistant_ia' ? 'assistant' : 'conversations'}
              onTabChange={(tab) => {
                setCurrentMenu(tab === 'assistant' ? 'assistant_ia' : 'conversations');
              }}
            />
          )}

          {/* Assistant IA for Formations */}
          {isFormations && currentMenu === 'assistant_ia' && (
            <CustomerServiceModule
              key={`${brand.id}-assistant`}
              brand={brand}
              chatbotConfig={chatbotConfigs[brand.id]}
              onUpdateChatbotConfig={(newConfig) => {
                setChatbotConfigs({ ...chatbotConfigs, [brand.id]: newConfig });
              }}
              conversations={conversations}
              onUpdateConversations={setConversations}
              initialTab="assistant"
              onTabChange={(tab) => {
                setCurrentMenu(tab === 'assistant' ? 'assistant_ia' : 'conversations');
              }}
            />
          )}

          {/* Knowledge & AI Settings for Non-Formations */}
          {!isFormations && currentMenu === 'settings_ia' && (
            <KnowledgeSettings
              brand={brand}
              docs={docs}
              onUpdateDocs={setDocs}
              faqs={faqs}
              onUpdateFaqs={setFaqs}
            />
          )}

        </main>
      </div>

      {/* LEAD 360° MODAL */}
      <Lead360Modal
        lead={selected360Lead}
        brand={brand}
        isOpen={is360ModalOpen}
        onClose={() => setIs360ModalOpen(false)}
        onUpdateLead={handleUpdateLead}
      />

      {/* PRODUCT DETAIL DRAWER */}
      <ProductDetailDrawer
        product={selectedProduct}
        brand={brand}
        isOpen={isProductDrawerOpen}
        onClose={() => setIsProductDrawerOpen(false)}
        onUpdateStock={handleUpdateStock}
      />

      <FooterInstitutional />
    </div>
  );
};
