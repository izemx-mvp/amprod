export type BrandId = 'cosmetics' | 'rehab' | 'huiles' | 'formations' | 'seo';

export interface BrandConfig {
  id: BrandId;
  name: string;
  tagline: string;
  sector: string;
  badge: string;
  logo: string;
  loginEmail: string;
  loginRole: string;
  primaryColor: string;
  primaryHover: string;
  primaryLight: string;
  primaryText: string;
  accentBadge: string;
  headerGradient: string;
  themeGreenName: string; // e.g. "Vert Émeraude Profond", "Vert Nature Olive"
  description: string;
}

export interface ActivityTimelineItem {
  id: string;
  date: string;
  title: string;
  description: string;
  type: 'order' | 'quote' | 'training' | 'invoice' | 'claim' | 'whatsapp' | 'email' | 'call' | 'note';
  author: string;
  badge?: string;
}

export interface LeadOrClient {
  id: string;
  brandId: BrandId;
  isClient: boolean;
  name: string;
  company?: string;
  email: string;
  phone: string;
  city: string;
  country: string;
  source: 'Site Web' | 'WhatsApp' | 'Instagram' | 'Salon Pro' | 'Bouche à oreille' | 'Campagne Ads';
  status: string; // e.g. "Nouveau", "Qualifié", "Proposition envoyée", "Inscrit", "Payé une avance", "Confirmé", "Absent le jour J"
  aiScore: number; // 0-100
  aiRationale: string;
  lastContact: string;
  assignedTo: string;
  totalOrdersValue: number;
  totalPaid: number;
  remainingDue?: number;
  activeOrdersCount: number;
  pendingQuotesCount: number;
  openClaimsCount: number;
  trainingRegisteredCount?: number;
  notes: string;
  timeline: ActivityTimelineItem[];
}

export interface Product {
  id: string;
  brandId: BrandId;
  sku: string;
  name: string;
  category: string;
  price: number;
  cost: number;
  stock: number;
  minStock: number;
  salesLast30Days: number;
  revenueGenerated: number;
  rating: number;
  reviewsCount: number;
  description: string;
  composition?: string;
  image: string;
  status: 'En stock' | 'Stock faible' | 'Rupture' | 'Précommande';
}

export interface TrainingSession {
  id: string;
  trainingId: string;
  startDate: string;
  endDate: string;
  location: string;
  maxAttendees: number;
  enrolledCount: number;
  status: 'Planifiée' | 'En cours' | 'Clôturée' | 'Complète';
}

export interface TrainingCourse {
  id: string;
  title: string;
  code: string;
  level: 'Débutant' | 'Intermédiaire' | 'Avancé' | 'Masterclass';
  durationDays: number;
  priceTotal: number;
  minDeposit: number;
  totalEnrolled: number;
  completionRate: number;
  rating: number;
  image: string;
  instructor: string;
  description: string;
  syllabus: string[];
  sessions: TrainingSession[];
}

export interface Quote {
  id: string;
  brandId: BrandId;
  quoteNumber: string;
  clientName: string;
  clientEmail: string;
  date: string;
  validUntil: string;
  totalHT: number;
  totalTTC: number;
  status: 'Brouillon' | 'Envoyé' | 'Accepté' | 'Refusé' | 'Expiré';
  itemsCount: number;
}

export interface Order {
  id: string;
  brandId: BrandId;
  orderNumber: string;
  clientName: string;
  clientEmail: string;
  date: string;
  totalTTC: number;
  paymentStatus: 'Payé' | 'Partiel (Avance)' | 'En attente' | 'Échoué';
  logisticsStatus: 'En préparation' | 'Expédié' | 'En transit' | 'Livré' | 'Retourné';
  trackingNumber: string;
  carrier: 'Chronopost' | 'DHL Express' | 'Amana Express' | 'Colissimo';
}

export interface LogisticsShipment {
  id: string;
  orderNumber: string;
  clientName: string;
  destination: string;
  carrier: string;
  trackingNumber: string;
  status: 'Étiquette créée' | 'Ramassé' | 'Au centre de tri' | 'En livraison' | 'Livré';
  dateShipped: string;
  estimatedDelivery: string;
  temperatureControlled?: boolean;
}

export interface Invoice {
  id: string;
  brandId: BrandId;
  invoiceNumber: string;
  clientName: string;
  date: string;
  dueDate: string;
  amountTotal: number;
  amountPaid: number;
  remainingDue: number;
  status: 'Payée' | 'Avance reçue' | 'En attente' | 'En retard';
  paymentMethod: 'Virement' | 'Carte Bancaire' | 'Chèque' | 'Espèces';
}

export type ClaimStatus = 'En attente' | 'Ouverte' | 'Résolue' | 'Refusée' | 'Nouveau' | 'En cours d\'analyse' | 'En attente client' | 'Résolu' | 'Rejeté';
export type ClaimPriority = 'Faible' | 'Basse' | 'Moyenne' | 'Haute' | 'Urgente';

export interface Claim {
  id: string;
  brandId: BrandId;
  claimNumber: string;
  clientName: string;
  subject: string;
  priority: ClaimPriority;
  status: ClaimStatus;
  dateCreated: string;
  category: 'Produit défectueux' | 'Retard livraison' | 'Colis endommagé' | 'Erreur commande' | 'Autre';
  resolutionNotes?: string;
}

export interface PurchaseSupplier {
  id: string;
  brandId: BrandId;
  name: string;
  country: string;
  category: string;
  contactName: string;
  phone: string;
  email: string;
  reliabilityScore: number;
  leadTimeDays: number;
}

export interface PurchaseOrder {
  id: string;
  brandId: BrandId;
  poNumber: string;
  supplierName: string;
  date: string;
  expectedDate: string;
  totalAmount: number;
  status: 'Commandé' | 'En transit' | 'Réceptionné' | 'Contrôle qualité OK' | 'Litige';
  itemsSummary: string;
}

export interface ChatMessage {
  id: string;
  sender: 'client' | 'ai' | 'agent';
  text: string;
  timestamp: string;
  status?: 'sent' | 'delivered' | 'read';
  suggestedByAI?: boolean;
}

export type OmnichannelChannel = 'WhatsApp' | 'Instagram' | 'Facebook' | 'TikTok' | 'Site Web';

export interface WhatsAppConversation {
  id: string;
  brandId: BrandId;
  clientName: string;
  phone: string;
  avatar?: string;
  channel: OmnichannelChannel | 'WebChat';
  unreadCount: number;
  status: 'En cours (IA)' | 'Transféré Humain' | 'Résolu' | 'En attente';
  priority: 'Normale' | 'Haute' | 'Prioritaire VIP';
  lastMessage: string;
  lastTimestamp: string;
  notes: string;
  messages: ChatMessage[];
}

export interface ChannelSettings {
  botName: string;
  welcomeMessage: string;
  tone: 'Professionnel & Rassurant' | 'Chaleureux & Bienveillant' | 'Direct & Efficace' | 'Prestige & Luxe';
  supportedLanguages: ('FR' | 'AR' | 'EN')[];
  businessHours: {
    start: string;
    end: string;
    days: string;
  };
  humanTransferRules: {
    maxAIFailures: number;
    keywords: string[];
    transferOnAngrySentiment: boolean;
  };
}

export interface ChatbotConfig {
  brandId: BrandId;
  botName: string;
  welcomeMessage: string;
  tone: 'Professionnel & Rassurant' | 'Chaleureux & Bienveillant' | 'Direct & Efficace' | 'Prestige & Luxe';
  supportedLanguages: ('FR' | 'AR' | 'EN')[];
  businessHours: {
    start: string;
    end: string;
    days: string;
  };
  humanTransferRules: {
    maxAIFailures: number;
    keywords: string[];
    transferOnAngrySentiment: boolean;
  };
  channelSettings?: Record<OmnichannelChannel, ChannelSettings>;
  aiEnabled: boolean;
  totalConversationsToday: number;
  resolutionRatePercent: number;
  avgResponseTimeSeconds: number;
}

export interface SeoMetric {
  brandId: BrandId;
  brandName: string;
  seoScore: number; // 0-100
  indexedPages: number;
  errors404: number;
  avgPageLoadSeconds: number;
  organicTrafficMonthly: number;
  trafficGrowthPercent: number;
  topKeyword: string;
  bestSellerTrafficDropAlert?: string;
  keywordsRankedTop3: number;
}

export interface TrainingReview {
  id: string;
  candidateName: string;
  courseTitle: string;
  rating: number; // 1-5
  date: string;
  comment: string;
  status: 'Publié' | 'En attente' | 'Mis en avant';
  sentiment: 'Positif' | 'Neutre' | 'Améliorable';
  recommendation: boolean;
}

export interface EmailTemplate {
  id: string;
  title: string;
  subject: string;
  category: 'Relance Acompte' | 'Confirmation Inscription' | 'Post-Formation / Avis' | 'Convocation';
  body: string;
  lastUpdated: string;
}
