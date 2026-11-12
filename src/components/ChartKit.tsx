import React from 'react';

/**
 * Kit graphique commun à tout l'ERP : mêmes axes, même grille, même infobulle
 * et même palette sur chaque graphe, pour un rendu homogène et moderne.
 */

/** Couleur de la surface des cartes : sert aux anneaux et séparations entre marques */
export const CHART_SURFACE = '#0f172a';

/**
 * Palette par filiale pour les graphes multi-marques.
 * Teintes volontairement éloignées (les couleurs de marque sont toutes vertes)
 * et vérifiées pour rester distinctes, y compris pour les daltoniens.
 */
export const BRAND_CHART_COLORS: Record<string, string> = {
  cosmetics: '#199e70',
  rehab: '#9085e9',
  huiles: '#c98500',
  formations: '#3987e5',
};

/** Teintes de série génériques (même ordre partout) */
export const SERIES = {
  blue: '#3987e5',
  orange: '#d95926',
  aqua: '#199e70',
  yellow: '#c98500',
  violet: '#9085e9',
  neutral: '#64748b',
};

/** Couleurs d'état : toujours accompagnées d'un libellé */
export const STATUS_COLORS = {
  good: '#0ca30c',
  info: '#3987e5',
  warning: '#fab219',
  critical: '#d03b3b',
};

const TICK = { fontSize: 11, fill: '#94a3b8' };

/** Axes discrets : pas de trait d'axe ni de graduations, seulement les libellés */
export const xAxisProps = {
  axisLine: false,
  tickLine: false,
  tick: TICK,
  tickMargin: 10,
} as const;

export const yAxisProps = {
  axisLine: false,
  tickLine: false,
  tick: TICK,
  tickMargin: 6,
  width: 44,
} as const;

/** Grille horizontale seule, en filet continu très discret */
export const gridProps = {
  vertical: false,
  stroke: '#1e293b',
  strokeWidth: 1,
} as const;

/** Repère de survol pour les courbes (ligne verticale) et les barres (bande) */
export const lineCursor = { stroke: '#475569', strokeWidth: 1 };
export const barCursor = { fill: 'rgba(148, 163, 184, 0.07)' };

/** Point actif : pastille pleine cerclée de la couleur de surface */
export const activeDot = (color: string) => ({
  r: 5,
  fill: color,
  stroke: CHART_SURFACE,
  strokeWidth: 2,
});

/** Point permanent des courbes multi-séries */
export const seriesDot = (color: string) => ({
  r: 4,
  fill: color,
  stroke: CHART_SURFACE,
  strokeWidth: 2,
});

/** 12 500 -> « 12,5k », 1 200 000 -> « 1,2M » */
export const formatCompact = (value: number): string => {
  const abs = Math.abs(value);
  if (abs >= 1_000_000) return `${(value / 1_000_000).toFixed(1).replace('.0', '').replace('.', ',')}M`;
  if (abs >= 1_000) return `${(value / 1_000).toFixed(abs >= 10_000 ? 0 : 1).replace('.0', '').replace('.', ',')}k`;
  return `${value}`;
};

interface ChartTooltipProps {
  active?: boolean;
  label?: React.ReactNode;
  payload?: any[];
  /** Met en forme la valeur de chaque série */
  formatValue?: (value: number, name: string) => string;
  /** Remplace le nom technique d'une série par un libellé lisible */
  seriesLabel?: (name: string) => string;
}

/** Infobulle unifiée : titre, puis une ligne par série avec sa pastille de couleur */
export const ChartTooltip: React.FC<ChartTooltipProps> = ({
  active,
  label,
  payload,
  formatValue,
  seriesLabel,
}) => {
  if (!active || !payload || payload.length === 0) return null;

  const title = label ?? payload[0]?.payload?.name;

  return (
    <div className="min-w-[150px] rounded-xl border border-slate-700/80 bg-slate-950/95 px-3.5 py-2.5 shadow-2xl backdrop-blur-md">
      {title !== undefined && title !== '' && (
        <p className="mb-1.5 text-[11px] font-semibold text-slate-300">{title}</p>
      )}
      <div className="space-y-1">
        {payload.map((entry: any, i: number) => {
          const name = String(entry.name ?? entry.dataKey ?? '');
          const color = entry.payload?.color || entry.color || entry.stroke || entry.fill;
          return (
            <div key={i} className="flex items-center justify-between gap-5 text-xs">
              <span className="flex items-center gap-2 text-slate-400">
                <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: color }} />
                {seriesLabel ? seriesLabel(name) : name}
              </span>
              <span className="font-semibold tabular-nums text-white">
                {formatValue ? formatValue(Number(entry.value), name) : Number(entry.value).toLocaleString('fr-FR')}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

interface ChartLegendProps {
  items: { label: string; color: string; dashed?: boolean }[];
  className?: string;
}

/** Légende compacte : pastille de couleur + libellé en texte neutre */
export const ChartLegend: React.FC<ChartLegendProps> = ({ items, className = '' }) => (
  <ul className={`flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] text-slate-300 ${className}`}>
    {items.map((item) => (
      <li key={item.label} className="flex items-center gap-1.5">
        {item.dashed ? (
          <span className="w-4 border-t-2 border-dashed" style={{ borderColor: item.color }} />
        ) : (
          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
        )}
        {item.label}
      </li>
    ))}
  </ul>
);

interface AreaGradientProps {
  id: string;
  color: string;
  /** Opacité en haut du dégradé (défaut : voile léger) */
  from?: number;
}

/** Dégradé vertical pour les aires : voile de la teinte qui s'efface vers la base */
export const AreaGradient: React.FC<AreaGradientProps> = ({ id, color, from = 0.28 }) => (
  <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stopColor={color} stopOpacity={from} />
    <stop offset="100%" stopColor={color} stopOpacity={0} />
  </linearGradient>
);
