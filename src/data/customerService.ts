import { WhatsAppConversation, ChatbotConfig, BrandId } from '../types';

export const INITIAL_CHATBOT_CONFIGS: Record<BrandId, ChatbotConfig> = {
  cosmetics: {
    brandId: 'cosmetics',
    botName: 'Aura — Conseillère Cosmétique & R&D',
    welcomeMessage: 'Bonjour et bienvenue chez AM PROD Cosmétiques. Je suis Aura, votre assistante IA experte en dermo-cosmétique. Comment puis-je vous accompagner sur nos formulations ou vos commandes ?',
    tone: 'Prestige & Luxe',
    supportedLanguages: ['FR', 'AR', 'EN'],
    businessHours: {
      start: '08:30',
      end: '19:30',
      days: 'Lun - Sam'
    },
    humanTransferRules: {
      maxAIFailures: 2,
      keywords: ['humain', 'devis urgent', 'directeur', 'réclamation grave', 'remboursement'],
      transferOnAngrySentiment: true
    },
    aiEnabled: true,
    totalConversationsToday: 38,
    resolutionRatePercent: 86.5,
    avgResponseTimeSeconds: 3.2
  },
  rehab: {
    brandId: 'rehab',
    botName: 'Gaïa — Herboriste & Guide Bien-Être Bio',
    welcomeMessage: 'Bonjour ! Bienvenue dans l’univers Rehab Bio. Je suis Gaïa, à votre écoute pour vous guider à travers nos infusions, cosmétiques naturels et certifications biologiques.',
    tone: 'Chaleureux & Bienveillant',
    supportedLanguages: ['FR', 'AR'],
    businessHours: {
      start: '09:00',
      end: '18:00',
      days: 'Lun - Ven'
    },
    humanTransferRules: {
      maxAIFailures: 2,
      keywords: ['conseiller', 'allergie', 'panier bloqué'],
      transferOnAngrySentiment: true
    },
    aiEnabled: true,
    totalConversationsToday: 24,
    resolutionRatePercent: 89.0,
    avgResponseTimeSeconds: 2.8
  },
  huiles: {
    brandId: 'huiles',
    botName: 'Argana — Spécialiste Matières Premières & Export',
    welcomeMessage: 'Bienvenue chez AM PROD Huiles Végétales. Je suis Argana, votre interlocutrice dédiée aux analyses techniques, cours des huiles nobles et commandes en vrac.',
    tone: 'Professionnel & Rassurant',
    supportedLanguages: ['FR', 'EN', 'AR'],
    businessHours: {
      start: '08:00',
      end: '20:00',
      days: 'Lun - Sam'
    },
    humanTransferRules: {
      maxAIFailures: 2,
      keywords: ['export conteneur', 'négociation prix', 'cif le havre'],
      transferOnAngrySentiment: true
    },
    aiEnabled: true,
    totalConversationsToday: 19,
    resolutionRatePercent: 91.2,
    avgResponseTimeSeconds: 4.1
  },
  formations: {
    brandId: 'formations',
    botName: 'Sofia — Conseillère Admissions & Certifications',
    welcomeMessage: 'Bonjour ! Bienvenue à l’Académie AM PROD Formations. Je suis Sofia, votre guide pour choisir votre cursus cosmétique, vérifier les dates et valider vos facilités de paiement.',
    tone: 'Professionnel & Rassurant',
    supportedLanguages: ['FR', 'AR'],
    businessHours: {
      start: '09:00',
      end: '19:00',
      days: 'Lun - Sam'
    },
    humanTransferRules: {
      maxAIFailures: 2,
      keywords: ['financement entreprise', 'attestation', 'responsable pédagogique'],
      transferOnAngrySentiment: true
    },
    aiEnabled: true,
    totalConversationsToday: 45,
    resolutionRatePercent: 84.0,
    avgResponseTimeSeconds: 2.5
  },
  seo: {
    brandId: 'seo',
    botName: 'Atlas SEO AI — Superviseur Stratégique',
    welcomeMessage: 'Bonjour Administrateur. Je suis l\'Agent SEO & Analytics du Groupe AM PROD. Vous pouvez m\'interroger sur les métriques croisées de nos 4 marques.',
    tone: 'Direct & Efficace',
    supportedLanguages: ['FR', 'EN'],
    businessHours: {
      start: '00:00',
      end: '23:59',
      days: '7j/7 24h/24'
    },
    humanTransferRules: {
      maxAIFailures: 3,
      keywords: ['audit approfondi', 'alerte critique'],
      transferOnAngrySentiment: false
    },
    aiEnabled: true,
    totalConversationsToday: 62,
    resolutionRatePercent: 97.4,
    avgResponseTimeSeconds: 1.2
  }
};

export const INITIAL_CONVERSATIONS: WhatsAppConversation[] = [
  {
    id: 'conv-1',
    brandId: 'cosmetics',
    clientName: 'Dr. Kenza Benjelloun',
    phone: '+212 6 61 24 55 90',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80',
    channel: 'WhatsApp',
    unreadCount: 0,
    status: 'En cours (IA)',
    priority: 'Prioritaire VIP',
    lastMessage: 'Merci, j\'ai bien reçu le devis DEV-2026-089. Pouvez-vous confirmer le délai de fabrication ?',
    lastTimestamp: '2026-10-06T14:15:00Z',
    notes: 'Cliente médecin esthétique très prometteuse. Souhaite une livraison avant fin novembre.',
    messages: [
      {
        id: 'm1',
        sender: 'client',
        text: 'Bonjour, avez-vous la documentation sur le Sérum Niacinamide 10% ?',
        timestamp: '2026-10-05T10:10:00Z'
      },
      {
        id: 'm2',
        sender: 'ai',
        text: 'Bonjour Dr. Benjelloun ! Tout à fait, notre Sérum Éclat Niacinamide 10% + Zinc PCA bénéficie d\'une certification ISO 22716 avec dossier DIP complet. Je vous ai envoyé la fiche technique.',
        timestamp: '2026-10-05T10:10:30Z'
      },
      {
        id: 'm3',
        sender: 'client',
        text: 'Merci, j\'ai bien reçu le devis DEV-2026-089. Pouvez-vous confirmer le délai de fabrication ?',
        timestamp: '2026-10-06T14:15:00Z'
      }
    ]
  },
  {
    id: 'conv-2',
    brandId: 'cosmetics',
    clientName: 'Sofia Amrani (DermaGlow)',
    phone: '@dermaglow.maroc',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    channel: 'Instagram',
    unreadCount: 1,
    status: 'En cours (IA)',
    priority: 'Haute',
    lastMessage: 'Est-ce que vos crèmes barrières sont adaptées pour notre protocole post-peeling en clinique ?',
    lastTimestamp: '2026-10-06T13:55:00Z',
    notes: 'Contact DM Instagram suite à une story sponsoring.',
    messages: [
      {
        id: 'm4',
        sender: 'client',
        text: 'Bonjour ! J\'ai adoré votre post sur les céramides biomimétiques.',
        timestamp: '2026-10-06T13:50:00Z'
      },
      {
        id: 'm5',
        sender: 'ai',
        text: 'Bonjour Sofia ! Merci infiniment pour votre message. Nos céramides III et VI sont 100% identiques aux lipides cutanés.',
        timestamp: '2026-10-06T13:51:00Z'
      },
      {
        id: 'm6',
        sender: 'client',
        text: 'Est-ce que vos crèmes barrières sont adaptées pour notre protocole post-peeling en clinique ?',
        timestamp: '2026-10-06T13:55:00Z'
      }
    ]
  },
  {
    id: 'conv-3',
    brandId: 'cosmetics',
    clientName: 'Karim Tazi',
    phone: '+212 6 62 11 00 99',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    channel: 'Site Web',
    unreadCount: 1,
    status: 'Transféré Humain',
    priority: 'Haute',
    lastMessage: 'Je souhaite parler à un conseiller pour une commande sur mesure.',
    lastTimestamp: '2026-10-06T13:40:00Z',
    notes: 'Transfert déclenché automatiquement par le mot-clé "conseiller sur mesure".',
    messages: [
      {
        id: 'm7',
        sender: 'client',
        text: 'Je souhaite parler à un conseiller pour une commande sur mesure.',
        timestamp: '2026-10-06T13:40:00Z'
      }
    ]
  },
  {
    id: 'conv-4',
    brandId: 'cosmetics',
    clientName: 'Pharmacie Centrale Rabat',
    phone: 'facebook.com/pharmaciecentralerbt',
    avatar: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=150&auto=format&fit=crop&q=80',
    channel: 'Facebook',
    unreadCount: 0,
    status: 'Résolu',
    priority: 'Normale',
    lastMessage: 'Merci pour le catalogue revendeur envoyé par Messenger.',
    lastTimestamp: '2026-10-06T11:20:00Z',
    notes: 'Téléchargement de brochure B2B via Facebook Messenger.',
    messages: [
      {
        id: 'm8',
        sender: 'client',
        text: 'Bonjour, avez-vous une brochure pour les officines de santé ?',
        timestamp: '2026-10-06T11:15:00Z'
      },
      {
        id: 'm9',
        sender: 'ai',
        text: 'Bonjour ! Voici le catalogue officiel B2B Officine AM PROD Cosmétiques avec les marges de distribution.',
        timestamp: '2026-10-06T11:16:00Z'
      },
      {
        id: 'm10',
        sender: 'client',
        text: 'Merci pour le catalogue revendeur envoyé par Messenger.',
        timestamp: '2026-10-06T11:20:00Z'
      }
    ]
  },
  {
    id: 'conv-5',
    brandId: 'cosmetics',
    clientName: 'Lina_BeautéPro (@lina_skin)',
    phone: '@lina_skin_tiktok',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    channel: 'TikTok',
    unreadCount: 2,
    status: 'En attente',
    priority: 'Haute',
    lastMessage: 'Je suis créatrice de contenu skincare (120k abonnés). Faites-vous des partenariats B2B ou affiliation ?',
    lastTimestamp: '2026-10-06T14:45:00Z',
    notes: 'Influenceuse TikTok demandant les conditions de collaboration.',
    messages: [
      {
        id: 'm11',
        sender: 'client',
        text: 'Je suis créatrice de contenu skincare (120k abonnés). Faites-vous des partenariats B2B ou affiliation ?',
        timestamp: '2026-10-06T14:45:00Z'
      }
    ]
  },
  {
    id: 'conv-6',
    brandId: 'formations',
    clientName: 'Houda Bennani',
    phone: '+212 6 71 45 89 12',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    channel: 'WhatsApp',
    unreadCount: 0,
    status: 'En cours (IA)',
    priority: 'Prioritaire VIP',
    lastMessage: 'Parfait, le virement de l\'acompte est parti ! À quelle heure débute le premier jour ?',
    lastTimestamp: '2026-10-05T17:15:00Z',
    notes: 'Avance de 4 000 MAD réglée. Reste 8 000 MAD.',
    messages: [
      {
        id: 'm12',
        sender: 'client',
        text: 'Bonjour Sofia, est-il possible de payer en 2 fois pour la Masterclass Formulation ?',
        timestamp: '2026-10-05T16:50:00Z'
      },
      {
        id: 'm13',
        sender: 'ai',
        text: 'Bonjour Houda ! Absolument. Vous pouvez régler une avance de réservation de 4 000 MAD en ligne aujourd\'hui, et le solde de 8 000 MAD le premier jour en début de session.',
        timestamp: '2026-10-05T16:50:40Z'
      },
      {
        id: 'm14',
        sender: 'client',
        text: 'Parfait, le virement de l\'acompte est parti ! À quelle heure débute le premier jour ?',
        timestamp: '2026-10-05T17:15:00Z'
      }
    ]
  },
  {
    id: 'conv-7',
    brandId: 'formations',
    clientName: 'Nadia Cherkaoui',
    phone: '@nadiabeautylab',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    channel: 'Instagram',
    unreadCount: 0,
    status: 'En cours (IA)',
    priority: 'Haute',
    lastMessage: 'Le programme de certification Savonnerie à Froid est-il éligible au financement entreprise ?',
    lastTimestamp: '2026-10-06T12:30:00Z',
    notes: 'Directrice de laboratoire intéressée par formation continue d\'équipe.',
    messages: [
      {
        id: 'm15',
        sender: 'client',
        text: 'Le programme de certification Savonnerie à Froid est-il éligible au financement entreprise ?',
        timestamp: '2026-10-06T12:30:00Z'
      }
    ]
  },
  {
    id: 'conv-8',
    brandId: 'rehab',
    clientName: 'Mehdi Bennani',
    phone: '+212 6 65 33 21 00',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    channel: 'WhatsApp',
    unreadCount: 0,
    status: 'En cours (IA)',
    priority: 'Normale',
    lastMessage: 'Avez-vous du stock sur l\'huile de pépins de figue de barbarie bio 1L ?',
    lastTimestamp: '2026-10-06T15:10:00Z',
    notes: 'Client régulier Rehab Bio.',
    messages: [
      {
        id: 'm16',
        sender: 'client',
        text: 'Avez-vous du stock sur l\'huile de pépins de figue de barbarie bio 1L ?',
        timestamp: '2026-10-06T15:10:00Z'
      }
    ]
  },
  {
    id: 'conv-9',
    brandId: 'huiles',
    clientName: 'Alain Roussel (France Bio Export)',
    phone: '+33 6 12 34 56 78',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    channel: 'WhatsApp',
    unreadCount: 0,
    status: 'En cours (IA)',
    priority: 'Prioritaire VIP',
    lastMessage: 'Merci pour le bulletin d\'analyse COA d\'Argan vierge extra.',
    lastTimestamp: '2026-10-06T09:40:00Z',
    notes: 'Importateur européen, commande de fûts de 200L.',
    messages: [
      {
        id: 'm17',
        sender: 'client',
        text: 'Merci pour le bulletin d\'analyse COA d\'Argan vierge extra.',
        timestamp: '2026-10-06T09:40:00Z'
      }
    ]
  }
];
