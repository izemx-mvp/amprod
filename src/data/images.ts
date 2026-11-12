import { BrandId } from '../types';

/**
 * Bibliothèque d'images centralisée (Unsplash, usage libre).
 * Chaque photo est choisie selon l'activité de la filiale concernée.
 */
export const photo = (id: string, width = 800): string =>
  `https://images.unsplash.com/photo-${id}?w=${width}&auto=format&fit=crop&q=80`;

export const PHOTOS = {
  // AM PROD Cosmétiques — matières premières & laboratoire
  labTechnician: '1658387575528-88b316c42371',
  labBeakerGloved: '1617155093730-a8bf47be792d',
  labFlask: '1595500381966-eee2034aae48',
  sheaButter: '1762840192336-575fba31d28c',
  clearDrop: '1560521166-117ca72366bd',
  whitePowder: '1593095948071-474c5cc2989d',

  // Rehab Bio — cosmétiques finis naturels
  naturalSkincareSet: '1785581778868-79100f7fe56c',
  naturalSoapBars: '1584305574647-0cc949a2bb9f',
  faceCreamJar: '1629732047847-50219e9c5aef',
  botanicalBalm: '1573812461383-e5f8b759d12e',
  hairCareDuo: '1638131164217-c240e7627611',
  careRange: '1638130981545-39e109d88315',

  // AM PROD Huiles Végétales
  oilBottlesRange: '1669281393011-c335050cf0e9',
  goldenOilPour: '1768689033119-c3ac1e437d20',
  pricklyPearFruit: '1717016296561-37af0c705281',
  pricklyPearCactus: '1563422156298-c778a278f9a5',
  nigellaSeeds: '1735011725730-3c91d903ac92',
  goldenDropper: '1605040056130-38d9faad3534',

  // AM PROD Formations
  classroom: '1792783221454-304e20182d00',
  formulationBeaker: '1658387575638-026450e4df6e',
  formulationMixing: '1658387576718-5053dfd0cb53',
  regulatoryDocs: '1554224155-1696413565d3',
  artisanSoaps: '1600857544200-b2f666a9a2ec',
  botanicalMacerate: '1777396761485-85b2ac69b89a',
  premiumPackaging: '1633793566189-8e9fe6f817fc',
  microbiologyLab: '1575468130797-aa950b68aeec',
  serumAmber: '1781344116880-029945a42b75',
  serumDropper: '1786171118415-07653ed8cf99',

  // Hub CEO
  analyticsDashboard: '1551288049-bebda4e38f71',
} as const;

interface BrandVisual {
  /** Grande image d'ambiance (connexion, portail) */
  hero: string;
  /** Image de carte sur le portail */
  card: string;
  /** Image de secours si un visuel produit ne charge pas */
  fallback: string;
}

export const BRAND_VISUALS: Record<BrandId, BrandVisual> = {
  cosmetics: {
    hero: photo(PHOTOS.labTechnician, 1600),
    card: photo(PHOTOS.labTechnician, 900),
    fallback: photo(PHOTOS.labBeakerGloved),
  },
  rehab: {
    hero: photo(PHOTOS.naturalSkincareSet, 1600),
    card: photo(PHOTOS.naturalSkincareSet, 900),
    fallback: photo(PHOTOS.faceCreamJar),
  },
  huiles: {
    hero: photo(PHOTOS.oilBottlesRange, 1600),
    card: photo(PHOTOS.goldenOilPour, 900),
    fallback: photo(PHOTOS.goldenDropper),
  },
  formations: {
    hero: photo(PHOTOS.classroom, 1600),
    card: photo(PHOTOS.classroom, 900),
    fallback: photo(PHOTOS.formulationBeaker),
  },
  seo: {
    hero: photo(PHOTOS.analyticsDashboard, 1600),
    card: photo(PHOTOS.analyticsDashboard, 900),
    fallback: photo(PHOTOS.analyticsDashboard),
  },
};

export const brandFallbackImage = (brandId?: string): string =>
  (brandId && brandId in BRAND_VISUALS
    ? BRAND_VISUALS[brandId as BrandId]
    : BRAND_VISUALS.cosmetics
  ).fallback;

/**
 * Identifiants des anciennes photos génériques, encore présentes dans le
 * localStorage des navigateurs ayant déjà ouvert la plateforme.
 */
const LEGACY_PHOTO_IDS = [
  '1532187863486-abf9dbad1b69',
  '1584308666744-24d5c474f2ae',
  '1598440947619-2c35fc9aa908',
  '1608248597359-009c958469d4',
  '1563178406-4cdc2923acbc',
  '1607006314180-a22675681e84',
  '1556228720-195a672e8a03',
  '1522337360788-8b13dee7a37e',
  '1617897903246-719242758050',
  '1601049541289-9b1b7bbbfe19',
  '1620916566398-39f1143ab7be',
  '1454165804606-c3d57bc86b40',
  '1522335789203-aabd1fc54bc9',
  '1582719478250-c89cae4dc85b',
  '1570172619644-dfd03ed5d881',
];

export const isLegacyImage = (url?: string): boolean =>
  !url || LEGACY_PHOTO_IDS.some((id) => url.includes(id));

/**
 * Met à jour les images d'une liste persistée (produits, formations) :
 * seules les anciennes photos par défaut sont remplacées, les images
 * personnalisées par l'utilisateur sont conservées.
 * Retourne la même référence si rien n'a changé.
 */
export function refreshLegacyImages<T extends { id: string; image: string }>(
  items: T[],
  seeds: T[],
  fallbackFor: (item: T) => string
): T[] {
  let changed = false;
  const next = items.map((item) => {
    if (!isLegacyImage(item.image)) return item;
    const seed = seeds.find((s) => s.id === item.id);
    const image = seed ? seed.image : fallbackFor(item);
    if (image === item.image) return item;
    changed = true;
    return { ...item, image };
  });
  return changed ? next : items;
}
