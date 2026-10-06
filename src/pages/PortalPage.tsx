import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Sun, 
  Moon, 
  ArrowRight, 
  Lock,
  Layers
} from 'lucide-react';
import { BRANDS } from '../data/brands';
import { BrandId } from '../types';
import { AnimatedBackground } from '../components/AnimatedBackground';
import { FooterInstitutional } from '../components/FooterAndDisclaimers';
import { useTheme } from '../hooks/useTheme';

import { BrandLogo } from '../components/BrandLogo';

export const PortalPage: React.FC = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const brandKeys = Object.keys(BRANDS) as BrandId[];

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between selection:bg-orange-500 selection:text-white bg-slate-950 text-slate-100">
      <AnimatedBackground variant="portal" />

      {/* Top Navbar */}
      <header className="w-full px-6 py-4 flex items-center justify-between border-b border-slate-800/80 backdrop-blur-md bg-slate-950/70 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-950 border border-emerald-600/40 text-emerald-400 flex items-center justify-center font-bold text-xs tracking-tight shadow-xs">
            AM
          </div>
          <div>
            <h1 className="text-sm font-bold text-white leading-tight">
              AM PROD GROUP
            </h1>
            <p className="text-[11px] text-slate-400 font-normal">
              Portail Multi-Marques ERP & Agent SEO
            </p>
          </div>
        </div>
      </header>

      {/* Main Full Width Space */}
      <main className="flex-1 w-full px-6 lg:px-12 py-10 flex flex-col justify-center">
        
        {/* Hero Title */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-orange-500/10 text-orange-400 border border-orange-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            Portail Global Unifié — Architecture Front-End
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight">
            Plateforme de Gestion & Direction Groupe
          </h2>

          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Sélectionnez votre espace opérationnel. Chaque filiale dispose de son catalogue dédié, de ses données synchronisées, de ses indicateurs de performance et de l'Agent SEO central.
          </p>
        </div>

        {/* Brands Grid (Pleine largeur sur grand écran) */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {brandKeys.map((brandId) => {
            const brand = BRANDS[brandId];
            const isSeo = brandId === 'seo';

            return (
              <div
                key={brandId}
                onClick={() => navigate(`/login/${brandId}`)}
                className={`group relative rounded-xl p-5 transition-all duration-200 cursor-pointer flex flex-col justify-between overflow-hidden shadow-xs hover-lift bg-slate-900/60 border ${
                  isSeo
                    ? 'border-indigo-500/30 hover:border-indigo-500/60'
                    : 'border-slate-800/90 hover:border-slate-700'
                }`}
                style={{
                  ['--glow-color' as any]: `${brand.primaryColor}30`,
                }}
              >
                {/* Thin brand color indicator at top */}
                <div 
                  className="absolute top-0 left-0 right-0 h-1 transition-all group-hover:h-1.5"
                  style={{ backgroundColor: brand.primaryColor }}
                />

                <div className="space-y-3 pt-1">
                  <div className="flex items-start justify-between">
                    <BrandLogo brandId={brandId} variant="icon" size="md" />

                    <span 
                      className="text-[10px] font-medium px-2 py-0.5 rounded border"
                      style={{ 
                        borderColor: `${brand.primaryColor}30`,
                        color: brand.primaryColor,
                        backgroundColor: `${brand.primaryColor}10`
                      }}
                    >
                      {brand.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-white group-hover:text-brand-orange transition-colors">
                      {brand.name}
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                      {brand.tagline}
                    </p>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                    {brand.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Lock className="w-3 h-3 text-emerald-400" /> Démo 1-Click
                  </span>

                  <span 
                    className="inline-flex items-center gap-1 font-medium transition-transform group-hover:translate-x-0.5"
                    style={{ color: brand.primaryColor }}
                  >
                    Entrer
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <FooterInstitutional />
    </div>
  );
};
