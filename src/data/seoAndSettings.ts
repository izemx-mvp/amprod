import { SeoMetric } from '../types';

export const INITIAL_SEO_METRICS: SeoMetric[] = [
  {
    brandId: 'cosmetics',
    brandName: 'AM PROD Cosmétiques',
    seoScore: 92,
    indexedPages: 1420,
    errors404: 3,
    avgPageLoadSeconds: 1.15,
    organicTrafficMonthly: 48500,
    trafficGrowthPercent: 18.4,
    topKeyword: 'fabricant dermo cosmetique maroc',
    keywordsRankedTop3: 42,
    bestSellerTrafficDropAlert: 'Alerte : baisse de trafic de 12% détectée sur la page Sérum Éclat Niacinamide suite à une mise à jour d\'URL.'
  },
  {
    brandId: 'rehab',
    brandName: 'Rehab Bio',
    seoScore: 88,
    indexedPages: 860,
    errors404: 1,
    avgPageLoadSeconds: 0.98,
    organicTrafficMonthly: 31200,
    trafficGrowthPercent: 24.1,
    topKeyword: 'shampooing solide bio maroc',
    keywordsRankedTop3: 29
  },
  {
    brandId: 'huiles',
    brandName: 'AM PROD Huiles Végétales',
    seoScore: 95,
    indexedPages: 2100,
    errors404: 0,
    avgPageLoadSeconds: 0.92,
    organicTrafficMonthly: 84300,
    trafficGrowthPercent: 31.7,
    topKeyword: 'pure argan oil wholesale supplier',
    keywordsRankedTop3: 88,
    bestSellerTrafficDropAlert: 'Avertissement mineur : cannibalisation de mots-clés constatée entre Huile d\'Argan Vrac et Flacon 500ml.'
  },
  {
    brandId: 'formations',
    brandName: 'AM PROD Formations',
    seoScore: 90,
    indexedPages: 640,
    errors404: 2,
    avgPageLoadSeconds: 1.05,
    organicTrafficMonthly: 22800,
    trafficGrowthPercent: 14.9,
    topKeyword: 'formation formulation cosmetique casablanca',
    keywordsRankedTop3: 35
  }
];

export interface AiKnowledgeDoc {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedAt: string;
  tokensProcessed: number;
  category: 'Bon de commande' | 'Facture' | 'Devis' | 'Fiche Technique' | 'Autre';
}

export const INITIAL_KNOWLEDGE_DOCS: AiKnowledgeDoc[] = [
  {
    id: 'doc-1',
    name: 'Modele_Bon_de_Commande_Officiel_AMPROD_v3.pdf',
    type: 'application/pdf',
    size: '1.4 MB',
    uploadedAt: '2026-10-01',
    tokensProcessed: 14200,
    category: 'Bon de commande'
  },
  {
    id: 'doc-2',
    name: 'Trame_Devis_Commercial_Prestige_2026.docx',
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    size: '850 KB',
    uploadedAt: '2026-09-28',
    tokensProcessed: 9800,
    category: 'Devis'
  },
  {
    id: 'doc-3',
    name: 'Catalogue_General_Fiches_Techniques_INCI.pdf',
    type: 'application/pdf',
    size: '6.2 MB',
    uploadedAt: '2026-10-04',
    tokensProcessed: 48600,
    category: 'Fiche Technique'
  }
];

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  hitsCount: number;
}

export const INITIAL_FAQS: FaqItem[] = [
  {
    id: 'faq-1',
    question: 'Quels sont vos délais moyens de fabrication pour une marque blanche ?',
    answer: 'Pour les cosmétiques en marque blanche, notre délai moyen en salle blanche est de 15 à 21 jours ouvrés après validation du Bon à Tirer (BAT) et encaissement de l\'acompte.',
    category: 'Production',
    hitsCount: 142
  },
  {
    id: 'faq-2',
    question: 'Quelles sont les modalités de paiement pour les formations professionnelles ?',
    answer: 'Un acompte de réservation de 30% à 40% est requis à l\'inscription en ligne. Le solde restant peut être réglé en 1 ou 2 fois le premier jour de formation ou par convention d\'entreprise.',
    category: 'Formations',
    hitsCount: 88
  },
  {
    id: 'faq-3',
    question: 'Vos huiles végétales sont-elles accompagnées de certificats d\'analyse chromatographique ?',
    answer: 'Oui, 100% de nos lots d\'huile d\'argan, figue de barbarie et nigelle sont accompagnés d\'un bulletin d\'analyse par chromatographie en phase gazeuse (CPG) et certification Ecocert.',
    category: 'Qualité & Export',
    hitsCount: 96
  }
];
