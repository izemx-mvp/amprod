import {
  BrandId,
  Quote,
  Order,
  LogisticsShipment,
  Invoice,
  PurchaseSupplier,
  PurchaseOrder,
  LeadOrClient,
} from '../types';

/**
 * Données de démonstration complémentaires.
 * Elles remplissent les écrans qui étaient vides ou presque pour certaines
 * filiales (devis, commandes, logistique, factures, achats, fournisseurs, CRM).
 * Toutes les valeurs sont fictives.
 */

// ---------------------------------------------------------------------------
// DEVIS
// ---------------------------------------------------------------------------
const quote = (
  id: string,
  brandId: BrandId,
  quoteNumber: string,
  clientName: string,
  clientEmail: string,
  date: string,
  validUntil: string,
  totalHT: number,
  status: Quote['status'],
  itemsCount: number,
  vatRate = 0.2
): Quote => ({
  id,
  brandId,
  quoteNumber,
  clientName,
  clientEmail,
  date,
  validUntil,
  totalHT,
  totalTTC: Math.round(totalHT * (1 + vatRate)),
  status,
  itemsCount,
});

export const EXTRA_QUOTES: Quote[] = [
  // Cosmétiques (matières premières B2B)
  quote('q-c3', 'cosmetics', 'DEV-2026-092', 'Laboratoires Derma-Luxe', 'achats@derma-luxe.ma', '2026-10-12', '2026-11-12', 86400, 'Accepté', 6),
  quote('q-c4', 'cosmetics', 'DEV-2026-095', 'Savonnerie Artisanale du Rif', 'contact@savonnerie-rif.ma', '2026-10-21', '2026-11-21', 12800, 'Brouillon', 3),
  quote('q-c5', 'cosmetics', 'DEV-2026-078', 'Cosmétique Végétale Agadir', 'direction@cosveg-agadir.ma', '2026-09-08', '2026-10-08', 27500, 'Expiré', 4),
  quote('q-c6', 'cosmetics', 'DEV-2026-098', 'Pharmacie Centrale Guéliz', 'chraibi.tariq@pharma-gueliz.com', '2026-11-03', '2026-12-03', 19600, 'Envoyé', 2),
  // Rehab Bio (cosmétiques finis)
  quote('q-r2', 'rehab', 'DEV-REH-2026-022', 'Spa & Rituels Nature', 'reservations@spa-rituels.ma', '2026-10-14', '2026-11-14', 28600, 'Accepté', 8),
  quote('q-r3', 'rehab', 'DEV-REH-2026-024', 'Concept Store Vert Menthe', 'bonjour@vertmenthe.ma', '2026-10-22', '2026-11-22', 9800, 'Envoyé', 6),
  quote('q-r4', 'rehab', 'DEV-REH-2026-017', 'Parapharmacie Les Orangers', 'commande@para-orangers.ma', '2026-09-24', '2026-10-24', 21300, 'Refusé', 7),
  quote('q-r5', 'rehab', 'DEV-REH-2026-027', 'Riad Dar Yasmine', 'gouvernante@daryasmine.com', '2026-11-04', '2026-12-04', 14200, 'Brouillon', 4),
  // Huiles Végétales (export, hors TVA)
  quote('q-h2', 'huiles', 'DEV-EXP-2026-033', 'BioCosm Export SAS', 'purchasing@biocosm-export.fr', '2026-10-15', '2026-11-15', 214000, 'Accepté', 2, 0),
  quote('q-h3', 'huiles', 'DEV-EXP-2026-035', 'Savonnerie de l\'Atlas', 'atelier@savonnerie-atlas.ma', '2026-10-27', '2026-11-27', 46500, 'Envoyé', 3),
  quote('q-h4', 'huiles', 'DEV-EXP-2026-028', 'Nordic Organic Oils AB', 'sourcing@nordicorganic.se', '2026-09-18', '2026-10-18', 168000, 'Expiré', 2, 0),
  quote('q-h5', 'huiles', 'DEV-EXP-2026-037', 'Maison Argana Paris', 'achats@maison-argana.fr', '2026-11-05', '2026-12-05', 92500, 'Brouillon', 4, 0),
];

// ---------------------------------------------------------------------------
// COMMANDES + EXPÉDITIONS
// ---------------------------------------------------------------------------
const order = (
  id: string,
  brandId: BrandId,
  orderNumber: string,
  clientName: string,
  clientEmail: string,
  date: string,
  totalTTC: number,
  paymentStatus: Order['paymentStatus'],
  logisticsStatus: Order['logisticsStatus'],
  trackingNumber: string,
  carrier: Order['carrier']
): Order => ({
  id,
  brandId,
  orderNumber,
  clientName,
  clientEmail,
  date,
  totalTTC,
  paymentStatus,
  logisticsStatus,
  trackingNumber,
  carrier,
});

export const EXTRA_ORDERS: Order[] = [
  order('ord-c3', 'cosmetics', 'CMD-2026-147', 'Laboratoires Derma-Luxe', 'achats@derma-luxe.ma', '2026-10-16', 103680, 'Partiel (Avance)', 'En préparation', 'DHL-EXP-4410382', 'DHL Express'),
  order('ord-c4', 'cosmetics', 'CMD-2026-151', 'Centre Thalasso Atlantic', 'achats@thalasso-atlantic.ma', '2026-10-24', 38400, 'Payé', 'Livré', 'AMANA-77304418', 'Amana Express'),
  order('ord-c5', 'cosmetics', 'CMD-2026-156', 'Pharmacie Atlas', 'commandes@pharmacie-atlas.ma', '2026-11-02', 17200, 'En attente', 'En préparation', 'CHRO-MA-8861047', 'Chronopost'),
  order('ord-r2', 'rehab', 'CMD-REH-2026-058', 'Spa & Rituels Nature', 'reservations@spa-rituels.ma', '2026-10-17', 34320, 'Payé', 'Expédié', 'AMANA-77298855', 'Amana Express'),
  order('ord-r3', 'rehab', 'CMD-REH-2026-061', 'Herboristerie Bio Atlas & Nature', 'nadia@atlasnaturebio.com', '2026-10-23', 18480, 'Partiel (Avance)', 'En préparation', 'CHRO-MA-8857210', 'Chronopost'),
  order('ord-r4', 'rehab', 'CMD-REH-2026-063', 'Concept Store Vert Menthe', 'bonjour@vertmenthe.ma', '2026-10-30', 11760, 'Payé', 'En transit', 'COLI-9934402', 'Colissimo'),
  order('ord-r5', 'rehab', 'CMD-REH-2026-066', 'Parapharmacie Les Orangers', 'commande@para-orangers.ma', '2026-11-06', 8940, 'En attente', 'En préparation', 'AMANA-77311290', 'Amana Express'),
  order('ord-h2', 'huiles', 'CMD-H-2026-091', 'BioCosm Export SAS', 'purchasing@biocosm-export.fr', '2026-10-19', 214000, 'Partiel (Avance)', 'En préparation', 'DHL-EXP-4412760', 'DHL Express'),
  order('ord-h3', 'huiles', 'CMD-H-2026-093', 'Savonnerie de l\'Atlas', 'atelier@savonnerie-atlas.ma', '2026-10-28', 55800, 'Payé', 'Livré', 'AMANA-77306631', 'Amana Express'),
  order('ord-h4', 'huiles', 'CMD-H-2026-095', 'Laboratoires Botaniques d\'Aquitaine', 'jc.meyer@botanique-aquitaine.fr', '2026-11-03', 380000, 'En attente', 'En préparation', 'DHL-EXP-4419015', 'DHL Express'),
  order('ord-h5', 'huiles', 'CMD-H-2026-086', 'Maison Argana Paris', 'achats@maison-argana.fr', '2026-09-29', 74200, 'Payé', 'Livré', 'DHL-EXP-4398844', 'DHL Express'),
];

const shipment = (
  id: string,
  orderNumber: string,
  clientName: string,
  destination: string,
  carrier: string,
  trackingNumber: string,
  status: LogisticsShipment['status'],
  dateShipped: string,
  estimatedDelivery: string,
  temperatureControlled = false
): LogisticsShipment => ({
  id,
  orderNumber,
  clientName,
  destination,
  carrier,
  trackingNumber,
  status,
  dateShipped,
  estimatedDelivery,
  temperatureControlled,
});

export const EXTRA_LOGISTICS: LogisticsShipment[] = [
  shipment('log-c3', 'CMD-2026-147', 'Laboratoires Derma-Luxe', 'Casablanca Sidi Maârouf', 'DHL Express', 'DHL-EXP-4410382', 'Étiquette créée', '2026-10-18', '2026-10-21', true),
  shipment('log-c4', 'CMD-2026-151', 'Centre Thalasso Atlantic', 'El Jadida Front de Mer', 'Amana Express', 'AMANA-77304418', 'Livré', '2026-10-25', '2026-10-27'),
  shipment('log-r1', 'CMD-REH-2026-055', 'Terre & Sens', 'Rabat Agdal', 'Colissimo', 'COLI-9920141', 'Livré', '2026-10-02', '2026-10-04'),
  shipment('log-r2', 'CMD-REH-2026-058', 'Spa & Rituels Nature', 'Marrakech Hivernage', 'Amana Express', 'AMANA-77298855', 'En livraison', '2026-10-19', '2026-10-21'),
  shipment('log-r3', 'CMD-REH-2026-061', 'Herboristerie Bio Atlas & Nature', 'Fès Ville Nouvelle', 'Chronopost', 'CHRO-MA-8857210', 'Étiquette créée', '2026-10-25', '2026-10-27'),
  shipment('log-r4', 'CMD-REH-2026-063', 'Concept Store Vert Menthe', 'Tanger Marshan', 'Colissimo', 'COLI-9934402', 'Au centre de tri', '2026-10-31', '2026-11-03'),
  shipment('log-h2', 'CMD-H-2026-091', 'BioCosm Export SAS', 'Marseille Fos (France)', 'DHL Express', 'DHL-EXP-4412760', 'Ramassé', '2026-10-22', '2026-10-29', true),
  shipment('log-h3', 'CMD-H-2026-093', 'Savonnerie de l\'Atlas', 'Marrakech Sidi Ghanem', 'Amana Express', 'AMANA-77306631', 'Livré', '2026-10-29', '2026-10-31'),
  shipment('log-h4', 'CMD-H-2026-086', 'Maison Argana Paris', 'Paris Rungis (France)', 'DHL Express', 'DHL-EXP-4398844', 'Livré', '2026-10-01', '2026-10-06', true),
];

// ---------------------------------------------------------------------------
// FACTURES & PAIEMENTS
// ---------------------------------------------------------------------------
const invoice = (
  id: string,
  brandId: BrandId,
  invoiceNumber: string,
  clientName: string,
  date: string,
  dueDate: string,
  amountTotal: number,
  amountPaid: number,
  status: Invoice['status'],
  paymentMethod: Invoice['paymentMethod']
): Invoice => ({
  id,
  brandId,
  invoiceNumber,
  clientName,
  date,
  dueDate,
  amountTotal,
  amountPaid,
  remainingDue: amountTotal - amountPaid,
  status,
  paymentMethod,
});

export const EXTRA_INVOICES: Invoice[] = [
  // Cosmétiques
  invoice('inv-c3', 'cosmetics', 'FAC-2026-109', 'Laboratoires Derma-Luxe', '2026-10-16', '2026-11-16', 103680, 41472, 'Avance reçue', 'Virement'),
  invoice('inv-c4', 'cosmetics', 'FAC-2026-112', 'Centre Thalasso Atlantic', '2026-10-24', '2026-11-24', 38400, 38400, 'Payée', 'Chèque'),
  invoice('inv-c5', 'cosmetics', 'FAC-2026-087', 'Cosmétique Végétale Agadir', '2026-09-05', '2026-10-05', 22900, 0, 'En retard', 'Virement'),
  invoice('inv-c6', 'cosmetics', 'FAC-2026-116', 'Pharmacie Atlas', '2026-11-02', '2026-12-02', 17200, 0, 'En attente', 'Carte Bancaire'),
  // Rehab Bio
  invoice('inv-r1', 'rehab', 'FAC-REH-2026-048', 'Terre & Sens', '2026-10-01', '2026-10-31', 22400, 22400, 'Payée', 'Carte Bancaire'),
  invoice('inv-r2', 'rehab', 'FAC-REH-2026-051', 'Spa & Rituels Nature', '2026-10-17', '2026-11-17', 34320, 34320, 'Payée', 'Virement'),
  invoice('inv-r3', 'rehab', 'FAC-REH-2026-054', 'Herboristerie Bio Atlas & Nature', '2026-10-23', '2026-11-23', 18480, 7400, 'Avance reçue', 'Chèque'),
  invoice('inv-r4', 'rehab', 'FAC-REH-2026-056', 'Concept Store Vert Menthe', '2026-10-30', '2026-11-30', 11760, 11760, 'Payée', 'Carte Bancaire'),
  invoice('inv-r5', 'rehab', 'FAC-REH-2026-044', 'Riad Dar Yasmine', '2026-09-12', '2026-10-12', 9650, 0, 'En retard', 'Virement'),
  invoice('inv-r6', 'rehab', 'FAC-REH-2026-059', 'Parapharmacie Les Orangers', '2026-11-06', '2026-12-06', 8940, 0, 'En attente', 'Espèces'),
  // Huiles Végétales
  invoice('inv-h1', 'huiles', 'FAC-H-2026-071', 'Coopérative Féminine Argania Sud', '2026-10-04', '2026-11-04', 92000, 92000, 'Payée', 'Virement'),
  invoice('inv-h2', 'huiles', 'FAC-H-2026-074', 'BioCosm Export SAS', '2026-10-19', '2026-11-19', 214000, 85600, 'Avance reçue', 'Virement'),
  invoice('inv-h3', 'huiles', 'FAC-H-2026-076', 'Savonnerie de l\'Atlas', '2026-10-28', '2026-11-28', 55800, 55800, 'Payée', 'Chèque'),
  invoice('inv-h4', 'huiles', 'FAC-H-2026-079', 'Laboratoires Botaniques d\'Aquitaine', '2026-11-03', '2026-12-03', 380000, 0, 'En attente', 'Virement'),
  invoice('inv-h5', 'huiles', 'FAC-H-2026-066', 'Nordic Organic Oils AB', '2026-09-10', '2026-10-10', 48600, 0, 'En retard', 'Virement'),
  invoice('inv-h6', 'huiles', 'FAC-H-2026-068', 'Maison Argana Paris', '2026-09-29', '2026-10-29', 74200, 74200, 'Payée', 'Virement'),
  // Formations (paiements fractionnés)
  invoice('inv-f3', 'formations', 'FAC-FORM-2026-044', 'Salma El Amrani', '2026-10-10', '2026-11-20', 8500, 3000, 'Avance reçue', 'Carte Bancaire'),
  invoice('inv-f4', 'formations', 'FAC-FORM-2026-046', 'Youssef Mansour', '2026-10-15', '2026-11-15', 6500, 6500, 'Payée', 'Espèces'),
  invoice('inv-f5', 'formations', 'FAC-FORM-2026-047', 'Institut Beauté Solaire (3 stagiaires)', '2026-10-21', '2026-11-21', 25500, 9000, 'Avance reçue', 'Virement'),
  invoice('inv-f6', 'formations', 'FAC-FORM-2026-039', 'Yassine Belkacem', '2026-09-22', '2026-10-22', 12000, 4000, 'En retard', 'Chèque'),
  invoice('inv-f7', 'formations', 'FAC-FORM-2026-049', 'Nadia Lahlou', '2026-11-04', '2026-12-04', 8500, 0, 'En attente', 'Virement'),
];

// ---------------------------------------------------------------------------
// FOURNISSEURS & BONS D'ACHAT
// ---------------------------------------------------------------------------
const supplier = (
  id: string,
  brandId: BrandId,
  name: string,
  country: string,
  category: string,
  contactName: string,
  phone: string,
  email: string,
  reliabilityScore: number,
  leadTimeDays: number
): PurchaseSupplier => ({
  id,
  brandId,
  name,
  country,
  category,
  contactName,
  phone,
  email,
  reliabilityScore,
  leadTimeDays,
});

export const EXTRA_SUPPLIERS: PurchaseSupplier[] = [
  // Cosmétiques
  supplier('sup-c3', 'cosmetics', 'Seppic Ingrédients Cosmétiques', 'France', 'Tensioactifs doux & Émulsionnants', 'Claire Vasseur', '+33 1 42 91 40 00', 'c.vasseur@seppic-ingredients.fr', 96, 12),
  supplier('sup-c4', 'cosmetics', 'Karité Faso Coopérative', 'Burkina Faso', 'Beurre de karité brut équitable', 'Aminata Ouédraogo', '+226 25 36 18 40', 'export@karitefaso.bf', 91, 28),
  supplier('sup-c5', 'cosmetics', 'ChemiMaghreb Distribution', 'Maroc', 'Alcools, glycérine & solvants', 'Hicham Bennis', '+212 5 22 67 80 12', 'h.bennis@chemimaghreb.ma', 94, 5),
  // Rehab Bio
  supplier('sup-r1', 'rehab', 'Herbes de l\'Atlas Bio', 'Maroc', 'Plantes aromatiques & extraits bio', 'Rachid Ouazzani', '+212 5 24 43 21 08', 'r.ouazzani@herbes-atlas.ma', 97, 6),
  supplier('sup-r2', 'rehab', 'Verrerie Éco-Pack Méditerranée', 'Espagne', 'Pots en verre recyclé & couvercles bambou', 'Lucía Fernández', '+34 96 352 14 77', 'lucia@ecopack-med.es', 93, 18),
  supplier('sup-r3', 'rehab', 'Rucher du Moyen Atlas', 'Maroc', 'Cire d\'abeille & miel cosmétique', 'Driss El Fassi', '+212 5 35 56 70 33', 'contact@rucher-moyenatlas.ma', 95, 7),
  supplier('sup-r4', 'rehab', 'Imprimerie Verte Casablanca', 'Maroc', 'Étuis carton FSC & étiquettes', 'Samira Kabbaj', '+212 5 22 30 45 19', 's.kabbaj@imprimerie-verte.ma', 89, 10),
  // Huiles Végétales
  supplier('sup-h2', 'huiles', 'Coopérative Figue de Barbarie Aït Baâmrane', 'Maroc', 'Pépins de figue de barbarie triés', 'Khadija Aït Lahcen', '+212 5 28 78 90 21', 'coop.aitbaamrane@figue.ma', 97, 9),
  supplier('sup-h3', 'huiles', 'Ethio Nigella Trading', 'Éthiopie', 'Graines de nigelle (Habbah Sawda)', 'Dawit Bekele', '+251 11 551 20 64', 'sales@ethionigella.et', 90, 35),
  supplier('sup-h4', 'huiles', 'Flaconnage Miron Glass', 'Pays-Bas', 'Flacons verre violet & pompes', 'Sanne de Vries', '+31 20 794 31 50', 's.devries@mironglass.nl', 98, 16),
  supplier('sup-h5', 'huiles', 'Jojoba Sahara Farms', 'Égypte', 'Graines de jojoba première pression', 'Omar Farouk', '+20 2 2735 48 90', 'o.farouk@jojobasahara.eg', 92, 24),
];

const purchaseOrder = (
  id: string,
  brandId: BrandId,
  poNumber: string,
  supplierName: string,
  date: string,
  expectedDate: string,
  totalAmount: number,
  status: PurchaseOrder['status'],
  itemsSummary: string
): PurchaseOrder => ({
  id,
  brandId,
  poNumber,
  supplierName,
  date,
  expectedDate,
  totalAmount,
  status,
  itemsSummary,
});

export const EXTRA_PURCHASE_ORDERS: PurchaseOrder[] = [
  // Cosmétiques
  purchaseOrder('po-c2', 'cosmetics', 'ACH-2026-047', 'Bormioli Luigi Packaging Luxe', '2026-10-08', '2026-10-29', 64500, 'Réceptionné', '12 000 flacons verre 30 ml + pipettes compte-gouttes'),
  purchaseOrder('po-c3', 'cosmetics', 'ACH-2026-051', 'Seppic Ingrédients Cosmétiques', '2026-10-20', '2026-11-01', 48200, 'Contrôle qualité OK', '250 kg SCI en poudre + 80 kg émulsionnant végétal'),
  purchaseOrder('po-c4', 'cosmetics', 'ACH-2026-054', 'Karité Faso Coopérative', '2026-10-27', '2026-11-24', 37800, 'Commandé', '40 cartons de 25 kg beurre de karité brut'),
  purchaseOrder('po-c5', 'cosmetics', 'ACH-2026-042', 'ChemiMaghreb Distribution', '2026-09-26', '2026-10-01', 21600, 'Litige', '20 fûts alcool dénaturé 96° — 2 fûts non conformes'),
  // Rehab Bio
  purchaseOrder('po-r1', 'rehab', 'ACH-REH-2026-018', 'Herbes de l\'Atlas Bio', '2026-10-05', '2026-10-11', 18400, 'Contrôle qualité OK', '120 kg ortie + 90 kg romarin séchés bio'),
  purchaseOrder('po-r2', 'rehab', 'ACH-REH-2026-021', 'Verrerie Éco-Pack Méditerranée', '2026-10-14', '2026-11-01', 29700, 'En transit', '8 000 pots verre 50 ml + couvercles bambou'),
  purchaseOrder('po-r3', 'rehab', 'ACH-REH-2026-023', 'Rucher du Moyen Atlas', '2026-10-22', '2026-10-29', 12300, 'Réceptionné', '150 kg cire d\'abeille jaune filtrée'),
  purchaseOrder('po-r4', 'rehab', 'ACH-REH-2026-025', 'Imprimerie Verte Casablanca', '2026-11-03', '2026-11-13', 8600, 'Commandé', '15 000 étuis carton FSC + étiquettes gamme capillaire'),
  // Huiles Végétales
  purchaseOrder('po-h2', 'huiles', 'ACH-2026-045', 'Coopérative Figue de Barbarie Aït Baâmrane', '2026-10-09', '2026-10-18', 134000, 'Réceptionné', '2 tonnes de pépins de figue de barbarie triés'),
  purchaseOrder('po-h3', 'huiles', 'ACH-2026-049', 'Flaconnage Miron Glass', '2026-10-16', '2026-11-01', 42800, 'En transit', '6 000 flacons violets 30 ml + 3 000 flacons 250 ml'),
  purchaseOrder('po-h4', 'huiles', 'ACH-2026-052', 'Ethio Nigella Trading', '2026-10-24', '2026-11-28', 58500, 'Commandé', '1 500 kg graines de nigelle d\'Éthiopie'),
  purchaseOrder('po-h5', 'huiles', 'ACH-2026-055', 'Jojoba Sahara Farms', '2026-11-02', '2026-11-26', 71200, 'Commandé', '900 kg graines de jojoba dorées'),
];

// ---------------------------------------------------------------------------
// CRM : LEADS & CLIENTS
// ---------------------------------------------------------------------------
interface ContactSeed {
  id: string;
  brandId: BrandId;
  isClient: boolean;
  name: string;
  company?: string;
  email: string;
  phone: string;
  city: string;
  country?: string;
  source: LeadOrClient['source'];
  status: string;
  aiScore: number;
  aiRationale: string;
  lastContact: string;
  assignedTo: string;
  totalOrdersValue?: number;
  totalPaid?: number;
  activeOrdersCount?: number;
  pendingQuotesCount?: number;
  trainingRegisteredCount?: number;
  notes: string;
  lastEvent: { title: string; description: string; type: LeadOrClient['timeline'][number]['type'] };
}

const contact = (c: ContactSeed): LeadOrClient => {
  const totalOrdersValue = c.totalOrdersValue ?? 0;
  const totalPaid = c.totalPaid ?? 0;
  return {
    id: c.id,
    brandId: c.brandId,
    isClient: c.isClient,
    name: c.name,
    company: c.company,
    email: c.email,
    phone: c.phone,
    city: c.city,
    country: c.country ?? 'Maroc',
    source: c.source,
    status: c.status,
    aiScore: c.aiScore,
    aiRationale: c.aiRationale,
    lastContact: c.lastContact,
    assignedTo: c.assignedTo,
    totalOrdersValue,
    totalPaid,
    remainingDue: totalOrdersValue - totalPaid,
    activeOrdersCount: c.activeOrdersCount ?? 0,
    pendingQuotesCount: c.pendingQuotesCount ?? 0,
    openClaimsCount: 0,
    trainingRegisteredCount: c.trainingRegisteredCount,
    notes: c.notes,
    timeline: [
      {
        id: `${c.id}-t1`,
        date: c.lastContact,
        title: c.lastEvent.title,
        description: c.lastEvent.description,
        type: c.lastEvent.type,
        author: c.assignedTo,
      },
    ],
  };
};

export const EXTRA_LEADS: LeadOrClient[] = [
  // --- Cosmétiques ---
  contact({
    id: 'lead-cosm-x1', brandId: 'cosmetics', isClient: false,
    name: 'Imane Berrada', company: 'Atelier Cosmétique Naturelle Imane', email: 'imane@atelier-imane.ma', phone: '+212 6 62 18 44 70',
    city: 'Rabat', source: 'Instagram', status: 'Nouveau', aiScore: 71,
    aiRationale: 'Jeune marque en lancement, volumes modestes mais récurrents sur les tensioactifs doux.',
    lastContact: '2026-11-04T09:20:00Z', assignedTo: 'Yassine Alami', pendingQuotesCount: 0,
    notes: 'Souhaite des conditionnements de 5 kg pour démarrer sa gamme de shampooings solides.',
    lastEvent: { title: 'Demande de catalogue via Instagram', description: 'Envoi du catalogue tensioactifs et de la grille tarifaire petits volumes.', type: 'email' },
  }),
  contact({
    id: 'lead-cosm-x2', brandId: 'cosmetics', isClient: false,
    name: 'Hamza El Idrissi', company: 'Savonnerie Artisanale du Rif', email: 'contact@savonnerie-rif.ma', phone: '+212 6 70 55 21 36',
    city: 'Tétouan', source: 'Site Web', status: 'Qualifié', aiScore: 83,
    aiRationale: 'Besoin confirmé en beurre de karité et glycérine, commande test prévue ce mois-ci.',
    lastContact: '2026-10-21T15:10:00Z', assignedTo: 'Yassine Alami', pendingQuotesCount: 1,
    notes: 'Devis DEV-2026-095 en préparation. Demande une livraison groupée mensuelle.',
    lastEvent: { title: 'Appel de qualification', description: 'Volumes estimés : 150 kg de karité et 60 L de glycérine par mois.', type: 'call' },
  }),
  contact({
    id: 'client-cosm-x1', brandId: 'cosmetics', isClient: true,
    name: 'Nawal Tahiri', company: 'Laboratoires Derma-Luxe', email: 'achats@derma-luxe.ma', phone: '+212 5 22 97 60 14',
    city: 'Casablanca', source: 'Salon Pro', status: 'Client Fidèle VIP', aiScore: 96,
    aiRationale: 'Grand compte industriel : commandes trimestrielles régulières et paiements dans les délais.',
    lastContact: '2026-10-16T11:00:00Z', assignedTo: 'Yassine Alami', totalOrdersValue: 312000, totalPaid: 249792, activeOrdersCount: 1,
    notes: 'Contrat cadre annuel sur les acides formulatoires. Exige un certificat d\'analyse par lot.',
    lastEvent: { title: 'Commande CMD-2026-147 confirmée', description: 'Acompte de 40 % reçu par virement, préparation en cours.', type: 'order' },
  }),
  contact({
    id: 'client-cosm-x2', brandId: 'cosmetics', isClient: true,
    name: 'Rachid Lamrani', company: 'Centre Thalasso Atlantic', email: 'achats@thalasso-atlantic.ma', phone: '+212 5 23 34 22 81',
    city: 'El Jadida', source: 'Bouche à oreille', status: 'Client Actif', aiScore: 88,
    aiRationale: 'Achats réguliers de bases neutres pour soins cabine, panier moyen en hausse.',
    lastContact: '2026-10-24T16:40:00Z', assignedTo: 'Yassine Alami', totalOrdersValue: 126400, totalPaid: 126400,
    notes: 'Commande tous les deux mois. Sensible aux délais de livraison avant la haute saison.',
    lastEvent: { title: 'Facture FAC-2026-112 réglée', description: 'Règlement par chèque encaissé.', type: 'invoice' },
  }),
  // --- Rehab Bio ---
  contact({
    id: 'lead-rehab-x1', brandId: 'rehab', isClient: false,
    name: 'Zineb Chaoui', company: 'Concept Store Vert Menthe', email: 'bonjour@vertmenthe.ma', phone: '+212 6 61 73 09 52',
    city: 'Tanger', source: 'Instagram', status: 'Proposition envoyée', aiScore: 86,
    aiRationale: 'Boutique zéro déchet en forte croissance, clientèle alignée avec la gamme solide.',
    lastContact: '2026-10-22T10:05:00Z', assignedTo: 'Karima Idrissi', pendingQuotesCount: 1,
    notes: 'Souhaite un présentoir de comptoir et un réassort mensuel des shampooings solides.',
    lastEvent: { title: 'Devis DEV-REH-2026-024 envoyé', description: 'Proposition pour 6 références en dépôt-vente amélioré.', type: 'quote' },
  }),
  contact({
    id: 'lead-rehab-x2', brandId: 'rehab', isClient: false,
    name: 'Mounia Alaoui', company: 'Riad Dar Yasmine', email: 'gouvernante@daryasmine.com', phone: '+212 6 63 40 18 27',
    city: 'Marrakech', source: 'WhatsApp', status: 'Qualifié', aiScore: 78,
    aiRationale: 'Hôtellerie de charme : besoin en produits d\'accueil bio personnalisés pour 14 chambres.',
    lastContact: '2026-11-04T13:30:00Z', assignedTo: 'Karima Idrissi', pendingQuotesCount: 1,
    notes: 'Demande des formats 30 ml gravés au nom du riad.',
    lastEvent: { title: 'Échange WhatsApp', description: 'Envoi des échantillons baume et crème visage par coursier.', type: 'whatsapp' },
  }),
  contact({
    id: 'client-rehab-x1', brandId: 'rehab', isClient: true,
    name: 'Sanaa Benkirane', company: 'Spa & Rituels Nature', email: 'reservations@spa-rituels.ma', phone: '+212 5 24 43 88 16',
    city: 'Marrakech', source: 'Salon Pro', status: 'Client Fidèle VIP', aiScore: 93,
    aiRationale: 'Utilise la gamme en cabine et en revente : réassort toutes les trois semaines.',
    lastContact: '2026-10-17T09:45:00Z', assignedTo: 'Karima Idrissi', totalOrdersValue: 148600, totalPaid: 148600, activeOrdersCount: 1,
    notes: 'Partenaire historique. Co-création d\'un rituel signature prévue début 2027.',
    lastEvent: { title: 'Commande CMD-REH-2026-058 expédiée', description: 'Colis remis à Amana Express.', type: 'order' },
  }),
  contact({
    id: 'client-rehab-x2', brandId: 'rehab', isClient: true,
    name: 'Nadia Ouazzani', company: 'Herboristerie Bio Atlas & Nature', email: 'nadia@atlasnaturebio.com', phone: '+212 5 35 62 14 90',
    city: 'Fès', source: 'Site Web', status: 'Client Actif', aiScore: 85,
    aiRationale: 'Revendeur régulier, bon taux de réachat sur les soins capillaires.',
    lastContact: '2026-10-23T14:15:00Z', assignedTo: 'Karima Idrissi', totalOrdersValue: 62300, totalPaid: 51220, activeOrdersCount: 1,
    notes: 'Paiement en deux échéances accordé sur la dernière commande.',
    lastEvent: { title: 'Acompte reçu sur FAC-REH-2026-054', description: 'Chèque de 7 400 MAD encaissé, solde attendu fin novembre.', type: 'invoice' },
  }),
  // --- Huiles Végétales ---
  contact({
    id: 'lead-huiles-x1', brandId: 'huiles', isClient: false,
    name: 'Erik Lindqvist', company: 'Nordic Organic Oils AB', email: 'sourcing@nordicorganic.se', phone: '+46 8 520 271 40',
    city: 'Stockholm', country: 'Suède', source: 'Salon Pro', status: 'Négociation Grand Compte', aiScore: 89,
    aiRationale: 'Importateur scandinave certifié bio, volumes annuels estimés à 3 tonnes d\'huile d\'argan.',
    lastContact: '2026-10-29T08:30:00Z', assignedTo: 'Othmane Slaoui (Export Manager)', pendingQuotesCount: 1,
    notes: 'Demande les certificats Ecocert et COSMOS ainsi qu\'un incoterm DAP Göteborg.',
    lastEvent: { title: 'Relance du devis DEV-EXP-2026-028', description: 'Devis expiré : nouvelle proposition à émettre avec tarif transport révisé.', type: 'email' },
  }),
  contact({
    id: 'lead-huiles-x2', brandId: 'huiles', isClient: false,
    name: 'Camille Roussel', company: 'Maison Argana Paris', email: 'achats@maison-argana.fr', phone: '+33 1 84 60 12 55',
    city: 'Paris', country: 'France', source: 'Site Web', status: 'Proposition envoyée', aiScore: 84,
    aiRationale: 'Marque de niche déjà cliente sur l\'argan, intérêt nouveau pour l\'huile de figue de barbarie.',
    lastContact: '2026-11-05T10:50:00Z', assignedTo: 'Othmane Slaoui (Export Manager)', pendingQuotesCount: 1,
    notes: 'Souhaite un conditionnement en flacons violets 30 ml prêts à étiqueter.',
    lastEvent: { title: 'Devis DEV-EXP-2026-037 en préparation', description: 'Chiffrage en cours pour 4 références.', type: 'quote' },
  }),
  contact({
    id: 'client-huiles-x1', brandId: 'huiles', isClient: true,
    name: 'Pierre Lemoine', company: 'BioCosm Export SAS', email: 'purchasing@biocosm-export.fr', phone: '+33 4 91 22 60 38',
    city: 'Marseille', country: 'France', source: 'Salon Pro', status: 'Partenaire Distributeur', aiScore: 95,
    aiRationale: 'Distributeur européen majeur : commandes en fûts tous les deux mois.',
    lastContact: '2026-10-19T12:20:00Z', assignedTo: 'Othmane Slaoui (Export Manager)', totalOrdersValue: 842000, totalPaid: 713600, activeOrdersCount: 1,
    notes: 'Contrat d\'exclusivité France sur l\'argan désodorisé jusqu\'en 2027.',
    lastEvent: { title: 'Commande CMD-H-2026-091 confirmée', description: 'Acompte de 40 % reçu, chargement prévu fin octobre.', type: 'order' },
  }),
  contact({
    id: 'client-huiles-x2', brandId: 'huiles', isClient: true,
    name: 'Abdelilah Naciri', company: 'Savonnerie de l\'Atlas', email: 'atelier@savonnerie-atlas.ma', phone: '+212 5 24 33 57 02',
    city: 'Marrakech', source: 'Bouche à oreille', status: 'Client Actif', aiScore: 82,
    aiRationale: 'Achats mensuels d\'huiles de base pour savons saponifiés à froid.',
    lastContact: '2026-10-28T17:05:00Z', assignedTo: 'Othmane Slaoui', totalOrdersValue: 198400, totalPaid: 198400,
    notes: 'Préfère les bidons de 20 L. Livraison le mardi uniquement.',
    lastEvent: { title: 'Commande CMD-H-2026-093 livrée', description: 'Réception confirmée et facture réglée par chèque.', type: 'order' },
  }),
  // --- Formations ---
  contact({
    id: 'lead-form-x1', brandId: 'formations', isClient: false,
    name: 'Nadia Lahlou', email: 'nadia.lahlou@gmail.com', phone: '+212 6 64 29 81 17',
    city: 'Casablanca', source: 'Campagne Ads', status: 'Inscrit', aiScore: 87,
    aiRationale: 'Reconversion professionnelle motivée, dossier complet et financement validé.',
    lastContact: '2026-11-04T11:15:00Z', assignedTo: 'Salma Cherkaoui', totalOrdersValue: 8500, totalPaid: 0, trainingRegisteredCount: 1,
    notes: 'Inscrite à la Masterclass Formulation de décembre. Acompte attendu sous 7 jours.',
    lastEvent: { title: 'Inscription Masterclass Formulation', description: 'Convention de formation signée, facture FAC-FORM-2026-049 émise.', type: 'training' },
  }),
  contact({
    id: 'lead-form-x2', brandId: 'formations', isClient: false,
    name: 'Youssef Mansour', email: 'y.mansour@outlook.com', phone: '+212 6 68 51 30 74',
    city: 'Agadir', source: 'Site Web', status: 'Confirmé', aiScore: 91,
    aiRationale: 'Artisan savonnier en activité, formation intégralement réglée.',
    lastContact: '2026-10-15T09:00:00Z', assignedTo: 'Salma Cherkaoui', totalOrdersValue: 6500, totalPaid: 6500,
    notes: 'Participe à la session Savonnerie à froid. Demande une facture au nom de son auto-entreprise.',
    lastEvent: { title: 'Paiement intégral reçu', description: 'Règlement en espèces de 6 500 MAD au centre.', type: 'invoice' },
  }),
  contact({
    id: 'lead-form-x3', brandId: 'formations', isClient: false,
    name: 'Leila Bensouda', company: 'Institut Beauté Solaire', email: 'contact@beautesolaire.ma', phone: '+212 5 28 84 16 60',
    city: 'Agadir', source: 'Bouche à oreille', status: 'Payé une avance', aiScore: 90,
    aiRationale: 'Inscription groupée de 3 esthéticiennes, financement par l\'employeur.',
    lastContact: '2026-10-21T14:45:00Z', assignedTo: 'Salma Cherkaoui', totalOrdersValue: 25500, totalPaid: 9000,
    notes: 'Souhaite une attestation individuelle pour chaque stagiaire.',
    lastEvent: { title: 'Acompte groupé reçu', description: 'Virement de 9 000 MAD pour 3 places en Dermocosmétique Avancée.', type: 'invoice' },
  }),
];
