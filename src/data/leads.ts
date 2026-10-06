import { LeadOrClient } from '../types';

export const INITIAL_LEADS_COSMETICS: LeadOrClient[] = [
  {
    id: 'lead-cosm-1',
    brandId: 'cosmetics',
    isClient: false,
    name: 'Dr. Kenza Benjelloun',
    company: 'Clinique Esthétique DermaCare',
    email: 'k.benjelloun@dermacare.ma',
    phone: '+212 6 61 24 55 90',
    city: 'Casablanca',
    country: 'Maroc',
    source: 'Salon Pro',
    status: 'Proposition envoyée',
    aiScore: 94,
    aiRationale: 'Fort besoin en approvisionnement récurrent de sérums à l\'acide hyaluronique pur. Décideur direct, budget validé.',
    lastContact: '2026-10-05T14:30:00Z',
    assignedTo: 'Yassine Alami (Resp. Comptes Médicaux)',
    totalOrdersValue: 0,
    totalPaid: 0,
    activeOrdersCount: 0,
    pendingQuotesCount: 1,
    openClaimsCount: 0,
    notes: 'Intéressée par un lot de 500 unités avec étiquetage personnalisé en marque blanche prestige.',
    timeline: [
      {
        id: 't-1',
        date: '2026-10-05T14:30:00Z',
        title: 'Devis DEV-2026-089 envoyé',
        description: 'Envoi du devis pour 500 flacons Sérum Éclat Niacinamide 10% + Acide Hyaluronique (Total: 48 500 MAD HT).',
        type: 'quote',
        author: 'Yassine Alami',
        badge: 'Devis transmis'
      },
      {
        id: 't-2',
        date: '2026-10-04T10:15:00Z',
        title: 'Échange WhatsApp & Envoi catalogue PDF',
        description: 'La cliente a demandé la fiche toxicologique et les résultats des tests d\'efficacité clinique.',
        type: 'whatsapp',
        author: 'Assistant IA WhatsApp',
        badge: 'WhatsApp Bot'
      },
      {
        id: 't-3',
        date: '2026-10-02T16:00:00Z',
        title: 'Rencontre Stand Salon Cosmetica Casa',
        description: 'Premier contact sur le stand AM PROD. Test direct des textures de la gamme anti-âge.',
        type: 'note',
        author: 'Yassine Alami',
        badge: 'Salon'
      }
    ]
  },
  {
    id: 'client-cosm-2',
    brandId: 'cosmetics',
    isClient: true,
    name: 'Sofia Mansouri',
    company: 'Palais du Soin & Spa Luxury',
    email: 'direction@palaisdusoin.ma',
    phone: '+212 6 72 88 12 40',
    city: 'Marrakech',
    country: 'Maroc',
    source: 'Site Web',
    status: 'Client Fidèle VIP',
    aiScore: 89,
    aiRationale: 'Fréquence de commande bimensuelle. Faible taux de retour (0%). Forte marge générée.',
    lastContact: '2026-10-06T09:15:00Z',
    assignedTo: 'Karima Idrissi',
    totalOrdersValue: 185400,
    totalPaid: 185400,
    activeOrdersCount: 1,
    pendingQuotesCount: 0,
    openClaimsCount: 0,
    notes: 'Commande en cours de préparation en salle blanche. Livraison spéciale par transporteur sécurisé.',
    timeline: [
      {
        id: 't-4',
        date: '2026-10-06T09:15:00Z',
        title: 'Validation Commande CMD-2026-142',
        description: 'Commande validée de 120 Crèmes Riches Régénératrices Nuit. Paiement 100% encaissé par virement bancaire.',
        type: 'order',
        author: 'Karima Idrissi',
        badge: 'En préparation'
      },
      {
        id: 't-5',
        date: '2026-09-20T11:00:00Z',
        title: 'Facture FAC-2026-091 Soldée',
        description: 'Paiement de 34 200 MAD reçu et rapproché automatiquement avec Sage.',
        type: 'invoice',
        author: 'Comptabilité AM PROD',
        badge: 'Rapprochement Sage OK'
      }
    ]
  },
  {
    id: 'lead-cosm-3',
    brandId: 'cosmetics',
    isClient: false,
    name: 'Tariq Chraibi',
    company: 'Pharmacie Centrale Guéliz',
    email: 'chraibi.tariq@pharma-gueliz.com',
    phone: '+212 6 63 90 11 22',
    city: 'Marrakech',
    country: 'Maroc',
    source: 'Campagne Ads',
    status: 'Qualifié',
    aiScore: 78,
    aiRationale: 'Recherche un présentoir de comptoir pour la gamme dermo-cosmétique. Potentiel de réassort élevé.',
    lastContact: '2026-10-03T11:20:00Z',
    assignedTo: 'Yassine Alami',
    totalOrdersValue: 0,
    totalPaid: 0,
    activeOrdersCount: 0,
    pendingQuotesCount: 0,
    openClaimsCount: 0,
    notes: 'Relance prévue jeudi matin à 10h pour finaliser le panachage des références.',
    timeline: [
      {
        id: 't-6',
        date: '2026-10-03T11:20:00Z',
        title: 'Appel de qualification téléphonique',
        description: 'Présentation des marges distributeurs (38%) et des PLV offertes pour la première commande test.',
        type: 'call',
        author: 'Yassine Alami'
      }
    ]
  }
];

export const INITIAL_LEADS_REHAB: LeadOrClient[] = [
  {
    id: 'lead-rehab-1',
    brandId: 'rehab',
    isClient: false,
    name: 'Nadia El Fassi',
    company: 'Herboristerie Bio Atlas & Nature',
    email: 'nadia@atlasnaturebio.com',
    phone: '+212 6 65 33 44 11',
    city: 'Rabat',
    country: 'Maroc',
    source: 'Instagram',
    status: 'Qualifié',
    aiScore: 91,
    aiRationale: 'Engagement très élevé sur les shampooings solides et soins capillaires bio. Forte demande sur le packaging éco-responsable.',
    lastContact: '2026-10-05T16:45:00Z',
    assignedTo: 'Amine Tazi',
    totalOrdersValue: 0,
    totalPaid: 0,
    activeOrdersCount: 0,
    pendingQuotesCount: 1,
    openClaimsCount: 0,
    notes: 'Demande d\'échantillons de shampooings solides bio et crèmes visage régénérantes.',
    timeline: [
      {
        id: 't-r1',
        date: '2026-10-05T16:45:00Z',
        title: 'Envoi boîte d\'échantillons Rehab Bio',
        description: 'Expédition par Amana Express de 5 échantillons de cosmétique solide bio.',
        type: 'note',
        author: 'Amine Tazi'
      }
    ]
  },
  {
    id: 'client-rehab-2',
    brandId: 'rehab',
    isClient: true,
    name: 'Mehdi Bennani',
    company: 'Concept Store Terre & Sens',
    email: 'achats@terre-et-sens.com',
    phone: '+212 6 61 77 99 00',
    city: 'Tanger',
    country: 'Maroc',
    source: 'Bouche à oreille',
    status: 'Client Actif',
    aiScore: 84,
    aiRationale: 'Commandes mensuelles stables de la gamme savonnerie saponifiée à froid.',
    lastContact: '2026-10-06T08:00:00Z',
    assignedTo: 'Amine Tazi',
    totalOrdersValue: 74200,
    totalPaid: 74200,
    activeOrdersCount: 0,
    pendingQuotesCount: 0,
    openClaimsCount: 1,
    notes: 'Réclamation en cours concernant 2 flacons d\'eau florale de rose endommagés lors de la dernière livraison.',
    timeline: [
      {
        id: 't-r2',
        date: '2026-10-06T08:00:00Z',
        title: 'Réclamation REC-2026-014 ouverte',
        description: 'Notification signalant casse mineure dans le carton. Remplacement immédiat programmé.',
        type: 'claim',
        author: 'Service Client Rehab'
      }
    ]
  }
];

export const INITIAL_LEADS_HUILES: LeadOrClient[] = [
  {
    id: 'lead-huiles-1',
    brandId: 'huiles',
    isClient: false,
    name: 'Jean-Christophe Meyer',
    company: 'Laboratoires Botaniques d\'Aquitaine',
    email: 'jc.meyer@botanique-aquitaine.fr',
    phone: '+33 6 42 18 90 22',
    city: 'Bordeaux',
    country: 'France',
    source: 'Site Web',
    status: 'Négociation Grand Compte',
    aiScore: 96,
    aiRationale: 'Export international volume élevé (3 tonnes d\'huile d\'argan vierge désodorisée bio et 100L de pépins de figue de barbarie).',
    lastContact: '2026-10-06T11:00:00Z',
    assignedTo: 'Othmane Slaoui (Export Manager)',
    totalOrdersValue: 0,
    totalPaid: 0,
    activeOrdersCount: 0,
    pendingQuotesCount: 1,
    openClaimsCount: 0,
    notes: 'Audit des certificats Ecocert et USDA Organic transmis avec succès.',
    timeline: [
      {
        id: 't-h1',
        date: '2026-10-06T11:00:00Z',
        title: 'Devis Export DEV-EXP-2026-031 envoyé',
        description: 'Proposition globale CIF Le Havre de 380 000 MAD avec analyse chromatographique par lot.',
        type: 'quote',
        author: 'Othmane Slaoui'
      }
    ]
  },
  {
    id: 'client-huiles-2',
    brandId: 'huiles',
    isClient: true,
    name: 'Laila Belkadi',
    company: 'Coopérative Féminine Argania Sud',
    email: 'belkadi@arganiasud.ma',
    phone: '+212 6 68 44 22 10',
    city: 'Agadir',
    country: 'Maroc',
    source: 'Bouche à oreille',
    status: 'Partenaire Distributeur',
    aiScore: 82,
    aiRationale: 'Fournisseur et client croisé en huile de pépins de figue de barbarie.',
    lastContact: '2026-10-04T15:00:00Z',
    assignedTo: 'Othmane Slaoui',
    totalOrdersValue: 92000,
    totalPaid: 92000,
    activeOrdersCount: 1,
    pendingQuotesCount: 0,
    openClaimsCount: 0,
    notes: 'Commande d\'huile de Nigelle pressée à froid 200L en fûts alimentaires.',
    timeline: [
      {
        id: 't-h2',
        date: '2026-10-04T15:00:00Z',
        title: 'Commande CMD-H-2026-088 expédiée',
        description: 'Prise en charge par le transporteur spécialisé vracs.',
        type: 'order',
        author: 'Othmane Slaoui'
      }
    ]
  }
];

export const INITIAL_LEADS_FORMATIONS: LeadOrClient[] = [
  {
    id: 'form-lead-1',
    brandId: 'formations',
    isClient: false,
    name: 'Houda Bennani',
    company: 'Indépendante / Création de marque',
    email: 'houda.bennani@gmail.com',
    phone: '+212 6 71 45 89 12',
    city: 'Rabat',
    country: 'Maroc',
    source: 'Instagram',
    status: 'Payé une avance',
    aiScore: 92,
    aiRationale: 'Acompte versé immédiatement après le webinaire. Profil porteur de projet déterminé à lancer sa gamme.',
    lastContact: '2026-10-05T17:10:00Z',
    assignedTo: 'Salma Cherkaoui (Conseillère Admission)',
    totalOrdersValue: 12000,
    totalPaid: 4000,
    remainingDue: 8000,
    activeOrdersCount: 0,
    pendingQuotesCount: 0,
    openClaimsCount: 0,
    trainingRegisteredCount: 1,
    notes: 'Inscrite à la session "Masterclass Formulation Émulsions & Sérums" de Novembre 2026. Reste 8 000 MAD à payer le premier jour de formation.',
    timeline: [
      {
        id: 't-f1',
        date: '2026-10-05T17:10:00Z',
        title: 'Avance de 4 000 MAD reçue par CMI en ligne',
        description: 'Reçu de paiement émis. Reste à payer calculé automatiquement : 8 000 MAD.',
        type: 'invoice',
        author: 'Système Paiement Automatique',
        badge: 'Avance confirmée'
      },
      {
        id: 't-f2',
        date: '2026-10-04T12:00:00Z',
        title: 'Échange d\'orientation téléphonique',
        description: 'Validation des prérequis en chimie et présentation de l\'atelier pratique en laboratoire.',
        type: 'call',
        author: 'Salma Cherkaoui'
      }
    ]
  },
  {
    id: 'form-lead-2',
    brandId: 'formations',
    isClient: true,
    name: 'Karim Guessous',
    company: 'Laboratoire Phytoderm',
    email: 'k.guessous@phytoderm.ma',
    phone: '+212 6 60 12 34 56',
    city: 'Casablanca',
    country: 'Maroc',
    source: 'Site Web',
    status: 'Confirmé',
    aiScore: 95,
    aiRationale: 'Financement d\'entreprise approuvé pour 2 collaborateurs. Paiement intégral de 24 000 MAD reçu.',
    lastContact: '2026-10-06T10:00:00Z',
    assignedTo: 'Salma Cherkaoui',
    totalOrdersValue: 24000,
    totalPaid: 24000,
    remainingDue: 0,
    activeOrdersCount: 0,
    pendingQuotesCount: 0,
    openClaimsCount: 0,
    trainingRegisteredCount: 2,
    notes: 'Formation : Réglementation Cosmétique DIP & Conformité Norme ISO 22716 BPF.',
    timeline: [
      {
        id: 't-f3',
        date: '2026-10-06T10:00:00Z',
        title: 'Convention de formation signée',
        description: 'Transmission de la convocation officielle et des accès e-learning préparatoires.',
        type: 'training',
        author: 'Salma Cherkaoui'
      }
    ]
  },
  {
    id: 'form-lead-3',
    brandId: 'formations',
    isClient: false,
    name: 'Samira Touimi',
    company: 'Porteuse de projet',
    email: 'samira.touimi@outlook.com',
    phone: '+212 6 62 98 76 54',
    city: 'Fès',
    country: 'Maroc',
    source: 'WhatsApp',
    status: 'Inscrit',
    aiScore: 68,
    aiRationale: 'Dossier déposé mais en attente du règlement de l\'acompte de réservation.',
    lastContact: '2026-10-03T16:00:00Z',
    assignedTo: 'Salma Cherkaoui',
    totalOrdersValue: 8500,
    totalPaid: 0,
    remainingDue: 8500,
    activeOrdersCount: 0,
    pendingQuotesCount: 0,
    openClaimsCount: 0,
    trainingRegisteredCount: 1,
    notes: 'Relance par SMS et WhatsApp programmée J-7 avant clôture des places.',
    timeline: [
      {
        id: 't-f4',
        date: '2026-10-03T16:00:00Z',
        title: 'Inscription en ligne soumise',
        description: 'Pré-inscription pour la session "Savonnerie Saponifiée à Froid & Cosmétiques Solides".',
        type: 'training',
        author: 'Portail Étudiant'
      }
    ]
  },
  {
    id: 'form-lead-4',
    brandId: 'formations',
    isClient: false,
    name: 'Younes Mansour',
    company: 'Atelier Nature',
    email: 'younes.m@gmail.com',
    phone: '+212 6 77 11 22 33',
    city: 'Tanger',
    country: 'Maroc',
    source: 'Campagne Ads',
    status: 'Absent le jour J',
    aiScore: 35,
    aiRationale: 'Acompte payé lors d\'une session passée mais n\'a pas pu se présenter pour cause d\'urgence.',
    lastContact: '2026-09-28T09:00:00Z',
    assignedTo: 'Salma Cherkaoui',
    totalOrdersValue: 6000,
    totalPaid: 2000,
    remainingDue: 4000,
    activeOrdersCount: 0,
    pendingQuotesCount: 0,
    openClaimsCount: 0,
    trainingRegisteredCount: 1,
    notes: 'Proposer un report sans frais vers la session de décembre.',
    timeline: [
      {
        id: 't-f5',
        date: '2026-09-28T09:00:00Z',
        title: 'Signalement absence enregistré',
        description: 'Création d\'un avoir d\'acompte valable 6 mois.',
        type: 'note',
        author: 'Administration Pédagogique'
      }
    ]
  }
];
