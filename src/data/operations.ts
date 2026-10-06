import { Quote, Order, LogisticsShipment, Invoice, Claim, PurchaseSupplier, PurchaseOrder } from '../types';

export const INITIAL_QUOTES: Quote[] = [
  {
    id: 'q-1',
    brandId: 'cosmetics',
    quoteNumber: 'DEV-2026-089',
    clientName: 'Dr. Kenza Benjelloun',
    clientEmail: 'k.benjelloun@dermacare.ma',
    date: '2026-10-05',
    validUntil: '2026-11-05',
    totalHT: 48500,
    totalTTC: 58200,
    status: 'Envoyé',
    itemsCount: 2
  },
  {
    id: 'q-2',
    brandId: 'cosmetics',
    quoteNumber: 'DEV-2026-084',
    clientName: 'Centre Thalasso Atlantic',
    clientEmail: 'achats@thalasso-atlantic.ma',
    date: '2026-09-28',
    validUntil: '2026-10-28',
    totalHT: 32000,
    totalTTC: 38400,
    status: 'Accepté',
    itemsCount: 4
  },
  {
    id: 'q-3',
    brandId: 'huiles',
    quoteNumber: 'DEV-EXP-2026-031',
    clientName: 'Laboratoires Botaniques d\'Aquitaine',
    clientEmail: 'jc.meyer@botanique-aquitaine.fr',
    date: '2026-10-06',
    validUntil: '2026-11-06',
    totalHT: 380000,
    totalTTC: 380000,
    status: 'Envoyé',
    itemsCount: 3
  },
  {
    id: 'q-4',
    brandId: 'rehab',
    quoteNumber: 'DEV-REH-2026-019',
    clientName: 'Herboristerie Bio Atlas & Nature',
    clientEmail: 'nadia@atlasnaturebio.com',
    date: '2026-10-05',
    validUntil: '2026-11-05',
    totalHT: 15400,
    totalTTC: 18480,
    status: 'Envoyé',
    itemsCount: 5
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-1',
    brandId: 'cosmetics',
    orderNumber: 'CMD-2026-142',
    clientName: 'Sofia Mansouri (Palais du Soin)',
    clientEmail: 'direction@palaisdusoin.ma',
    date: '2026-10-06',
    totalTTC: 64800,
    paymentStatus: 'Payé',
    logisticsStatus: 'En préparation',
    trackingNumber: 'CHRO-MA-8849201',
    carrier: 'Chronopost'
  },
  {
    id: 'ord-2',
    brandId: 'cosmetics',
    orderNumber: 'CMD-2026-139',
    clientName: 'Institut Beauté Solaire',
    clientEmail: 'contact@beautesolaire.ma',
    date: '2026-10-03',
    totalTTC: 28500,
    paymentStatus: 'Payé',
    logisticsStatus: 'En transit',
    trackingNumber: 'AMANA-77291104',
    carrier: 'Amana Express'
  },
  {
    id: 'ord-3',
    brandId: 'huiles',
    orderNumber: 'CMD-H-2026-088',
    clientName: 'Laila Belkadi (Argania Sud)',
    clientEmail: 'belkadi@arganiasud.ma',
    date: '2026-10-04',
    totalTTC: 92000,
    paymentStatus: 'Payé',
    logisticsStatus: 'Expédié',
    trackingNumber: 'DHL-EXP-4402199',
    carrier: 'DHL Express'
  },
  {
    id: 'ord-4',
    brandId: 'rehab',
    orderNumber: 'CMD-REH-2026-055',
    clientName: 'Mehdi Bennani (Terre & Sens)',
    clientEmail: 'achats@terre-et-sens.com',
    date: '2026-10-01',
    totalTTC: 22400,
    paymentStatus: 'Payé',
    logisticsStatus: 'Livré',
    trackingNumber: 'COLI-9920141',
    carrier: 'Colissimo'
  }
];

export const INITIAL_LOGISTICS: LogisticsShipment[] = [
  {
    id: 'log-1',
    orderNumber: 'CMD-2026-142',
    clientName: 'Palais du Soin & Spa Luxury',
    destination: 'Marrakech Palméraie',
    carrier: 'Chronopost',
    trackingNumber: 'CHRO-MA-8849201',
    status: 'Ramassé',
    dateShipped: '2026-10-06',
    estimatedDelivery: '2026-10-07',
    temperatureControlled: true
  },
  {
    id: 'log-2',
    orderNumber: 'CMD-2026-139',
    clientName: 'Institut Beauté Solaire',
    destination: 'Agadir Baie',
    carrier: 'Amana Express',
    trackingNumber: 'AMANA-77291104',
    status: 'En livraison',
    dateShipped: '2026-10-04',
    estimatedDelivery: '2026-10-06',
    temperatureControlled: false
  },
  {
    id: 'log-3',
    orderNumber: 'CMD-H-2026-088',
    clientName: 'Coopérative Féminine Argania Sud',
    destination: 'Agadir Zone Industrielle',
    carrier: 'DHL Express',
    trackingNumber: 'DHL-EXP-4402199',
    status: 'Au centre de tri',
    dateShipped: '2026-10-05',
    estimatedDelivery: '2026-10-08',
    temperatureControlled: true
  }
];

export const INITIAL_INVOICES: Invoice[] = [
  {
    id: 'inv-1',
    brandId: 'cosmetics',
    invoiceNumber: 'FAC-2026-091',
    clientName: 'Palais du Soin & Spa Luxury',
    date: '2026-09-20',
    dueDate: '2026-10-20',
    amountTotal: 34200,
    amountPaid: 34200,
    remainingDue: 0,
    status: 'Payée',
    paymentMethod: 'Virement'
  },
  {
    id: 'inv-2',
    brandId: 'cosmetics',
    invoiceNumber: 'FAC-2026-104',
    clientName: 'Institut Beauté Solaire',
    date: '2026-10-03',
    dueDate: '2026-11-03',
    amountTotal: 28500,
    amountPaid: 28500,
    remainingDue: 0,
    status: 'Payée',
    paymentMethod: 'Carte Bancaire'
  },
  {
    id: 'inv-3',
    brandId: 'formations',
    invoiceNumber: 'FAC-FORM-2026-042',
    clientName: 'Houda Bennani',
    date: '2026-10-05',
    dueDate: '2026-11-12',
    amountTotal: 12000,
    amountPaid: 4000,
    remainingDue: 8000,
    status: 'Avance reçue',
    paymentMethod: 'Carte Bancaire'
  },
  {
    id: 'inv-4',
    brandId: 'formations',
    invoiceNumber: 'FAC-FORM-2026-041',
    clientName: 'Karim Guessous (Phytoderm)',
    date: '2026-10-06',
    dueDate: '2026-10-28',
    amountTotal: 24000,
    amountPaid: 24000,
    remainingDue: 0,
    status: 'Payée',
    paymentMethod: 'Virement'
  }
];

export const INITIAL_CLAIMS: Claim[] = [
  {
    id: 'clm-1',
    brandId: 'rehab',
    claimNumber: 'REC-2026-014',
    clientName: 'Mehdi Bennani (Terre & Sens)',
    subject: 'Deux flacons eau florale brisés dans carton de livraison',
    priority: 'Moyenne',
    status: 'Ouverte',
    dateCreated: '2026-10-06',
    category: 'Colis endommagé',
    resolutionNotes: 'Échange immédiat envoyé par Chronopost ce jour et ouverture de litige transporteur.'
  },
  {
    id: 'clm-2',
    brandId: 'cosmetics',
    claimNumber: 'REC-2026-011',
    clientName: 'Pharmacie Atlas',
    subject: 'Délai d\'acheminement dépassé de 48h sur lot dermo-cosmétique',
    priority: 'Basse',
    status: 'Résolue',
    dateCreated: '2026-09-29',
    category: 'Retard livraison',
    resolutionNotes: 'Avoir commercial de 5% accordé sur la prochaine facture.'
  },
  {
    id: 'clm-3',
    brandId: 'cosmetics',
    claimNumber: 'REC-2026-018',
    clientName: 'Laboratoires Derma-Luxe',
    subject: 'Micro-défaut de sertissage sur 5 pipettes de sérum actif',
    priority: 'Haute',
    status: 'En attente',
    dateCreated: '2026-10-06',
    category: 'Produit défectueux',
    resolutionNotes: 'Inspection échantillon en cours par le responsable qualité.'
  },
  {
    id: 'clm-4',
    brandId: 'cosmetics',
    claimNumber: 'REC-2026-009',
    clientName: 'Centre Esthétique Anfa',
    subject: 'Demande de retour sur lot ouvert depuis plus de 60 jours',
    priority: 'Faible',
    status: 'Refusée',
    dateCreated: '2026-09-20',
    category: 'Autre',
    resolutionNotes: 'Non conforme aux CGV (délai de rétractation et scellé de garantie dépassé).'
  },
  {
    id: 'clm-5',
    brandId: 'huiles',
    claimNumber: 'REC-2026-021',
    clientName: 'BioCosm Export SAS',
    subject: 'Vérification indice d\'acide sur fûts argan désodorisée',
    priority: 'Haute',
    status: 'Ouverte',
    dateCreated: '2026-10-05',
    category: 'Produit défectueux',
    resolutionNotes: 'Contre-analyse laboratoire indépendant diligentée.'
  },
  {
    id: 'clm-6',
    brandId: 'huiles',
    claimNumber: 'REC-2026-019',
    clientName: 'Savonnerie de l\'Atlas',
    subject: 'Erreur d\'étiquetage sur lot de 50L huile de figue de barbarie',
    priority: 'Moyenne',
    status: 'En attente',
    dateCreated: '2026-10-06',
    category: 'Erreur commande',
    resolutionNotes: 'Vérification du numéro de lot en stock tampon.'
  },
  {
    id: 'clm-7',
    brandId: 'huiles',
    claimNumber: 'REC-2026-012',
    clientName: 'Argania Sud Négoce',
    subject: 'Contestation de frais de transport maritime surcotés',
    priority: 'Basse',
    status: 'Résolue',
    dateCreated: '2026-09-28',
    category: 'Autre',
    resolutionNotes: 'Ajustement de la facture avec note de crédit de 1 200 MAD.'
  },
  {
    id: 'clm-8',
    brandId: 'rehab',
    claimNumber: 'REC-2026-015',
    clientName: 'Spa & Rituels Nature',
    subject: 'Retard de livraison 24h sur baumes réparateurs bio',
    priority: 'Basse',
    status: 'En attente',
    dateCreated: '2026-10-06',
    category: 'Retard livraison',
    resolutionNotes: 'Relance transporteur Amana.'
  },
  {
    id: 'clm-9',
    brandId: 'formations',
    claimNumber: 'REC-2026-008',
    clientName: 'Salma El Amrani',
    subject: 'Demande de report de session suite à empêchement professionnel',
    priority: 'Moyenne',
    status: 'En attente',
    dateCreated: '2026-10-06',
    category: 'Autre',
    resolutionNotes: 'Proposition de report sur la session de novembre sans frais.'
  },
  {
    id: 'clm-10',
    brandId: 'formations',
    claimNumber: 'REC-2026-007',
    clientName: 'Karim Guessous',
    subject: 'Attestation de formation complémentaire non reçue par email',
    priority: 'Faible',
    status: 'Résolue',
    dateCreated: '2026-10-04',
    category: 'Autre',
    resolutionNotes: 'Attestation officielle signée réémise et transmise en PDF HD.'
  },
  {
    id: 'clm-11',
    brandId: 'formations',
    claimNumber: 'REC-2026-006',
    clientName: 'Yassine Belkacem',
    subject: 'Demande de remboursement d\'acompte 24h avant démarrage',
    priority: 'Urgente',
    status: 'Refusée',
    dateCreated: '2026-09-30',
    category: 'Autre',
    resolutionNotes: 'Non conforme au règlement intérieur (acompte non remboursable à J-5, session conservée pour 6 mois).'
  }
];

export const INITIAL_SUPPLIERS: PurchaseSupplier[] = [
  {
    id: 'sup-1',
    brandId: 'cosmetics',
    name: 'Givaudan & Quest Active Ingredients',
    country: 'Suisse / France',
    category: 'Principes Actifs & Peptides',
    contactName: 'Marc Dupont',
    phone: '+33 1 45 67 89 00',
    email: 'contact.actives@givaudan.com',
    reliabilityScore: 98,
    leadTimeDays: 14
  },
  {
    id: 'sup-2',
    brandId: 'cosmetics',
    name: 'Bormioli Luigi Packaging Luxe',
    country: 'Italie',
    category: 'Flacons en verre & Pipettes compte-gouttes',
    contactName: 'Elena Rossi',
    phone: '+39 0521 7931',
    email: 'e.rossi@bormioliluigi.it',
    reliabilityScore: 95,
    leadTimeDays: 21
  },
  {
    id: 'sup-3',
    brandId: 'huiles',
    name: 'Coopérative Taroudant Al-Baraka',
    country: 'Maroc',
    category: 'Amandons d\'Argan certifiés Ecocert',
    contactName: 'Fatima Zahra',
    phone: '+212 5 28 85 12 34',
    email: 'coop.albaraka@argan.ma',
    reliabilityScore: 99,
    leadTimeDays: 4
  }
];

export const INITIAL_PURCHASE_ORDERS: PurchaseOrder[] = [
  {
    id: 'po-1',
    brandId: 'cosmetics',
    poNumber: 'ACH-2026-044',
    supplierName: 'Givaudan & Quest Active Ingredients',
    date: '2026-10-02',
    expectedDate: '2026-10-18',
    totalAmount: 112000,
    status: 'En transit',
    itemsSummary: '10 kg Niacinamide Ultra-pure + 5 kg Acide Hyaluronique 4D'
  },
  {
    id: 'po-2',
    brandId: 'huiles',
    poNumber: 'ACH-2026-039',
    supplierName: 'Coopérative Taroudant Al-Baraka',
    date: '2026-09-25',
    expectedDate: '2026-10-01',
    totalAmount: 78000,
    status: 'Contrôle qualité OK',
    itemsSummary: '1 200 kg Amandons d\'argan 1er choix'
  }
];
