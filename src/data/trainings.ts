import { TrainingCourse, TrainingReview, EmailTemplate } from '../types';

export const INITIAL_TRAINING_COURSES: TrainingCourse[] = [
  {
    id: 'tr-01',
    title: 'Masterclass Formulation Émulsions, Sérums & Soins Actifs',
    code: 'FORM-COSM-01',
    level: 'Avancé',
    durationDays: 5,
    priceTotal: 12000,
    minDeposit: 4000,
    totalEnrolled: 48,
    completionRate: 98,
    rating: 4.95,
    image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&auto=format&fit=crop&q=80',
    instructor: 'Dr. Leila Zerouali (Docteur en Pharmacie & Formulation)',
    description: 'Immersion intensive de 35 heures en laboratoire certifié. Maîtrisez le calcul HLB, les systèmes de conservation naturels, la stabilité thermique et la rhéologie des émulsions haut de gamme.',
    syllabus: [
      'Jour 1 : Chimie des tensioactifs et calculs de stabilité HLB',
      'Jour 2 : Formulations des sérums aqueux, gels et biphasiques',
      'Jour 3 : Émulsions H/E et E/H (crèmes de jour, baumes légers)',
      'Jour 4 : Actifs sensibles (Vitamine C pure, Rétinoïdes, Acides)',
      'Jour 5 : Tests de stabilité accélérée (centrifugation, étuve 45°C)'
    ],
    sessions: [
      {
        id: 'sess-1',
        trainingId: 'tr-01',
        startDate: '2026-11-12',
        endDate: '2026-11-16',
        location: 'Campus AM PROD Laboratoires — Casablanca',
        maxAttendees: 12,
        enrolledCount: 10,
        status: 'Planifiée'
      },
      {
        id: 'sess-2',
        trainingId: 'tr-01',
        startDate: '2026-12-07',
        endDate: '2026-12-11',
        location: 'Campus AM PROD Laboratoires — Casablanca',
        maxAttendees: 12,
        enrolledCount: 6,
        status: 'Planifiée'
      }
    ]
  },
  {
    id: 'tr-02',
    title: 'Réglementation Cosmétique DIP & Conformité ISO 22716 BPF',
    code: 'REG-DIP-02',
    level: 'Intermédiaire',
    durationDays: 3,
    priceTotal: 8500,
    minDeposit: 3000,
    totalEnrolled: 64,
    completionRate: 100,
    rating: 4.88,
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop&q=80',
    instructor: 'Me. Taha Kettani (Consultant Réglementaire CPNP & DMP Maroc)',
    description: 'Constituez votre Dossier d\'Information Produit (DIP), validez vos allégations marketing, étiquetages et respectez les Bonnes Pratiques de Fabrication cosmétique.',
    syllabus: [
      'Jour 1 : Cadre juridique européen (Règlement CE 1223/2009) & DMP Maroc',
      'Jour 2 : Rapport sur la Sécurité du Produit Cosmétique (CPSR partie A & B)',
      'Jour 3 : Audit d\'atelier selon la norme ISO 22716 et traçabilité des lots'
    ],
    sessions: [
      {
        id: 'sess-3',
        trainingId: 'tr-02',
        startDate: '2026-10-28',
        endDate: '2026-10-30',
        location: 'En Ligne Live Interactif & Siège Rabat',
        maxAttendees: 15,
        enrolledCount: 14,
        status: 'Planifiée'
      }
    ]
  },
  {
    id: 'tr-03',
    title: 'Savonnerie Saponifiée à Froid & Cosmétiques Solides Zéro Déchet',
    code: 'SAF-BIO-03',
    level: 'Débutant',
    durationDays: 3,
    priceTotal: 6500,
    minDeposit: 2000,
    totalEnrolled: 92,
    completionRate: 97,
    rating: 4.96,
    image: 'https://images.unsplash.com/photo-1607006314180-a22675681e84?w=800&auto=format&fit=crop&q=80',
    instructor: 'Mme. Asmaa Lahlou (Maître Artisan Savonnier & Formatrice Bio)',
    description: 'Apprenez à concevoir des savons saponifiés à froid surgras, des shampoings solides et des déodorants en stick sans eau ni conservateur synthétique.',
    syllabus: [
      'Jour 1 : Calcul de la lessive de soude, indice de saponification et surgraissage',
      'Jour 2 : Marbrages artistiques, ajouts d\'argiles et poudres botaniques',
      'Jour 3 : Formulation de shampoings solides aux tensioactifs doux (SCI)'
    ],
    sessions: [
      {
        id: 'sess-4',
        trainingId: 'tr-03',
        startDate: '2026-11-20',
        endDate: '2026-11-22',
        location: 'Atelier Pilote — Marrakech Guéliz',
        maxAttendees: 10,
        enrolledCount: 10,
        status: 'Complète'
      }
    ]
  },
  {
    id: 'tr-04',
    title: 'Extraction Végétale, Macérats & Huiles Essentielles Thérapeutiques',
    code: 'EXT-BOT-04',
    level: 'Intermédiaire',
    durationDays: 4,
    priceTotal: 9800,
    minDeposit: 3500,
    totalEnrolled: 36,
    completionRate: 95,
    rating: 4.82,
    image: 'https://images.unsplash.com/photo-1608248597359-009c958469d4?w=800&auto=format&fit=crop&q=80',
    instructor: 'Dr. Othmane Slaoui (Ingénieur Agronome & Distillateur)',
    description: 'Maîtrisez la distillation à la vapeur d\'eau, l\'hydrodistillation, les macérations solaires et le contrôle organoleptique des huiles de première pression.',
    syllabus: [
      'Jour 1 : Botanique appliquée et principes actifs des plantes aromatiques',
      'Jour 2 : Paramètres critiques de distillation & rendement en HE',
      'Jour 3 : Macérats huileux stables et antioxydants naturels (Vit E, Romarin)',
      'Jour 4 : Sécurité toxicologique et dosage des allergènes'
    ],
    sessions: [
      {
        id: 'sess-5',
        trainingId: 'tr-04',
        startDate: '2026-11-25',
        endDate: '2026-11-28',
        location: 'Domaine Expérimental de l\'Ourika',
        maxAttendees: 8,
        enrolledCount: 7,
        status: 'Planifiée'
      }
    ]
  },
  {
    id: 'tr-05',
    title: 'Branding, Packaging Éco-Conçu & Stratégie Commerciale Beauté',
    code: 'MKT-COSM-05',
    level: 'Débutant',
    durationDays: 2,
    priceTotal: 5500,
    minDeposit: 1500,
    totalEnrolled: 74,
    completionRate: 100,
    rating: 4.79,
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop&q=80',
    instructor: 'M. Kamil Berrada (Directeur Marketing & Brand Strategist)',
    description: 'Positionnement de marque haut de gamme, sourcing des packagings recyclables, calcul du coût de revient et stratégie de mise sur le marché B2B / pharmacie.',
    syllabus: [
      'Jour 1 : Storytelling de marque, univers sensoriel et identité visuelle',
      'Jour 2 : Grille tarifaire distributeur, marges et accords commerciaux'
    ],
    sessions: [
      {
        id: 'sess-6',
        trainingId: 'tr-05',
        startDate: '2026-12-01',
        endDate: '2026-12-02',
        location: 'Campus Virtuel & Siège Casablanca',
        maxAttendees: 20,
        enrolledCount: 18,
        status: 'Planifiée'
      }
    ]
  },
  {
    id: 'tr-06',
    title: 'Contrôle Microbiologique & Tests de Stabilité Cosmétique Challenge Test',
    code: 'LAB-QUAL-06',
    level: 'Avancé',
    durationDays: 3,
    priceTotal: 10500,
    minDeposit: 3500,
    totalEnrolled: 28,
    completionRate: 100,
    rating: 4.91,
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop&q=80',
    instructor: 'Dr. Myriam Chraibi (Microbiologiste Industrielle)',
    description: 'Protocoles de challenge-tests (ISO 11930), dénombrement microbien, validation de la PAO (Période Après Ouverture) et tests de compatibilité contenant-contenu.',
    syllabus: [
      'Jour 1 : Écosystème microbiologique et flore cutanée',
      'Jour 2 : Protocole officiel Challenge Test & interprétation des courbes de réduction',
      'Jour 3 : Audit de propreté des lignes de conditionnement'
    ],
    sessions: [
      {
        id: 'sess-7',
        trainingId: 'tr-06',
        startDate: '2026-12-14',
        endDate: '2026-12-16',
        location: 'Laboratoire Central AM PROD — Casablanca',
        maxAttendees: 6,
        enrolledCount: 5,
        status: 'Planifiée'
      }
    ]
  },
  {
    id: 'tr-07',
    title: 'Dermocosmétique Avancée & Soins Anti-Âge aux Peptides Biomimétiques',
    code: 'DERM-BIO-07',
    level: 'Masterclass',
    durationDays: 4,
    priceTotal: 14000,
    minDeposit: 5000,
    totalEnrolled: 22,
    completionRate: 96,
    rating: 4.98,
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&auto=format&fit=crop&q=80',
    instructor: 'Dr. Leila Zerouali & Invité R&D International',
    description: 'Formulation de haute technicité : encapsulation liposomale, peptides signal et vecteurs d\'actifs pénétrants pour cabinets médicaux et spas haut standing.',
    syllabus: [
      'Jour 1 : Physiologie de la barrière cutanée et perméabilité transdermique',
      'Jour 2 : Chimie des peptides biomimétiques et facteurs de croissance',
      'Jour 3 : Systèmes d\'encapsulation et nanovecteurs stables',
      'Jour 4 : Validation clinique et mesures par cornéométrie'
    ],
    sessions: [
      {
        id: 'sess-8',
        trainingId: 'tr-07',
        startDate: '2027-01-15',
        endDate: '2027-01-18',
        location: 'Campus AM PROD Laboratoires — Casablanca',
        maxAttendees: 10,
        enrolledCount: 8,
        status: 'Planifiée'
      }
    ]
  }
];

export const INITIAL_TRAINING_REVIEWS: TrainingReview[] = [
  {
    id: 'rev-01',
    candidateName: 'Houda Bennani',
    courseTitle: 'Masterclass Formulation Émulsions, Sérums & Soins Actifs',
    rating: 5,
    date: '2026-10-02',
    comment: 'Formation exceptionnelle et extrêmement concrète ! Les travaux pratiques au sein du laboratoire permettent de maîtriser instantanément les calculs HLB et la stabilité des émulsions. Je lance ma marque le mois prochain en toute sérénité.',
    status: 'Mis en avant',
    sentiment: 'Positif',
    recommendation: true
  },
  {
    id: 'rev-02',
    candidateName: 'Karim Guessous (Phytoderm)',
    courseTitle: 'Réglementation Cosmétique DIP & Conformité ISO 22716 BPF',
    rating: 5,
    date: '2026-09-29',
    comment: 'Le formateur Maître Kettani maîtrise parfaitement les exigences de la DMP Maroc et du règlement CPNP européen. Nous avons pu auditer directement nos fiches de fabrication en atelier.',
    status: 'Publié',
    sentiment: 'Positif',
    recommendation: true
  },
  {
    id: 'rev-03',
    candidateName: 'Salma El Fassi',
    courseTitle: 'Savonnerie Saponifiée à Froid & Cosmétiques Solides Zéro Déchet',
    rating: 5,
    date: '2026-09-20',
    comment: 'Atelier passionnant avec Asmaa Lahlou. Les techniques de marbrage naturel et de calcul de soude sont limpides. Matériel de très haute qualité fourni.',
    status: 'Publié',
    sentiment: 'Positif',
    recommendation: true
  },
  {
    id: 'rev-04',
    candidateName: 'Mehdi Chraibi',
    courseTitle: 'Extraction Végétale, Macérats & Huiles Essentielles Thérapeutiques',
    rating: 4,
    date: '2026-09-14',
    comment: 'Très bonne session pratique dans la vallée de l\'Ourika. Approche technique rigoureuse sur le rendement des alambics. Seul regret : 4 jours passent trop vite !',
    status: 'Publié',
    sentiment: 'Positif',
    recommendation: true
  },
  {
    id: 'rev-05',
    candidateName: 'Amine Bensouda',
    courseTitle: 'Branding, Packaging Éco-Conçu & Stratégie Commerciale Beauté',
    rating: 4,
    date: '2026-08-30',
    comment: 'Excellents insights sur les marges de distribution et les exigences des pharmacies. Cas pratiques très instructifs sur les erreurs à éviter lors du lancement.',
    status: 'Publié',
    sentiment: 'Positif',
    recommendation: true
  },
  {
    id: 'rev-06',
    candidateName: 'Nawal Tazi',
    courseTitle: 'Contrôle Microbiologique & Tests de Stabilité Cosmétique Challenge Test',
    rating: 5,
    date: '2026-08-18',
    comment: 'Indispensable pour tout formulateur sérieux voulant garantir la PAO sans risque sanitaire. La rigueur scientifique du Dr. Myriam Chraibi est remarquable.',
    status: 'Mis en avant',
    sentiment: 'Positif',
    recommendation: true
  }
];

export const INITIAL_EMAIL_TEMPLATES: EmailTemplate[] = [
  {
    id: 'tmpl-1',
    title: 'Relance Règlement Acompte (J-7)',
    subject: 'Votre réservation à la session [Formation] — Acompte en attente',
    category: 'Relance Acompte',
    body: 'Bonjour [Nom],\n\nNous faisons suite à votre pré-inscription à la session [Formation] programmée le [Date].\n\nAfin de bloquer définitivement votre place en laboratoire (places limitées à 12 stagiaires), nous vous remercions de bien vouloir régler votre acompte de [Montant_Acompte] MAD.\n\nLien de paiement sécurisé CMI : [Lien]\n\nRestant à votre disposition,\nL\'Académie AM PROD Formations',
    lastUpdated: '2026-10-04'
  },
  {
    id: 'tmpl-2',
    title: 'Confirmation d\'Inscription & Convocation Officielle',
    subject: 'Convocation Officielle — Session de formation [Formation]',
    category: 'Confirmation Inscription',
    body: 'Bonjour [Nom],\n\nNous avons le plaisir de vous confirmer votre inscription définitive à la formation [Formation].\n\n• Date de démarrage : [Date]\n• Lieu : Campus AM PROD Laboratoires — Casablanca\n• Horaires : 09h00 - 17h00\n\nVotre blouse de laboratoire et supports pédagogiques vous seront remis dès votre arrivée.\n\nBien cordialement,\nDirection Pédagogique AM PROD',
    lastUpdated: '2026-10-02'
  },
  {
    id: 'tmpl-3',
    title: 'Enquête de Satisfaction & Attestation Post-Formation',
    subject: 'Votre attestation de réussite et avis sur votre session AM PROD Formations',
    category: 'Post-Formation / Avis',
    body: 'Bonjour [Nom],\n\nFélicitations pour votre validation du parcours [Formation] !\n\nVous trouverez ci-joint votre attestation de fin de formation officielle avec mention des heures pratiques réalisées.\n\nPour nous aider à maintenir notre niveau d\'excellence, merci de partager votre retour d\'expérience en 2 minutes : [Lien_Avis]\n\nAu plaisir de vous accompagner dans le développement de vos formules,\nAM PROD Académie',
    lastUpdated: '2026-09-28'
  }
];
